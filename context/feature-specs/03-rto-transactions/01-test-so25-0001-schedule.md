# 01 — Acceptance test: SO25-0001 full Amortisation Schedule

**Status:** ⬜ Not run  
**Parent:** [overview.md](overview.md)  
**Dataset:** [`test-datasets.md`](../01-rent-to-own-understanding/test-datasets.md)  
**Depends on:** Phase-02 RATE MVP passing (SO25-0001 RATE test ✅)  
**Issue:** [#2](https://github.com/hazrulgithub11/revenue-recognition/issues/2) float-carry / round-on-write

---

## Goal

Save a Rent To Own Contract with SO25-0001 inputs; verify that exactly 36
Amortisation Period rows are created in `cm_rto_transactions`, that early
periods match Excel’s displayed values, and that the **last Principal Closing
Balance is 0.00** (float-carry working balances; round to Books 2dp on write only).

**Interim bar:** late periods may differ from the GRSB workbook by ±0.02 while
principal is only 2dp WIP. Full Excel displayed 1:1 across all 36 rows is deferred
until full-precision principal exists.

**Primary seam:** Rent To Own Contract save/recalc → rows in `cm_rto_transactions`
for that contract.

---

## Inputs

| Contract field | Value |
|----------------|-------|
| RTO Period (`cf_rto_period`) | **36** |
| RTO Principal WIP (`cf_rto_principal_wip`) | **11 449.81** |
| RTO Monthly Payment Amount (`cf_rto_monthly_payment_amount_wip`) | **399.00** |
| RTO Start Date (`cf_rto_start_date`) | any valid date (e.g. 2026-01-01) |
| Customer (`cf_customer`) | any valid customer lookup |

---

## RATE reference

`r ≈ 0.01280994` (monthly) — already confirmed ✅ by Phase-02 test.

---

## Expected outputs — contract RATE fields (unchanged)

| Field | Expected |
|-------|----------|
| RTO Interest % | ≈ **0.012810** |
| Interest Total | ≈ **2 914.19** |
| RTO Paid off Amount | **0** |
| RTO Current Balance | ≈ **14 364.00** |

---

## Expected outputs — Amortisation Period count + status

| Check | Expected |
|-------|----------|
| Total rows in `cm_rto_transactions` for this contract | **36** |
| All rows `cf_status` | **Pending** |
| All rows `cf_rto_contract_no` lookup | → this contract |
| All rows `cf_customer` | copied from contract |

---

## Expected period amounts

> Working balances carry full float between periods; stored Amount fields are
> rounded to 2dp on write. Spot-check periods 1–2 against Excel display; last
> closing must be exactly **0.00**. Late rows: tolerance ±0.02 vs workbook.

| Period | Date | Opening | Finance Income | Payment | Principal Reduction | Closing |
|--------|------|---------|---------------|---------|---------------------|---------|
| 1 | start date | **11 449.81** | **146.67** | **399.00** | **252.33** | **11 197.48** |
| 2 | start + 1 month | **11 197.48** | **143.44** | **399.00** | **255.56** | **10 941.92** |
| 36 (last) | start + 35 months | ≈ **393.95** | ≈ **5.05** | **399.00** | ≈ **393.95** | **0.00** |

**Period-1 values cross-check:**
```
opening     = 11 449.81  (= cf_rto_principal_wip)
interest    = 11 449.81 × 0.01280994 = 146.67
principal   = 399.00 − 146.67 = 252.33
closing     = 11 449.81 − 252.33 = 11 197.48
```

**Required checks:**
```
Exactly 36 Pending rows, contract + customer linked
Periods 1–2 match Excel display (table above)
Period-36 Principal Closing Balance = 0.00   (must; not ≈)
No last-line plug: same formulas on last period; payment still 399 unless cash guard
Late periods may drift ±0.02 vs GRSB workbook under 2dp WIP
```

**Aggregate cross-check (all 36 periods):**
```
Sum of Finance Income        ≈ 2 914.19   (= Interest Total)
Sum of Principal Reduction   ≈ 11 449.81  (= RTO Principal WIP)
Sum of Payment Amount        = 36 × 399 = 14 364.00
Period-36 closing            = 0.00       (float-carry; no forced plug)
```

---

## Run log

| Date | Contract ID / No | Notes |
|------|------------------|-------|
| — | — | Not yet run |
