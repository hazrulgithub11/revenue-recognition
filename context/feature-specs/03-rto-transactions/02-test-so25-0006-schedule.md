# 02 — Acceptance test: SO25-0006 full Amortisation Schedule

**Status:** ⬜ Not run  
**Parent:** [overview.md](overview.md)  
**Dataset:** [`test-datasets.md`](../01-rent-to-own-understanding/test-datasets.md)  
**Depends on:** [01-test-so25-0001-schedule.md](01-test-so25-0001-schedule.md) green

---

## Goal

Second dataset sanity check with a higher rate (≈ 3.58 % / month vs 1.28 %).
Confirms the amort loop is not hard-coded to SO25-0001 inputs.

---

## Inputs

| Contract field | Value |
|----------------|-------|
| RTO Period | **36** |
| RTO Principal WIP | **14 015.00** |
| RTO Monthly Payment Amount | **699.00** |
| RTO Start Date | any valid date |
| Customer | any valid customer lookup |

---

## RATE reference

`r ≈ 0.035832` (monthly) — already confirmed ✅ by Phase-02 test.

---

## Expected outputs — contract RATE fields

| Field | Expected |
|-------|----------|
| RTO Interest % | ≈ **0.035832** |
| Interest Total | ≈ **11 149.00** |
| RTO Paid off Amount | **0** |
| RTO Current Balance | ≈ **25 164.00** |

---

## Expected outputs — Amortisation Period count + status

| Check | Expected |
|-------|----------|
| Total rows in `cm_rto_transactions` for this contract | **36** |
| All rows `cf_status` | **Pending** |
| All rows `cf_rto_contract_no` lookup | → this contract |
| All rows `cf_customer` | copied from contract |

---

## Expected period amounts (spot-check — tolerance ±0.02)

| Period | Date | Opening | Finance Income | Payment | Principal Reduction | Closing |
|--------|------|---------|---------------|---------|---------------------|---------|
| 1 | start date | **14 015.00** | **502.18** | **699.00** | **196.82** | **13 818.18** |
| 2 | start + 1 month | **13 818.18** | **495.12** | **699.00** | **203.88** | **13 614.30** |
| 36 (last) | start + 35 months | ≈ **674.82** | ≈ **24.18** | **699.00** | ≈ **674.82** | **0.00** |

**Period-1 cross-check:**
```
opening   = 14 015.00  (= cf_rto_principal_wip)
interest  = 14 015.00 × 0.035832 = 502.18
principal = 699.00 − 502.18 = 196.82
closing   = 14 015.00 − 196.82 = 13 818.18
```

**Aggregate cross-check:**
```
Sum of Finance Income       ≈ 11 149.00
Sum of Principal Reduction  ≈ 14 015.00
Sum of Payment Amount       = 36 × 699 = 25 164.00
Period-36 closing           = 0.00 (float-carry / round-on-write; no forced plug)
Late rows may drift ±0.02 vs workbook under 2dp WIP
```

---

## Run log

| Date | Contract ID / No | Notes |
|------|------------------|-------|
| — | — | Not yet run |
