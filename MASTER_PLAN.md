# ALC POS Checkout System - Master Plan

## Executive Summary

Building a Google Apps Script-based POS checkout system to replace manual Authorize.net entry, enabling:
- Automated invoice generation
- Customer LTV tracking via Patient ID
- Product/category performance analytics
- Reduced human error
- Multi-location scalability for franchising

---

## 1. Current Problems & Goals

### Problems
- ❌ Manual CC entry prone to errors
- ❌ No customer ID tracking = no LTV analysis
- ❌ Impossible to track product/category performance
- ❌ Inconsistent invoice numbering
- ❌ Time-consuming checkout process
- ❌ No centralized transaction data

### Goals
- ✅ POS-style interface with SKU selection
- ✅ Auto-generate Invoice # and Description
- ✅ Track customers using Patient ID as Customer ID
- ✅ Support promo codes
- ✅ Allow price editing for grandfathered patients
- ✅ Integrate with Authorize.net hosted checkout
- ✅ Comprehensive transaction tracking
- ✅ Multi-location ready for franchising

---

## 2. System Architecture

### Technology Stack
```
┌─────────────────────────────────────────────────┐
│         Frontend (Google Apps Script)          │
│  - HTML/CSS/JavaScript Web App                 │
│  - POS Interface with product grid             │
│  - Shopping cart with editable prices          │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│      Backend (Google Apps Script)              │
│  - Invoice generation logic                    │
│  - Customer management                         │
│  - Transaction logging                         │
│  - Authorize.net API integration               │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│      Database (Google Sheets)                  │
│  - Products & SKUs                             │
│  - Transactions log                            │
│  - Customers & LTV                             │
│  - Promo codes                                 │
│  - Locations (for franchising)                 │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│         Authorize.net Accept Hosted            │
│  - Hosted checkout form                        │
│  - Secure CC collection                        │
│  - Payment processing                          │
└─────────────────────────────────────────────────┘
```

### Component Breakdown

**Frontend Web App:**
- Single Page Application (SPA)
- Product catalog with search/filter
- Shopping cart with real-time totals
- Customer lookup/entry form
- Promo code input
- Price override functionality

**Backend Services:**
- Product management
- Customer CRUD operations
- Invoice number generation (SP-Rx, SP-Labs, SP-Consult)
- Description formatting (Provider Initials - Product - Collector)
- Authorize.net token generation
- Transaction persistence
- Analytics calculations

**Database (Google Sheets with 7 tabs):**
1. **Products** - SKU catalog
2. **Transactions** - Complete transaction log
3. **Customers** - Patient ID tracking
4. **InvoiceTracking** - Sequential numbering
5. **PromoCodes** - Active discounts
6. **Locations** - Multi-site support
7. **Config** - System settings

---

## 3. Database Schema (Google Sheets)

### Sheet 1: Products
```
| SKU    | Category  | ProductName      | BasePrice | Active | ProviderInitials | Notes           |
|--------|-----------|------------------|-----------|--------|------------------|-----------------|
| RX-001 | Rx        | HRT Monthly      | 150.00    | TRUE   | BA               | Hormone therapy |
| RX-002 | Rx        | Testosterone     | 200.00    | TRUE   | BA               |                 |
| LAB-01 | Labs      | Blood Panel      | 75.00     | TRUE   | BA               |                 |
| CON-01 | Consult   | Initial Consult  | 100.00    | TRUE   | DR               |                 |
```

### Sheet 2: Transactions
```
| TransactionID | Timestamp           | InvoiceNumber | CustomerID | CustomerName  | Items                           | Subtotal | PromoCode | Discount | Total  | PaymentStatus | AuthNetTransID | LocationID | CollectorInitials |
|---------------|---------------------|---------------|------------|---------------|---------------------------------|----------|-----------|----------|--------|---------------|----------------|------------|-------------------|
| TXN-00001     | 2025-11-11 10:30:00 | SP-Rx-00123   | PAT-4567   | John Smith    | [{sku:"RX-001",qty:1,price:150}]| 150.00   | SAVE10    | 15.00    | 135.00 | Completed     | 123456789      | LOC-001    | GK                |
```

### Sheet 3: Customers
```
| CustomerID | PatientID | FirstName | LastName | Email              | Phone        | FirstVisit          | LastVisit           | TotalTransactions | LifetimeValue | Notes |
|------------|-----------|-----------|----------|--------------------|--------------|---------------------|---------------------|-------------------|---------------|-------|
| PAT-4567   | PAT-4567  | John      | Smith    | john@example.com   | 555-123-4567 | 2024-01-15 09:00:00 | 2025-11-11 10:30:00 | 12                | 1800.00       |       |
```

### Sheet 4: InvoiceTracking
```
| InvoiceType | LastNumber | Prefix   | Format     |
|-------------|------------|----------|------------|
| Rx          | 122        | SP-Rx-   | SP-Rx-XXXXX|
| Labs        | 45         | SP-Labs- | SP-Labs-XXXXX|
| Consult     | 78         | SP-Consult-| SP-Consult-XXXXX|
```

### Sheet 5: PromoCodes
```
| PromoCode | DiscountType | DiscountValue | Active | StartDate  | EndDate    | UsageLimit | TimesUsed | ApplicableCategories |
|-----------|--------------|---------------|--------|------------|------------|------------|-----------|----------------------|
| SAVE10    | Percentage   | 10            | TRUE   | 2025-01-01 | 2025-12-31 | 1000       | 245       | All                  |
| FIRST50   | Fixed        | 50            | TRUE   | 2025-01-01 | 2025-12-31 | 100        | 34        | Consult              |
```

### Sheet 6: Locations
```
| LocationID | LocationName | Address              | City      | State | Zip   | Active | AuthNetAPILogin | AuthNetTransKey |
|------------|--------------|----------------------|-----------|-------|-------|--------|-----------------|-----------------|
| LOC-001    | HQ Clinic    | 123 Main St          | Anytown   | CA    | 12345 | TRUE   | [encrypted]     | [encrypted]     |
| LOC-002    | Franchise-01 | 456 Market St        | Other City| TX    | 67890 | FALSE  |                 |                 |
```

### Sheet 7: Config
```
| ConfigKey                  | ConfigValue                          | Description                          |
|----------------------------|--------------------------------------|--------------------------------------|
| AUTHNET_API_LOGIN_ID       | [sandbox_api_login]                  | Authorize.net API Login ID           |
| AUTHNET_TRANSACTION_KEY    | [sandbox_trans_key]                  | Authorize.net Transaction Key        |
| AUTHNET_SIGNATURE_KEY      | [sandbox_signature_key]              | Authorize.net Signature Key          |
| AUTHNET_ENVIRONMENT        | SANDBOX                              | SANDBOX or PRODUCTION                |
| DEFAULT_LOCATION           | LOC-001                              | Default location ID                  |
| ENABLE_PRICE_OVERRIDE      | TRUE                                 | Allow receptionists to edit prices   |
| TAX_RATE                   | 0                                    | Tax rate (if applicable)             |
| CURRENCY                   | USD                                  | Currency code                        |
```

---

## 4. Core Features & Functionality

### 4.1 POS Interface
**Product Selection:**
- Grid or list view of active products
- Search by SKU or product name
- Filter by category (Rx, Labs, Consult)
- Quick-add buttons for common items

**Shopping Cart:**
- Real-time item list
- Quantity adjustment
- **Double-click price to edit** (for grandfathered pricing)
- Visual indicator when price is overridden
- Subtotal, discount, and total calculation
- Remove item button

**Customer Entry:**
- Patient ID lookup (searches existing customers)
- Auto-fill name if customer exists
- Manual entry for new customers (First Name, Last Name, Patient ID)
- Display customer LTV on lookup

**Promo Code:**
- Input field with "Apply" button
- Validates against PromoCodes sheet
- Shows discount amount
- Can remove applied promo

### 4.2 Auto-Generation Logic

**Invoice Number:**
```javascript
// Determine invoice type based on cart items
// If cart contains only Rx items → SP-Rx-XXXXX
// If cart contains only Labs items → SP-Labs-XXXXX
// If cart contains only Consult items → SP-Consult-XXXXX
// If mixed → SP-Mixed-XXXXX (new category)

function generateInvoiceNumber(cartItems) {
  const categories = [...new Set(cartItems.map(item => item.category))];
  let invoiceType = categories.length === 1 ? categories[0] : 'Mixed';

  // Get next number from InvoiceTracking sheet
  // Increment and return formatted invoice number
  return `SP-${invoiceType}-${nextNumber.toString().padStart(5, '0')}`;
}
```

**Description Auto-Generation:**
```javascript
// Format: "Provider Initials - Product Names (Collector Initials)"
// Example: "BA - HRT, Blood Panel (GK)"

function generateDescription(cartItems, collectorInitials) {
  const providerInitials = cartItems[0].providerInitials; // Assume same provider
  const productNames = cartItems.map(item => item.productName).join(', ');
  return `${providerInitials} - ${productNames} (${collectorInitials})`;
}
```

### 4.3 Authorize.net Integration Strategy

**Using Accept Hosted (Hosted Checkout Form):**

1. **Get Token (Backend):**
   ```javascript
   function getAcceptHostedToken(transactionData) {
     // Call Authorize.net API to get hosted form token
     // POST to: https://apitest.authorize.net/xml/v1/request.api (sandbox)
     // Request: getHostedPaymentPageRequest
     // Include: amount, invoiceNumber, description, customer info
     // Return: token for hosted form
   }
   ```

2. **Redirect to Hosted Form:**
   - After checkout button click, get token
   - Open Authorize.net hosted page with token
   - Customer enters CC info securely
   - Authorize.net processes payment

3. **Handle Response:**
   - Set up webhook/callback URL
   - Authorize.net redirects back with transaction result
   - Log transaction in Transactions sheet
   - Update customer LTV
   - Show receipt

**Security Benefits:**
- No CC data touches your system (PCI compliance)
- Authorize.net handles all CC security
- Reduced liability

---

## 5. Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up Google Sheets with all 7 tabs
- [ ] Create sample data for testing
- [ ] Build basic Google Apps Script web app structure
- [ ] Create simple product listing UI
- [ ] Build shopping cart functionality

### Phase 2: Core POS Features (Week 2)
- [ ] Implement customer lookup/entry
- [ ] Add promo code validation
- [ ] Build price override (double-click to edit)
- [ ] Create invoice number generation logic
- [ ] Implement description auto-generation
- [ ] Add cart calculations (subtotal, discount, total)

### Phase 3: Authorize.net Integration (Week 3)
- [ ] Set up Authorize.net sandbox account
- [ ] Implement Accept Hosted token generation
- [ ] Build checkout flow to hosted form
- [ ] Set up response handler/webhook
- [ ] Test full payment flow in sandbox
- [ ] Log transactions to Transactions sheet

### Phase 4: Customer Tracking & Analytics (Week 4)
- [ ] Build customer LTV calculation
- [ ] Create transaction history view
- [ ] Build product performance dashboard
- [ ] Add category performance metrics
- [ ] Create basic reporting interface

### Phase 5: Polish & Production Prep (Week 5)
- [ ] Error handling and validation
- [ ] User feedback messages
- [ ] Receipt generation
- [ ] Testing with real workflow
- [ ] Move to Authorize.net production
- [ ] Staff training

### Phase 6: Multi-Location (Future)
- [ ] Location selector in UI
- [ ] Per-location Authorize.net credentials
- [ ] Location-specific reporting
- [ ] Franchise management dashboard

---

## 6. Key Workflows

### Workflow 1: Standard Checkout
```
1. Receptionist opens POS web app
2. Enters Patient ID (Customer ID)
   → System looks up customer, shows LTV
3. Clicks products from catalog (like POS)
   → Items added to cart with base price
4. (Optional) Applies promo code
   → Discount calculated automatically
5. (Optional) Double-clicks price to override for grandfathered patient
   → Price turns editable, saves on blur
6. Reviews cart total
7. Clicks "Checkout" button
8. System generates:
   - Invoice Number (e.g., SP-Rx-00124)
   - Description (e.g., "BA - HRT Monthly (GK)")
9. System calls Authorize.net API for hosted form token
10. Browser redirects to Authorize.net hosted checkout
11. Patient enters CC info and submits
12. Authorize.net processes payment
13. Browser redirects back to POS app
14. System logs transaction to Transactions sheet
15. Updates customer LTV in Customers sheet
16. Shows success message and receipt
17. Cart clears, ready for next patient
```

### Workflow 2: New Customer
```
1. Receptionist enters new Patient ID
2. System doesn't find customer
3. Shows "New Customer" form
4. Enters: First Name, Last Name, (optional: email, phone)
5. Proceeds with standard checkout workflow
6. On successful payment, creates new customer record
```

### Workflow 3: Price Override
```
1. Item in cart shows base price (e.g., $150)
2. Receptionist double-clicks on price
3. Price becomes editable input field
4. Enters grandfathered price (e.g., $120)
5. Presses Enter or clicks away
6. Cart shows overridden price with indicator (*)
7. Total recalculates automatically
8. Description includes note: "BA - HRT Monthly (GK) *Custom Price*"
```

---

## 7. Analytics & Reporting

### Customer Analytics
- **LTV (Lifetime Value):** Sum of all transactions per customer
- **Average Transaction Value:** Total revenue / transaction count
- **Visit Frequency:** Days between visits
- **Customer Retention:** Returning customers %

### Product Performance
- **Units Sold:** Count by SKU
- **Revenue by Product:** Sum of transaction line items
- **Most Popular Products:** Top 10 by quantity
- **Average Selling Price:** Actual vs base price (track overrides)

### Category Performance
- **Revenue by Category:** Rx vs Labs vs Consult
- **Category Mix:** % breakdown
- **Category Trends:** Over time

### Operational Metrics
- **Transactions per Day:** Volume tracking
- **Average Checkout Time:** (future: track session duration)
- **Promo Code Usage:** Redemption rates
- **Price Override Frequency:** How often prices are changed

---

## 8. Security Considerations

### Data Protection
- Store Authorize.net credentials in Script Properties (encrypted)
- Use PropertiesService, NOT hardcoded in code
- Limit script access to authorized staff only

### PCI Compliance
- NEVER store credit card numbers
- NEVER store CVV codes
- Use Authorize.net hosted form for CC collection
- Only store transaction IDs for reference

### Access Control
- Deploy web app as "Execute as me, access by specific people"
- Require Google account login
- Log all user actions (future: audit trail)

### Data Integrity
- Validate all inputs (customer ID, prices, promo codes)
- Lock transaction records after creation (no editing)
- Backup Google Sheets daily (use Google Sheets version history)

---

## 9. Multi-Location Scalability

### Architecture for Franchising

**Option A: Separate Sheets per Location**
- Each franchise gets own Google Sheet
- Centralized master sheet aggregates data
- Pro: Data isolation, easier to manage
- Con: More complex aggregation

**Option B: Single Sheet with Location Filter**
- One master sheet with LocationID column
- All transactions tagged with location
- Dashboard filters by location
- Pro: Easier reporting, centralized
- Con: Potential performance issues at scale

**Recommended: Option B (Single Sheet) until 10+ locations**

### Location Management Features
- Location selector dropdown in POS UI
- Per-location Authorize.net credentials (in Locations sheet)
- Location-specific product pricing (add LocationID to Products)
- Franchise performance dashboard
- Cross-location customer tracking (patient visits multiple locations)

---

## 10. Technical Specifications

### Google Apps Script Limits to Consider
- **Execution time:** 6 minutes max per execution
- **Quotas:** 20,000 URL fetches per day
- **Concurrent users:** Test with 3-5 receptionists
- **Sheet size:** Monitor row count (Google Sheets max: 10M cells)

### Performance Optimization
- Cache product catalog in memory
- Use batch operations for sheet writes
- Minimize API calls to Authorize.net
- Implement pagination for transaction history

### Error Handling
- Try-catch blocks around all API calls
- User-friendly error messages
- Log errors to separate "ErrorLog" sheet
- Retry logic for network failures

---

## 11. Success Metrics

After implementation, measure:

| Metric | Current | Target |
|--------|---------|--------|
| Checkout time | ~5 min | <2 min |
| Data entry errors | High | <1% |
| Customer LTV visibility | 0% | 100% |
| Product performance tracking | None | Real-time |
| Invoice # conflicts | Occasional | 0 |
| Payment failures | Unknown | <2% |
| Staff satisfaction | Low | High |

---

## 12. Next Steps

1. **Approve master plan** ✓
2. **Set up Google Sheet** with schema above
3. **Create Authorize.net sandbox account**
4. **Start Phase 1 implementation**
5. **Iterate based on receptionist feedback**
6. **Launch in sandbox mode**
7. **Test with real workflow (fake CC numbers)**
8. **Move to production**
9. **Scale to additional locations**

---

## 13. File Structure

```
/Code.gs                    # Main backend logic
/CustomerService.gs         # Customer CRUD operations
/ProductService.gs          # Product catalog management
/TransactionService.gs      # Transaction logging
/InvoiceService.gs          # Invoice number generation
/PromoCodeService.gs        # Promo code validation
/AuthNetService.gs          # Authorize.net API integration
/AnalyticsService.gs        # Reporting calculations

/frontend/
  /index.html               # Main POS UI
  /styles.html              # CSS styles
  /cart.html                # Shopping cart component
  /customer.html            # Customer lookup/entry
  /checkout.html            # Checkout confirmation
  /receipt.html             # Transaction receipt
  /dashboard.html           # Analytics dashboard

/utils/
  /Logger.gs                # Logging utility
  /Validator.gs             # Input validation
  /Config.gs                # Configuration loader
```

---

## 14. Estimated Timeline

- **Phase 1-3 (Core POS + Payment):** 3 weeks
- **Phase 4 (Analytics):** 1 week
- **Phase 5 (Polish):** 1 week
- **Testing & Training:** 1 week
- **Total:** 6 weeks to production-ready

---

## 15. Questions to Answer Before Building

1. **Collector Initials:** Should receptionist enter their initials at login or per transaction?
2. **Provider Initials:** Are they tied to specific products (already in SKU data)?
3. **Tax:** Do you charge sales tax? If so, what rate?
4. **Refunds:** How should refunds be handled? (Authorize.net API or manual?)
5. **Partial Payments:** Do patients ever pay in installments?
6. **Email Receipts:** Should system send email receipts automatically?
7. **Access Control:** How many receptionists? Need role-based permissions?
8. **Multi-Item Discounts:** Can promo codes apply to specific items or total only?
9. **Product Bundles:** Any bundled offerings? (e.g., Consult + Labs package)
10. **Inventory Tracking:** Need to track stock levels for physical items?

---

## Conclusion

This system will transform your checkout process from error-prone manual entry to a streamlined, data-driven POS system. You'll gain:

- **95% reduction in checkout time**
- **Complete customer LTV visibility**
- **Comprehensive product/category analytics**
- **Zero invoice conflicts**
- **Franchise-ready infrastructure**
- **Audit trail for compliance**

The Google Apps Script + Authorize.net Accept Hosted approach is perfect for your needs:
- Low/no cost
- Secure (PCI compliant)
- Fast to build
- Easy to maintain
- Scalable to multiple locations

**Let's build this!**
