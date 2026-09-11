# Rent-to-Own MVP — Contract Field Calculations

**Status:** In progress — Deluge live ✅; SO25-0001 + SO25-0006 pass ✅; workflow next  


**Org:** Megah Holdings Sdn Bhd (Zoho Books `795380341`)  
**Module:** Rent To Own Contracts (`cm_rent_to_own_contract`)  
**Depends on:** [01 — Rent-to-Own Understanding](../01-rent-to-own-understanding/overview.md) (Excel `RATE` model)  
**Primary test case:** SO25-0001 — period 36, principal 11,449.81, monthly 399.00

> MVP goal: when a Rent To Own Contract is saved, a **single custom function** fills Interest %, Interest Total, Paid off Amount, and Current Balance. Item / Recurring Invoice / payment wiring comes later.

---

## 1. One-sentence summary

On create (and edit of calc inputs), compute `RATE(period, −pmt, principal)` and write Interest %, Interest Total, Paid off = 0, and Current Balance onto the contract record.

---

## 2. Scope

### In scope

| # | Deliverable |
|---|-------------|
| 1 | Fix field data types on `cm_rent_to_own_contract` (text → amount / decimal) |
| 2 | One Deluge custom function implementing Excel `RATE()` + derived totals |
| 3 | Workflow on Contract **Created** (+ optional **Edited** when period / principal / monthly change) |
| 4 | Verify against SO25-0001 (and optionally SO25-0006) from the Excel test datasets |

### Out of scope (next phases)

- Copy Principal from Item lookup
- Pull Monthly Payment from Recurring Invoice profile
- Update Paid off / Balance when invoice payments are received
- Amortisation schedule (period rows) custom module
- Commencement / monthly journal entries
- Maintenance split (C25 / C26), machine revenue, deferred maintenance
- Buyout / early termination logic
- CRM `Contract_GR` (not part of this Books MVP)

---

## 3. Current module snapshot (Books MCP scan)

**Entity API name:** `cm_rent_to_own_contract`  
**Plural label:** Rent To Own Contracts

| Label | API name | Current type | MVP role |
|-------|----------|--------------|----------|
| RTO Contract No* | `cf_rto_contract_no` | string | Input (manual) |
| Customer* | `cf_customer` | lookup → Customers | Input (already wired) |
| RTO Item* | `cf_rto_item` | lookup → Items | Input (already wired; copy later) |
| RTO ID | `cf_rto_id` | autonumber `RTO-#####` | System |
| RTO Start Date* | `cf_rto_start_date` | date | Input |
| RTO End Date* | `cf_rto_end_date` | date | Input |
| RTO Period* | `cf_rto_period` | number | **Calc input** (months) |
| RTO Principal (WIP) | `cf_rto_principal_wip` | amount ✅ | **Calc input** |
| RTO Monthly Payment Amount (WIP) | `cf_rto_monthly_payment_amount_wip` | amount | **Calc input** (manual for MVP) |
| RTO Interest % (WIP) | `cf_rto_interest_wip` | decimal ✅ | **Calc output** (store monthly rate e.g. `0.012810`) |
| Interest Total (WIP) | `cf_interest_total_wip` | amount ✅ | **Calc output** |
| RTO Paid off Amount (WIP) | `cf_rto_paid_off_amount_wip` | amount (default 0) | **Calc output** |
| RTO Current Balance | `cf_rto_current_balance` | amount | **Calc output** |

Lookups already work: Customer → Customers, RTO Item → Items. For MVP, Principal and Monthly Payment are **typed in manually**.

---

## 4. Field type fixes (do before Deluge)

| Field | Change to | Why |
|-------|-----------|-----|
| `cf_rto_principal_wip` | Amount | Must be numeric for `RATE` |
| `cf_rto_interest_wip` | Decimal | Store monthly rate `0.012810` (not `1.2810`) — decided |
| `cf_interest_total_wip` | Amount | Currency total, not text |

Interest % storage: **Decimal as monthly rate** (`0.012810`). Display label can still say “%”. Document in the Deluge function comment.

---

## 5. Calculation rules

### Inputs

```
n   = cf_rto_period                          // months
PV  = cf_rto_principal_wip                   // principal / net selling price
PMT = cf_rto_monthly_payment_amount_wip      // monthly payment
```

Guardrails: if any of `n`, `PV`, `PMT` is null / ≤ 0, skip update (or write empty) and exit.

### Outputs

```
r            = RATE(n, −PMT, PV)             // monthly interest rate (Excel RATE)
interest_tot = (PMT × n) − PV                // total interest over full term
paid_off     = 0                             // MVP: no payments yet
balance      = (PV + interest_tot) − paid_off
             = PMT × n                       // at commencement
```

### Why Interest Total is not `rate × 36`

Field help text currently says `RATE(...) × 36`. That is wrong.

Excel total finance income = sum of period interest = **total cash − principal**:

```
(399 × 36) − 11,449.81 = 14,364 − 11,449.81 = 2,914.19
```

### RATE() in Deluge

Deluge has no native `RATE()`. Implement Newton-Raphson (same as Excel):

Solve `r` where:

```
PV = PMT × (1 − (1 + r)^(−n)) / r
```

Seed: `r = 0.01`. Iterate until convergence (e.g. |Δr| < 1e−10 or max 100 iterations). Match Excel to ≥ 6 decimal places on rate; ±0.02 on currency.

Reference: [`rate-simulator.html`](../01-rent-to-own-understanding/rate-simulator.html) and [`test-datasets.md`](../01-rent-to-own-understanding/test-datasets.md).

### Current Balance convention (MVP)

MVP uses the **cash remaining** formula from the field help text:

```
(Principal + Interest Total) − Paid off
```

This is **not** the Excel lease-receivable closing balance (which starts at principal only). Acceptable for MVP; refine when schedule + payment updates are built.

---

## 6. Automation design

### One function, not four

| Approach | MVP choice |
|----------|------------|
| 4 separate functions | ❌ Unnecessary; same trigger, shared inputs |
| 1 function writing 4 fields | ✅ |

**Suggested function name:** `rto_calculate_contract_fields`

### Workflow

| Setting | Value |
|---------|-------|
| Module | Rent To Own Contracts |
| When | Created |
| Also | Edited — only if `cf_rto_period` **or** `cf_rto_principal_wip` **or** `cf_rto_monthly_payment_amount_wip` changes |
| Action | Call `rto_calculate_contract_fields` |

Paid off / Balance will later need a **second** workflow on invoice payment. Not MVP.

### Function steps (pseudo)

1. Load contract record by ID.
2. Read `n`, `PV`, `PMT`.
3. Validate inputs.
4. Compute `r` via Newton-Raphson.
5. Compute `interest_tot`, `paid_off = 0`, `balance`.
6. Update record:
   - `cf_rto_interest_wip` = `r`
   - `cf_interest_total_wip` = `interest_tot`
   - `cf_rto_paid_off_amount_wip` = `0`
   - `cf_rto_current_balance` = `balance`

---

## 7. Acceptance test

Create a contract with SO25-0001 inputs (Customer / Item can be any valid lookups):

| Input field | Value |
|-------------|-------|
| RTO Period | 36 |
| RTO Principal | 11449.81 |
| RTO Monthly Payment Amount | 399.00 |

| Output field | Expected |
|--------------|----------|
| RTO Interest % | ≈ **0.012810** (monthly) / **1.2810%** |
| Interest Total | ≈ **2914.19** |
| RTO Paid off Amount | **0** |
| RTO Current Balance | ≈ **14364.00** |

Optional second check — SO25-0006: period 36, principal 14015.00, monthly 699.00 → rate ≈ 3.5832%, interest total ≈ 11149.00, balance ≈ 25164.00.

Tolerance: rate ≥ 6 decimal places; currency ±0.02.

**Later (not now):** smoke-test a contract whose Excel `RATE(n, −PMT, PV)` is **below 1% monthly** (`r < 0.01`). Confirm Deluge still lands near Excel — seed is `0.01` but should walk down; watch for non-convergence or the `r ≤ 0 → 0.0001` clamp on near-zero interest deals.

---

## 8. Implementation checklist

One task per file — keep work notes / scripts / test logs there; this overview stays the index.

| # | Task | Status | Spec |
|---|------|--------|------|
| 1 | Field type fixes (Principal / Interest % / Interest Total) | ✅ Done (MCP verified) | [01-field-types.md](01-field-types.md) |
| 2 | Interest % storage convention (`0.012810` vs `1.2810`) | ✅ Done — store `0.012810` | [02-interest-storage-convention.md](02-interest-storage-convention.md) |
| 3 | Deluge `RATE` helper + `rto_calculate_contract_fields` | ✅ Live in Books — [`../../function/rto_calculate_contract_fields.ds`](../../function/rto_calculate_contract_fields.ds) | [03-deluge-rate-function.md](03-deluge-rate-function.md) |
| 4 | Workflow: Created (+ Edited on calc inputs) | Not started | [04-workflow.md](04-workflow.md) |
| 5 | Acceptance test SO25-0001 | ✅ Pass (manual run) | [05-test-so25-0001.md](05-test-so25-0001.md) |
| 6 | Optional test SO25-0006 | ✅ Pass (manual run) | [06-test-so25-0006.md](06-test-so25-0006.md) |
| 7 | API name / precision quirks log | Not started | [07-quirks.md](07-quirks.md) |

---

## 9. Next phase (after MVP works)

Order of follow-ups once create-time calcs are green:

1. **Item fields** — RTO Principal / net selling price (and later maintenance) → copy into `cf_rto_principal_wip`
2. **Recurring Invoice lookup** on contract → fill monthly payment
3. **Invoice lookup** to `cm_rent_to_own_contract` (replace text `cf_rto_contract_no` on Invoice)
4. **Payment workflow** — increment Paid off, recalc Current Balance
5. **RTO Schedule** custom module — period rows (amortisation sub-ledger)
6. **Journals** — commencement + monthly recognition (Excel Phase 1 / Phase 2)

---

## 10. Open decisions

| # | Decision | Recommendation for MVP |
|---|----------|------------------------|
| 1 | Interest % as `0.012810` or `1.2810`? | ✅ Decided: store **0.012810** (true monthly rate) |
| 2 | Current Balance = cash remaining vs lease receivable? | Cash remaining for MVP; revisit with schedule |
| 3 | Recalc on every edit, or only when calc inputs change? | Only when period / principal / monthly change |
| 4 | End Date auto from Start + Period? | Nice-to-have; not required for calc MVP |
