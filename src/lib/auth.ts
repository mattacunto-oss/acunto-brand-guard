import { cookies } from "next/headers";

const COOKIE = "abg_session";
const DEMO_USER = "demo";
const DEMO_PASS = "demo";

export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const v = jar.get(COOKIE)?.value;
  return v === "demo-admin";
}

export async function login(username: string, password: string): Promise<boolean> {
  if (username === DEMO_USER && password === DEMO_PASS) {
    const jar = await cookies();
    jar.set(COOKIE, "demo-admin", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return true;
  }
  return false;
}

export async function logout() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
