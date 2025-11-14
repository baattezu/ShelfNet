"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import type { AuthCredentials } from "@/shared/types";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

interface RegisterFormProps {
  onSubmit?: (
    credentials: AuthCredentials & { name: string }
  ) => Promise<void> | void;
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const router = useRouter();
  const auth = useAuth();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!name || !email || !password) {
      setError("Заполните все поля");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setErrorEmail("Введите корректный email");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setErrorPassword("Пароль должен быть не менее 8 символов");
      setLoading(false);
      return;
    }

    try {
      await auth.register(name, email, password);
      router.push("/");
      toast.success("Регистрация успешна!");
    } catch (err: any) {
      setError(err.message || "Ошибка регистрации");
      toast.error("Ошибка регистрации. Попробуйте еще раз.");
    }

    setLoading(false);
  };

  const handleChange = async (event: FormEvent) => {
    const name = (event.target as HTMLInputElement).name;
    const value = (event.target as HTMLInputElement).value;

    setError(null);

    if (name === "email") {
      setEmail(value);
      setErrorEmail(null);
    }

    if (name === "password") {
      setPassword(value);
      setErrorPassword(null);
    }

    if (name === "name") {
      setName(value);
    }

    if (name === "email" && value.trim().length > 0 && !value.includes("@")) {
      setErrorEmail("Введите корректный email");
    }

    if (name === "password" && value.trim().length > 0 && value.length < 8) {
      setErrorPassword("Пароль должен быть не менее 8 символов");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-slate-400">Имя</label>
        <Input
          name="name"
          value={name}
          onChange={(event) => handleChange(event)}
          placeholder="Анна Каренина"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-400">Email</label>
        <Input
          name="email"
          type="email"
          value={email}
          onChange={(event) => handleChange(event)}
          placeholder="you@shelfnet.com"
        />
        {errorEmail && <p className="text-sm text-rose-400">{errorEmail}</p>}
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-400">Пароль</label>
        <Input
          name="password"
          type="password"
          value={password}
          onChange={(event) => handleChange(event)}
          placeholder="Минимум 8 символов"
        />
        {errorPassword && (
          <p className="text-sm text-rose-400">{errorPassword}</p>
        )}
      </div>

      {error && <p className="text-sm text-rose-400">{error}</p>}

      <Button type="submit" className="w-full">
        Создать аккаунт
      </Button>
    </form>
  );
}
