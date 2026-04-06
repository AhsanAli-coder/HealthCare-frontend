import { useMemo, useState } from "react";

const CHATS = [
  {
    id: "dr-stephen",
    name: "Dr. Stephen Conley",
    preview: "Hi, how are you feeling today?",
    time: "25:09",
    status: "Ongoing Call",
    online: true,
  },
  {
    id: "dr-sarah",
    name: "Dr. Sarah Smith",
    preview: "Please share your reports.",
    time: "17:10",
    status: "",
    online: false,
  },
  {
    id: "dr-john",
    name: "Dr. John Doe",
    preview: "I have prescribed for you...",
    time: "Yesterday",
    status: "",
    online: false,
  },
  {
    id: "clinic",
    name: "Clinic Support",
    preview: "Your appointment is confirmed.",
    time: "05/04/21",
    status: "",
    online: false,
  },
  {
    id: "billing",
    name: "Billing Team",
    preview: "Your invoice is ready.",
    time: "04/04/21",
    status: "",
    online: false,
  },
  {
    id: "lab",
    name: "Lab Desk",
    preview: "Your lab report has been uploaded.",
    time: "03/04/21",
    status: "",
    online: false,
  },
];

function Avatar({ size = 40, online = false }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="h-full w-full rounded-full bg-slate-200" />
      {online ? (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
      ) : null}
    </div>
  );
}

function ChatListItem({ chat, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-xl px-3 py-3 text-left transition-colors",
        active ? "bg-sky-50" : "hover:bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar size={40} online={chat.online} />
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-slate-900">
              {chat.name}
            </p>
            <p className="truncate text-xs text-slate-500">{chat.preview}</p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs font-semibold text-slate-400">{chat.time}</p>
          {chat.status ? (
            <p className="mt-1 text-[11px] font-bold text-[#007E85]">
              {chat.status}
            </p>
          ) : null}
        </div>
      </div>
    </button>
  );
}

function Bubble({ side, children, meta }) {
  const isRight = side === "right";
  return (
    <div className={isRight ? "flex justify-end" : "flex justify-start"}>
      <div className={isRight ? "flex items-end gap-3" : "flex items-end gap-3"}>
        {!isRight ? <Avatar size={32} online /> : null}
        <div
          className={[
            "max-w-[520px] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
            isRight
              ? "bg-[#2D9CFF] text-white"
              : "bg-white text-slate-700 ring-1 ring-slate-200/70",
          ].join(" ")}
        >
          {children}
        </div>
        {isRight ? <Avatar size={32} /> : null}
      </div>
      {meta ? (
        <p
          className={[
            "mt-1 text-[11px] text-slate-400",
            isRight ? "text-right" : "text-left",
          ].join(" ")}
        >
          {meta}
        </p>
      ) : null}
    </div>
  );
}

export default function PatientMessages() {
  const [activeId, setActiveId] = useState(CHATS[0].id);
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");

  const activeChat = useMemo(
    () => CHATS.find((c) => c.id === activeId) ?? CHATS[0],
    [activeId],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return CHATS;
    return CHATS.filter((c) => c.name.toLowerCase().includes(q));
  }, [search]);

  function onSend(e) {
    e.preventDefault();
    setText("");
  }

  return (
    <div className="px-6 py-6">
      <div className="grid h-[calc(100vh-5rem-3rem)] max-h-[780px] gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left: chat list */}
        <section className="rounded-2xl bg-white shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70">
          <div className="border-b border-slate-200 px-5 py-4">
            <h1 className="text-base font-extrabold text-slate-900">Message</h1>
            <div className="mt-3">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                    />
                  </svg>
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for message"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Recent Chat</span>
              <span>▾</span>
            </div>
          </div>

          <div className="max-h-[620px] overflow-auto px-3 py-3">
            <div className="space-y-1">
              {filtered.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  active={chat.id === activeId}
                  onClick={() => setActiveId(chat.id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Right: conversation */}
        <section className="flex min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70">
          {/* conversation header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <Avatar size={40} online />
              <div>
                <p className="text-sm font-extrabold text-slate-900">
                  {activeChat.name}
                </p>
                <p className="text-xs font-semibold text-[#007E85]">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"
                aria-label="Favorite"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"
                aria-label="Info"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16v-4m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* messages */}
          <div className="flex-1 overflow-auto bg-white px-6 py-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Avatar size={32} online />
                <div>
                  <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200/70">
                    Hi Doctor,
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">Today 7:45 am</p>
                </div>
              </div>

              <Bubble side="right" meta="Today 7:55 am">
                Good Morning
              </Bubble>
              <Bubble side="right" meta="Today 7:55 am">
                I’m not feeling well. Can you please guide me?
              </Bubble>

              <div className="flex items-start gap-3">
                <Avatar size={32} online />
                <div>
                  <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200/70">
                    Don’t worry. Tell me your symptoms and share any recent
                    reports.
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">Today 7:59 am</p>
                </div>
              </div>

              <Bubble side="right" meta="Today 8:02 am">
                Sure — attaching images now.
              </Bubble>

              <div className="flex items-start gap-3">
                <Avatar size={32} online />
                <div className="space-y-2">
                  <div className="inline-flex gap-2">
                    <div className="h-16 w-16 rounded-xl bg-slate-200" />
                    <div className="h-16 w-16 rounded-xl bg-slate-200" />
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200/70">
                    Received.
                  </div>
                </div>
              </div>

              {/* audio bubble */}
              <div className="flex justify-end">
                <div className="flex w-[320px] items-center gap-3 rounded-2xl bg-[#2D9CFF] px-4 py-3 text-white shadow-sm">
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20"
                    aria-label="Play"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <div className="h-2 flex-1 rounded-full bg-white/30">
                    <div className="h-2 w-[55%] rounded-full bg-white" />
                  </div>
                  <span className="text-xs font-semibold">1:30</span>
                </div>
              </div>
            </div>
          </div>

          {/* composer */}
          <form onSubmit={onSend} className="border-t border-slate-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Emoji"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 10h.01M15 10h.01M8 15s1.5 2 4 2 4-2 4-2"
                  />
                </svg>
              </button>

              <div className="relative flex-1">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
                />
              </div>

              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Attach"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.44 11.05 12.25 20.24a5.5 5.5 0 0 1-7.78-7.78l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.2 9.19a1.5 1.5 0 0 1-2.12-2.12l8.49-8.49"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Voice"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 10v1a7 7 0 0 1-14 0v-1"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19v4" />
                </svg>
              </button>

              <button
                type="submit"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#6D63FF] text-white shadow-sm hover:opacity-95"
                aria-label="Send"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M2 21 23 12 2 3v7l15 2-15 2v7z" />
                </svg>
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

