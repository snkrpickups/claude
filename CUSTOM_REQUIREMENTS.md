# ALC POS System - Custom Requirements Summary

**Generated from user questionnaire on 2025-11-11**

---

## System Configuration

### Staff & Access
- **Users:** 6-10 receptionists
- **Collector Initials:** Auto-detected from Google account (user's first/last initial)
- **Access Control:** Google account authentication required

### Product Catalog
- **Total SKUs:** 119 products
- **Categories:**
  - Weight Loss (WL)
  - HRT Male (HRT-M)
  - HRT Female (HRT-F)
  - Pellet Therapy (PEL)
  - Sexual Performance (SP)
  - Peptides (PEP)
  - Cosmetic Facial (COS)
  - Cosmetic Hair (HAIR)
  - Cosmetic Creams (COS-CREAM)
  - IV Therapy (IV)
  - Procedures (PROC)
  - Compassionate Care (COMP)
  - Shipping (SHIP)
  - Consults (CONS)
  - Deposits (DEPOSIT)
  - Supplements (SUPPS)
  - Labs (LAB)

- **Provider Initials:** NOT tied to products - must be selected per transaction
- **Provider List:** BA, DR, GK (and others as needed)

### Pricing & Discounts
- **Sales Tax:** None
- **Price Override Reasons:**
  - "Grandfathered" (quick button)
  - "F&F" (Friends & Family - quick button)
  - Custom reason (text entry)
- **Override Behavior:** Log the reason, allow immediately
- **Promo Codes:** Configurable per code (can apply to cart total OR specific products/categories)

### Payment Processing
- **Primary:** Credit card via Authorize.net Accept Hosted
- **Split Payments:** YES - support cash + card splits
  - Example: $500 total → $200 cash + $300 card
  - Track both amounts separately
- **Partial Payments:** No payment plans (full payment at time of service)
- **Refunds:** Manual through Authorize.net (not in POS)
- **Saved Cards:** Maybe in future (not Phase 1)

### Customer Management
- **Patient ID Format:** 2 letters + 6 digits (e.g., JF123456)
- **Validation:** Regex: `^[A-Z]{2}\d{6}$`
- **Existing Database:** No - starting fresh
- **Email Receipts:** Optional - only send if patient requests
  - Show checkbox at checkout: "Email receipt to patient?"
  - If checked, prompt for email address

### Invoicing
- **Format:** `LOC-000001` (Location code + sequential number)
- **Example:** LOC-000001, LOC-000002, LOC-000003
- **No category prefixes** (simplified from original SP-Rx-XXXXX)
- **Starting Number:** 000001 (fresh start)
- **Multi-location:** Each location has own sequence
  - HQ: LOC1-000001
  - Franchise 01: LOC2-000001
  - Franchise 02: LOC3-000001

### Description Format
**Template:** `{ProviderInitials} | {SKU1, SKU2, SKU3} | {CollectorInitials}`

**Examples:**
- Single item: `BA | WL-SEM-I-10WK | GK`
- Multiple items: `BA | HRT-M-TEST-10WK, LAB-INIT-A-M | GK`
- Different provider: `DR | CONS-INITIAL, LAB-INIT-B-F | JF`

### Reporting & Analytics
**All reports needed:**
- ✅ Daily sales summary
- ✅ Product performance (units sold, revenue)
- ✅ Category performance (by major category)
- ✅ Customer LTV ranking
- ✅ Receptionist performance (collector tracking)
- ✅ Promo code usage and redemption rates
- ✅ Price override frequency and reasons
- ✅ Payment method breakdown (card vs cash vs split)

**Report Frequency:** As needed (on-demand)

### Multi-Location (Phase 6 - within 3 months!)
- **Timeline:** URGENT - within 3 months
- **Location Setup:** Each location has:
  - Own Authorize.net account (separate credentials)
  - Own invoice sequence (LOC1-, LOC2-, LOC3-)
  - Own location code (configurable)
- **Shared:**
  - Product catalog (same SKUs across all)
  - Customer database (patients can visit any location)
  - Central reporting (aggregate across locations)

### Product Bundles
- **Status:** YES - have existing bundles
- **Examples needed:** (user to provide list)
- **Functionality:**
  - Bundle SKU acts as single product
  - Shows component items in description
  - Special bundle pricing

### Special Requirements
1. **Description Field:** `{Provider} | {SKUs} | {Collector}`
2. **Auto-detect collector:** From Google account email
3. **Provider selector:** Dropdown at checkout
4. **Price override UI:** Quick buttons + custom option
5. **Split payment UI:** Cash amount input + card amount (auto-calculate)

---

## Technical Implementation Notes

### Database Schema Changes

**Products Sheet:**
```
SKU | Category | ItemName | Duration | BasePrice | Active | Notes
WL-SEM-O-10WK | Weight Loss | Semaglutide Oral 10 weeks | 10 weeks | 850.00 | TRUE |
```

**Transactions Sheet:**
```
TransactionID | Timestamp | InvoiceNumber | CustomerID | CustomerName | ProviderInitials | CollectorName | Items | Subtotal | PromoCode | Discount | PriceOverrides | CashAmount | CardAmount | Total | PaymentStatus | AuthNetTransID | LocationID | Description
```

**InvoiceTracking Sheet:**
```
LocationID | LocationCode | LastNumber | CurrentSequence
LOC-001 | LOC | 0 | LOC-000001
LOC-002 | LOC1 | 0 | LOC1-000001
LOC-003 | LOC2 | 0 | LOC2-000001
```

**Locations Sheet:**
```
LocationID | LocationCode | LocationName | AuthNetAPILogin | AuthNetTransKey | AuthNetSignatureKey | Active
LOC-001 | LOC | Main Clinic | [SANDBOX_KEY] | [SANDBOX_KEY] | [SANDBOX_KEY] | TRUE
```

**Config Sheet:**
```
ConfigKey | ConfigValue
DEFAULT_LOCATION | LOC-001
PATIENT_ID_REGEX | ^[A-Z]{2}\d{6}$
ENABLE_SPLIT_PAYMENT | TRUE
ENABLE_EMAIL_RECEIPT | TRUE
PRICE_OVERRIDE_REASONS | Grandfathered,F&F,Custom
PROVIDER_LIST | BA,DR,GK,JF
```

### UI Components

**Checkout Flow:**
1. Enter Patient ID (validate JF123456 format)
2. Select Provider (dropdown: BA, DR, GK, etc.)
3. Add products to cart (from 119 SKUs)
4. Apply promo code (optional)
5. Edit prices if needed (quick buttons: Grandfathered / F&F)
6. Review cart total
7. Choose payment method:
   - [ ] Credit Card Only (full amount)
   - [ ] Cash + Card Split
     - Cash amount: $____
     - Card amount: $____ (auto-calculated)
8. [x] Email receipt? (if checked, show email input)
9. Click "Process Payment"

**For Card Payment:**
- Redirect to Authorize.net hosted form
- Return with transaction result
- Log everything

**For Cash + Card:**
- First: Record cash amount
- Then: Redirect to Authorize.net for card portion
- Log both amounts

---

## Priority Implementation Order

### Phase 1 (Week 1) - CURRENT
1. ✅ Database structure with 7 tabs
2. ✅ Import 119 SKUs into Products sheet
3. ✅ Build ProductService
4. ✅ Build basic POS UI with category filters
5. ✅ Build shopping cart

### Phase 2 (Week 1-2)
6. CustomerService with JF123456 validation
7. Provider selector dropdown
8. Price override with quick buttons
9. Promo code service (configurable)
10. Cart calculations

### Phase 3 (Week 2)
11. Split payment UI (cash + card)
12. InvoiceService with LOC-000001 format
13. Description generator: "BA | SKUs | GK"
14. Authorize.net integration
15. Transaction logging

### Phase 4 (Week 2-3)
16. Analytics dashboard (all reports)
17. Email receipt functionality
18. Multi-location selector
19. Location-specific Authorize.net routing

### Phase 5 (Week 3)
20. Testing with sandbox
21. User acceptance testing
22. Training materials
23. Production deployment

---

## Success Metrics

**Before (Current State):**
- Checkout time: ~5 minutes
- Data entry errors: High
- Customer tracking: None
- Product analytics: None
- Invoice conflicts: Occasional

**After (Target State):**
- Checkout time: <2 minutes (60% reduction)
- Data entry errors: <1%
- Customer LTV: 100% visibility
- Product analytics: Real-time
- Invoice conflicts: 0%

---

## Files to Create

### Backend (Google Apps Script)
- `/Code.gs` - Main entry point
- `/ProductService.gs` - Product management (119 SKUs)
- `/CustomerService.gs` - Customer CRUD with JF123456 validation
- `/InvoiceService.gs` - LOC-000001 invoice generation
- `/TransactionService.gs` - Transaction logging with split payment
- `/PromoCodeService.gs` - Configurable promo codes
- `/AuthNetService.gs` - Authorize.net Accept Hosted integration
- `/AnalyticsService.gs` - All reporting functions
- `/LocationService.gs` - Multi-location management
- `/utils/Config.gs` - Configuration loader
- `/utils/Validator.gs` - Input validation (Patient ID, etc.)
- `/utils/Logger.gs` - Error logging

### Frontend (HTML/CSS/JS)
- `/frontend/index.html` - Main POS interface
- `/frontend/styles.html` - CSS styling
- `/frontend/customer.html` - Customer lookup/entry
- `/frontend/cart.html` - Shopping cart with overrides
- `/frontend/checkout.html` - Payment selection (card/split)
- `/frontend/receipt.html` - Transaction receipt
- `/frontend/dashboard.html` - Analytics dashboard
- `/frontend/scripts.html` - JavaScript logic

---

## Next Immediate Steps

1. ✅ Parse 119 SKUs into structured format
2. ✅ Create Google Sheets setup script
3. ✅ Build ProductService with all SKUs
4. ✅ Build POS UI with category filters
5. ✅ Implement cart with price override buttons

**Starting implementation NOW!**
