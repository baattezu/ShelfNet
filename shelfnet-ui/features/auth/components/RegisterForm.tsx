"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { AuthCredentials } from "@/types";

interface RegisterFormProps {
  onSubmit?: (
    credentials: AuthCredentials & { name: string }
  ) => Promise<void> | void;
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name || !email || !password) {
      setError("Заполните все поля");
      return;
    }

    if (!email.includes("@")) {
      setError("Введите корректный email");
      return;
    }

    if (password.length < 8) {
      setError("Пароль должен быть не менее 8 символов");
      return;
    }

    await onSubmit?.({ name, email, password });
    setSuccess(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-slate-400">Имя</label>
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Анна Каренина"
        />
      </div>
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
          Добро пожаловать! После интеграции API добавим редирект.
        </p>
      )}
      <Button type="submit" className="w-full">
        Создать аккаунт
      </Button>
    </form>
  );
}
