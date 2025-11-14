"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { AuthCredentials } from "@/types";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/dist/client/components/navigation";

interface LoginFormProps {
  onSubmit?: (credentials: AuthCredentials) => Promise<void> | void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const { login } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email || !password) {
      setError("Заполните email и пароль");
      return;
    }

    if (!email.includes("@")) {
      setError("Введите корректный email");
      return;
    }

    await onSubmit?.({ email, password });
    setSuccess(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-slate-400">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@shelfnet.com"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-400">Пароль</label>
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Минимум 8 символов"
        />
      </div>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-400">
          Все ок! Здесь появится редирект после интеграции с API.
        </p>
      )}
      <Button type="submit" className="w-full">
        Войти
      </Button>
    </form>
  );
}
