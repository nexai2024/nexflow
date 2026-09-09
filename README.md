# NexFlow — AI Software Stack Builder & Workflow Integration Mapper

**NexFlow** is an AI-powered software stack builder, workflow designer, visual integration mapper, and cost/redundancy calculator. It takes a business goal (e.g. 'Launch a Podcast', 'Start an Online Store') and existing tech stack, then generates a tailored step-by-step workflow with compatible tool recommendations, visual integration pathways, custom pricing calculations, and subscription redundancy alerts.

---

## 🚀 Key Features

1. **Goal-Driven Workflow Recommendation Engine**:
   - Recommends multi-step workflows tailored to existing tools and business objectives.
   - Recommends tools based on suitability, existing ownership, and compatibility.
2. **Visual Toolchain & Integration Mapper**:
   - Interactive flow diagram illustrating recommended software tools and integration connectors (Native Sync, Automated iPaaS, Zapier / Webhooks).
   - Modal inspection for tool pricing tiers, capabilities, and website links.
3. **Total Stack Cost Calculator & Pricing Overrides**:
   - Calculates monthly and 12-month annualized stack costs.
   - Supports custom negotiated or contracted subscription pricing overrides.
4. **Software Redundancy Identifier**:
   - Detects overlapping software capabilities across owned and recommended tools (e.g. multiple email tools) and calculates potential monthly savings.
5. **Goal Presets Library & Quick Launch Templates**:
   - Curated templates for Podcast Launch, Online Store, B2B Sales Pipeline, and Content Creator Ecosystem.
6. **Stack Specification Export & Shareable Link**:
   - Download complete software stack specifications as formatted JSON or generate shareable state links.

---

## 🛠️ Quick Start & Local Development

### Prerequisites
- Node.js 20+
- npm 10+

### Installation & Run

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
# Open http://localhost:3000
```

### Verification & Testing

```bash
# Run unit & integration test suite
npx vitest run

# Run test coverage
npx vitest run --coverage

# Typecheck
npx tsc --noEmit

# Execute automated release gate
./verify
```

---

## 📄 Documentation

All project architecture specifications and build pack logs reside in `/docs/`:
- `00-idea-brief.md`: Objective and clarified assumptions
- `01-prd.md`: Product requirements document
- `02-requirements.md`: Master numbered REQ-### list
- `03-architecture.md`: Pinned tech stack & directory structure
- `04-threat-model.md`: Data classification & threat review
- `05-nfr.md`: Numeric performance & scale targets
- `06-test-plan.md`: Test plan & coverage goals
- `07-traceability.md`: Requirement-to-test mapping matrix
- `08-runbook.md`: Setup, dev, and deployment operations
- `09-data-and-migrations.md`: Domain data structures
- `RELEASE-GATE.md`: Verified release gate report
