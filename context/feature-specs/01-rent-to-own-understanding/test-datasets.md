# Rent-to-Own Test Datasets (from Excel)

Source: `GRSB-Rent To Own-ZOHO 1.xlsx` — all 5 active contracts.

Use these to verify JavaScript / Deluge logic matches Excel.

---

## Table 1 — Inputs

| Contract | Customer | Product | Cost | Term | Payment/mth | Outright (C14) | Maint/yr (C15) | Maint yrs (C16) |
|----------|----------|---------|------|------|-------------|----------------|----------------|-----------------|
| SO25-0001 | HAKATA F&B SDN BHD | D1M Dishwasher | 10,000.00 | 36 | 399.00 | 20,068.81 | 2,873.00 | 3 |
| SO25-0006 | KAM KITCHENS HOME SDN BHD | D1M Dishwasher | 10,000.00 | 36 | 699.00 | 22,634.00 | 2,873.00 | 3 |
| SO25-0135 | Craven F&B | NI1050 Ice machine | 13,451.70 | 24 | 850.00 | 17,855.23 | 2,288.00 | 2 |
| SO25-0138 | Nyonya Recipe | CI500 Ice machine | 5,517.66 | 24 | 639.00 | 15,287.00 | 2,288.00 | 2 |
| SO25-0172 | Goldhill Reserve Sdn Bhd | D1M Dishwasher | 10,000.00 | 36 | 699.00 | 22,634.00 | 2,873.00 | 3 |

---

## Table 2 — Expected outputs (Excel)

| Contract | Net price C17 | Rate/mth C29 | Machine C25 | Maint C26 | Profit C33 | P1 interest | P1 principal | Total interest | Total principal |
|----------|---------------|--------------|-------------|-----------|------------|-------------|--------------|----------------|-----------------|
| SO25-0001 | 11,449.81 | 1.2810% | 4,579.45 | 6,870.37 | 1,449.81 | 146.67 | 252.33 | 2,914.19 | 11,449.81 |
| SO25-0006 | 14,015.00 | 3.5832% | 9,214.68 | 4,800.32 | 4,015.00 | 502.18 | 196.82 | 11,149.00 | 14,015.00 |
| SO25-0135 | 13,279.23 | 3.7637% | 10,300.52 | 2,978.71 | -172.46 | 499.79 | 350.21 | 7,120.77 | 13,279.23 |
| SO25-0138 | 10,711.00 | 3.0958% | 7,515.02 | 3,195.98 | 5,193.34 | 331.59 | 307.41 | 4,625.00 | 10,711.00 |
| SO25-0172 | 14,015.00 | 3.5832% | 9,214.68 | 4,800.32 | 4,015.00 | 502.18 | 196.82 | 11,149.00 | 14,015.00 |

---

## Table 3 — Derived cash splits (for reference)

| Contract | Total lease payment C20 | Total maint C21 | Machine cash C22 |
|----------|-------------------------|-----------------|------------------|
| SO25-0001 | 14,364.00 | 8,619.00 | 5,745.00 |
| SO25-0006 | 25,164.00 | 8,619.00 | 16,545.00 |
| SO25-0135 | 20,400.00 | 4,576.00 | 15,824.00 |
| SO25-0138 | 15,336.00 | 4,576.00 | 10,760.00 |
| SO25-0172 | 25,164.00 | 8,619.00 | 16,545.00 |

---

## Notes for testing

- **SO25-0006 and SO25-0172** share identical inputs; both should produce the same outputs.
- **SO25-0135** has negative selling profit (net price below inventory cost) — still valid for rate calculation.
- Tolerance for automated tests: **±0.02** on currency fields, rate should match to **6+ decimal places**.
- Excel `RATE()` call: `=RATE(nper, -pmt, pv, 0, 0)`

---

## Quick manual check (SO25-0001)

```
Net price  = 20,068.81 - (2,873 × 3) = 11,449.81
RATE(36, -399, 11449.81)              = 1.2810% / month
Period 1 interest                     = 11,449.81 × 1.2810% = 146.67
Period 1 principal                    = 399 - 146.67 = 252.33
```

Interactive testing: open [`rate-simulator.html`](rate-simulator.html) in a browser.
