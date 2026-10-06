interface Env {
  TREASURY_API_URL?: string;
  TREASURY_API_TOKEN?: string;
  TREASURY_SESSION_SECRET?: string;
}

type PagesContext = {
  request: Request;
  env: Env;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });

const cookieValue = (request: Request, name: string) => {
  const cookies = request.headers.get("cookie") || "";
  const match = cookies
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(name + "="));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
};

export const onRequest = async ({ request, env }: PagesContext): Promise<Response> => {
  if (
    !env.TREASURY_SESSION_SECRET ||
    cookieValue(request, "club1600_session") !== env.TREASURY_SESSION_SECRET
  ) {
    return json({ ok: false, error: "Authentication required." }, 401);
  }

  if (!env.TREASURY_API_URL || !env.TREASURY_API_TOKEN) {
    return json(
      {
        ok: false,
        error: "Google Sheets sync is not configured on this Cloudflare deployment.",
      },
      503,
    );
  }

  try {
    if (request.method === "GET") {
      const incoming = new URL(request.url);
      const target = new URL(env.TREASURY_API_URL);
      incoming.searchParams.forEach((value, key) => target.searchParams.set(key, value));
      target.searchParams.set("token", env.TREASURY_API_TOKEN);

      const upstream = await fetch(target.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
        redirect: "follow",
      });

      return new Response(await upstream.text(), {
        status: upstream.status,
        headers: {
          "content-type": upstream.headers.get("content-type") || "application/json; charset=UTF-8",
          "cache-control": "no-store",
        },
      });
    }

    if (request.method === "POST") {
      const body = (await request.json()) as Record<string, unknown>;
      const upstream = await fetch(env.TREASURY_API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({ ...body, token: env.TREASURY_API_TOKEN }),
        redirect: "follow",
      });

      return new Response(await upstream.text(), {
        status: upstream.status,
        headers: {
          "content-type": upstream.headers.get("content-type") || "application/json; charset=UTF-8",
          "cache-control": "no-store",
        },
      });
    }

    return json({ ok: false, error: "Method not allowed." }, 405);
  } catch (error) {
    return json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Treasury sync failed.",
      },
      502,
    );
  }
};
