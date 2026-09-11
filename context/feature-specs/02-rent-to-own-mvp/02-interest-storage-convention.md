# 02 — Interest % storage convention

**Status:** ✅ Done (decided 2026-09-03)  
**Parent:** [overview.md](overview.md) §4 / §10  
**Field:** `cf_rto_interest_wip` (Decimal)

---

## Decision

**Store `0.012810`** — true monthly rate from Excel `RATE()`, not percent points (`1.2810`).

| Convention | Example (SO25-0001) | Choice |
|------------|---------------------|--------|
| **Decimal monthly rate** | `0.012810` | ✅ Use this |
| Percent display number | `1.2810` | ❌ Rejected |

- Display label can still say “Interest %”.
- Deluge writes `r` as-is (no ×100 / ÷100).
- Document the convention in the Deluge function comment (see [03-deluge-rate-function.md](03-deluge-rate-function.md)).

---

## Acceptance

- SO25-0001 writeback ≈ `0.012810` (≥ 6 decimal places).
- Function comment states: stored value is monthly rate, not percent points.
