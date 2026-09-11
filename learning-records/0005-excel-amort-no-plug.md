# Amort maths follow Excel (no last-line plug)

User wants period amounts computed like Excel: interest = opening × rate, principal = cash − interest, closing = opening − principal, every period including the last. No forced zero closing. Excel ends ~0 because RATE solves the PV; Zoho should use the same loop (store amounts at Books precision).
