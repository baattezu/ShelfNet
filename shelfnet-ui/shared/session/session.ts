export const session = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("shelfnet_token");
  },

  getUser(): any | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("shelfnet_user");
    return raw ? JSON.parse(raw) : null;
  },

  set(token: string, user: any) {
    if (typeof window === "undefined") return;
    localStorage.setItem("shelfnet_token", token);
    localStorage.setItem("shelfnet_user", JSON.stringify(user));
  },

  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("shelfnet_token");
    localStorage.removeItem("shelfnet_user");
  },
};
