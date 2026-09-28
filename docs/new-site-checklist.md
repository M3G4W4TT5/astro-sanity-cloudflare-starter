# New client site checklist

Copy this checklist into the **client's private working notes** and fill in owners, dates and evidence. Do not write sensitive decisions into the public template.

## Brief and ownership

- [ ] Record audience, purpose, required pages, language(s), interactions, deadline and approval owner.
- [ ] Record the client's GitHub repository owner/admin, Sanity project owner/editors, Cloudflare account admin, domain registrar/DNS owner, mail admin, monitored operations inbox and backup access.
- [ ] Identify existing business inbox and MX records. If there is no inbox, decide and create one as a separate step. Resend is a sending provider, not an inbox decision.
- [ ] Inventory approved copy, factual claims, logos, images, licences, credits and any private evidence. Keep uncleared or sensitive files out of public Git/Sanity.

## Build and editorial setup

- [ ] Generate an independent GitHub repository using **Use this template**. Record its URL and visibility; review files before public push. Template updates will not auto-merge later.
- [ ] Replace demo content/design, metadata and `noindex` with approved site-specific work. Add only necessary pages, schema fields and React islands.
- [ ] Create the client Sanity project and intended public dataset. Confirm plan, membership and visibility. Set `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, Studio equivalents and `SITE_URL` without write tokens in the build.
- [ ] Publish a valid `homePage` document with ID `home`; `npm ci`, `npm run check`, `npm run build`. Verify the built HTML contains approved Sanity content, not demo copy.
- [ ] Set up named Studio editors and trusted publishing practice. Review raw public document fields and asset URLs for unintended exposure.

## Pages and content deployment

- [ ] Create the client's Pages project connected to its GitHub `main`. Set Node 24, build command `npm run build`, output `dist`, and project-specific build variables. Verify `functions/` is deployed.
- [ ] Review the generated `*.pages.dev` hostname. Keep launch DNS untouched until approved.
- [ ] Create a **production** Pages deploy hook. Put its URL only in the Sanity webhook configuration; configure the intended dataset, POST, published create/update/delete, drafts/versions excluded.
- [ ] Publish a harmless edit. Check Sanity webhook attempts, Pages deployment success and the changed live page. Test unpublish/delete behaviour too.
- [ ] Configure Pages project updates alert for the client project, **Production → Deployment failed**, to a monitored inbox. Use the alert test and confirm email receipt.

## Contact and launch

- [ ] Choose recipient inbox and fixed authenticated sender. Default: Resend Free; optional: Cloudflare sending to a verified destination. Verify sending domain and current pricing/limits. Do not alter existing mail MX records casually.
- [ ] Set Turnstile site key for review and final hostnames, server secret, provider credentials and `CONTACT_FORM_ENABLED=1` in hosted Pages. Keep `PUBLIC_CONTACT_FORM_READY=0` for now.
- [ ] Submit directly to the hosted endpoint, confirm provider acceptance, actual inbox receipt and Reply-To. Test bad fields, bad Turnstile token and provider failure. Then set `PUBLIC_CONTACT_FORM_READY=1`, rebuild and test the visible form.
- [ ] Obtain client-reviewed legal/privacy content for actual collection and providers; record retention and handling. No template policy is publishable as-is.
- [ ] Review accessibility, mobile layout, links, SEO/indexing, content and analytics/cookies if added. Get approval for the domain/DNS switch; connect the client domain and verify HTTPS, canonical URL, live pages and contact delivery there.
- [ ] Complete [operations handoff](operations-handoff.md).
