# Quickstart and configuration

This guide covers the technical setup behind the [starter overview](../README.md). Astro builds static HTML, Sanity supplies approved public editorial text at build time, and a Cloudflare Pages Function handles contact submissions. React is installed for interactive islands when a particular design needs one; this demo page does not hydrate React.

The page in this repository is **demonstration content**, not client copy or a design to publish. There are no client accounts, assets, domains, credentials, or legal pages in the template.

## Local start

Requires Node 24 (pinned in `.mise.toml` and `.node-version`), npm, and no Docker.

```bash
mise install       # if using mise
npm ci
npm run dev        # http://localhost:4321
npm run check
npm run build      # static output in dist/
npm run preview
```

The default build uses clearly labelled demo text and needs no account. Copy `.env.example` to `.env` only when configuring a client. When `PUBLIC_SANITY_PROJECT_ID` is set, `src/lib/content.ts` fetches the published `homePage` document with ID `home`. The build fails if that document or a required field is missing; it does not silently use demo text. The minimal schema lives in `studio/schemas/homePage.ts` and should evolve for the approved site's actual editorial needs.

After creating a client Sanity project, set its public project ID and dataset in `.env`, copy `studio/.env.example` to `studio/.env`, and use `npm run studio:dev` for local editing. Add the project's Studio deployment and named editors during client setup. Sanity content is fetched during **build**, not in the visitor's browser. A publish or unpublish needs a successful Pages rebuild.

## Contact endpoint

`functions/api/contact.ts` validates bounded form data and verifies Turnstile with Siteverify on hosted Pages. `functions/api/mail.ts` selects a replaceable provider: Resend by default, or Cloudflare Email Service for a verified destination. The sender is a fixed authenticated address from server configuration; the visitor is Reply-To. The endpoint returns success only after the sending API accepts the message. Acceptance is not proof of inbox arrival.

The public form starts disabled (`PUBLIC_CONTACT_FORM_READY=0`). A hosted endpoint also requires `CONTACT_FORM_ENABLED=1`, a Turnstile secret, and working mail settings. Keep the public switch at `0` while you make a direct hosted test submission and verify inbox receipt and Reply-To. Only then set the public switch to `1` and rebuild. On localhost, the Function **never sends real mail**: `CONTACT_DEV_MODE=1` allows a labelled simulation. To exercise it, copy `.dev.vars.example` to `.dev.vars`, run `npm run build` and `npm run dev:pages`, then POST a valid multipart form to `http://localhost:8788/api/contact`. Astro's `npm run dev` serves the page only; it does not run Pages Functions.

## Configuration boundaries

| Setting | Where it belongs | Meaning |
| --- | --- | --- |
| `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `SITE_URL` | Client `.env` locally; Pages build variables | Public Sanity source and canonical URL. Set `SITE_URL` to the review hostname first, then the approved domain. |
| `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET` | Client `studio/.env` locally; Studio deployment settings | Public project identifiers, never a write token. |
| `PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_CONTACT_FORM_READY`, `PUBLIC_CONTACT_EMAIL` | Client `.env` locally; Pages build variables | Public widget key, form display switch, optional direct email link. |
| `CONTACT_FORM_ENABLED`, `CONTACT_PROVIDER`, `CONTACT_RECIPIENT`, `CONTACT_SENDER` | Pages Function environment variables | Server-only enable switch, `resend` or `cloudflare`, real inbox and verified fixed sender. Treat recipient as operational/private. |
| `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY` | Pages encrypted secrets | Verification and default sending credentials. |
| `CF_EMAIL_ACCOUNT_ID`, `CF_EMAIL_API_TOKEN` | Pages server configuration; token as encrypted secret | Only for the optional Cloudflare verified-destination adapter. |
| Pages deploy hook URL | Sanity webhook URL field only | Secret trigger URL. Never put it in Git, Studio document fields, or browser code. |

The root `.env.example`, `studio/.env.example`, and `.dev.vars.example` contain no live values. `.env`, `.dev.vars`, `dist`, and local Studio files are ignored. Never put private evidence, credentials, sensitive notes, uncleared images, or contact submissions in a public Sanity dataset or this public repository. Published Sanity documents are publicly queryable, and uploaded assets may remain reachable by URL.

## Cloudflare Pages setup

For **each generated client repository**, connect its GitHub `main` branch to a new Pages project. Use Node 24, `npm ci` if the Pages build setup permits a custom install command, `npm run build`, and `dist` as output. Keep the `functions/` directory at the repository root. Review the generated `*.pages.dev` hostname before connecting a client domain. Set production and preview variables deliberately; do not assume preview secrets are safe for arbitrary code. Create a production deploy hook and a Sanity webhook for published creates, updates and deletes (including unpublish), with drafts/versions excluded. A successful webhook call means the rebuild was requested; inspect the Pages deployment and the actual page. Configure and test a Pages **production deployment-failed** email alert to a monitored inbox.

Resend Free is the default sending choice; verify the client's sending domain and choose an actual recipient inbox separately. Cloudflare Email Service can send to an account-verified destination on the free path when the sending domain is configured in Cloudflare Email Service. Check the domain's current MX records first. Do not enable Email Routing over Google Workspace or another existing mail provider's MX records without an agreed mail migration. See the [new site checklist](new-site-checklist.md) and [operations handoff](operations-handoff.md) for the full sequence.

## Reference documentation

- [Astro React integration](https://docs.astro.build/en/guides/integrations-guide/react/), [Astro on Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/), [Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Sanity webhooks](https://www.sanity.io/docs/content-lake/webhooks), [dataset safety](https://www.sanity.io/docs/content-lake/keeping-your-data-safe), [pricing](https://www.sanity.io/pricing)
- [Pages deploy hooks](https://developers.cloudflare.com/pages/configuration/deploy-hooks/), [Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Resend send API](https://resend.com/docs/api-reference/emails/send-email), [Resend pricing](https://resend.com/pricing)
- [Cloudflare Email Service REST API](https://developers.cloudflare.com/email-service/api/send-emails/rest-api/), [pricing](https://developers.cloudflare.com/email-service/platform/pricing/), [limits](https://developers.cloudflare.com/email-service/platform/limits/)
