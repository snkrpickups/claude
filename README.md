# ALC Point of Sale System

A Google Apps Script-based POS checkout system integrated with Authorize.net for medical clinic operations.

## ⚡ Quick Start (New!)

**Automated Setup Available!** We now have a one-click script that sets up all 7 Google Sheets in 30 seconds:

👉 **[setup-scripts/README.md](./setup-scripts/README.md)** - Automated Google Sheets setup

This script automatically:
- ✅ Creates all 7 required sheets
- ✅ Populates all 119 products
- ✅ Sets up headers and formatting
- ✅ Initializes invoice tracking
- ✅ Adds sample promo codes

**Time saved: 2-3 hours!** 🚀

## 📋 What This Solves

**Current Problems:**
- Manual credit card entry (error-prone)
- No customer tracking or LTV analysis
- Impossible to track product/category performance
- Time-consuming checkout process

**Our Solution:**
- Modern POS interface with product selection
- Automatic invoice generation
- Customer LTV tracking using Patient IDs
- Comprehensive analytics
- Authorize.net integration for secure payments
- Multi-location ready for franchising

## 📚 Documentation

1. **[MASTER_PLAN.md](./MASTER_PLAN.md)** - Complete system architecture and design
   - System architecture
   - Database schema (7 Google Sheets tabs)
   - Feature specifications
   - Security considerations
   - Multi-location scalability plan

2. **[IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)** - Step-by-step build guide
   - Phase 1: Foundation (Week 1)
   - Phase 2: Core POS Features (Week 2)
   - Phase 3: Authorize.net Integration (Week 3)
   - Phase 4: Analytics (Week 4)
   - Phase 5: Production Launch (Week 5)

3. **[QUESTIONS_TO_ANSWER.md](./QUESTIONS_TO_ANSWER.md)** - Configuration questionnaire
   - Answer these before we start building
   - Helps customize the system to your exact needs

## 🎯 Key Features

### For Receptionists
- **Fast Checkout**: Click products like a POS, no manual entry
- **Smart Pricing**: Double-click to edit prices for grandfathered patients
- **Customer Lookup**: Instantly see customer history and LTV
- **Promo Codes**: Apply discounts automatically
- **Auto-Fill**: System generates invoice numbers and descriptions

### For Management
- **Customer LTV**: Track lifetime value using Patient IDs
- **Product Analytics**: See what sells, what doesn't
- **Category Performance**: Compare Rx vs Labs vs Consult revenue
- **Transaction History**: Complete audit trail
- **Multi-Location**: Ready to scale to franchise locations

### Security & Compliance
- **PCI Compliant**: No credit card data stored (Authorize.net handles it)
- **Secure**: Google account authentication required
- **Encrypted**: Authorize.net credentials stored securely
- **Audit Trail**: All transactions logged

## 🏗️ Architecture

```
Google Apps Script Web App (Frontend)
         ↓
Google Apps Script (Backend Logic)
         ↓
Google Sheets (Database - 7 tabs)
         ↓
Authorize.net Accept Hosted (Payment Processing)
```

### Database Structure (Google Sheets)

1. **Products** - SKU catalog with pricing
2. **Transactions** - Complete transaction log
3. **Customers** - Patient ID tracking and LTV
4. **InvoiceTracking** - Sequential invoice numbers
5. **PromoCodes** - Active discount codes
6. **Locations** - Multi-site configuration
7. **Config** - System settings and API credentials

## 🚀 Getting Started

### Prerequisites
- Google Account (with Google Apps Script access)
- Authorize.net Sandbox Account ([free signup](https://developer.authorize.net/hello_world/sandbox/))
- Your product/SKU list

### Quick Start

1. **Answer the questions** in [QUESTIONS_TO_ANSWER.md](./QUESTIONS_TO_ANSWER.md)

2. **Set up Google Sheet**:
   - Create new Google Sheet: "ALC_POS_System"
   - Add 7 tabs: Products, Transactions, Customers, InvoiceTracking, PromoCodes, Locations, Config
   - Populate with your data (see Implementation Roadmap)

3. **Get Authorize.net credentials**:
   - Sign up for sandbox account
   - Get API Login ID, Transaction Key, Signature Key
   - Add to Config sheet

4. **Build the system**:
   - Follow [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) Phase 1-5
   - Or I can build it for you - just provide answers and your SKU list

5. **Test in sandbox**:
   - Use Authorize.net test card numbers
   - Verify full checkout flow
   - Test with your team

6. **Launch to production**:
   - Switch to Authorize.net production credentials
   - Train staff
   - Go live!

## 📊 Sample Workflow

**Current (Manual):**
1. Receptionist reads clipboard
2. Opens Authorize.net virtual terminal
3. Manually types CC info
4. Manually types amount
5. Manually types invoice number (SP-Rx-...)
6. Manually types description (BA - HRT (GK))
7. Manually types customer name
8. Submits payment
9. *Time: ~5 minutes, error-prone*

**New (Automated):**
1. Receptionist enters Patient ID → system shows customer LTV
2. Clicks products from catalog → added to cart
3. (Optional) Applies promo code → discount calculated
4. (Optional) Double-clicks price → edits for grandfathered patient
5. Clicks "Checkout" → redirects to Authorize.net hosted form
6. Patient enters CC info → payment processed
7. System logs everything automatically
8. *Time: <2 minutes, zero errors*

## 💰 What You Can Track

### Customer Metrics
- Lifetime Value (LTV) per patient
- Visit frequency
- Average transaction size
- Customer retention rate

### Product Metrics
- Units sold by SKU
- Revenue by product
- Most popular items
- Average selling price vs base price

### Business Metrics
- Daily/weekly/monthly revenue
- Category mix (Rx vs Labs vs Consult)
- Promo code redemption rates
- Receptionist performance

## 🔒 Security Features

- **No CC storage**: Credit cards never touch your system
- **PCI compliant**: Authorize.net handles all CC data
- **Access control**: Google account authentication
- **Encrypted credentials**: API keys stored in Script Properties
- **Audit logging**: All transactions recorded with timestamps

## 📈 Scalability (Multi-Location)

Built for franchising from day one:
- Location selector in POS interface
- Per-location Authorize.net credentials
- Location-specific product pricing
- Cross-location customer tracking
- Franchise performance dashboard

Start with one location, scale to 100+ without rebuilding.

## 🛠️ Tech Stack

- **Frontend**: Google Apps Script HTML Service (HTML/CSS/JavaScript)
- **Backend**: Google Apps Script (JavaScript)
- **Database**: Google Sheets (7 tabs)
- **Payment**: Authorize.net Accept Hosted
- **Hosting**: Google Cloud (via Apps Script)
- **Cost**: $0 (all free tools!)

## 📅 Timeline

| Phase | Duration | What's Built |
|-------|----------|--------------|
| Phase 1 | 1 week | Database + basic UI |
| Phase 2 | 1 week | POS features + cart |
| Phase 3 | 1 week | Authorize.net integration |
| Phase 4 | 1 week | Analytics dashboard |
| Phase 5 | 1 week | Polish + production launch |
| **Total** | **5-6 weeks** | **Production-ready system** |

Can be accelerated with dedicated effort.

## 🎓 Training Required

**For Receptionists (30 minutes):**
- How to enter Patient ID
- How to add products to cart
- How to edit prices (double-click)
- How to apply promo codes
- How to complete checkout

**For Management (1 hour):**
- How to run reports
- How to add new products
- How to create promo codes
- How to view transaction history
- How to manage multiple locations

## 🐛 Support & Maintenance

**Common Issues:**
- Products not loading → Check sheet names
- Customer lookup failing → Verify Patient ID format
- Authorize.net errors → Check credentials in Config sheet
- Price not updating → Try refresh or clear cache

**Ongoing Maintenance:**
- Add new products as needed
- Create seasonal promo codes
- Review analytics monthly
- Backup Google Sheet (auto-versioned by Google)

## 📞 Next Steps

**Ready to build?**

1. Complete [QUESTIONS_TO_ANSWER.md](./QUESTIONS_TO_ANSWER.md)
2. Gather your SKU list
3. Create Authorize.net sandbox account
4. Let's start Phase 1!

**Have questions?**
- Review [MASTER_PLAN.md](./MASTER_PLAN.md) for detailed architecture
- Check [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) for step-by-step guide
- Ask me anything!

---

## 📝 Document Index

- **README.md** (this file) - Overview and quick start
- **MASTER_PLAN.md** - Complete system design and architecture
- **IMPLEMENTATION_ROADMAP.md** - Detailed build guide with code samples
- **QUESTIONS_TO_ANSWER.md** - Configuration questionnaire

---

**Built for ALC | Powered by Google Apps Script + Authorize.net**

*This system will transform your checkout process from error-prone manual entry to a streamlined, data-driven POS that scales with your franchise growth.*
