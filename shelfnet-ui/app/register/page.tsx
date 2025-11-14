import Link from "next/link";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card } from "@/components/ui/Card";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <SiteLayout showFooter={false}>
      <section className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">
            ShelfNet Account
          </p>
          <h1 className="text-4xl font-black text-white">Создайте профиль</h1>
          <p className="text-lg text-slate-300">
            Регистрация откроет доступ к персональным рекомендациям, полкам и
            клубам. Пока это демонстрация UI — позже подключим API.
          </p>
          <p className="text-sm text-slate-500">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-sky-400">
              Войдите
            </Link>
          </p>
        </div>
        <Card className="bg-slate-950/50 p-8">
          <RegisterForm />
        </Card>
      </section>
    </SiteLayout>
  );
}
