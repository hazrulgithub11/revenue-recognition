# RTO Transactions — Module Snapshot

**Status:** Schema documented (Books MCP scan)  
**Org:** Megah Holdings Sdn Bhd (Zoho Books `795380341`)  
**Module:** RTO Transactions (`cm_rto_transactions`)  
**Depends on:** [02 — Rent-to-Own MVP](../02-rent-to-own-mvp/overview.md) (`cm_rent_to_own_contract`)  
**Source:** `ZohoBooks_list_custom_fields` via ZohoBooksMegah MCP (2026-09-11)

> Period / amortisation sub-ledger: one row per payment period. Links to a Rent To Own Contract and Customer; amount columns mirror the Excel amort schedule (opening → income / principal reduction → closing).

---

## 1. Module identity

| | |
|---|---|
| **Display name** | RTO Transactions |
| **Entity API name** | `cm_rto_transactions` |
| **Parent contract module** | `cm_rent_to_own_contract` |
| **Custom fields** | 11 (5 mandatory) |

**Note:** ZohoBooksMegah MCP can list field metadata for this module but has no list/get tools for record rows.

---

## 2. Field snapshot

| # | Label | API name | Field ID | Type | Required | Notes |
|---|-------|----------|----------|------|----------|-------|
| 1 | RTO Record No | `cf_rto_record_no` | `3636475000022817068` | autonumber | Yes | Next value `RTO-00001` |
| 2 | Customer | `cf_customer` | `3636475000022816068` | lookup → Customers | Yes | Related list: RTO Transaction |
| 3 | RTO Contract No | `cf_rto_contract_no` | `3636475000022816071` | lookup → `cm_rent_to_own_contract` | Yes | Field-based lookup on contract `cf_rto_contract_no` |
| 4 | Date | `cf_date` | `3636475000022816074` | date | Yes | Period due date (Excel col B). **No period # field** — sort/identity by date |
| 5 | Status | `cf_status` | `3636475000022816076` | dropdown | Yes | New schedule rows: **Pending** (Books form default may still say Default — set in Deluge) |
| 7 | Payment Received No | `cf_payment_received_no` | `3636475000022816085` | string | No | Books payment received reference |
| 8 | Principal Opening Balance | `cf_principal_opening_balance` | `3636475000022816116` | amount | No | Excel amort col C |
| 9 | Payment Amount | `cf_payment_amount` | `3636475000022816118` | amount | No | Help: “Only full allowed” |
| 10 | Finance Income | `cf_finance_income` | `3636475000022816120` | amount | No | Help: “Amount to pay off interest” |
| 11 | Principal Reduction | `cf_principal_reduction` | `3636475000022816122` | amount | No | Help: “Amount to reduce principal” |
| 12 | Principal Closing Balance | `cf_principal_closing_balance` | `3636475000022816124` | amount | No | Excel amort closing |

Index gap (no field at index 6) is as returned by Books.

---

## 3. Status dropdown (`cf_status`)

| Order | Name | Value ID |
|-------|------|----------|
| 1 | Pending | `3636475000022816081` |
| 2 | Invoiced | `3636475000022816078` |
| 3 | Overdue | `3636475000022816079` |
| 4 | Paid | `3636475000022816077` |
| 5 | Default | `3636475000022816080` |

Default value on new records in Books UI: **Default**. Schedule generator must set **Pending** explicitly.

---

## 4. Relationships

```
Customer (contact)
    ↑ lookup cf_customer
RTO Transactions (cm_rto_transactions)
    ↓ lookup cf_rto_contract_no (field-based → cf_rto_contract_no)
Rent To Own Contract (cm_rent_to_own_contract)
```

| Lookup | Related entity | Display param | Related list name |
|--------|----------------|---------------|-------------------|
| `cf_customer` | `customer` | `contact_name` | RTO Transaction |
| `cf_rto_contract_no` | `cm_rent_to_own_contract` | `cf_rto_contract_no_formatted` | RTO Transaction |

Contract lookup uses `lookup_field_id` `3636475000022611062` (contract’s `cf_rto_contract_no`).

---

## 5. Excel amort column map

| Transaction field | Excel role (01 understanding) |
|-------------------|-------------------------------|
| `cf_principal_opening_balance` | Opening balance (period start receivable) |
| `cf_payment_amount` | Cash received / PMT |
| `cf_finance_income` | Finance income (interest portion) |
| `cf_principal_reduction` | Principal portion of payment |
| `cf_principal_closing_balance` | Closing balance |

At period 1, opening balance should seed from contract `cf_rto_principal_wip` (not the same as per-period opening thereafter — see [01 overview](../01-rent-to-own-understanding/overview.md)).

**Payment amount:** contract monthly PMT when Excel cash guard allows (`opening ≤ 1` → 0).
**Customer:** copied from the parent contract when the schedule is generated.

---

## 6. Decisions (contract → transactions)

| Topic | Decision |
|-------|----------|
| When to create | On contract create: full schedule of `cf_rto_period` rows |
| View UX | Related list on contract — no duplicate Table |
| Status | New rows = **Pending** |
| Regenerate | Delete+rebuild only if **all** existing periods are still Pending |
| If not all Pending | **Block** edits to Period / Principal / Monthly Payment |
| Period identity | `cf_date` only (no period # field) |
| Period 1 date | = `cf_rto_start_date`; then +1 month each |
| Amounts | Excel **1:1** amort loop (incl. cash guard `opening ≤ 1 → cash 0`) |
| Payment amount | Contract monthly PMT (when cash guard allows) |
| Customer | Copied from contract |
| Function shape | One Deluge: RATE → write contract → create/replace periods |
| Out of scope | Invoice / payment / status beyond Pending |

Acceptance: SO25-0001 (and peers) period dates + opening/interest/payment/principal/closing match Excel within Books amount precision.

---

## 7. Parked (invoices later)

1. Status Pending → Invoiced → Paid / Overdue
2. `cf_payment_received_no` text vs payment lookup
3. “Only full allowed” enforcement on Payment Amount
4. Invoice creation timing (scheduler vs Recurring Invoice)

