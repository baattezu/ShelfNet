import type { AuthResponse, SessionPayload, User } from "@/demo-src/models";

const MOCK_USER: User = {
  id: "demo-user",
  name: "ShelfNet Mentor",
  email: "mentor@shelfnet.dev",
  avatarUrl: "https://avatars.githubusercontent.com/u/9919?v=4",
  roles: ["admin", "mentor"],
};

const DEMO_PASSWORD = "ReadMore!";

function issueSession(user: User): SessionPayload {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + 1000 * 60 * 60 * 24;
  return {
    token: `${user.id}.${expiresAt}`,
    issuedAt,
    expiresAt,
    user,
  };
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 650));

  if (email.toLowerCase() !== MOCK_USER.email || password !== DEMO_PASSWORD) {
    throw new Error("Invalid credentials. Try mentor@shelfnet.dev / ReadMore!");
  }

  return { session: issueSession(MOCK_USER) };
}

export async function getCurrentSession(
  token?: string | null
): Promise<SessionPayload | null> {
  if (!token) return null;
  const [, expires] = token.split(".");
  const expiresAt = Number(expires);
  if (Number.isNaN(expiresAt) || Date.now() > expiresAt) {
    return null;
  }
  return issueSession(MOCK_USER);
}

export async function logout() {
  await new Promise((resolve) => setTimeout(resolve, 150));
}
