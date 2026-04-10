import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import * as appointmentApi from "../../api/appointmentApi.js";
import * as authApi from "../../api/authApi.js";
import AppointmentChatRoom from "../../components/chat/AppointmentChatRoom.jsx";
import DoctorTopbar from "../../components/doctor/layout/DoctorTopbar.jsx";
import { useAppDispatch, useAppSelector } from "../../store/hooks.js";
import { setAccessToken } from "../../store/slices/authSlice.js";
import { formatAppointmentWhen } from "../../utils/appointmentTime.js";
import { chatEligibleAppointment } from "../../utils/appointmentChat.js";

function patientPeerName(a) {
  const p = a?.patientId;
  if (typeof p === "object" && p?.name) return p.name;
  return "Patient";
}

export default function DoctorMessages() {
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((s) => s.auth);
  const viewerTz =
    user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const [searchParams] = useSearchParams();
  const queryApptId = searchParams.get("appointmentId") || "";

  const [items, setItems] = useState([]);
  const [listStatus, setListStatus] = useState("loading");
  const [listError, setListError] = useState(null);
  const [selectedId, setSelectedId] = useState(queryApptId);
  const [tokenStatus, setTokenStatus] = useState("idle");

  useEffect(() => {
    if (queryApptId) setSelectedId(queryApptId);
  }, [queryApptId]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setListStatus("loading");
      setListError(null);
      try {
        const res = await appointmentApi.getDoctorAppointments();
        const list = Array.isArray(res?.data) ? res.data : [];
        if (mounted) setItems(list);
        if (mounted) setListStatus("ok");
      } catch (e) {
        if (mounted) {
          setListError(e?.data?.message ?? e?.message ?? "Could not load");
          setListStatus("error");
        }
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (accessToken) {
      setTokenStatus("ok");
      return;
    }
    let cancelled = false;
    setTokenStatus("loading");
    (async () => {
      try {
        const t = await authApi.refreshAccessToken();
        if (!cancelled && t) dispatch(setAccessToken(t));
        if (!cancelled) setTokenStatus(t ? "ok" : "error");
      } catch {
        if (!cancelled) setTokenStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken, dispatch]);

  const chatAppointments = useMemo(
    () => items.filter((a) => chatEligibleAppointment(a)),
    [items],
  );

  const selected = useMemo(
    () => chatAppointments.find((a) => String(a._id ?? a.id) === selectedId),
    [chatAppointments, selectedId],
  );

  useEffect(() => {
    if (selectedId || chatAppointments.length === 0) return;
    const first = chatAppointments[0];
    const fid = String(first._id ?? first.id);
    if (fid) setSelectedId(fid);
  }, [selectedId, chatAppointments]);

  return (
    <>
      <DoctorTopbar title="Messages" subtitle="Chat with patients (confirmed visits)" />

      <div className="space-y-4 px-6 py-6">
        {tokenStatus === "error" && !accessToken ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
            Could not refresh an access token for live chat. Try logging out and
            signing in again.
          </div>
        ) : null}

        <div className="grid h-[calc(100vh-8rem)] min-h-[420px] max-h-[820px] gap-4 lg:grid-cols-[minmax(260px,320px)_1fr]">
          <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-extrabold text-slate-900">
                Active chats
              </h2>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Within 1 hour after appointment start.
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {listStatus === "loading" ? (
                <p className="px-2 py-4 text-sm text-slate-600">Loading…</p>
              ) : null}
              {listError ? (
                <p className="px-2 py-2 text-sm font-semibold text-red-700">
                  {listError}
                </p>
              ) : null}
              {listStatus === "ok" && chatAppointments.length === 0 ? (
                <p className="px-2 py-4 text-sm font-semibold text-slate-600">
                  No active chat windows. Confirm appointments and chat during the
                  visit hour.
                </p>
              ) : null}
              {chatAppointments.map((a) => {
                const id = String(a._id ?? a.id);
                const active = id === selectedId;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedId(id)}
                    className={[
                      "mb-1 w-full rounded-xl px-3 py-3 text-left transition-colors",
                      active ? "bg-sky-50" : "hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <p className="truncate text-sm font-extrabold text-slate-900">
                      {patientPeerName(a)}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {a?.startAt
                        ? formatAppointmentWhen(a.startAt, viewerTz)
                        : "—"}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
            <AppointmentChatRoom
              appointmentId={selectedId}
              appointmentMeta={selected}
              accessToken={accessToken}
              currentUserId={user?._id ?? user?.id}
              peerLabel={selected ? patientPeerName(selected) : "Patient"}
            />
          </section>
        </div>

        <div className="flex justify-end">
          <Link
            to="/doctor/appointments"
            className="text-sm font-extrabold text-[#007E85] hover:underline"
          >
            Back to appointments
          </Link>
        </div>
      </div>
    </>
  );
}
