# Operations and handoff checklist

For each client, record the answers in a restricted handoff document. Do not put credentials or contact messages in this repository.

- [ ] List named owners and backup admins for GitHub, Sanity, Cloudflare Pages, domain/DNS, mail inbox, sender service and Turnstile. Record who can approve publication and who monitors failures.
- [ ] Record client repository URL, branch, Pages project/review/live URLs, Studio URL, dataset and domain registrar. Store secret **locations** and rotation owners, never secret values.
- [ ] Record Pages build settings (`npm run build`, `dist`, Node 24), environment variable names, production/preview split, custom domain and DNS records. Verify current MX records and mail flow after any DNS change.
- [ ] Record Sanity webhook location, dataset/filter/trigger types, associated Pages deploy hook and how to inspect attempt logs. Keep the hook URL secret. Document how to manually request a fresh build if a webhook fails.
- [ ] Record Pages deployment-failed alert configuration and prove its test email reached the monitored inbox. Review failed builds promptly; an older successful deployment can stay live after a failed build.
- [ ] Record last published CMS test edit, Sanity revision/time, matching successful Pages deployment and the observed live URL/content. A webhook 2xx alone is insufficient.
- [ ] Record contact recipient, verified sender, provider, Turnstile allowed hostnames, successful hosted submission time, inbox receipt and Reply-To check. Success from the sending API means acceptance, not final delivery.
- [ ] Record privacy/legal owner, data handling and retention, provider agreements if needed, asset rights/credits, renewal/cost limits and what to do when an enquiry or provider fails.
- [ ] Export/back up published Sanity documents and selected approved media; keep source evidence separately. Rehearse restoring one page and one image. Git history alone does not back up CMS content.
- [ ] Explain editorial workflow: review private evidence, edit draft, approve, publish, observe webhook/build, verify live page. Explain unpublish, rollback and stale Pages deployment handling.
- [ ] Transfer access and document an incident contact path. Keep template and client repos separate; template updates do not reach generated repos automatically.
