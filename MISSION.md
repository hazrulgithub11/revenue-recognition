# Mission: RTO schedule → invoice design

## Why
Ship Zoho Books rent-to-own so each month’s customer invoice and payment map cleanly to an amortisation period — without painting into a corner when recurring billing, overdue, and journals come next.

## Success looks like
- Explain why schedule rows and invoices are different objects in real billing/loan systems
- Choose a Books-shaped design: Contract → Amortisation Periods → Invoice → Payment
- Spot when a “table on the contract” helps UX vs when it blocks invoicing later

## Constraints
- Zoho Books custom modules (`cm_rent_to_own_contract`, `cm_rto_transactions`)
- Excel amort model (01 understanding) is the accounting source of truth
- Prefer patterns that survive invoice + payment wiring

## Out of scope
- Invoice module / Recurring Invoice / payment wiring (explicitly deferred — contract + transactions first)
- Deep ASC 606 / MFRS 15 theory beyond what RTO needs
- Building Deluge/workflows in this teaching track until the model for periods is clear
