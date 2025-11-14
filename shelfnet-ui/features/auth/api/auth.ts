import { api } from "@/shared/api/http";
import { AuthSession } from "../models/auth-session";

export function login(data: { email: string; password: string }) {
  return api.post<AuthSession>("/auth/login", data);
}
export function register(data: {
  name: string;
  email: string;
  password: string;
}) {
  return api.post<AuthSession>("/auth/register", data);
}
