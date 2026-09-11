# Rent-to-Own Revenue Recognition

Domain language for GRSB finance-lease (rent-to-own) recognition in Zoho Books, sourced from the Excel amort model and Books custom modules.

## Language

**Rent To Own Contract**:
The parent agreement for one financed asset: term, principal, monthly payment, and derived interest.
_Avoid_: RTO deal, lease header (unless speaking informally)

**Amortisation Period**:
One scheduled period of the lease receivable (opening → finance income / payment / principal reduction → closing). In the UI this appears as an **RTO Transaction**.
_Avoid_: payment row, monthly payment (alone), invoice line

**RTO Transaction**:
Books UI / module label (`cm_rto_transactions`) for an Amortisation Period record. Same concept; prefer **Amortisation Period** in specs and glossary.
_Avoid_: treating it as cash receipt only

**RTO Principal (WIP)**:
The contract’s original net selling price / net investment (Excel C30). Seeds period-1 opening balance only.
_Avoid_: Principal Opening Balance (that is per-period remaining receivable)

**Principal Opening Balance**:
Outstanding lease receivable at the start of one Amortisation Period.
_Avoid_: RTO Principal (WIP)

**Invoice (RTO)**:
The Books sales document that bills the customer for one Amortisation Period’s cash payment. Distinct from the period row itself.
_Avoid_: calling an RTO Transaction an invoice

**RTO Period (contract)**:
The contract’s term length in months (`cf_rto_period`) — how many Amortisation Periods to generate (e.g. 36). Period identity on each row is the **Date**, not a period index.
_Avoid_: confusing with a per-row “period number” field (we are not adding one)

**Schedule regenerate rule**:
Rebuild all Amortisation Periods from contract inputs only when every existing period is still Pending; otherwise the schedule is frozen.
_Avoid_: silent partial updates of individual period maths

**Amortisation maths**:
Period amounts must match the Excel schedule **1:1** (same RATE, same loop: interest = opening × monthly rate; cash = 0 if opening ≤ 1 else PMT; principal = cash − interest; closing = opening − principal). No last-line force-zero plug.
_Avoid_: approximate shortcuts that drift from Excel test cases (SO25-0001, etc.)
