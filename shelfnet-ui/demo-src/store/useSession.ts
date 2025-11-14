"use client";

import { create } from "zustand";
import type { StateCreator } from "zustand";
import Cookies from "js-cookie";
import type { User } from "../models/user";

type SessionState = {
  token: string | null;
  user: User | null;
  setSession: (token: string | null, user?: User | null) => void;
  clearSession: () => void;
  rehydrateSession: () => void;
};

const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  return Cookies.get("shelfnet_token") ?? null;
};

const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("shelfnet_user");
    return raw ? (JSON.parse(raw) as User) : null;
  } catch (error) {
    console.warn("Failed to parse stored user", error);
    return null;
  }
};

const storeCreator: StateCreator<SessionState> = (set, get) => ({
  token: getStoredToken(),
  user: getStoredUser(),
  setSession: (token: string | null, user: User | null = get().user) => {
    if (typeof window !== "undefined") {
      if (token) Cookies.set("shelfnet_token", token, { expires: 7 });
      else Cookies.remove("shelfnet_token");

      if (user) localStorage.setItem("shelfnet_user", JSON.stringify(user));
      else localStorage.removeItem("shelfnet_user");
    }
    set({ token, user });
  },
  clearSession: () => {
    if (typeof window !== "undefined") {
      Cookies.remove("shelfnet_token");
      localStorage.removeItem("shelfnet_user");
    }
    set({ token: null, user: null });
  },
  rehydrateSession: () => {
    set({ token: getStoredToken(), user: getStoredUser() });
  },
});

export const useSession = create<SessionState>(storeCreator);

export default useSession;
