export const ServerLoginButton = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-text">
      Not logged in, please{" "}
      <a className="underline decoration-accent" href="/api/auth/signin">
        sign in
      </a>
    </div>
  );
};
