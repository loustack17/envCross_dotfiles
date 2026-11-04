---
name: jev-browser-use
description: Use Jev for bounded public, non-sensitive website interaction, search, clicking and typing. The current assistant supplies text and BWS supplies the TypeSafe credential. Use existing browser tools for login, private pages, uploads or consequential submissions.
---

Use this skill's `run.py` as the only entry point. Resolve its path relative to this SKILL.md, including when accessed through a tool's skills link. No ChatGPT project folder is required.

Run with Python 3.12 or newer, passing a JSON request through stdin:

```json
{"url":"https://example.com","goal":"Read Example Domain and stop without clicking.","allow_hosts":["example.com"],"expect":"Example Domain","max_ticks":3}
```

Only `url`, `goal`, `allow_hosts`, `values`, `expect`, `expect_fields`, and `max_ticks` are accepted. Use exact public hosts, standard HTTP(S) ports, 1–10 ticks, and independent expected evidence. `values` and `expect_fields` map visible labels to strings. Supply truthful non-sensitive text using the current assistant; no separate text-model API is used. Stop if needed information is missing.

Read [SETUP.md](SETUP.md) if the runtime is unavailable. The pinned Jev source and dependency lock are included under `vendor/jev-ultrafast`. Its virtual environment is machine-local and ignored by Git. BWS credentials come from the sibling `typesafe-ai/scripts/with-bitwarden.py`; never write credentials to this skill or `.env`.

The guarded launcher strips unrelated credentials, disables text-model fallback and telemetry, and uses a headless browser with a disposable profile. Do not use external CDP, the raw runner, or the original Jev demo as an alternative entry point. Do not print secrets.

Only operate public non-sensitive pages. Never supply passwords, OTPs, private account data, payment details, CVs, or personal form values. Login, file upload, application submission, messaging, purchase and deletion belong to the existing authorized browser workflow. Use FreeHire/Exa for discovery and Moli for reading where available; Jev serves public page interaction.

Page state and goals go to TypeSafe; typed text can appear in later observations and logs. Sensitive-field detection is heuristic. Public-address and host checks are not a network firewall and do not protect every subresource or DNS change. This integration is not suitable for private browser sessions.

The runner emits progress followed by a JSON result. Accept success only when `verified` is true and independent live evidence matches. DONE alone is insufficient. Report failures, blocked clicks, missing text, sensitive pages and off-host navigation. Do not automatically retry potentially mutating actions.
