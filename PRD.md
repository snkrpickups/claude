# Product Requirements Document (PRD)
## ALC Point of Sale System

**Version:** 1.0
**Last Updated:** November 12, 2025
**Product Owner:** ALC Medical Clinic
**Status:** In Development

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Product Vision](#product-vision)
4. [Target Users](#target-users)
5. [Business Requirements](#business-requirements)
6. [User Stories](#user-stories)
7. [Functional Requirements](#functional-requirements)
8. [Technical Requirements](#technical-requirements)
9. [User Experience](#user-experience)
10. [Data Requirements](#data-requirements)
11. [Security & Compliance](#security--compliance)
12. [Success Metrics](#success-metrics)
13. [Constraints & Assumptions](#constraints--assumptions)
14. [Future Enhancements](#future-enhancements)
15. [Appendix](#appendix)

---

## Executive Summary

The ALC Point of Sale (POS) System is a custom-built, web-based checkout solution designed specifically for medical clinics offering aesthetic and wellness services. The system replaces manual Authorize.net credit card entry with an automated, error-free checkout process while providing comprehensive customer analytics and business intelligence.

**Key Features:**
- Automated checkout with 119 SKUs across 17 categories
- Customer Lifetime Value (LTV) tracking using Patient IDs
- Price override capabilities for grandfathered patients
- Split payment support (Cash + Card)
- Authorize.net payment integration
- Multi-location franchise support
- Real-time analytics and reporting

**Technology Stack:**
- Google Apps Script (Backend)
- Google Sheets (Database)
- HTML/CSS/JavaScript (Frontend)
- Authorize.net Accept Hosted (Payment Processing)

**Timeline:** ASAP deployment (1-2 weeks)

---

## Problem Statement

### Current State
ALC Medical Clinic currently processes payments by:
1. Manually entering credit card information into Authorize.net dashboard
2. Tracking patient purchases in disconnected spreadsheets
3. Managing product pricing without override capabilities
4. Unable to analyze customer lifetime value or product performance
5. No systematic way to track which providers or collectors handled transactions

### Pain Points
- **High Error Rate**: Manual credit card entry leads to typos, wrong amounts, and processing delays
- **Security Risk**: Staff members handling physical credit cards and entering data
- **No Customer Intelligence**: Unable to identify high-value patients or track purchase patterns
- **Inefficient Checkout**: 5-10 minutes per transaction due to manual processes
- **No Audit Trail**: Difficult to track who processed what transaction
- **Scalability Issues**: Current process won't work with franchise expansion plans

### Impact
- Lost revenue from abandoned checkouts due to long wait times
- Customer dissatisfaction from checkout errors
- Staff frustration with repetitive manual tasks
- Missed opportunities for personalized patient care based on LTV
- Inability to make data-driven inventory and pricing decisions

---

## Product Vision

**Vision Statement:**
Create a fast, error-free checkout experience that captures valuable customer data while seamlessly integrating with existing payment infrastructure, enabling ALC to deliver personalized patient care and scale to multiple franchise locations.

**Success Looks Like:**
- Checkout time reduced from 5-10 minutes to under 2 minutes
- Zero credit card entry errors
- 100% transaction attribution (provider + collector tracked)
- Real-time visibility into customer LTV and product performance
- Ready for multi-location deployment within 3 months

---

## Target Users

### Primary Users

#### 1. Front Desk Staff / Collectors (6-10 users)
**Role:** Process patient checkouts
**Technical Proficiency:** Basic (comfortable with web browsers)
**Key Needs:**
- Fast, intuitive product selection
- Easy patient lookup
- Clear error messages
- Simple split payment handling

#### 2. Medical Providers (BA, DR, JN, etc.)
**Role:** Deliver services that are being purchased
**Technical Proficiency:** Basic
**Key Needs:**
- Accurate transaction attribution
- Visibility into which services patients are purchasing

#### 3. Clinic Manager
**Role:** Oversees operations, analyzes performance
**Technical Proficiency:** Intermediate (Excel/Sheets proficient)
**Key Needs:**
- Customer LTV reports
- Product performance analytics
- Provider performance tracking
- Invoice tracking and reconciliation

### Secondary Users

#### 4. Patients/Customers
**Role:** Pay for services
**Technical Proficiency:** Varies
**Key Needs:**
- Secure payment processing
- Receipt delivery
- Familiar payment experience (Authorize.net)

---

## Business Requirements

### BR-1: Revenue Protection
**Priority:** P0 (Critical)
The system must ensure 100% payment capture with zero processing errors to protect revenue.

**Acceptance Criteria:**
- All transactions logged with timestamp
- Payment amounts match invoice totals
- Failed payments are flagged and tracked
- No duplicate charges possible

### BR-2: Customer Intelligence
**Priority:** P0 (Critical)
The system must track customer lifetime value to enable personalized patient care and marketing.

**Acceptance Criteria:**
- Each patient has unique Patient ID (JF123456 format)
- System tracks total spend per patient
- System tracks visit count per patient
- LTV automatically updates on each transaction

### BR-3: Product Analytics
**Priority:** P1 (High)
The system must provide insights into product and category performance.

**Acceptance Criteria:**
- Daily/weekly/monthly sales by SKU
- Category performance comparison
- Revenue by product line
- Top-selling products report

### BR-4: Operational Efficiency
**Priority:** P0 (Critical)
The system must reduce checkout time by at least 60%.

**Acceptance Criteria:**
- Average checkout time under 2 minutes
- Zero manual credit card entry
- Auto-detection of collector from Google account
- One-click product addition to cart

### BR-5: Franchise Scalability
**Priority:** P1 (High)
The system must support multiple clinic locations with separate financial tracking.

**Acceptance Criteria:**
- Each location has unique Authorize.net account
- Location-based invoice numbering (LOC-000001)
- Location-specific reporting
- Easy addition of new locations

### BR-6: Pricing Flexibility
**Priority:** P1 (High)
The system must support price overrides for grandfathered patients and special cases.

**Acceptance Criteria:**
- Quick buttons for common discounts (Grandfathered, F&F)
- Custom price entry with reason tracking
- Override audit trail (who, when, why)
- Visual indicators for modified prices

---

## User Stories

### Epic 1: Checkout Processing

#### US-1.1: Add Products to Cart
**As a** front desk staff member
**I want to** quickly add products to a cart by clicking on them
**So that** I can build an order without typing SKU numbers

**Acceptance Criteria:**
- Product grid displays all active SKUs with price
- Click on product card adds to cart
- Cart shows item count and running total
- Can add same product multiple times (quantity increments)

---

#### US-1.2: Customer Lookup
**As a** front desk staff member
**I want to** look up existing patients by Patient ID
**So that** I can see their purchase history and LTV

**Acceptance Criteria:**
- Input field validates JF123456 format (2 letters + 6 digits)
- System retrieves customer details if found
- Displays: Name, LTV, Total Visits
- Shows new customer form if Patient ID not found

---

#### US-1.3: Price Override
**As a** front desk staff member
**I want to** override product prices for grandfathered patients
**So that** I can honor legacy pricing agreements

**Acceptance Criteria:**
- Double-click on cart item price opens override modal
- Quick buttons: Grandfathered, F&F (Family & Friends)
- Custom price input field
- Reason dropdown or text field
- Visual indicator on overridden items (yellow highlight)
- Override details logged in transaction

---

#### US-1.4: Split Payment
**As a** front desk staff member
**I want to** accept partial payment in cash and remainder by card
**So that** patients can use available cash and pay balance by credit card

**Acceptance Criteria:**
- Payment method radio buttons: Card Only / Split Payment
- Split payment shows Cash Amount and Card Amount fields
- Card amount auto-calculates as (Total - Cash)
- Validation ensures amounts sum to total
- Both amounts logged in transaction record

---

#### US-1.5: Process Card Payment
**As a** front desk staff member
**I want to** process credit card payments without handling the physical card
**So that** we maintain PCI compliance and reduce errors

**Acceptance Criteria:**
- "Process Payment" button triggers Authorize.net redirect
- Opens Authorize.net Accept Hosted page in new window
- Patient enters own card details
- System receives payment confirmation
- Transaction logged with Authorize.net transaction ID

---

### Epic 2: Customer Management

#### US-2.1: Create New Customer
**As a** front desk staff member
**I want to** create new customer profiles during checkout
**So that** we can track first-time patients

**Acceptance Criteria:**
- New customer form appears if Patient ID not found
- Required fields: First Name, Last Name
- Optional fields: Email, Phone
- Patient ID format validated before save
- Customer created before transaction processing

---

#### US-2.2: View Customer LTV
**As a** clinic manager
**I want to** see customer lifetime value rankings
**So that** I can identify high-value patients for VIP treatment

**Acceptance Criteria:**
- Analytics report shows customers sorted by LTV
- Displays: Patient ID, Name, LTV, Visit Count
- Filterable by date range
- Exportable to CSV/Excel

---

### Epic 3: Analytics & Reporting

#### US-3.1: Daily Sales Report
**As a** clinic manager
**I want to** view daily sales totals
**So that** I can track revenue performance

**Acceptance Criteria:**
- Shows total revenue for selected date
- Breaks down by: Cash vs Card, By Provider, By Category
- Displays transaction count
- Compares to previous day/week

---

#### US-3.2: Product Performance
**As a** clinic manager
**I want to** analyze which products are selling best
**So that** I can optimize inventory and pricing

**Acceptance Criteria:**
- Report shows revenue by SKU
- Sortable by revenue, quantity sold, or profit margin
- Filterable by category and date range
- Shows trending products (up/down arrows)

---

#### US-3.3: Provider Performance
**As a** clinic manager
**I want to** see revenue by provider
**So that** I can track individual performance

**Acceptance Criteria:**
- Report shows each provider's total revenue
- Displays transaction count per provider
- Average transaction value
- Filterable by date range

---

### Epic 4: Multi-Location Support

#### US-4.1: Location Selection
**As a** front desk staff member
**I want to** select which location I'm working at
**So that** transactions are attributed correctly

**Acceptance Criteria:**
- Location auto-detected (default) or manually selected
- Each location has unique ID and name
- Invoice numbers include location code (LOC-000001)
- Can't process transactions without location

---

#### US-4.2: Location-Specific Analytics
**As a** clinic manager
**I want to** compare performance across locations
**So that** I can identify best practices and improvement opportunities

**Acceptance Criteria:**
- All reports filterable by location
- Side-by-side location comparison view
- Per-location revenue, LTV, product performance
- Ranking of locations by key metrics

---

## Functional Requirements

### FR-1: Product Management

#### FR-1.1: Product Catalog
- System maintains 119 SKUs across 17 categories
- Categories: Weight Loss, HRT Male, HRT Female, Sexual Health, IV Therapy, Labs, Peptides, Procedures, Skincare, Supplements, Devices, Consultations, Memberships, Packages, Telehealth, Other
- Each product has: SKU, Category, Item Name, Duration, Base Price, Active Status, Notes
- Products can be activated/deactivated
- Base prices editable in Google Sheets

#### FR-1.2: Product Display
- Category filter (All, Weight Loss, HRT Male, etc.)
- Search by SKU or Item Name
- Product grid with cards showing: SKU, Name, Duration, Price
- Visual feedback on hover and click
- Product count displayed for current filter

#### FR-1.3: Cart Management
- Add product increments quantity if already in cart
- Remove individual items from cart
- Clear entire cart
- Display: Item Name, SKU, Quantity, Price, Subtotal per item
- Running totals: Subtotal, Discount, Total

---

### FR-2: Customer Management

#### FR-2.1: Patient ID Validation
- Format: 2 uppercase letters + 6 digits (JF123456)
- Real-time validation on input
- Clear error messages for invalid format
- Auto-uppercase conversion

#### FR-2.2: Customer Lookup
- Search by Patient ID
- Return: Customer ID, Patient ID, First Name, Last Name, Email, Phone, Created Date, Last Transaction, Total Transactions, Lifetime Value
- Display existing customer details
- Show new customer form if not found

#### FR-2.3: Customer Creation
- Required: Patient ID, First Name, Last Name
- Optional: Email, Phone
- Created Date auto-populated
- Initial LTV = 0, Total Transactions = 0
- Duplicate Patient ID prevention

#### FR-2.4: LTV Tracking
- Automatically updates on each transaction
- Increments Total Transactions count
- Adds transaction amount to Lifetime Value
- Updates Last Transaction timestamp
- Atomic operations prevent race conditions

---

### FR-3: Checkout Processing

#### FR-3.1: Invoice Generation
- Format: LOCATION_CODE-NNNNNN (e.g., LOC-000001)
- Sequential numbering per location
- Atomic increment using LockService
- Never reuses invoice numbers
- Tracked in InvoiceTracking sheet

#### FR-3.2: Transaction Description
- Format: "PROVIDER | SKU1, SKU2, SKU3 | COLLECTOR"
- Example: "BA | SEMA-025, TIRZ-05 | GK"
- Provider initials manually selected
- Collector initials auto-detected from Google account
- All SKUs in cart included in description

#### FR-3.3: Payment Processing
- Card Only: Full amount to Authorize.net
- Split Payment: Cash amount + Card amount = Total
- Validation: Amounts must match total within $0.01
- Cash amount must be > $0 for split payments
- Card amount routes to Authorize.net Accept Hosted

#### FR-3.4: Transaction Logging
- Every transaction saved to Transactions sheet
- Fields: Timestamp, Transaction ID, Invoice Number, Patient ID, Customer Name, Provider, Collector, Cart Details (JSON), Subtotal, Promo Code, Discount, Price Overrides (JSON), Cash Amount, Card Amount, Total, Payment Status, Authorize.net Trans ID, Location ID, Description, Email Receipt Flag
- Transaction ID auto-generated (UUID)
- Payment Status: Pending, Completed, Failed, Cancelled

---

### FR-4: Pricing & Promotions

#### FR-4.1: Price Overrides
- Manual price editing per cart item
- Quick buttons: Grandfathered, F&F
- Custom reason field
- Original price preserved
- Override details in transaction log
- Visual indicator (yellow highlight)

#### FR-4.2: Promo Codes
- Code stored in PromoCodes sheet
- Types: Percentage discount, Fixed amount discount
- Start and end dates
- Usage limit (max uses)
- Active/Inactive status
- Automatic validation on apply
- Cannot apply expired or maxed-out codes
- Only one promo per transaction

#### FR-4.3: Discount Calculation
- Percentage: Subtotal × (Percentage / 100)
- Fixed: Flat amount off
- Applied after price overrides
- Cannot reduce total below $0
- Discount amount displayed separately
- Promo usage count incremented on successful transaction

---

### FR-5: Payment Integration

#### FR-5.1: Authorize.net Accept Hosted
- API Endpoint: Sandbox (https://apitest.authorize.net/xml/v1/request.api) or Production (https://api.authorize.net/xml/v1/request.api)
- Payment Form: Sandbox (https://test.authorize.net/payment/payment) or Production (https://accept.authorize.net/payment/payment)
- Token-based integration (getHostedPaymentPageRequest)
- Form opens in new window
- POST method with token parameter
- Customer enters card details on Authorize.net page
- Billing address optional (not required)
- Shipping address hidden

#### FR-5.2: Payment Settings
- Billing address: Show but not required
- Shipping address: Hidden
- Payment button text: "Pay"
- Return URL: POS app with success status
- Cancel URL: POS app with cancelled status
- Receipt: Handled by Authorize.net or custom

#### FR-5.3: Credentials Management
- Per-location Authorize.net credentials
- API Login ID, Transaction Key, Signature Key (optional)
- Environment: SANDBOX or PRODUCTION
- Credentials stored in Locations sheet
- Retrieved per transaction based on location

---

### FR-6: User Management

#### FR-6.1: User Authentication
- Google account authentication (built-in via Apps Script)
- Session-based user detection
- Email address captured
- Name extracted from email (firstname.lastname@domain.com)
- Initials auto-generated (first letter of first + last name)

#### FR-6.2: Provider Selection
- Manual dropdown selection required
- Provider list configured in Config sheet
- Default providers: BA, DR, JN, MA, XA
- Validation: Cannot checkout without provider
- Provider initials included in transaction description

#### FR-6.3: Collector Auto-Detection
- Collector initials auto-populated from logged-in user
- Extracted from Google account email
- Displayed in read-only field
- Included in transaction description
- Audit trail of who processed each transaction

---

### FR-7: Analytics & Reporting

#### FR-7.1: Customer Analytics
- Top customers by LTV
- Customer segmentation (high/medium/low value)
- Average transaction value per customer
- Visit frequency analysis
- New vs returning customer ratio

#### FR-7.2: Product Analytics
- Revenue by SKU
- Revenue by Category
- Units sold per product
- Top 10 products (by revenue and quantity)
- Product mix analysis
- Slow-moving inventory identification

#### FR-7.3: Provider Analytics
- Revenue by provider
- Transaction count by provider
- Average transaction value by provider
- Product mix by provider
- Provider comparison reports

#### FR-7.4: Financial Reports
- Daily sales summary
- Weekly/monthly sales trends
- Cash vs card payment breakdown
- Payment method distribution
- Discount and promo code usage
- Revenue by location

---

### FR-8: Multi-Location Support

#### FR-8.1: Location Configuration
- Locations sheet with: Location ID, Location Code, Location Name, Address, City, State, Zip, Active Status, Authorize.net credentials, Environment
- Each location has unique invoice numbering
- Location-specific Authorize.net accounts
- Can activate/deactivate locations

#### FR-8.2: Location Selection
- Default location from Config (DEFAULT_LOCATION)
- Auto-select if only one active location
- All transactions tagged with Location ID
- Invoice numbers include Location Code

#### FR-8.3: Location-Specific Reporting
- Filter all reports by location
- Compare locations side-by-side
- Per-location revenue, customer count, product performance
- Location rankings

---

## Technical Requirements

### TR-1: Platform & Infrastructure

#### TR-1.1: Google Apps Script
- Container-bound script (bound to Google Sheet)
- Web app deployment mode
- Execute as: User accessing the web app
- Who has access: Anyone with Google account (internal org)
- Apps Script API quota: 20,000 URL Fetch calls/day
- Script runtime: 6 minutes max per execution

#### TR-1.2: Google Sheets Database
- Single spreadsheet with 7 tabs:
  1. **Products**: 119 SKUs, updated rarely
  2. **Transactions**: Append-only log, grows continuously
  3. **Customers**: One row per patient, updated on each transaction
  4. **InvoiceTracking**: One row per location, updated on each checkout
  5. **PromoCodes**: Small table, updated occasionally
  6. **Locations**: Small table (1-10 rows), updated rarely
  7. **Config**: Key-value pairs, updated rarely

#### TR-1.3: Browser Compatibility
- Chrome 90+ (primary)
- Firefox 88+
- Safari 14+
- Edge 90+
- No IE support

---

### TR-2: Data Model

#### TR-2.1: Products Sheet
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| SKU | String | Yes | Unique product identifier |
| Category | String | Yes | Product category (17 options) |
| ItemName | String | Yes | Product display name |
| Duration | String | No | Treatment duration or quantity |
| BasePrice | Number | Yes | Default price in USD |
| Active | Boolean | Yes | TRUE/FALSE for visibility |
| Notes | String | No | Internal notes |

**Indexes:** SKU (unique)
**Size:** 119 rows (relatively static)

#### TR-2.2: Transactions Sheet
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| Timestamp | DateTime | Yes | Transaction datetime |
| TransactionID | String | Yes | UUID v4 |
| InvoiceNumber | String | Yes | LOC-000001 format |
| PatientID | String | Yes | JF123456 format |
| CustomerName | String | Yes | Full name |
| ProviderInitials | String | Yes | 2-3 letters |
| CollectorName | String | Yes | Full name from email |
| CartDetails | JSON | Yes | Serialized cart array |
| Subtotal | Number | Yes | Pre-discount total |
| PromoCode | String | No | Code used |
| Discount | Number | Yes | Discount amount (0 if none) |
| PriceOverrides | JSON | No | Array of overrides |
| CashAmount | Number | Yes | Cash portion (0 if card only) |
| CardAmount | Number | Yes | Card portion |
| Total | Number | Yes | Final amount |
| PaymentStatus | String | Yes | Pending/Completed/Failed/Cancelled |
| AuthNetTransID | String | No | Authorize.net transaction ID |
| LocationID | String | Yes | Location identifier |
| Description | String | Yes | Provider | SKUs | Collector |
| EmailReceipt | Boolean | Yes | TRUE/FALSE |

**Indexes:** TransactionID (unique), InvoiceNumber (unique), PatientID (non-unique)
**Growth Rate:** ~100-500 rows/month
**Size Limit:** 10 million cells (Google Sheets limit)

#### TR-2.3: Customers Sheet
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| CustomerID | String | Yes | UUID v4 |
| PatientID | String | Yes | JF123456 format (unique) |
| FirstName | String | Yes | Patient first name |
| LastName | String | Yes | Patient last name |
| Email | String | No | Contact email |
| Phone | String | No | Phone number |
| CreatedDate | DateTime | Yes | First transaction date |
| LastTransaction | DateTime | No | Most recent transaction |
| TotalTransactions | Number | Yes | Count of transactions |
| LifetimeValue | Number | Yes | Sum of all transaction totals |

**Indexes:** CustomerID (unique), PatientID (unique)
**Growth Rate:** ~20-50 new customers/month
**Size Estimate:** 5,000 rows over 5 years

#### TR-2.4: InvoiceTracking Sheet
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| LocationID | String | Yes | Unique location ID |
| LocationCode | String | Yes | 3-letter code for invoices |
| LastInvoiceNumber | Number | Yes | Last used sequential number |
| LastInvoiceGenerated | String | No | Full invoice string (LOC-000001) |

**Indexes:** LocationID (unique)
**Updates:** Atomic increment on each transaction
**Size:** 1-10 rows (one per location)

#### TR-2.5: PromoCodes Sheet
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| PromoCode | String | Yes | Code entered by user (SAVE10) |
| DiscountType | String | Yes | Percentage or Fixed |
| DiscountValue | Number | Yes | Percentage (10) or amount (25.00) |
| StartDate | Date | Yes | Valid from date |
| EndDate | Date | Yes | Valid until date |
| MaxUses | Number | No | Usage limit (blank = unlimited) |
| CurrentUses | Number | Yes | Times used |
| Active | Boolean | Yes | TRUE/FALSE |

**Indexes:** PromoCode (unique)
**Size:** 10-50 rows

#### TR-2.6: Locations Sheet
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| LocationID | String | Yes | LOC-001 format |
| LocationCode | String | Yes | LOC (3 letters) |
| LocationName | String | Yes | Display name |
| Address | String | No | Street address |
| City | String | No | City |
| State | String | No | State/Province |
| Zip | String | No | Postal code |
| Active | Boolean | Yes | TRUE/FALSE |
| AuthNet_API_Login | String | Yes | Authorize.net API Login ID |
| AuthNet_TransKey | String | Yes | Transaction Key |
| AuthNet_SignatureKey | String | No | Signature Key (optional) |
| Environment | String | Yes | SANDBOX or PRODUCTION |

**Indexes:** LocationID (unique)
**Size:** 1-10 rows

#### TR-2.7: Config Sheet
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| ConfigKey | String | Yes | Setting name |
| ConfigValue | String | Yes | Setting value |

**Key-Value Pairs:**
- DEFAULT_LOCATION: LOC-001
- PATIENT_ID_REGEX: ^[A-Z]{2}\d{6}$
- PROVIDER_LIST: BA,DR,JN,MA,XA
- ENABLE_SPLIT_PAYMENT: TRUE
- CURRENCY_SYMBOL: $

**Size:** 5-20 rows

---

### TR-3: API Integrations

#### TR-3.1: Authorize.net Accept Hosted API

**Endpoint:**
- Sandbox: https://apitest.authorize.net/xml/v1/request.api
- Production: https://api.authorize.net/xml/v1/request.api

**Method:** POST
**Content-Type:** application/json

**Request Structure:**
```json
{
  "getHostedPaymentPageRequest": {
    "merchantAuthentication": {
      "name": "API_LOGIN_ID",
      "transactionKey": "TRANSACTION_KEY"
    },
    "transactionRequest": {
      "transactionType": "authCaptureTransaction",
      "amount": "123.45",
      "order": {
        "invoiceNumber": "LOC-000001",
        "description": "BA | SEMA-025 | GK"
      },
      "customer": {
        "id": "JF123456",
        "email": "patient@example.com"
      },
      "billTo": {
        "firstName": "John",
        "lastName": "Smith"
      }
    },
    "hostedPaymentSettings": {
      "setting": [
        {
          "settingName": "hostedPaymentReturnOptions",
          "settingValue": "{\"showReceipt\":true,\"url\":\"...\",\"cancelUrl\":\"...\"}"
        },
        {
          "settingName": "hostedPaymentBillingAddressOptions",
          "settingValue": "{\"show\":true,\"required\":false}"
        }
      ]
    }
  }
}
```

**Success Response:**
```json
{
  "token": "mh+PzT8rYwip8RdVqI1UwuSUzU/hLyO7i...",
  "messages": {
    "resultCode": "Ok",
    "message": [{
      "code": "I00001",
      "text": "Successful."
    }]
  }
}
```

**Error Response:**
```json
{
  "messages": {
    "resultCode": "Error",
    "message": [{
      "code": "E00007",
      "text": "User authentication failed due to invalid authentication values."
    }]
  }
}
```

**Rate Limits:** 10,000 requests/day (per merchant account)
**Timeout:** 30 seconds
**Retry Logic:** Exponential backoff (2s, 4s, 8s, 16s) for network errors only

---

#### TR-3.2: Authorize.net Hosted Payment Form

**URL:**
- Sandbox: https://test.authorize.net/payment/payment
- Production: https://accept.authorize.net/payment/payment

**Method:** POST (form submission)
**Parameters:**
- token: (string, required) Token from getHostedPaymentPageRequest

**Integration Method:**
1. Generate token via API call (backend)
2. Open new browser window (preserves user gesture)
3. Write HTML form to window
4. Auto-submit form with token
5. User completes payment on Authorize.net page
6. Authorize.net redirects to returnUrl or cancelUrl

**Security:**
- PCI-compliant hosted form
- No card data touches our servers
- Token expires after 15 minutes
- Single-use token (cannot be reused)

---

### TR-4: Performance Requirements

#### TR-4.1: Response Times
- Page load: < 3 seconds
- Product search/filter: < 500ms
- Customer lookup: < 1 second
- Add to cart: < 200ms
- Checkout initiation: < 2 seconds
- Token generation: < 3 seconds
- Payment redirect: < 1 second

#### TR-4.2: Scalability
- Support 6-10 concurrent users initially
- Scale to 50 concurrent users (multi-location)
- Handle 500 transactions/day per location
- 5,000 total SKUs across all locations
- 100,000 customer records
- 1 million transaction records over 5 years

#### TR-4.3: Data Limits
- Google Sheets: 10 million cells max
- Apps Script: 6-minute execution limit
- URL Fetch: 20,000 calls/day
- Concurrent script executions: 30
- Transaction log: Archive after 2 years

---

### TR-5: Security Requirements

#### TR-5.1: Authentication
- Google OAuth 2.0 (built-in via Apps Script)
- Organization-only access (Google Workspace)
- No password management required
- Session timeout: 1 hour of inactivity

#### TR-5.2: Authorization
- All users have equal permissions (no RBAC initially)
- Future: Role-based access (Manager, Staff, Read-Only)
- Audit trail via Google account email

#### TR-5.3: Data Protection
- Google Sheets encryption at rest (Google-managed)
- HTTPS for all communications (enforced)
- No credit card data stored (PCI compliance)
- Authorize.net credentials in sheet (read-only to users)
- Patient data covered by HIPAA (clinic's responsibility)

#### TR-5.4: Input Validation
- Patient ID regex validation
- Price override bounds ($0-$10,000)
- Email format validation
- Phone number format validation
- SQL injection prevention (using parameterized sheets access)
- XSS prevention (HTML escaping)

---

### TR-6: Deployment Requirements

#### TR-6.1: Deployment Process
1. Copy AllInOneDeployment.gs into Apps Script
2. Save and rename project
3. Deploy as web app:
   - Execute as: Me (developer)
   - Who has access: Anyone with Google account (org)
4. Copy web app URL
5. Share with team

#### TR-6.2: Configuration
1. Add Authorize.net credentials to Locations sheet
2. Set DEFAULT_LOCATION in Config sheet
3. Update PROVIDER_LIST in Config sheet
4. Activate/deactivate products in Products sheet
5. Test with sandbox credentials
6. Switch to production credentials when ready

#### TR-6.3: Updates
- Code updates: Replace code in Apps Script, save
- No redeployment needed unless deployment settings change
- Zero downtime updates
- Version control via Git repository

---

## User Experience

### UX-1: Design Principles

1. **Speed First:** Minimize clicks and typing
2. **Error Prevention:** Validate inputs before submission
3. **Clear Feedback:** Confirm actions with visual indicators
4. **Familiar Patterns:** Use standard e-commerce UX
5. **Accessibility:** Keyboard navigation, clear labels, color contrast

### UX-2: Layout

#### Main Screen
```
┌─────────────────────────────────────────────────────────────────┐
│  ALC POS System                              User: John Doe     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────┐  ┌─────────────────────────┐   │
│  │  PRODUCTS                 │  │  CUSTOMER INFO          │   │
│  │  ─────────────            │  │  ─────────────          │   │
│  │  [Category Filters]       │  │  Patient ID: [______]   │   │
│  │  [Search: ___________]    │  │  [Lookup Customer]      │   │
│  │                           │  │                         │   │
│  │  ┌────┐ ┌────┐ ┌────┐    │  │  Name: John Smith       │   │
│  │  │SKU1│ │SKU2│ │SKU3│    │  │  LTV: $1,245.00         │   │
│  │  │$100│ │$200│ │$150│    │  │  Visits: 5              │   │
│  │  └────┘ └────┘ └────┘    │  └─────────────────────────┘   │
│  │  ┌────┐ ┌────┐ ┌────┐    │                                │
│  │  │SKU4│ │SKU5│ │SKU6│    │  ┌─────────────────────────┐   │
│  │  │$300│ │$50 │ │$75 │    │  │  CART (3 items)         │   │
│  │  └────┘ └────┘ └────┘    │  │  ─────────────          │   │
│  └───────────────────────────┘  │  SKU1 x1      $100.00   │   │
│                                  │  SKU2 x2      $400.00   │   │
│                                  │                         │   │
│                                  │  Subtotal:    $500.00   │   │
│                                  │  Discount:    -$50.00   │   │
│                                  │  TOTAL:       $450.00   │   │
│                                  │                         │   │
│                                  │  Provider: [BA ▼]       │   │
│                                  │  Collector: GK          │   │
│                                  │                         │   │
│                                  │  [Process Payment]      │   │
│                                  └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### UX-3: Color Scheme

**Primary Colors:**
- Primary Blue: #2563eb (buttons, active filters)
- Success Green: #10b981 (prices, success messages)
- Danger Red: #ef4444 (errors, delete actions)
- Warning Yellow: #fef3c7 (price overrides, new customer alerts)

**Neutrals:**
- Text: #1f2937 (dark gray)
- Text Light: #6b7280 (medium gray)
- Border: #e5e7eb (light gray)
- Background: #f9fafb (off-white)
- White: #ffffff

### UX-4: Responsive Design

- **Desktop (1200px+):** Two-column layout (products left, cart right)
- **Tablet (768-1199px):** Single column, cart below products
- **Mobile (< 768px):** Stacked layout, sticky cart footer

### UX-5: Accessibility

- WCAG 2.1 Level AA compliance
- Keyboard navigation (Tab, Enter, Esc)
- ARIA labels on interactive elements
- Color contrast ratio > 4.5:1
- Focus indicators on all inputs
- Screen reader compatible

---

## Data Requirements

### DR-1: Data Retention

- **Transactions:** Permanent retention, archive after 2 years to separate sheet
- **Customers:** Permanent retention
- **Products:** Permanent retention, soft delete (Active = FALSE)
- **Invoice Tracking:** Permanent retention
- **Promo Codes:** Archive expired codes after 1 year
- **Locations:** Permanent retention, soft delete
- **Config:** Permanent retention

### DR-2: Data Backup

- Google Sheets native versioning (30-day history)
- Daily automated export to Google Drive (via Apps Script trigger)
- Weekly manual backup by clinic manager
- Quarterly archive to external storage

### DR-3: Data Privacy

- Patient data considered PHI (Protected Health Information)
- Covered by clinic's HIPAA compliance program
- No data sharing with third parties
- Access limited to authorized clinic staff
- Audit trail of all transactions
- Right to be forgotten: Archive customer on request, don't delete (for financial records)

---

## Security & Compliance

### SC-1: PCI Compliance

**Scope:** PCI DSS Level 4 (< 20,000 transactions/year)

**Compliance Strategy:**
- **No card data stored:** All payment processing via Authorize.net
- **Tokenization:** Accept Hosted integration (SAQ-A eligible)
- **Secure transmission:** HTTPS enforced
- **Access control:** Google OAuth authentication
- **Audit logging:** All transactions logged with timestamp and user

**SAQ Type:** SAQ-A (Cardholder data entirely outsourced)

### SC-2: HIPAA Compliance

**Covered Entities:** ALC Medical Clinic

**PHI Elements:**
- Patient ID (JF123456)
- Patient Name
- Email address
- Phone number
- Treatment details (SKU descriptions)

**Safeguards:**
- **Administrative:** Staff training, access policies
- **Physical:** Google data center security (Google's BAA)
- **Technical:** Encryption at rest and in transit, authentication, audit logs

**Business Associate Agreement:** Required with Google Workspace

### SC-3: Data Security Controls

| Control | Implementation |
|---------|----------------|
| Encryption at Rest | Google-managed (AES-256) |
| Encryption in Transit | HTTPS/TLS 1.2+ |
| Authentication | Google OAuth 2.0 |
| Authorization | Google Workspace organization limits |
| Session Management | 1-hour timeout |
| Input Validation | Client + server-side |
| Error Handling | No sensitive data in error messages |
| Logging | Transaction audit trail |
| Backup | Daily automated export |

---

## Success Metrics

### SM-1: Operational Metrics

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Average Checkout Time | 5-10 min | < 2 min | Timestamp analysis |
| Checkout Error Rate | 15% | < 1% | Error logs |
| Payment Processing Errors | 5% | < 0.5% | Failed transaction count |
| System Uptime | N/A | 99.5% | Monitoring |
| User Adoption | 0% | 100% (6-10 users) | Active user count |

### SM-2: Business Metrics

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Customer LTV Visibility | 0% | 100% | All customers have LTV |
| Transaction Attribution | 0% | 100% | All transactions have provider + collector |
| Product Performance Insights | None | Weekly reports | Manager reviews analytics |
| Revenue Tracking Accuracy | ~90% | 100% | Reconciliation with bank statements |

### SM-3: Customer Experience Metrics

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Checkout Abandonment Rate | ~20% | < 5% | Incomplete transactions |
| Customer Complaints (payment-related) | 5/month | < 1/month | Support tickets |
| Payment Success Rate | 95% | > 99% | Successful vs failed payments |

### SM-4: Technical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page Load Time | < 3s | Browser DevTools |
| API Response Time | < 2s | Apps Script logs |
| Error Rate | < 0.1% | Error logs |
| Data Accuracy | 100% | Audit reconciliation |

---

## Constraints & Assumptions

### Constraints

1. **Technical Constraints:**
   - Google Apps Script 6-minute execution limit
   - Google Sheets 10 million cell limit
   - URL Fetch quota: 20,000 calls/day
   - Browser compatibility (modern browsers only)

2. **Budget Constraints:**
   - Zero additional software costs (Google Workspace already owned)
   - Authorize.net fees: 2.9% + $0.30 per transaction
   - No dedicated development budget (one-time build)

3. **Timeline Constraints:**
   - Must launch within 1-2 weeks
   - No time for extensive user testing
   - Iterative improvements post-launch

4. **Resource Constraints:**
   - No dedicated IT staff
   - Front desk staff have basic technical skills
   - Limited training time (< 1 hour)

5. **Regulatory Constraints:**
   - Must maintain PCI compliance
   - Must maintain HIPAA compliance
   - Cannot store credit card data

### Assumptions

1. **User Assumptions:**
   - Staff have Google accounts within organization
   - Users have basic computer literacy
   - Users will access from desktop computers (primarily)
   - Users have stable internet connection

2. **Business Assumptions:**
   - Product catalog changes infrequently (< 10 new SKUs/month)
   - Patient ID format will remain consistent (JF123456)
   - Average transaction value: $100-$500
   - Transaction volume: 20-50/day initially

3. **Technical Assumptions:**
   - Google Workspace will remain the primary platform
   - Authorize.net will remain the payment processor
   - Internet connectivity is reliable
   - Google Sheets performance adequate for 5 years

4. **Operational Assumptions:**
   - Clinic manager can perform basic Google Sheets updates
   - Staff will provide feedback for improvements
   - Multi-location expansion within 3 months
   - Current process documentation accurate

---

## Future Enhancements

### Phase 2 (Months 2-3)

#### FE-2.1: Enhanced Analytics Dashboard
- Real-time dashboard with charts and graphs
- Customizable date ranges
- Automated weekly email reports
- KPI tracking (revenue, LTV, conversion rate)
- Predictive analytics (revenue forecasting)

#### FE-2.2: Inventory Management
- Stock level tracking
- Low stock alerts
- Reorder point automation
- Supplier management
- Cost tracking (COGS)

#### FE-2.3: Appointment Integration
- Link transactions to appointment system
- Pre-checkout from appointment
- Package/membership tracking
- Recurring billing

#### FE-2.4: Advanced Customer Features
- Customer notes and preferences
- Birthday tracking and automated campaigns
- Referral tracking
- Loyalty points program
- Treatment history timeline

### Phase 3 (Months 4-6)

#### FE-3.1: Mobile App
- Native iOS/Android apps
- Offline mode
- Mobile-optimized checkout
- Barcode scanning for products
- Mobile receipt delivery

#### FE-3.2: Advanced Reporting
- Custom report builder
- Scheduled reports (daily, weekly, monthly)
- Export to Excel/PDF
- Data visualization library
- Comparison reports (YoY, MoM)

#### FE-3.3: Multi-Currency Support
- Currency selection per location
- Exchange rate management
- Multi-currency reporting

#### FE-3.4: Role-Based Access Control
- Manager, Staff, Read-Only roles
- Permission-based feature access
- Approval workflows for large transactions
- Price override approval requirements

### Phase 4 (Months 7-12)

#### FE-4.1: Customer Portal
- Patients view own transaction history
- Download receipts
- View LTV and visit count
- Book appointments
- Update contact information

#### FE-4.2: Marketing Automation
- Email campaigns based on LTV
- Abandoned cart recovery
- Product recommendation engine
- Birthday and anniversary campaigns
- Re-engagement campaigns

#### FE-4.3: EHR Integration
- Sync with Electronic Health Records
- Pull patient demographics
- Push treatment details
- Billing integration

#### FE-4.4: Financial Integrations
- QuickBooks integration
- Xero integration
- Automated reconciliation
- Tax reporting
- 1099 generation for providers

### Long-Term Vision (Year 2+)

- AI-powered pricing optimization
- Dynamic pricing based on demand
- Automated inventory replenishment
- Predictive customer churn analysis
- Franchise management portal
- API for third-party integrations
- White-label POS for other clinics

---

## Appendix

### A1: Glossary

| Term | Definition |
|------|------------|
| Accept Hosted | Authorize.net's hosted payment page solution |
| Apps Script | Google's JavaScript-based cloud scripting platform |
| LTV | Lifetime Value - total revenue from a customer |
| Patient ID | Unique identifier for customers (JF123456 format) |
| PCI DSS | Payment Card Industry Data Security Standard |
| PHI | Protected Health Information (HIPAA) |
| SKU | Stock Keeping Unit - unique product identifier |
| SAQ | Self-Assessment Questionnaire (PCI compliance) |

### A2: Product Categories (17)

1. Weight Loss
2. HRT Male (Hormone Replacement Therapy)
3. HRT Female
4. Sexual Health
5. IV Therapy
6. Labs (Laboratory Tests)
7. Peptides
8. Procedures (Medical Procedures)
9. Skincare
10. Supplements
11. Devices (Medical Devices)
12. Consultations
13. Memberships
14. Packages (Treatment Packages)
15. Telehealth
16. Other
17. (Reserved for future use)

### A3: Sample SKUs

| SKU | Category | Item Name | Duration | Base Price |
|-----|----------|-----------|----------|------------|
| SEMA-025 | Weight Loss | Semaglutide 0.25mg | Weekly | $250.00 |
| TIRZ-05 | Weight Loss | Tirzepatide 5mg | Weekly | $350.00 |
| TEST-CYP | HRT Male | Testosterone Cypionate | Monthly | $150.00 |
| ESTRA-001 | HRT Female | Estradiol | Monthly | $120.00 |
| IV-GLUT | IV Therapy | Glutathione IV | Single | $200.00 |
| CONSULT-NEW | Consultations | New Patient Consultation | 30 min | $100.00 |
| MEMBER-VIP | Memberships | VIP Membership | Annual | $1,200.00 |

### A4: Provider Codes

| Code | Provider Name | Specialty |
|------|---------------|-----------|
| BA | Dr. B. Anderson | Medical Director |
| DR | Dr. D. Rodriguez | Physician |
| JN | J. Nguyen | Nurse Practitioner |
| MA | M. Anderson | Physician Assistant |
| XA | X. Admin | Administrative |

### A5: Test Scenarios

#### Happy Path - Card Only Payment
1. User logs in (Google account)
2. Click on product (SEMA-025)
3. Enter Patient ID: JF123456 (existing customer)
4. Customer details load (LTV: $500, Visits: 2)
5. Select Provider: BA
6. Click "Process Payment"
7. Redirect to Authorize.net
8. Enter test card: 4111111111111111
9. Payment successful
10. Transaction logged
11. Customer LTV updated to $750
12. Invoice generated: LOC-000015

#### Happy Path - Split Payment
1. Add product (IV-GLUT, $200)
2. Enter Patient ID: JF654321 (existing)
3. Select Provider: DR
4. Select payment method: Split Payment
5. Enter Cash Amount: $100
6. Card Amount auto-calculates: $100
7. Click "Process Payment"
8. Redirect to Authorize.net for $100 card payment
9. Payment successful
10. Transaction logs: Cash $100, Card $100, Total $200

#### Happy Path - New Customer
1. Add products (total $400)
2. Enter Patient ID: AB123456 (new)
3. New customer form appears
4. Fill in: First Name, Last Name, Email, Phone
5. Select Provider: JN
6. Click "Process Payment"
7. Customer created with LTV: $0
8. Redirect to payment
9. Payment successful
10. Customer LTV updated to $400, Visits: 1

#### Edge Case - Price Override
1. Add product (SEMA-025, $250)
2. Double-click price in cart
3. Click "Grandfathered" button
4. Price changes to $200
5. Yellow highlight on item
6. Override reason: "Grandfathered"
7. Complete checkout
8. Transaction logs override details

#### Edge Case - Promo Code
1. Add products (subtotal $500)
2. Enter promo code: SAVE10
3. Click "Apply"
4. Discount: -$50 (10%)
5. Total: $450
6. Complete checkout
7. Promo usage count increments
8. Discount logged in transaction

#### Error Case - Invalid Patient ID
1. Enter Patient ID: "ABC" (too short)
2. Click "Lookup Customer"
3. Error: "Invalid Patient ID format. Must be 2 letters + 6 digits (e.g., JF123456)"
4. Input field highlighted red

#### Error Case - Authorize.net Credentials Missing
1. Location has no Authorize.net credentials
2. User completes checkout
3. Error: "Authorize.net credentials not configured for this location"
4. Transaction not created
5. User prompted to contact manager

### A6: Code Repository Structure

```
/
├── README.md
├── PRD.md (this document)
├── MASTER_PLAN.md
├── IMPLEMENTATION_ROADMAP.md
├── DEPLOYMENT.md
├── SINGLE_FILE_DEPLOYMENT.md
├── AUTHORIZE_NET_SETUP.md
├── CUSTOM_REQUIREMENTS.md
├── SUMMARY.md
├── UI_PREVIEW.md
├── apps-script/
│   ├── Code.gs
│   ├── Config.gs
│   ├── Validator.gs
│   ├── ProductService.gs
│   ├── CustomerService.gs
│   ├── LocationService.gs
│   ├── InvoiceService.gs
│   ├── PromoCodeService.gs
│   ├── TransactionService.gs
│   ├── AuthNetService.gs
│   ├── AnalyticsService.gs
│   └── CheckoutService.gs
├── apps-script/html/
│   ├── index.html
│   ├── styles.html
│   ├── customer.html
│   ├── cart.html
│   ├── checkout.html
│   └── scripts.html
├── setup-scripts/
│   ├── SetupGoogleSheets.gs
│   ├── CreateNewSheet.gs
│   ├── AllInOneDeployment.gs
│   └── DiagnoseAuthNet.gs
└── data/
    └── products.json
```

### A7: Support & Maintenance

**Support Channels:**
- Internal: Clinic manager is first point of contact
- Technical: Repository issues on GitHub
- Authorize.net: support.authorize.net

**Maintenance Schedule:**
- Weekly: Review transaction logs for errors
- Monthly: Product catalog updates
- Quarterly: Performance review and optimization
- Annually: Security audit

**Escalation Path:**
1. Front desk staff → Clinic manager
2. Clinic manager → Technical documentation
3. Unresolved issues → Developer contact

### A8: Training Materials

**Training Checklist:**
- [ ] System overview (15 min)
- [ ] Product selection and cart management (10 min)
- [ ] Customer lookup and creation (10 min)
- [ ] Price overrides and promo codes (10 min)
- [ ] Payment processing (10 min)
- [ ] Error handling (5 min)
- [ ] Practice transactions (20 min)

**Quick Reference Guide:**
- One-page cheat sheet
- Common errors and solutions
- Keyboard shortcuts
- Contact information

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-12 | Claude AI | Initial PRD creation |

**Review Cycle:** Quarterly
**Next Review:** 2026-02-12
**Approval:** Pending clinic manager review

---

**END OF DOCUMENT**
