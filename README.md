# Astro + Sanity + Cloudflare Pages starter

A public template for building small, content-focused websites. It gives you a working local demo and a starting point for a site with editable content and a contact form.

The demo is intentionally generic. Each site made from this template needs its own design, approved content, accounts, and launch decisions.

## What’s included

- **Astro** for a fast, static website
- **Sanity** for content editors, with content added during each build
- **Cloudflare Pages** for hosting and a server-side contact endpoint
- **Turnstile** for form verification and **Resend** as the default mail provider
- **React support** when a design needs interactive components

You can run the demo without creating any accounts. The contact form starts disabled and sends no real mail during local development.

## Try it locally

You’ll need Node 24 and npm.

```bash
npm ci
npm run dev
```

Open [http://localhost:4321](http://localhost:4321). To check the project and make a production build, run:

```bash
npm run check
npm run build
```

## Make it your own

1. Create a new repository using this template.
2. Replace the demo design and text with content approved for your site.
3. Set up your own Sanity project and connect it to the build.
4. Configure a Cloudflare Pages review site before connecting your domain.
5. Set up and test the contact form before making it visible to visitors.

The demo page is marked `noindex`. Remove that setting only when the real site is ready to be found by search engines. This template does not include client assets or ready-to-publish legal pages. The [privacy policy](docs/templates/privacy-policy.md) and [cookie policy](docs/templates/cookie-policy.md) are working templates that require a client-specific review.

## Guides

- [Quickstart and configuration](docs/quickstart.md) — local setup, Sanity, Pages, webhooks, and contact form settings
- [New site checklist](docs/new-site-checklist.md) — decisions and checks for a client project
- [Operations handoff](docs/operations-handoff.md) — what to record before handing over a live site
- [Starter decisions](docs/decisions.md) — why the template uses this setup
