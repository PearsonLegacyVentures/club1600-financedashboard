export const onRequestPost = async () =>
  new Response(JSON.stringify({ ok: true }), {
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "no-store",
      "set-cookie": "club1600_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0",
    },
  });
