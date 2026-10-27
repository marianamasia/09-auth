"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  useEffect(() => {
    const controller = new AbortController();
    const startingUser = useAuthStore.getState().user;
    const canUpdate = () =>
      !controller.signal.aborted &&
      useAuthStore.getState().user === startingUser;
    async function restoreSession() {
      try {
        if (await checkSession(controller.signal)) {
          const user = await getMe(controller.signal);
          if (canUpdate()) setUser(user);
        } else if (canUpdate()) clearIsAuthenticated();
      } catch {
        if (canUpdate()) clearIsAuthenticated();
      }
    }
    void restoreSession();
    return () => controller.abort();
  }, [pathname, setUser, clearIsAuthenticated]);

  return <>{children}</>;
}
