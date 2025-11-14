import { UserProfile } from "@/shared/types";

export interface AuthSession {
  token: string;
  user: UserProfile;
}
