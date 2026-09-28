# Starter decisions

Recorded 28 September 2026. These are template defaults, not client approvals.

| Decision | Reason and boundary |
| --- | --- |
| Public GitHub template; independent generated repositories | Reuse setup without coupling client histories. No automatic downstream updates. |
| Astro static + TypeScript; React integration available | Content-first output and optional interactive islands; no persistent site server. |
| Minimal Sanity `homePage` model | Proves editable published content without imposing a universal page builder. Expand only for an approved brief. |
| Local labelled demo with fail-closed configured CMS | No account needed to start; a configured missing document must fail the build rather than publish placeholder copy. |
| Git-connected Cloudflare Pages and generated `pages.dev` review hostname | Static builds and isolated review before a client domain change. Publish webhook requests another build; live verification remains required. |
| Pages Function + Turnstile + provider interface | Server validation and replaceable sending; contact form stays disabled pending hosted inbox proof. |
| Resend Free default; Cloudflare verified-destination option | Keep normal mail hosting and actual recipient choice separate from outbound sending. Existing MX records must be reviewed before Email Routing. |
| Working privacy and cookie policy templates; no published legal pages or client media | The templates prompt for the actual controller, providers, rights, retention and device technologies. Client review and approval remain necessary. |
| No Docker or unit-test suite by default | A small static starter needs local build/type checks and targeted hosted acceptance, not mirrored tests. |
