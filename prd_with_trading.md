
# CrowdAthletes PRD (With Share Trading)

## Abstract
CrowdAthletes is a two-sided marketplace prototype that enables talented but underprivileged athletes to raise capital from investors in exchange for a future revenue share.

The prototype demonstrates a complete funding loop:
Athlete onboarding → Funding request → Investor discovery → Simulated investment → Portfolio tracking → ROI scenario visualization → Secondary share trading.

This prototype validates usability, clarity, marketplace dynamics, and pitch readiness.

---

## Business Objectives
- Validate clarity of the athlete investment model
- Demonstrate end-to-end usability for both sides
- Simulate secondary market liquidity through share trading
- Increase perceived trust via verification scoring
- Strengthen pitch narrative through ROI scenario visualization

---

## KPI

| GOAL | METRIC | QUESTION |
|------|--------|----------|
| Athlete Flow Completion | ≥80% | Can athletes publish funding without help? |
| Investor Flow Completion | ≥80% | Can investors browse, invest, and trade without confusion? |
| Model Understanding | ≥75% | Can users explain how investors make money? |

---

## Success Criteria
- ≥80% usability completion
- ≥75% accurate explanation of revenue-share model
- Users understand how share trading works
- Positive qualitative feedback on clarity and trust

---

## User Journeys

### Athlete Journey
1. Sign up
2. Upload identity document
3. Upload stats and video
4. Receive verification score
5. Set funding goal
6. Publish profile
7. Monitor funding progress

### Investor Journey
1. Sign up
2. Select risk profile
3. Browse athletes
4. View verification score and ROI scenarios
5. Invest (simulated)
6. Track portfolio
7. Buy or sell shares in secondary marketplace

---

## Share Trading (Secondary Market Simulation)

### Concept
Investors can list their athlete shares for sale at a chosen simulated price.
Other investors can browse listed shares and purchase them.

### Trading Flow
1. Investor selects owned athlete share
2. Clicks “List for Sale”
3. Sets price (simulated)
4. Share appears in Marketplace
5. Another investor purchases
6. Portfolio updates for both parties

### Trading Logic (Simulation)
- Share price influenced by:
  - Funding progress
  - Verification score
  - Athlete performance updates
- No real monetary transfer

---

## ROI Scenario Logic (Simulation)

| Scenario | Career Earnings | Revenue Share % | Investor Return |
|-----------|----------------|----------------|----------------|
| Conservative | €200,000 | 5% | €10,000 |
| Moderate | €800,000 | 5% | €40,000 |
| Breakout | €5,000,000 | 5% | €250,000 |

---

## Risks & Mitigations

| RISK | MITIGATION |
|------|------------|
| Athlete fraud | Verification scoring + ID upload |
| Legal complexity | Clear simulation disclaimer |
| Return misunderstanding | ROI visualization |
| Market manipulation (trading) | Simulated pricing + no real funds |

---

## Assumptions
- Simulated investments only
- Simulated secondary trading only
- No real securities issued
- Web-based prototype
- Built on Antigravity
