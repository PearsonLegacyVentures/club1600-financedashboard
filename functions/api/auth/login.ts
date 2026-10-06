interface Env {
  TREASURY_PASSWORD?: string;
  TREASURY_SESSION_SECRET?: string;
}

type PagesContext = { request: Request; env: Env };

const TREASURY_USERNAME = "amar";

const json = (body: unknown, status = 200, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=UTF-8", "cache-control": "no-store", ...headers },
  });

export const onRequestPost = async ({ request, env }: PagesContext) => {
  if (!env.TREASURY_PASSWORD || !env.TREASURY_SESSION_SECRET) {
    return json({ ok: false, error: "Treasury login is not configured." }, 503);
  }

  const body = (await request.json()) as { username?: string; password?: string };
  if (body.username !== TREASURY_USERNAME || body.password !== env.TREASURY_PASSWORD) {
    return json({ ok: false, error: "Incorrect username or password." }, 401);
  }

  return json(
    { ok: true },
    200,
    {
      "set-cookie": `club1600_session=${encodeURIComponent(env.TREASURY_SESSION_SECRET)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=43200`,
    },
  );
};
