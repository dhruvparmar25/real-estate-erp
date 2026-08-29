import AuthShell from "@/components/auth/AuthShell";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";
import { ENV } from "@/config/env";

export const metadata = { title: `Sign in — ${ENV.appName}` };
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <AuthShell>
      <AuthCard>
        <div className="flex flex-col items-center text-center mb-6">
          <h1 className="text-2xl font-bold text-(--color-text-primary)">Welcome to {ENV.appName}</h1>
          <h2 className="text-3xl font-bold text-(--color-primary) mt-2">Sign in</h2>
          <p className="text-small text-(--color-text-secondary) mt-2">
            Sign in to continue to your workspace
          </p>
        </div>
        <LoginForm />
      </AuthCard>
    </AuthShell>
  );
}
