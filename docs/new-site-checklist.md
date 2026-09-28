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
- [ ] Follow [Sanity project and Studio](quickstart.md#sanity-project-and-studio): create the client project and public dataset, record ownership, and set matching site and Studio IDs without write tokens in the build.
- [ ] Publish a valid `homePage` document with ID `home`; run `npm ci`, `npm run check`, `npm run build`, and verify the built HTML contains approved Sanity content rather than demo copy.
- [ ] Deploy/configure the client's Studio, invite named editors, verify their access and review raw public document fields and asset URLs for unintended exposure.

## Pages and content deployment

- [ ] Follow [Cloudflare Pages setup](quickstart.md#cloudflare-pages-setup): connect only the intended GitHub repository, select `main`, set Node 24, build command `npm run build`, output `dist`, and separate production/preview variables. Inspect the first build log and deployed commit; verify `functions/` is deployed.
- [ ] Review the generated `*.pages.dev` hostname. Keep launch DNS untouched until approved.
- [ ] Follow [Sanity publish to Pages](quickstart.md#sanity-publish-to-pages): create a **production** Pages deploy hook and configure the Sanity webhook for the intended dataset, `POST`, published create/update/delete, drafts/versions excluded. Keep the hook URL secret.
- [ ] Publish a harmless edit. Record the Sanity attempt, matching successful Pages deployment and changed live page. Define the intended unpublish/delete behavior before testing it; the starter's required `home` document makes an unpublish build fail.
- [ ] Follow [Production deployment failure alert](quickstart.md#production-deployment-failure-alert): filter the Pages project update alert to this project, **Production → Deployment failed**, and confirm its test email reaches the monitored inbox.

## Contact and launch

- [ ] Choose recipient inbox and fixed authenticated sender. Default: Resend Free; optional: Cloudflare sending to a verified destination. Verify sending domain and current pricing/limits. Do not alter existing mail MX records casually. Follow the [Resend setup and delivery check](quickstart.md#resend-setup-and-delivery-check) when using Resend.
- [ ] For a Resend review test, record the owner and recovery access for any approved temporary inbox/account. Create a site-named Sending access API key; set the review Pages `RESEND_API_KEY`, `CONTACT_RECIPIENT`, `CONTACT_SENDER`, `CONTACT_PROVIDER=resend`, `CONTACT_FORM_ENABLED=1` and Turnstile settings. Redeploy after changing bindings. Keep production `PUBLIC_CONTACT_FORM_READY=0`.
- [ ] Enable the form only on the review deployment and submit a hosted enquiry with Turnstile. Confirm Resend **Delivered**, actual inbox receipt and Reply-To. Test bad fields, bad Turnstile token and failure messaging. If the test fails, disable the review form while correcting it.
- [ ] Verify the final Resend sending domain and fixed sender, replace the temporary recipient with the approved business inbox, check any API key domain restriction and retest on review. Set production bindings and redeploy. After launch approval, enable `PUBLIC_CONTACT_FORM_READY=1` in production, rebuild and confirm delivery and Reply-To on the live hostname.
- [ ] Adapt the [privacy policy template](templates/privacy-policy.md) to the actual controller, purposes, legal bases, form, providers, transfers, retention and rights. Resolve every marker, verify the deployed behaviour and obtain client approval before publishing.
- [ ] Inventory cookies and similar technologies on the deployed site, including Turnstile and any later integrations. Adapt the [cookie policy template](templates/cookie-policy.md), resolve every marker and test consent and withdrawal where optional technology is used. Obtain client approval before publishing.
- [ ] Review accessibility, mobile layout, links, SEO/indexing, content and analytics/cookies if added. Get approval for the domain/DNS switch; connect the client domain and verify HTTPS, canonical URL, live pages and contact delivery there.
- [ ] Complete [operations handoff](operations-handoff.md).
