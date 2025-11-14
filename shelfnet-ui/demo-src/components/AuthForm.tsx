"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ShieldCheck, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/demo-src/hooks/useAuth";
import { loginSchema, type LoginFormValues } from "@/demo-src/utils/validators";

export function AuthForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  // eslint-disable-next-line react-hooks/incompatible-library -- React Hook Form's watch is safe in this demo scope.
  const emailValue = watch("email", "");
  const passwordValue = watch("password", "");

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await login(values.email, values.password);
      router.push("/demo/protected");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Login failed");
    }
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="text-sm font-medium text-slate-200">Email</label>
        <input
          type="email"
          className={`input-base mt-1 ${
            emailValue ? (errors.email ? "input-invalid" : "input-valid") : ""
          }`}
          placeholder="mentor@shelfnet.dev"
          {...register("email")}
        />
        <p
          className={`field-message ${
            errors.email ? "field-message--danger" : "field-message--success"
          }`}
        >
          {errors.email?.message ??
            (emailValue ? "Looks good" : "We'll never share your email")}
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-200">Password</label>
        <input
          type="password"
          className={`input-base mt-1 ${
            passwordValue
              ? errors.password
                ? "input-invalid"
                : "input-valid"
              : ""
          }`}
          placeholder="ReadMore!"
          {...register("password")}
        />
        <p
          className={`field-message ${
            errors.password
              ? "field-message--danger"
              : passwordValue
              ? "field-message--success"
              : ""
          }`}
        >
          {errors.password?.message ??
            (passwordValue ? "Secure password" : "Needs 8 chars & uppercase")}
        </p>
      </div>

      {serverError ? (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {serverError}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={16} className="text-emerald-400" />
          Session tokens are stored in a secure cookie for the guard +
          middleware demo.
        </div>
      )}

      <motion.button
        type="submit"
        whileTap={{ scale: 0.98 }}
        disabled={!isValid || isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2 font-semibold text-slate-900 transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <ShieldCheck className="h-4 w-4" />
        )}
        {isSubmitting ? "Signing in" : "Enter demo workspace"}
      </motion.button>
    </form>
  );
}

export default AuthForm;
