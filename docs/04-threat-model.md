# Threat Model & Security Review

## Data Classification
- **Public**: Tool catalog (SaaS names, public pricing estimates, integration capabilities, workflow templates).
- **User-provided / Client-Local**: Goal selections, list of existing tech stack tools, custom price overrides. (No PII, credit card details, or sensitive credentials stored on server).

## Entry Points & STRIDE Analysis
1. **Goal Input & Custom Tool Additions**:
   - Threat: Cross-Site Scripting (XSS) / Input Injection in custom tool names or step descriptions.
   - Mitigation: Input sanitization, strict React JSX escaping, Zod schema validation.
2. **Shareable URL State Export/Import**:
   - Threat: Malicious payload injection via URL parameters or shareable state links.
   - Mitigation: Strict JSON schema parsing with Zod validation on imported URL state; invalid or malformed state gracefully rejected with fallback to default state.
3. **Dependency CVE Management**:
   - Threat: Supply chain vulnerabilities in npm dependencies.
   - Mitigation: Lockfile integrity, automated `npm audit --audit-level=high` checks in release gate.
