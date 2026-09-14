# Revenue Recognition — Progress Tracker

**Last updated:** 2026-09-11 (Phase 03 — Amortisation Period generation implemented)  

**Org:** Megah Holdings Sdn Bhd — Zoho Books `organization_id=795380341`  
**Primary module:** Rent To Own Contracts (`cm_rent_to_own_contract`)

---

## Overall status

| Phase | Spec | Status |
|-------|------|--------|
| 01 — Understanding (Excel model) | [`feature-specs/01-rent-to-own-understanding/`](feature-specs/01-rent-to-own-understanding/overview.md) | Done |
| 02 — MVP (contract field calcs) | [`feature-specs/02-rent-to-own-mvp/`](feature-specs/02-rent-to-own-mvp/overview.md) | In progress — Deluge written; workflow next |
| 03 — Amortisation Period generation (RTO Transactions) | [`feature-specs/03-rto-transactions/`](feature-specs/03-rto-transactions/overview.md) | ✅ Implemented — acceptance tests pending manual run |
| 04 — Item / RI / payment wiring | — | Not started |
| 05 — Schedule + journals | — | Not started |

---

## Phase 01 — Understanding (done)

| Item | Status | Notes |
|------|--------|-------|
| Excel workbook analysed (`GRSB-Rent To Own-ZOHO 1.xlsx`) | Done | Finance lease model: RATE, amortisation, journals |
| Overview written | Done | [`01-rent-to-own-understanding/overview.md`](feature-specs/01-rent-to-own-understanding/overview.md) |
| Test datasets extracted (5 contracts) | Done | [`test-datasets.md`](feature-specs/01-rent-to-own-understanding/test-datasets.md) |
| RATE simulator HTML | Done | [`rate-simulator.html`](feature-specs/01-rent-to-own-understanding/rate-simulator.html) |
| RTO flow image reviewed | Done | Architecture diagram vs Excel model compared (image = rental/buyout path; Excel = finance lease) |

---

## Phase 02 — MVP (in progress)

### Research / design

| Item | Status | Notes |
|------|--------|-------|
| ZohoBooksMegah MCP scan of org | Done | Org `795380341` confirmed |
| Located Books custom module | Done | Entity `cm_rent_to_own_contract` (not CRM) |
| Documented all 13 contract fields | Done | See MVP overview §3 |
| Customer lookup wired | Done | `cf_customer` → Customers |
| Item lookup wired | Done | `cf_rto_item` → Items |
| MVP plan written | Done | [`02-rent-to-own-mvp/overview.md`](feature-specs/02-rent-to-own-mvp/overview.md) |
| Calc rules agreed | Done | RATE + Interest Total = (PMT×n)−PV; Paid off=0; Balance=(PV+interest)−paid_off |
| One function (not four) agreed | Done | Create/edit workflow → single Deluge function |

### Field type fixes

**MCP re-check: 2026-09-03 (after recreate + unused cleanup)** via `ZohoBooks_list_custom_fields` on `cm_rent_to_own_contract`.

| Field | API name | Field ID | MCP type | Status |
|-------|----------|----------|----------|--------|
| RTO Principal (WIP) | `cf_rto_principal_wip` | `3636475000022627031` | **amount** | ✅ |
| RTO Interest % (WIP) | `cf_rto_interest_wip` | `3636475000022604031` | **decimal** | ✅ |
| Interest Total (WIP) | `cf_interest_total_wip` | `3636475000022627034` | **amount** | ✅ |
| RTO Monthly Payment Amount (WIP) | `cf_rto_monthly_payment_amount_wip` | `3636475000022611093` | amount | ✅ |
| RTO Paid off Amount (WIP) | `cf_rto_paid_off_amount_wip` | `3636475000022611099` | amount | ✅ |
| RTO Current Balance | `cf_rto_current_balance` | `3636475000022611101` | amount | ✅ |
| RTO Period | `cf_rto_period` | `3636475000022611089` | number | ✅ |

Old text-box versions removed (new field IDs for Principal / Interest % / Interest Total). API names unchanged — Deluge can use the same `cf_*` names.

### Implementation checklist

Detail lives in per-task files under [`02-rent-to-own-mvp/`](feature-specs/02-rent-to-own-mvp/overview.md) — not in this tracker.

| # | Task | Status | Spec |
|---|------|--------|------|
| 1 | Fix Principal / Interest % / Interest Total data types | ✅ Done (MCP verified) | [01-field-types.md](feature-specs/02-rent-to-own-mvp/01-field-types.md) |
| 2 | Decide Interest % storage (`0.012810` vs `1.2810`) | ✅ Done — store `0.012810` | [02-interest-storage-convention.md](feature-specs/02-rent-to-own-mvp/02-interest-storage-convention.md) |
| 3 | Write Deluge `RATE` + contract update function | ✅ Live in Books — [`function/rto_calculate_contract_fields.ds`](function/rto_calculate_contract_fields.ds) | [03-deluge-rate-function.md](feature-specs/02-rent-to-own-mvp/03-deluge-rate-function.md) |
| 4 | Workflow: Created (+ Edited on calc inputs) | Not started | [04-workflow.md](feature-specs/02-rent-to-own-mvp/04-workflow.md) |
| 5 | SO25-0001 acceptance test | ✅ Pass (manual run) | [05-test-so25-0001.md](feature-specs/02-rent-to-own-mvp/05-test-so25-0001.md) |
| 6 | SO25-0006 optional test | ✅ Pass (manual run) | [06-test-so25-0006.md](feature-specs/02-rent-to-own-mvp/06-test-so25-0006.md) |
| 7 | API name / precision quirks log | Not started | [07-quirks.md](feature-specs/02-rent-to-own-mvp/07-quirks.md) |

---

## Related findings (Books org — not MVP blockers)

| Finding | Detail |
|---------|--------|
| Invoice `cf_rto_contract_no` | Text field on Invoice — not a lookup to the RTO module yet |
| Items | No RTO principal / outright / maintenance custom fields yet |
| Recurring invoices | Only 3 test profiles; none linked to RTO |
| CRM `Contract_GR` | Separate CRM module; **not** used for this Books MVP |
| Other Books custom modules | Support Plan (`cm_support_plan`), Autopay Files, etc. — unrelated |

---

---

## Phase 03 — Amortisation Period generation (implemented 2026-09-11)

| # | Task | Status | Spec |
|---|------|--------|------|
| 1 | Extend `rto_calculate_contract_fields` with Phase-2 period loop | ✅ Done | [`function/rto_calculate_contract_fields.ds`](function/rto_calculate_contract_fields.ds) |
| 2 | Acceptance test SO25-0001 full schedule (36 rows; last close 0.00; float-carry) | ⬜ Pending manual run | [`03-rto-transactions/01-test-so25-0001-schedule.md`](feature-specs/03-rto-transactions/01-test-so25-0001-schedule.md) |
| 3 | Acceptance test SO25-0006 full schedule | ⬜ Pending manual run | [`03-rto-transactions/02-test-so25-0006-schedule.md`](feature-specs/03-rto-transactions/02-test-so25-0006-schedule.md) |
| 4 | Acceptance test regenerate + lock | ⬜ Pending manual run | [`03-rto-transactions/03-test-regenerate-lock.md`](feature-specs/03-rto-transactions/03-test-regenerate-lock.md) |

### What Phase 03 added to the Deluge function

After the contract RATE fields are PUT (Phase 1, existing), the function now:

1. Reads `cf_rto_start_date` + `cf_customer` from the contract.
2. Lists existing `cm_rto_transactions` records for this contract (`per_page=200`).
3. **Lock check** — if any period is not Pending, logs "schedule locked" and returns.
4. Deletes all existing Pending periods for this contract.
5. Creates `n` new Amortisation Period rows via the Excel amort loop  
   (`interest = opening × r`; `cash = PMT if opening > 1 else 0`; `principal = cash − interest`; `closing = opening − principal`; no last-line force-zero).
6. Each row: `cf_status = Pending`, `cf_customer` copied from contract, `cf_rto_contract_no` → this contract's record ID, `cf_date` = start date + i months (EDATE).

---

## Next actions

1. ~~Fix the 3 field types~~ ✅
2. ~~Decide Interest % storage~~ ✅ (`0.012810`)
3. ~~Write Deluge `rto_calculate_contract_fields`~~ ✅ ([`function/rto_calculate_contract_fields.ds`](function/rto_calculate_contract_fields.ds))
4. ~~Manual acceptance SO25-0001 + SO25-0006 (RATE)~~ ✅
5. ~~Implement Amortisation Period generation~~ ✅ (Phase 03)
6. **Run acceptance tests** — create a contract with SO25-0001 inputs in Zoho Books; verify 36 rows match Excel.
7. Wire workflow Created (+ Edited on calc inputs) — [04](feature-specs/02-rent-to-own-mvp/04-workflow.md).
8. Log Deluge quirks (connection scopes, `module_fields` parse, no `while`, lookup field POST format) — [07](feature-specs/02-rent-to-own-mvp/07-quirks.md).
