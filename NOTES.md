# Teaching notes

- Prefers concrete Zoho Books / GRSB RTO decisions over abstract theory.
- Settled design (grill): child RTO Transactions (36 rows) on contract create; UI label RTO Transaction = glossary Amortisation Period; optimize for viewing under contract — use related list, do not duplicate rows into a contract Table.
- **Scope now:** Rent To Own Contract + RTO Transactions only. Do not design invoice/payment flows until user reopens that.
- Invoice timing question (B vs C) parked; revisit after period generation works.
- Q6: Regenerate schedule only if no period has left Pending (delete+rebuild when safe).
- Q7: New periods start Status = **Pending**.
- Q8: One Deluge function — RATE → write contract → create/replace period rows (atomic).
- Q9: No per-row period # — order/identity by `cf_date`; contract `cf_rto_period` = how many rows to generate.
- Q10: Period 1 `cf_date` = contract start date.
- Q11: Follow Excel — same formulas every period; **no** last-line force-to-zero plug.
- Q12: Every period `cf_payment_amount` = contract monthly PMT.
- Q13: Copy Customer from contract onto every period row.
- Q14: Excel 1:1 — same formulas + cash guard; schedule must match Excel amounts.
- Setup complete: AGENTS.md + docs/agents (GitHub tracker, default triage labels, single-context domain).
