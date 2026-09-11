# Design choice: child Amortisation Periods + related list UX

User confirmed: keep 36 RTO Transaction (Amortisation Period) records per contract, auto-created on contract create; primary motivation for “subform” was cleaner viewing of one contract’s schedule (not scale fear). Implication: teach related-list UX and invoice-from-period next; discourage copying the same 36 lines into a contract Table (duplicate source of truth).
