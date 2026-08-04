# Gemini chat proxy (Cloudflare Worker)

The old site called the Gemini API straight from the browser with the API key
in page source. Anyone could read it and spend against the quota. A static
site can never hide a key, so the call has to move server-side. This Worker is
that server.

**The API key lives only as a Worker secret. It is never committed, never sent
to the browser, and never appears in the built site.**

## Where the API key goes

**Not** in `.env`, `wrangler.toml`, `lib/content.ts`, or anywhere in the repo.
It goes in one place — Cloudflare's encrypted secret store:

```bash
npx wrangler secret put GEMINI_API_KEY
```

That prompts for the value and stores it encrypted against the Worker. To
change it later, run the same command again. To set it from the dashboard
instead: **Workers & Pages → your worker → Settings → Variables and Secrets →
Add → type: Secret → name: `GEMINI_API_KEY`**.

## Deploy

```bash
cd worker && npx wrangler deploy
```

Then set `ALLOWED_ORIGIN` in `wrangler.toml` to the site origin, and put the
Worker URL into the site build:

```bash
echo 'NEXT_PUBLIC_AI_PROXY_URL=https://gemini-proxy.<your-subdomain>.workers.dev' >> ../.env.local
```

Rebuild the site. With that variable unset the chat widget does not render at
all, so there is never a broken chat button.

## First, rotate the leaked key

The previously-used key is in the public history of the `rahul-khare997.github.io`
repo and must be treated as compromised regardless of what happens next:

1. Google Cloud Console → APIs & Services → Credentials
2. Delete that key
3. Create a new one, restrict it to the **Generative Language API** only
4. Put the new key in the Worker secret above — not in the site

Deleting the old key is the only thing that actually stops it being used;
removing it from the current source does not, since it remains in git history.

## What the Worker enforces

- **Origin allow-list** — requests from other sites are rejected, so the
  endpoint cannot be used as a free Gemini relay.
- **Rate limit** — 20 requests per IP per 10 minutes, held in Cloudflare's
  cache. A cheap brake on quota burn, not a security boundary.
- **Fixed system prompt** — the résumé context lives in the Worker. The client
  sends only conversation turns, so a caller cannot replace the instructions
  and repurpose the endpoint as a general-purpose chatbot.
- **Length caps** — messages over 1,000 characters and histories over 20 turns
  are rejected.
