# 07 — API name / precision quirks

**Status:** Not started  
**Parent:** [overview.md](overview.md) §8  
**Fill in as you hit issues during Deluge / workflow / tests.**

---

## Goal

Capture anything that bites during implementation so we do not re-discover it later.

---

## Known so far

| Topic | Detail |
|-------|--------|
| Field IDs changed | Principal / Interest % / Interest Total recreated → new IDs; **API names unchanged** (`cf_*`) |
| Interest % type | Decimal — confirm write format matches [02](02-interest-storage-convention.md) |
| Interest Total ≠ rate × n | Must use `(PMT × n) − PV` |

---

## Log

| Date | Quirk | Workaround / decision |
|------|-------|------------------------|
| | | |
