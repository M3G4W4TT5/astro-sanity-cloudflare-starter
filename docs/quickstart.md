# Quickstart and configuration

This guide covers the technical setup behind the [starter overview](../README.md). Astro builds static HTML, Sanity supplies approved public editorial text at build time, and a Cloudflare Pages Function handles contact submissions. React is installed for interactive islands when a particular design needs one; this demo page does not hydrate React.

The page in this repository is **demonstration content**, not client copy or a design to publish. There are no client accounts, assets, domains, credentials, or published legal pages in the template. Working [privacy](templates/privacy-policy.md) and [cookie](templates/cookie-policy.md) policy templates live in `docs/templates/`; they need client-specific facts, deployment checks and approval before being placed on a public site.

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

### Sanity project and Studio

1. In the client's durable Sanity account, create a project and a public dataset (the example configuration uses `production`). Record the project owner, dataset name and named editors in the client's private checklist. Review fields and assets before adding them: the public dataset is for publishable site content, not private evidence or contact messages.
2. Copy `.env.example` to `.env` and set `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET`. Copy `studio/.env.example` to `studio/.env` and set `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET` to the **same** project and dataset. These are public identifiers, not write tokens. Keep both local files out of Git.
3. Adapt `studio/schemas/homePage.ts` to the approved content model. Run `npm run studio:dev`, open the Home page editor, fill its required fields and **Publish** the document. The starter's structure fixes its document ID at `home`; `src/lib/content.ts` queries that ID and type. If the schema or ID changes, update the query and webhook scope too.
4. Run `npm run check` and `npm run build` from the repository root. Confirm `dist/index.html` contains the approved published heading and text. A missing published `home` document or required field deliberately fails the build. Draft edits will not appear because the build uses the published perspective.
5. From `studio/`, run `npx sanity deploy` to choose a client-specific `*.sanity.studio` hostname, or configure another approved Studio host. Open the deployed Studio, confirm it connects to the intended dataset, invite the named editors in Sanity project management, and confirm they can access it. Keep Studio configuration free of tokens. See [Sanity Studio deployment](https://www.sanity.io/docs/studio/deployment).

Sanity content is fetched during **build**, not in the visitor's browser. Every publish or unpublish needs a successful Pages rebuild before the website changes.

## Contact endpoint

`functions/api/contact.ts` validates bounded form data and verifies Turnstile with Siteverify on hosted Pages. `functions/api/mail.ts` selects a replaceable provider: Resend by default, or Cloudflare Email Service for a verified destination. The sender is a fixed authenticated address from server configuration; the visitor is Reply-To. The endpoint returns success only after the sending API accepts the message. Acceptance is not proof of inbox arrival.

The public form starts disabled (`PUBLIC_CONTACT_FORM_READY=0`). A hosted endpoint also requires `CONTACT_FORM_ENABLED=1`, a Turnstile secret, and working mail settings. Use a review deployment with the form enabled to obtain a valid Turnstile token and test the hosted flow; keep production's public switch at `0` until the intended inbox receives the message and Reply-To works. If the review test fails, turn its form off again while correcting the setup. On localhost, the Function **never sends real mail**: `CONTACT_DEV_MODE=1` allows a labelled simulation. To exercise it, copy `.dev.vars.example` to `.dev.vars`, run `npm run build` and `npm run dev:pages`, then POST a valid multipart form to `http://localhost:8788/api/contact`. Astro's `npm run dev` serves the page only; it does not run Pages Functions.

## Configuration boundaries

| Setting | Where it belongs | Meaning |
| --- | --- | --- |
| `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `SITE_URL` | Client `.env` locally; Pages build variables | Public Sanity source and canonical URL. Set `SITE_URL` to the review hostname first, then the approved domain. |
| `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET` | Client `studio/.env` locally; Studio deployment settings | Public project identifiers, never a write token. |
| `PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_CONTACT_FORM_READY`, `PUBLIC_CONTACT_EMAIL` | Client `.env` locally; Pages build variables | Public widget key, form display switch, optional direct email link. |
| `CONTACT_FORM_ENABLED`, `CONTACT_PROVIDER`, `CONTACT_RECIPIENT`, `CONTACT_SENDER` | Pages Function environment variables | Server-only enable switch, `resend` or `cloudflare`, real inbox and fixed sender. Resend accepts an address or `Site Name <address>`; verify the sending domain before live use. Treat recipient as operational/private. |
| `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY` | Pages encrypted secrets | Verification and default sending credentials. |
| `CF_EMAIL_ACCOUNT_ID`, `CF_EMAIL_API_TOKEN` | Pages server configuration; token as encrypted secret | Only for the optional Cloudflare verified-destination adapter. |
| Pages deploy hook URL | Sanity webhook URL field only | Secret trigger URL. Never put it in Git, Studio document fields, or browser code. |

The root `.env.example`, `studio/.env.example`, and `.dev.vars.example` contain no live values. `.env`, `.dev.vars`, `dist`, and local Studio files are ignored. Never put private evidence, credentials, sensitive notes, uncleared images, or contact submissions in a public Sanity dataset or this public repository. Published Sanity documents are publicly queryable, and uploaded assets may remain reachable by URL.

## Cloudflare Pages setup

For **each generated client repository**:

1. Push the reviewed client repository to its chosen GitHub owner. In the client's Cloudflare account, go to **Workers & Pages → Create application → Pages → Connect to Git**, authorize the intended repository and select it. Review the GitHub application's repository access before granting it. Choose `main` as the production branch; other branches can produce preview deployments. See [Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/).
2. In the build setup, use the repository root, `npm run build` as the build command, and `dist` as the output directory. Keep `functions/` at that root so Pages deploys `/api/contact`. Node 24 is pinned in `.node-version`; set `NODE_VERSION=24` in Pages if an explicit build variable is needed, then confirm the version in the build log. Use `npm ci` for a custom install command only if the Pages setup offers one. See [Pages build image](https://developers.cloudflare.com/pages/configuration/build-image/).
3. Set the build variables for the intended environment before deploying. Production should have `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET` and `SITE_URL` for its current `*.pages.dev` review origin, plus `PUBLIC_CONTACT_FORM_READY=0`. Set `PUBLIC_TURNSTILE_SITE_KEY` only when configuring the form. Set preview values separately for the review branch and hostname. `SITE_URL` changes to the approved domain at launch. Server settings and encrypted secrets are listed in [configuration boundaries](#configuration-boundaries); never add secret values to Git. Do not give arbitrary preview code access to production mail secrets.
4. Deploy and inspect the build log, deployed commit, generated hostname, page content and `/api/contact` route. The route must exist, but with sending disabled it should not accept mail. Confirm the site is still marked `noindex` during review. A `*.pages.dev` hostname and a successful build do not approve the client domain or content for launch.

### Sanity publish to Pages

1. In **Pages → client project → Settings → Builds**, add a deploy hook named for Sanity and select the production branch (`main` in this starter). Copy its generated URL directly into the client's Sanity webhook configuration. It is an unauthenticated trigger URL: keep it out of Git, chat, screenshots and public handoff notes. See [Pages deploy hooks](https://developers.cloudflare.com/pages/configuration/deploy-hooks/).
2. In **Sanity project management → API → Webhooks**, create an enabled webhook for the same dataset. Set its URL to the Pages deploy hook, method to `POST`, and triggers to published **create, update and delete**. Leave draft and version triggers off. For the untouched starter, use the filter `_type == "homePage" && _id == "home"`; expand it when other published document types affect the site. Unpublishing fires the delete trigger. See [Sanity webhook settings](https://www.sanity.io/docs/content-lake/webhooks).
3. Publish a harmless, identifiable edit in Studio. Inspect the webhook's **Attempts** log, the matching Pages deployment (its source should be the deploy hook), and the live page text. Record the edit, deployment and observed URL in the client's private handoff. Repeat for unpublish/delete where the site's intended behavior is defined; this starter's build deliberately fails if `home` is unpublished, so decide whether to block unpublishing or design an approved empty state before relying on that action.

| Symptom | Inspect next |
| --- | --- |
| No Pages build | Check the Sanity webhook's dataset, filter, triggers, enabled status and Attempts log; check the deploy hook URL and branch. |
| Pages build failed | Read the build log. Check required published documents, Sanity identifiers and build variables; the prior successful deployment may still be live. |
| Build succeeded but content looks old | Confirm the deployment used the intended branch/dataset, then inspect its URL and the visible page before checking the custom domain or cache. |

### Production deployment failure alert

In the client's Cloudflare account, open **Manage account → Alerts → Add → Pages → Project updates**. Choose the client project, **Production** environment and **Deployment failed** event; send it to a monitored inbox. Save and enable the alert, use its **Test** action, and confirm receipt in that inbox. Record the alert location and owner in the private handoff. This alert catches failed Pages deployments; a Sanity webhook that never starts a build must be investigated in Sanity Attempts. See [Cloudflare Pages notifications](https://developers.cloudflare.com/notifications/notification-available/).

Resend Free is the default sending choice; verify the client's sending domain and choose an actual recipient inbox separately. Cloudflare Email Service can send to an account-verified destination on the free path when the sending domain is configured in Cloudflare Email Service. Check the domain's current MX records first. Do not enable Email Routing over Google Workspace or another existing mail provider's MX records without an agreed mail migration. See the [new site checklist](new-site-checklist.md) and [operations handoff](operations-handoff.md) for the full sequence.

### Resend setup and delivery check

This is a per-client setup. The account and test recipient need named owners and recovery access. If a temporary mailbox is approved for review, use that mailbox for the Resend account and `CONTACT_RECIPIENT`; the `resend.dev` testing sender has recipient restrictions. Replace the temporary mailbox with the chosen business inbox before launch. Resend sends the enquiries but does not choose or provision that inbox.

1. Create the client-owned [Resend account](https://resend.com/). In **API Keys**, create a site-named key with **Sending access**. Keep the key out of chat, Git and screenshots. If the key is restricted to a domain, ensure its scope covers the test sender and later replace or update the key for the verified client domain. See [API key permissions](https://resend.com/changelog/new-api-key-permissions).
2. The existing `functions/api/mail.ts` sends `POST https://api.resend.com/emails` with a fixed `from`, the chosen `to`, a text subject/body and the visitor's email in `reply_to`. Do not put the visitor's address in `from`.
3. In **Cloudflare Pages → client project → Settings → Variables and Secrets**, configure the intended review environment. Add `RESEND_API_KEY` as an encrypted secret, `CONTACT_RECIPIENT` as the approved temporary inbox, and `CONTACT_SENDER` as `Site Name <onboarding@resend.dev>` for the initial test. The `resend.dev` sender is for limited testing, not launch. Set `CONTACT_PROVIDER=resend`, `CONTACT_FORM_ENABLED=1`, `TURNSTILE_SECRET_KEY` as an encrypted secret, and the review hostname's Turnstile site key. You may encrypt the recipient and sender values too. Keep production `PUBLIC_CONTACT_FORM_READY=0`. See [Pages secrets](https://developers.cloudflare.com/pages/functions/bindings/#secrets).
4. Redeploy the review environment after setting bindings. Set its `PUBLIC_CONTACT_FORM_READY=1` build variable and rebuild so the hosted form and Turnstile widget appear. Check that the review hostname is allowed in Turnstile. Keep the live domain disconnected or its production form disabled during this test. See [Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/).
5. Submit one enquiry through the hosted review form. In **Resend → Emails**, check for **Delivered**, confirm receipt in the temporary inbox, and use Reply to verify the visitor address. An API success response by itself only means Resend accepted the request. Test invalid fields, an invalid Turnstile token and the form's failure message.
6. For final delivery, verify the approved sending domain in **Resend → Domains**, set `CONTACT_SENDER` to a fixed address on that domain, and replace `CONTACT_RECIPIENT` with the approved business inbox. Check any domain-scoped API key. Repeat the hosted delivery and Reply-To test on the review deployment with these final settings. Configure the production bindings and redeploy; enable the production public form at the approved launch and confirm delivery again on the live hostname. Use the [domain verification guide](https://resend.com/blog/new-domain-verification-experience) and confirm current DNS instructions in Resend.

## Reference documentation

- [Astro React integration](https://docs.astro.build/en/guides/integrations-guide/react/), [Astro on Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/), [Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Sanity webhooks](https://www.sanity.io/docs/content-lake/webhooks), [dataset safety](https://www.sanity.io/docs/content-lake/keeping-your-data-safe), [pricing](https://www.sanity.io/pricing)
- [Pages deploy hooks](https://developers.cloudflare.com/pages/configuration/deploy-hooks/), [Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Resend send API](https://resend.com/docs/api-reference/emails/send-email), [Resend pricing](https://resend.com/pricing)
- [Cloudflare Email Service REST API](https://developers.cloudflare.com/email-service/api/send-emails/rest-api/), [pricing](https://developers.cloudflare.com/email-service/platform/pricing/), [limits](https://developers.cloudflare.com/email-service/platform/limits/)
