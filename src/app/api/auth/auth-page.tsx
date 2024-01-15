import { SessionProvider, useSession } from "next-auth/react";
import Link from "next/link";

function ShowLoginButton({ children }: { children: React.ReactNode }) {
  const session = useSession();
  if (session.status === "authenticated") {
    return <>{children}</>;
  }
  if (session.status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center text-text">
        Loading...
      </div>
    );
  }
  return (
    <div className="text-text">
      Not logged in, please{" "}
      <Link className="underline decoration-accent" href="/api/auth/signin">
        sign in
      </Link>
    </div>
  );
}

export function AuthPrompts({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ShowLoginButton>{children}</ShowLoginButton>
    </SessionProvider>
  );
}

export function AuthPage({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <ShowLoginButton>{children}</ShowLoginButton>
      </div>
    </SessionProvider>
  );
}
