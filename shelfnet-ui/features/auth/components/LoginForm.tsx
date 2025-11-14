"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import type { AuthCredentials } from "@/shared/types";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

interface LoginFormProps {
  onSubmit?: (credentials: AuthCredentials) => Promise<void> | void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const router = useRouter();
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError("Заполните email и пароль");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Введите корректный email");
      setLoading(false);
      return;
    }

    try {
      await auth.login(email, password);
      router.push("/");
      toast.success("Вход успешен!");
    } catch (err: any) {
      setError(err.message || "Ошибка входа");
      toast.error("Ошибка входа. Попробуйте еще раз.");
    }

    setLoading(false);
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
      <Button type="submit" className="w-full">
        Войти
      </Button>
    </form>
  );
}
