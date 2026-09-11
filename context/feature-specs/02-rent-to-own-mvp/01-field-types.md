# 01 — Field type fixes

**Status:** Done ✅ (MCP verified 2026-09-03)  
**Parent:** [overview.md](overview.md) §4 / §8  
**Module:** `cm_rent_to_own_contract`

---

## Goal

Change Principal, Interest %, and Interest Total from text to numeric types so Deluge `RATE` can read them.

---

## Changes

| Field | API name | Field ID | Type |
|-------|----------|----------|------|
| RTO Principal (WIP) | `cf_rto_principal_wip` | `3636475000022627031` | Amount |
| RTO Interest % (WIP) | `cf_rto_interest_wip` | `3636475000022604031` | Decimal |
| Interest Total (WIP) | `cf_interest_total_wip` | `3636475000022627034` | Amount |

Old text-box versions removed. New field IDs; **same `cf_*` API names** — Deluge can keep using those names.

---

## Notes

- Verified via `ZohoBooks_list_custom_fields` on `cm_rent_to_own_contract`.
- Monthly Payment, Paid off, Current Balance, Period were already correct types.
