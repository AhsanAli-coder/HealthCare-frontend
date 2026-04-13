import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { getSocketOrigin } from "../config/env.js";
import * as notificationApi from "../api/notificationApi.js";
import * as authApi from "../api/authApi.js";
import { useAppDispatch, useAppSelector } from "../store/hooks.js";
import { setAccessToken } from "../store/slices/authSlice.js";

const DashboardNotificationContext = createContext({
  unreadCount: 0,
  refreshUnread: async () => {},
});

export function useDashboardNotifications() {
  return useContext(DashboardNotificationContext);
}

/** Patient or doctor: same user-scoped notifications API + socket room. */
export function DashboardNotificationProvider({ children }) {
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((s) => s.auth);
  const userId = user?._id ?? user?.id;

  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  const tokenRef = useRef(accessToken);

  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

  const refreshUnread = useCallback(async () => {
    if (!userId) {
      setUnreadCount(0);
      return;
    }
    try {
      const res = await notificationApi.getNotifications({
        unreadOnly: true,
        limit: 200,
      });
      const list = Array.isArray(res?.data) ? res.data : [];
      setUnreadCount(list.length);
    } catch {
      setUnreadCount(0);
    }
  }, [userId]);

  useEffect(() => {
    refreshUnread();
  }, [refreshUnread]);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    let pollId;

    async function ensureToken() {
      if (tokenRef.current) return tokenRef.current;
      try {
        const t = await authApi.refreshAccessToken();
        if (t) dispatch(setAccessToken(t));
        return t;
      } catch {
        return null;
      }
    }

    async function connectSocket() {
      const token = await ensureToken();
      if (cancelled || !token) return;

      const origin = getSocketOrigin();
      if (!origin) return;

      const socket = io(origin, {
        path: "/socket.io",
        transports: ["websocket", "polling"],
        auth: { token },
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("join_notifications", String(userId));
      });

      socket.on("notification", () => {
        refreshUnread();
      });

      socket.on("connect_error", () => {
        /* REST polling fallback */
      });
    }

    connectSocket();

    pollId = setInterval(() => {
      refreshUnread();
    }, 60000);

    return () => {
      cancelled = true;
      clearInterval(pollId);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, dispatch, refreshUnread]);

  const value = { unreadCount, refreshUnread };

  return (
    <DashboardNotificationContext.Provider value={value}>
      {children}
    </DashboardNotificationContext.Provider>
  );
}
