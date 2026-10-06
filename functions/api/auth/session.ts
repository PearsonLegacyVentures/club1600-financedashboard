interface Env { TREASURY_SESSION_SECRET?: string }
type PagesContext = { request: Request; env: Env };

const cookieValue = (request: Request, name: string) => {
  const cookies = request.headers.get("cookie") || "";
  const match = cookies.split(";").map((part) => part.trim()).find((part) => part.startsWith(name + "="));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
};

export const onRequestGet = async ({ request, env }: PagesContext) => {
  const authenticated = Boolean(
    env.TREASURY_SESSION_SECRET &&
    cookieValue(request, "club1600_session") === env.TREASURY_SESSION_SECRET,
  );
  return new Response(JSON.stringify({ ok: true, authenticated }), {
    headers: { "content-type": "application/json; charset=UTF-8", "cache-control": "no-store" },
  });
};
