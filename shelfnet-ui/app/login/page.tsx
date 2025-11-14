import Link from "next/link";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <SiteLayout showFooter={false}>
      <section className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">
            ShelfNet Access
          </p>
          <h1 className="text-4xl font-black text-white">С возвращением!</h1>
          <p className="text-lg text-slate-300">
            Введите email и пароль, чтобы перейти к каталогу, полкам и
            сообществам. После интеграции API здесь появится реальный вызов.
          </p>
          <p className="text-sm text-slate-500">
            Нет аккаунта?{" "}
            <Link href="/register" className="text-sky-400">
              Зарегистрируйтесь
            </Link>
          </p>
        </div>
        <Card className="bg-slate-950/50 p-8">
          <LoginForm />
        </Card>
      </section>
    </SiteLayout>
  );
}
