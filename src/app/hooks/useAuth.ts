import { getServerAuthSession } from "@/server/auth";

export async function useAuth() {
  const session = await getServerAuthSession();
  return session;
}
