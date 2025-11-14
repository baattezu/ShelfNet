import type { User } from "./user";

export type SessionPayload = {
  token: string;
  issuedAt: number;
  expiresAt: number;
  user: User;
};

export type AuthResponse = {
  session: SessionPayload;
};
