import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getSocketOrigin } from "../../config/env.js";
import * as messageApi from "../../api/messageApi.js";
import {
  appointmentAllowsChatStatus,
  isChatWindowOpen,
} from "../../utils/appointmentChat.js";

function senderIdString(msg) {
  const s = msg?.senderId;
  if (!s) return "";
  if (typeof s === "object" && s._id) return String(s._id);
  return String(s);
}

function senderName(msg) {
  const s = msg?.senderId;
  if (s && typeof s === "object" && s.name) return s.name;
  return "User";
}

export default function AppointmentChatRoom({
  appointmentId,
  appointmentMeta,
  accessToken,
  currentUserId,
  peerLabel,
}) {
  const [messages, setMessages] = useState([]);
  const [loadStatus, setLoadStatus] = useState("idle");
  const [loadError, setLoadError] = useState(null);
  const [text, setText] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [joinError, setJoinError] = useState(null);
  const [sendError, setSendError] = useState(null);
  const [peerTyping, setPeerTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const peerTypingTimeoutRef = useRef(null);
  const listEndRef = useRef(null);
  const socketRef = useRef(null);
  const emitTypingRef = useRef(null);

  const statusOk =
    appointmentAllowsChatStatus(appointmentMeta?.status) &&
    isChatWindowOpen(appointmentMeta?.startAt);

  const scrollToBottom = useCallback(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!appointmentId) return;
    let cancelled = false;
    async function load() {
      setLoadStatus("loading");
      setLoadError(null);
      try {
        const res = await messageApi.getChatHistory(appointmentId);
        const list = Array.isArray(res?.data) ? res.data : [];
        if (!cancelled) {
          setMessages(list);
          setLoadStatus("ok");
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(
            e?.data?.message ?? e?.message ?? "Could not load messages",
          );
          setLoadStatus("error");
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [appointmentId]);

  useEffect(() => {
    if (!appointmentId || !accessToken || !statusOk) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocketConnected(false);
      return;
    }

    const origin = getSocketOrigin();
    if (!origin) return;

    const socket = io(origin, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      auth: { token: accessToken },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setJoinError(null);
      socket.emit("join_chat", appointmentId, (ack) => {
        if (ack?.ok) {
          setSocketConnected(true);
        } else {
          setJoinError(ack?.error ?? "Could not join chat room");
          setSocketConnected(false);
        }
      });
    });

    socket.on("connect_error", (err) => {
      setJoinError(err?.message ?? "Socket connection failed");
      setSocketConnected(false);
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    socket.on("receive_message", (msg) => {
      if (!msg) return;
      setMessages((prev) => {
        const id = String(msg._id ?? "");
        if (id && prev.some((m) => String(m._id) === id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on("typing", ({ userId } = {}) => {
      if (String(userId) === String(currentUserId)) return;
      setPeerTyping(true);
      if (peerTypingTimeoutRef.current)
        clearTimeout(peerTypingTimeoutRef.current);
      peerTypingTimeoutRef.current = setTimeout(() => {
        setPeerTyping(false);
      }, 2500);
    });

    socket.on("stop_typing", ({ userId } = {}) => {
      if (String(userId) === String(currentUserId)) return;
      setPeerTyping(false);
    });

    return () => {
      if (peerTypingTimeoutRef.current)
        clearTimeout(peerTypingTimeoutRef.current);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [appointmentId, accessToken, currentUserId, statusOk]);

  emitTypingRef.current = () => {
    const s = socketRef.current;
    if (!s?.connected || !appointmentId) return;
    s.emit("typing", { appointmentId });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      s.emit("stop_typing", { appointmentId });
    }, 1200);
  };

  function onChangeText(e) {
    setText(e.target.value);
    emitTypingRef.current();
  }

  function onSubmit(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t || !socketRef.current?.connected || !statusOk) return;
    setSendError(null);
    socketRef.current.emit(
      "send_message",
      { appointmentId, text: t },
      (ack) => {
        if (!ack?.ok) {
          setSendError(ack?.error ?? "Send failed");
          return;
        }
        setText("");
        socketRef.current.emit("stop_typing", { appointmentId });
      },
    );
  }

  if (!appointmentId) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm font-semibold text-slate-500">
        Select a conversation to start.
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-4">
        <p className="text-sm font-extrabold text-slate-900">{peerLabel}</p>
        <p className="mt-1 text-xs font-semibold text-slate-500">
          {statusOk
            ? socketConnected
              ? "Connected — messages are saved on the server."
              : joinError
                ? joinError
                : "Connecting…"
            : !appointmentAllowsChatStatus(appointmentMeta?.status)
              ? "Chat is available after the appointment is confirmed."
              : "This chat window closed (1 hour after visit start)."}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/80 px-6 py-4">
        {loadStatus === "loading" ? (
          <p className="text-sm font-semibold text-slate-600">Loading…</p>
        ) : null}
        {loadError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">
            {loadError}
          </div>
        ) : null}

        <div className="mt-2 space-y-3">
          {messages.map((m) => {
            const mine = senderIdString(m) === String(currentUserId);
            return (
              <div
                key={m._id}
                className={mine ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={[
                    "max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                    mine
                      ? "bg-[#007E85] text-white"
                      : "bg-white text-slate-800 ring-1 ring-slate-200/80",
                  ].join(" ")}
                >
                  {!mine ? (
                    <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-500">
                      {senderName(m)}
                    </p>
                  ) : null}
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <p
                    className={[
                      "mt-1 text-[10px] font-semibold",
                      mine ? "text-white/80" : "text-slate-400",
                    ].join(" ")}
                  >
                    {m.createdAt
                      ? new Date(m.createdAt).toLocaleString(undefined, {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {peerTyping ? (
          <p className="mt-3 text-xs font-semibold italic text-slate-500">
            {peerLabel} is typing…
          </p>
        ) : null}
        <div ref={listEndRef} />
      </div>

      <form
        onSubmit={onSubmit}
        className="border-t border-slate-200 bg-white px-6 py-4"
      >
        {sendError ? (
          <p className="mb-2 text-xs font-semibold text-red-700">{sendError}</p>
        ) : null}
        <div className="flex gap-2">
          <input
            value={text}
            onChange={onChangeText}
            disabled={!statusOk || !socketConnected}
            placeholder={
              statusOk ? "Type a message…" : "Chat not available for this slot"
            }
            className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!statusOk || !socketConnected || !text.trim()}
            className="h-11 shrink-0 rounded-xl bg-[#007E85] px-5 text-sm font-extrabold text-white hover:bg-[#006970] disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
