# Aaina — Working Rules

1. Follow PROJECT_SPEC.md. Build in phases; after each phase run the app, test it in the browser sub-agent, then commit.
2. Never ask for or store secrets in chat or files. Use env vars only.
3. Don't add paid services or accounts. Ask me before adding any dependency with a restrictive licence.
4. Prefer small, targeted edits over rewriting files. Keep components small and typed. Handle errors visibly.
5. Don't claim something works until you have run it. Report failures plainly, with the next step.
6. Every user-facing claim (accuracy, stats, "AI-powered") must be true and demonstrable.
7. Keep the P0 flow working at all times; never leave main broken. Feature-freeze time is given by me.
8. Verify third-party facts (model IDs, Space APIs, licences, quotas) against live docs before relying on them; record what you verified in docs/.
