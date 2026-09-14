# Amort maths follow Excel (no last-line plug)

User wants period amounts computed like Excel: interest = opening × rate, principal = cash − interest, closing = opening − principal, every period including the last. No forced zero closing. Excel ends ~0 because RATE solves the PV; Zoho should use the same loop.

**Books precision** means **round-on-write / float-carry**: keep full working float between periods; round Amount fields to 2dp only when writing each Amortisation Period. It does **not** mean round the working opening/closing every step (that drifts the last closing to ~0.03).
