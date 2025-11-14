"use client";

import { useState, useEffect, useCallback } from "react";
import { login as apiLogin } from "../api/auth";
import { register as apiRegister } from "../api/auth";
import { AuthSession } from "../models/auth-session";
import { UserProfile } from "@/shared/types";
import { session } from "@/shared/session/session";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setToken(session.getToken());
    setUser(session.getUser());
    setReady(true);
  }, []);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await apiLogin({ email, password });

    session.set(token, user);
    setToken(token);
    setUser(user);

    return { token, user } as AuthSession;
  }, []);

  // REGISTER (данные получаешь, потом фронт решает логиниться или нет)
  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { token, user } = await apiRegister({ name, email, password });

      session.set(token, user);
      setToken(token);
      setUser(user);

      return { token, user } as AuthSession;
    },
    []
  );

  // LOGOUT
  const logout = useCallback(() => {
    session.clear();
    setToken(null);
    setUser(null);
  }, []);

  return {
    token,
    user,
    isAuthenticated: ready && !!token,
    login,
    register,
    logout,
  } as const;
}

export default useAuth;
