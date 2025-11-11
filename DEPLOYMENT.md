# ALC POS System - Complete Deployment Guide

**From Zero to Production in 2 Hours**

---

## 📋 Prerequisites

Before you begin, gather:

1. **Google Account** with access to Google Sheets and Apps Script
2. **Authorize.net Sandbox Account** (free): https://developer.authorize.net/hello_world/sandbox/
3. **Your Product List** (119 SKUs provided in `data/products.json`)
4. **2 hours** of focused time

---

## 🚀 Quick Start (Step-by-Step)

### STEP 1: Create Google Sheet (20 minutes)

**1.1 Create Spreadsheet**
- Go to https://sheets.google.com
- Click **+ Blank**
- Rename to: `ALC_POS_System`

**1.2 Create Tabs**

Create 7 tabs (click + at bottom):
1. Products
2. Transactions
3. Customers
4. InvoiceTracking
5. PromoCodes
6. Locations
7. Config

**1.3 Set Up Products Tab**

Row 1 headers:
```
SKU | Category | ItemName | Duration | BasePrice | Active | Notes
```

Then copy/paste all 119 products from `SETUP_GUIDE.md` (starts at line 55)

Or import from `data/products.json` using:
- File > Import > Upload > Select JSON file
- Import location: Append to current sheet

**1.4 Set Up Other Tabs**

Follow the detailed schema in `SETUP_GUIDE.md` for:
- Transactions (empty, just headers)
- Customers (empty, just headers)
- InvoiceTracking (add initial row: `LOC-001 | LOC | 0 | LOC-000000`)
- PromoCodes (add sample: `WELCOME10 | Percentage | 10 | TRUE | 2025-01-01 | 2025-12-31 | 1000 | 0 | ALL |`)
- Locations (add your location with Authorize.net credentials)
- Config (copy all config rows from SETUP_GUIDE.md)

---

### STEP 2: Set Up Google Apps Script (30 minutes)

**2.1 Open Apps Script**
- In your Google Sheet: Extensions > Apps Script
- Delete default code in Code.gs

**2.2 Create File Structure**

Click **+** next to Files and create these **12 backend files**:
1. Code.gs
2. Config.gs
3. Validator.gs
4. ProductService.gs
5. CustomerService.gs
6. LocationService.gs
7. InvoiceService.gs
8. PromoCodeService.gs
9. TransactionService.gs
10. AuthNetService.gs
11. AnalyticsService.gs
12. CheckoutService.gs

**2.3 Create HTML Files**

Create these **7 frontend files** (use .html extension):
1. index.html
2. styles.html
3. customer.html
4. cart.html
5. checkout.html
6. scripts.html

**2.4 Copy Code**

Copy the code from the corresponding files in `apps-script/` folder:
- For backend: Copy from `apps-script/*.gs`
- For frontend: Copy from `apps-script/html/*.html`

**IMPORTANT:** Make sure to use the **exact file names** as shown above!

---

### STEP 3: Get Authorize.net Credentials (15 minutes)

**3.1 Create Sandbox Account**
1. Go to: https://developer.authorize.net/hello_world/sandbox/
2. Click **Get Sandbox Account**
3. Fill in your info
4. Verify email

**3.2 Get API Credentials**
1. Log in to: https://sandbox.authorize.net/
2. Go to: **Account** > **Settings** > **API Credentials & Keys**
3. Copy these three values:
   - API Login ID
   - Transaction Key (click "Generate New" if needed)
   - Signature Key (click "Get New Key")

**3.3 Add to Google Sheet**
1. Go to **Locations** tab in your Google Sheet
2. Row 2 (your location):
   - Column I: Paste API Login ID
   - Column J: Paste Transaction Key
   - Column K: Paste Signature Key
   - Column L: Ensure it says `SANDBOX`

---

### STEP 4: Deploy Web App (10 minutes)

**4.1 Test Setup First**
1. In Apps Script, go to Code.gs
2. Select function: `testSetup`
3. Click **Run** ▶️
4. Click **Review permissions** > Choose your account
5. Click **Advanced** > **Go to ALC_POS_System (unsafe)**
6. Click **Allow**
7. Check **Execution log** (View > Logs)
   - Should show: "All Tests Passed!"

**4.2 Deploy**
1. Click **Deploy** > **New deployment**
2. Click gear icon ⚙️ > Select **Web app**
3. Settings:
   - Description: `ALC POS v1.0`
   - Execute as: **Me**
   - Who has access: **Anyone** (or specific people in your org)
4. Click **Deploy**
5. **Copy the Web app URL** (looks like: https://script.google.com/...)
6. **Bookmark this URL** - this is your POS!

---

### STEP 5: First Test Transaction (15 minutes)

**5.1 Open POS**
- Open the Web app URL from Step 4

**5.2 Verify Loading**
You should see:
- Your name in top right
- 119 products loading
- Category filters (All, Weight Loss, HRT Male, etc.)
- Empty cart on right

**5.3 Test Simple Checkout**

1. **Enter Patient ID:** JF123456
2. Click **Lookup Customer**
3. Should show "New customer" form
4. Fill in:
   - First Name: John
   - Last Name: Test
5. **Select Provider:** BA
6. **Add Product:** Click "Initial Consult" ($150)
7. Cart should show: $150.00
8. Click **Process Payment**
9. Should redirect to Authorize.net hosted form

**5.4 Complete Test Payment**

Use Authorize.net test card:
- Card Number: `4111111111111111`
- Expiration: `12/2029`
- CVV: `123`

Click **Pay**

**5.5 Verify Transaction**
1. Go back to Google Sheet
2. Check **Transactions** tab
   - Should have new row with invoice LOC-000001
3. Check **Customers** tab
   - Should have John Test with LTV $150
4. Check **InvoiceTracking** tab
   - LastNumber should be 1

✅ **Success! Your POS is working!**

---

### STEP 6: Test Advanced Features (20 minutes)

**Test 2: Price Override**
1. Add HRT-M-TEST-10WK ($420) to cart
2. Double-click the price in cart
3. Click **Grandfathered** button
4. Price should change to ~$336 (80% of $420)
5. Checkout and verify

**Test 3: Promo Code**
1. Add WL-SEM-I-10WK ($1000) to cart
2. Enter promo code: `WELCOME10`
3. Click **Apply**
4. Should show: -$100 discount
5. Total: $900

**Test 4: Split Payment**
1. Add items totaling $500
2. Select **Cash + Card Split**
3. Enter Cash Amount: $200
4. Card Amount should auto-fill: $300
5. Proceed to checkout (card portion goes to Authorize.net)

**Test 5: Returning Customer**
1. Enter Patient ID: JF123456 (from Test 1)
2. Click Lookup
3. Should show: John Test, LTV: $150.00, Visits: 1
4. Add items and checkout
5. Verify LTV increases in Customers tab

---

### STEP 7: Train Your Team (30 minutes)

**Create Training Checklist:**

✅ How to open POS (bookmark URL)
✅ How to enter Patient ID (format: JF123456)
✅ How to select Provider (dropdown)
✅ How to search products (type in search box)
✅ How to filter by category (click category buttons)
✅ How to add products (click product cards)
✅ How to remove from cart (click × button)
✅ How to override price (double-click price, use Grandfathered/F&F)
✅ How to apply promo codes
✅ How to handle split payments
✅ How to email receipt (check box, enter email)
✅ What to do if payment fails (retry, or collect cash)

**Run Mock Transactions:**
- Have each receptionist complete 3-5 test transactions
- Use test card numbers (don't use real cards in sandbox!)
- Verify they understand the full workflow

---

### STEP 8: Go Live in Production (15 minutes)

**8.1 Get Production Credentials**
1. Log in to your **PRODUCTION** Authorize.net account
2. Get production API credentials (same process as sandbox)

**8.2 Update Google Sheet**
1. Go to **Locations** tab
2. Row 2 (your location):
   - Update API Login ID (production)
   - Update Transaction Key (production)
   - Update Signature Key (production)
   - **Change Column L from `SANDBOX` to `PRODUCTION`**

**8.3 Deploy New Version**
1. In Apps Script: **Deploy** > **Manage deployments**
2. Click ✏️ Edit
3. Update version description: `v1.0 - Production`
4. Click **Deploy**

**8.4 Test with Real Card**
1. Do ONE real transaction with a real card (small amount)
2. Verify it appears in your Authorize.net dashboard
3. Verify transaction logged in Google Sheet

✅ **You're Live!**

---

## 📊 Daily Operations

### Morning Routine
- [ ] Open POS bookmark
- [ ] Verify you see products loading
- [ ] Check Authorize.net dashboard (no issues)

### During Day
- Process checkouts as normal
- If Authorize.net is down: Can still log transactions manually

### End of Day
- [ ] Open **Transactions** tab in Google Sheet
- [ ] Sum Total column for daily revenue
- [ ] Check for any "Pending" payments (follow up)

---

## 🔧 Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| Products not loading | Check Products sheet name is exactly "Products" |
| Customer lookup fails | Verify Patient ID format (2 letters + 6 digits) |
| Authorize.net error | Check credentials in Locations sheet, verify Environment |
| Invoice number not incrementing | Check InvoiceTracking sheet, verify location ID matches |
| Price won't edit | Check Config: ENABLE_PRICE_OVERRIDE should be TRUE |
| Promo code invalid | Check PromoCodes sheet: Active=TRUE, dates are valid |
| Split payment not calculating | Ensure ENABLE_SPLIT_PAYMENT = TRUE in Config |

---

## 📈 Analytics & Reporting

### View Daily Sales
1. Go to Google Sheet > **Transactions** tab
2. Filter by today's date (Column B: Timestamp)
3. Sum Column O (Total)

### View Product Performance
1. Run: `getDashboardData()` function in Apps Script
2. Or build custom report:
   - Group by SKU (Column H: Items)
   - Count occurrences
   - Sum prices

### View Customer LTV
1. Go to **Customers** tab
2. Sort by Column J (LifetimeValue) descending
3. Top customers appear first

### Export for Advanced Analysis
1. File > Download > CSV
2. Import into Excel/Google Sheets
3. Create pivot tables, charts, etc.

---

## 🌐 Multi-Location Setup

### Adding Franchise Location

**1. Add to Locations Sheet**
```
LOC-002 | LOC1 | Franchise Name | Address | City | State | Zip | TRUE | [API_LOGIN] | [TRANS_KEY] | [SIG_KEY] | PRODUCTION
```

**2. Add to InvoiceTracking Sheet**
```
LOC-002 | LOC1 | 0 | LOC1-000000
```

**3. Deploy**
- Franchise locations can now select their location from dropdown
- Each location gets own invoice sequence (LOC1-000001, LOC1-000002...)
- Each location uses their own Authorize.net account

---

## 🔐 Security Best Practices

✅ **DO:**
- Keep Authorize.net credentials in Locations sheet only
- Restrict Google Sheet access to authorized staff
- Regularly backup (File > Make a copy)
- Review transactions daily for anomalies
- Update prices in Products sheet as needed

❌ **DON'T:**
- Share Web app URL publicly
- Hardcode credentials in code
- Process real payments in sandbox
- Skip testing before going live
- Ignore failed transactions

---

## 🆘 Support & Help

**Check Logs:**
1. Apps Script Editor > **Executions**
2. Filter by status (Failed, Success)
3. Click on execution to see details

**Common Error Messages:**

- `"Customer not found"` → Patient ID doesn't exist, create new customer
- `"Promo code invalid"` → Check PromoCodes sheet
- `"Failed to get payment token"` → Check Authorize.net credentials
- `"Location not found"` → Check Locations sheet, verify ID

**Need More Help:**
- Review MASTER_PLAN.md for architecture details
- Review CUSTOM_REQUIREMENTS.md for your specific config
- Check SETUP_GUIDE.md for detailed setup steps

---

## 🎯 Success Metrics

After 1 week, you should see:

✅ Checkout time reduced from ~5 min to <2 min
✅ Zero invoice number conflicts
✅ All customer LTVs visible in Customers sheet
✅ Complete transaction history in Transactions sheet
✅ Team satisfaction with new system high
✅ Data entry errors near zero

After 1 month:

✅ 100+ transactions logged
✅ Product performance insights available
✅ Customer LTV trends visible
✅ Promo code effectiveness measurable
✅ Ready for multi-location rollout

---

## 🎉 Congratulations!

You've successfully deployed a production-ready POS system that will:
- Save 60% of checkout time
- Eliminate data entry errors
- Provide complete customer LTV tracking
- Enable product/category performance analysis
- Scale to multiple franchise locations

**Your checkout process is now transformed!**

---

## Next Steps

1. ✅ Train all receptionists (use training checklist above)
2. ✅ Monitor first 50 transactions closely
3. ✅ Create monthly reports from data
4. ✅ Add new products as inventory expands
5. ✅ Set up franchise locations when ready
6. ✅ Celebrate your success! 🚀

**Questions?** Review the documentation in this repository!
