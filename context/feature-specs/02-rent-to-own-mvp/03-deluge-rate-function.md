# 03 — Deluge `RATE` helper + contract update

**Status:** ✅ Written (script ready to paste; not yet live in Books)  
**Parent:** [overview.md](overview.md) §5 / §6  
**Suggested name:** `rto_calculate_contract_fields`  
**Script:** [`context/function/rto_calculate_contract_fields.md`](../../function/rto_calculate_contract_fields.md)

---

## Goal

One custom function: implement Excel `RATE()` (Newton-Raphson), derive Interest Total / Paid off / Balance, write four fields on the contract.

---

## Inputs

| Var | Field | Notes |
|-----|-------|-------|
| `n` | `cf_rto_period` | months |
| `PV` | `cf_rto_principal_wip` | principal |
| `PMT` | `cf_rto_monthly_payment_amount_wip` | monthly payment |

Guard: if any of `n`, `PV`, `PMT` is null / ≤ 0 → skip update and exit.

---

## Outputs

| Field | Formula |
|-------|---------|
| `cf_rto_interest_wip` | `r = RATE(n, −PMT, PV)` — store as monthly rate (see [02](02-interest-storage-convention.md)) |
| `cf_interest_total_wip` | `(PMT × n) − PV` |
| `cf_rto_paid_off_amount_wip` | `0` (MVP) |
| `cf_rto_current_balance` | `(PV + interest_tot) − paid_off` (= `PMT × n` at commencement) |

Interest Total is **not** `rate × 36`.

---

## `RATE()` algorithm

Deluge has no native `RATE()`. Solve for `r` where:

```
PV = PMT × (1 − (1 + r)^(−n)) / r
```

- Seed: `r = 0.01`
- Iterate until `|f| < 1e−10` or max 100 iterations
- Match Excel: rate ≥ 6 decimal places; currency ±0.02

Reference: [`rate-simulator.html`](../01-rent-to-own-understanding/rate-simulator.html)

---

## Pseudo steps

1. Load contract by ID.
2. Read `n`, `PV`, `PMT`.
3. Validate.
4. Newton-Raphson → `r`.
5. Compute totals.
6. Update the four fields.

---

## Deliverable

Paste-ready Deluge lives in [`../../function/rto_calculate_contract_fields.md`](../../function/rto_calculate_contract_fields.md) (keeps overview free of long code).

Next: wire workflow ([04-workflow.md](04-workflow.md)), then SO25-0001 test ([05-test-so25-0001.md](05-test-so25-0001.md)).
