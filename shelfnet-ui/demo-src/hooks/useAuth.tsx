"use client";
import { useCallback, useEffect } from "react";
import { useSession } from "../store/useSession";
import { auth } from "../services/api";

export function useAuth() {
  const { token, user, setSession, clearSession, rehydrateSession } =
    useSession();

  useEffect(() => {
    rehydrateSession();
  }, [rehydrateSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await auth.login(email, password);
      setSession(res.session.token, res.session.user);
      return res.session;
    },
    [setSession]
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  return {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
  } as const;
}

export default useAuth;
