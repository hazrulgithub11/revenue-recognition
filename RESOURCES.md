# RTO billing architecture Resources

## Knowledge

- [Article: Billing to Revenue Recognition Data Flow (BillingPlatform)](https://billingplatform.com/blog/billing-to-revenue-recognition-data-flow)
  Billing answers “what/when do they owe?”; recognition answers “what/when did we earn?”. Use for: why schedule maths must not live only inside invoices.
- [Guide: Revenue Recognition ASC 606 / IFRS 15 (SaaS Billing Architecture)](https://www.saas-billing-architecture.com/tax-compliance-revenue-recognition/revenue-recognition-asc606/)
  Keep billing schedule and recognition schedule separate; invoice total is the handshake. Use for: failure modes when one table does both jobs.
- [Article: Building a Revenue Recognition Engine (Pratik Dhanave)](https://pratikdhanave.com/blog/posts/fintech-revenue-recognition-engine.html)
  Store a schedule of period rows; post journals from the schedule. Use for: “compute once, store rows” vs derive-from-invoice.
- [SAP Learning: Creating an Installment Plan (S/4HANA Contract Accounting)](https://learning.sap.com/learning-journeys/implementing-sap-s-4hana-cloud-for-contract-accounting-invoicing/creating-an-installment-plan)
  Installment plan as statistical schedule with repetition items / due dates used for collection. Use for: ERP-grade installment modeling.
- [Product: Odoo LoanSuite — schedule then invoices](https://www.jupical.io/en/odoo-loan-management)
  Compute installment schedule on the loan, then generate installment invoices (bulk or scheduler), each linked back. Closest UX to RTO finance-lease billing.
- [Stripe Docs: Query billing data](https://docs.stripe.com/data/query-billing-data)
  Subscription → recurring Invoice objects (not 36 pre-materialised amort rows). Use for: contrasting SaaS billing with loan amort schedules.
- [Zoho Books: Custom module tables](https://www.zoho.com/books/help/custom-modules/basic-functions.html)
  Books supports Tables (line items) on custom modules; related lists remain the child-module view. Use for: UX options without duplicating data.

## Wisdom (Communities)

- [r/Accounting](https://www.reddit.com/r/Accounting/)
  Controllers/staff on lease vs revenue timing questions. Use for: “does this journal smell right?”
- [Zoho Books community](https://help.zoho.com/portal/en/community/zoho-books)
  Implementation reality for custom modules, workflows, recurring invoices. Use for: Books limits and workarounds.

## Gaps

- No single primary source that documents “finance lease lessor + Zoho Books custom modules” end-to-end; we combine loan-ERP patterns with the GRSB Excel model.
