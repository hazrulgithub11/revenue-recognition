# 03 — Acceptance test: Regenerate + Lock

**Status:** ⬜ Not run  
**Parent:** [overview.md](overview.md)  
**Depends on:** [01-test-so25-0001-schedule.md](01-test-so25-0001-schedule.md) green

---

## Goal

Verify two behaviours that guard schedule integrity after initial generation:

| # | Scenario | Expected |
|---|----------|----------|
| A | **Regenerate** — all periods still Pending; change a calc input | Old rows deleted; new rows match new inputs |
| B | **Lock** — at least one period is not Pending; try to change a calc input | Schedule is **not** rebuilt; existing rows untouched |

---

## Scenario A — Regenerate while all Pending

### Setup

1. Use the SO25-0001 contract created in test 01 (36 rows, all Pending).
2. Confirm all 36 rows have `cf_status = Pending`.

### Action

Edit the contract: change **RTO Period** from `36` to `24`  
(or change Monthly Payment — any of the three calc inputs).

### Expected after edit

| Check | Expected |
|-------|----------|
| Row count in `cm_rto_transactions` for this contract | **24** (old 36 deleted, 24 new) |
| All new rows `cf_status` | **Pending** |
| Period-1 amounts | match Excel for n=24, PV=11 449.81, PMT=399 |
| No stale rows from the old 36-row schedule | confirmed — none found |

---

## Scenario B — Lock when any period is not Pending

### Setup

1. Use the SO25-0001 contract (36 rows from test 01, or regenerated from A).
2. Manually change **one period's** `cf_status` from `Pending` to `Invoiced`  
   (or any non-Pending status).

### Action

Edit the contract: change **RTO Monthly Payment Amount** (or Period or Principal).

### Expected after edit

| Check | Expected |
|-------|----------|
| Row count in `cm_rto_transactions` for this contract | **unchanged** (same 36 rows) |
| The period whose status was changed to Invoiced | still `Invoiced` — not deleted |
| Deluge `info` log | contains "schedule locked" message |
| Contract RATE fields (Interest %, Interest Total, Balance) | updated to reflect new inputs (RATE calc still runs; only schedule rebuild is blocked) |

---

## Notes

- Regenerate (Scenario A) works because the function deletes all Pending rows and
  rebuilds before POSTing new rows. The `LIST → filter → delete → create` path must
  complete atomically within one Deluge invocation.
- Lock (Scenario B) relies on the `anyNotPending` flag being set during the LIST scan.
  Any non-Pending status (Invoiced / Paid / Overdue / Default) triggers the block.
- If the `LIST /cm_rto_transactions` call fails (network error etc.), the function
  exits early and does **not** generate periods — safe-fail behaviour.

---

## Run log

| Date | Contract ID / No | Scenario | Notes |
|------|------------------|----------|-------|
| — | — | — | Not yet run |
