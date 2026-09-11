# 04 — Workflow (Created + Edited)

**Status:** Not started  
**Parent:** [overview.md](overview.md) §6  
**Calls:** [03-deluge-rate-function.md](03-deluge-rate-function.md) (`rto_calculate_contract_fields`)

---

## Goal

Run contract field calculations when a Rent To Own Contract is created, and when calc inputs change on edit.

---

## Settings

| Setting | Value |
|---------|-------|
| Module | Rent To Own Contracts (`cm_rent_to_own_contract`) |
| When | **Created** |
| Also | **Edited** — only if `cf_rto_period` **or** `cf_rto_principal_wip` **or** `cf_rto_monthly_payment_amount_wip` changes |
| Action | Call `rto_calculate_contract_fields` |

---

## Out of scope (MVP)

Paid off / Balance updates on invoice payment → separate workflow later (next phase).

---

## Checklist

- [ ] Workflow created in Zoho Books
- [ ] Created trigger fires function
- [ ] Edited trigger limited to the three calc inputs
- [ ] No recalc when only non-calc fields change
