One-liner:
AI-powered software stack builder, workflow designer, visual integration mapper, and cost/redundancy calculator.

Problem & who has it:
SMB owners, startup founders, and department heads struggle to select the right software tools for specific business goals (e.g., 'launch a podcast', 'start an online store'). Current software directories are generic, lack stack awareness, and fail to map tool workflows, leading to wasted time, incompatible toolchains, and budget waste.

Target platform(s):
Web (Responsive desktop and mobile)

Users & roles:
- Founder / SMB Owner / Department Head (creates workflows, maps existing tech stack, analyzes cost & redundancy, exports stack)

Auth needs:
none (Local-first session-based state with option to export/import JSON/shareable link)

Data stored & sensitivity:
User existing stack selections, business goals, custom tool pricing overrides (non-sensitive / client-managed).

Third-party services/APIs (mark which need paid keys):
None required for local offline generation and interactive stack optimization engine.

Launch scale: users / RPS / data size:
10,000 monthly active users / 50 RPS / Client-side catalog + server-rendered Next.js pages.

Budget & infra constraints:
Zero fixed API dependency cost for baseline MVP; static/SSR Next.js on Vercel/Node.

Compliance: none | GDPR | SOC2 | HIPAA | PCI:
none

Monetization:
SaaS tiers ($49/mo Starter, $149/mo Pro, Enterprise Custom)

NON-GOALS:
- Direct API provisioning or live automated OAuth data syncing with third-party SaaS accounts.
- Real-time live billing integration with 1,000+ SaaS vendor pricing APIs.
- User community forums or review hosting (covered by G2/Capterra).
- Mobile native apps (Web-first approach).

Open questions for the human:
None.

Assumptions (tagged, risk H/M/L):
- ASSUMPTION-01 (Risk: Low): A structured catalog of 50+ popular SaaS tools with integration capability matrices and category pricing provides sufficient real-world fidelity.
- ASSUMPTION-02 (Risk: Medium): Users prefer deterministic, high-quality rule-and-knowledge-based recommendation engines with custom prompt overrides over non-deterministic raw LLM responses.
