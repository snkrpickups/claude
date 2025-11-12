# Single-File Deployment Guide

## ⚡ Deploy Your POS System in 5 Minutes (One File Only!)

This guide uses **AllInOneDeployment.gs** - a single consolidated file containing ALL backend and frontend code.

**No need to copy 19 files!** Just one paste operation.

---

## 📋 Step-by-Step Instructions

### Step 1: Open Your Google Sheet
1. Go to your sheet: https://docs.google.com/spreadsheets/d/10_VtotlcWfRSApBvRgVDR6WzN_drx_rSa6DxoJnmWEU/edit
2. Make sure you're logged into your Google account

### Step 2: Open Apps Script Editor
1. In your sheet, click **Extensions** > **Apps Script**
2. You'll see a default `Code.gs` file with some placeholder code

### Step 3: Replace with AllInOneDeployment Code
1. Open `setup-scripts/AllInOneDeployment.gs` from this repository
2. **Copy ALL the code** (Ctrl+A, Ctrl+C)
3. Go back to Apps Script editor
4. **Select all default code** in Code.gs (Ctrl+A)
5. **Delete it** (Delete key)
6. **Paste AllInOneDeployment.gs code** (Ctrl+V)
7. Click **Save** 💾 (or Ctrl+S)
8. Rename the project to "ALC POS System" (click "Untitled project" at top)

### Step 4: Deploy as Web App
1. Click **Deploy** > **New deployment** (top right)
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Fill in the settings:
   - **Description**: "ALC POS System v1.0"
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone with Google account**
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** → **Go to ALC POS System (unsafe)** → **Allow**
9. Copy the **Web app URL** (looks like: https://script.google.com/macros/s/.../exec)
10. **Save this URL** - this is your POS system!

### Step 5: Test Your Deployment
1. Open the Web app URL in a new tab
2. You should see the POS interface
3. Try:
   - Selecting a category filter
   - Clicking a product to add to cart
   - Entering a Patient ID (format: JF123456)

---

## ✅ What This Single File Contains

The `AllInOneDeployment.gs` file consolidates:

### Backend Services (12 files combined):
- ✅ Code.gs (main entry point + getCurrentUser)
- ✅ Config.gs (configuration management)
- ✅ Validator.gs (Patient ID validation)
- ✅ ProductService.gs (119 SKU management)
- ✅ CustomerService.gs (LTV tracking)
- ✅ LocationService.gs (multi-location support)
- ✅ InvoiceService.gs (LOC-000001 generation)
- ✅ PromoCodeService.gs (discount codes)
- ✅ TransactionService.gs (transaction logging)
- ✅ AuthNetService.gs (Authorize.net integration)
- ✅ AnalyticsService.gs (reporting)
- ✅ CheckoutService.gs (complete checkout flow)

### Frontend Templates (7 files embedded as strings):
- ✅ index.html (main layout)
- ✅ styles.html (complete CSS)
- ✅ customer.html (Patient ID lookup)
- ✅ cart.html (shopping cart)
- ✅ checkout.html (payment)
- ✅ scripts.html (900+ lines of JavaScript)

---

## 🔧 How It Works

Instead of separate `.html` files, the templates are embedded as JavaScript functions:

```javascript
function getIndexHTML() {
  return `<!DOCTYPE html>...`;
}

function getStylesHTML() {
  return `<style>...`;
}

function include(filename) {
  const htmlMap = {
    'styles': getStylesHTML(),
    'customer': getCustomerHTML(),
    'cart': getCartHTML(),
    'checkout': getCheckoutHTML(),
    'scripts': getScriptsHTML()
  };
  return htmlMap[filename] || '';
}
```

When you access the web app:
1. `doGet()` runs
2. Calls `HtmlService.createTemplateFromFile('index')`
3. `getIndexHTML()` returns the HTML string
4. Template engine processes `<?!= include('styles'); ?>`
5. `include()` returns the embedded styles
6. Complete page is assembled and served

---

## 🎯 Next Steps After Deployment

### 1. Run Setup Script (If Sheet is Empty)
If your sheet doesn't have the 7 tabs yet:
1. In Apps Script editor, select function: **`setupDataSheets`** from dropdown
2. Click **Run** ▶️
3. This will create all 7 tabs with sample data

### 2. Add Authorize.net Credentials
1. Go to **Locations** tab in your sheet
2. Row 2, columns I, J, K (highlighted yellow)
3. Replace with your actual credentials from sandbox.authorize.net:
   - Column I: API Login ID
   - Column J: Transaction Key
   - Column K: Signature Key

### 3. Review Configuration
1. Go to **Config** tab
2. Verify settings:
   - DEFAULT_LOCATION: LOC-001
   - PATIENT_ID_REGEX: ^[A-Z]{2}\d{6}$
   - ENABLE_SPLIT_PAYMENT: TRUE
   - Provider list (row 7)

### 4. Test Complete Checkout Flow
1. Open your web app URL
2. Select a product
3. Enter Patient ID: JF123456 (new customer)
4. Fill in name
5. Select Provider (BA, DR, JN, etc.)
6. Click "Process Payment"
7. You'll be redirected to Authorize.net Accept Hosted
8. Use test card: 4111111111111111
9. Complete payment
10. Check **Transactions** tab for logged transaction
11. Check **Customers** tab for LTV tracking

---

## 🔄 Updating the Code

If you need to make changes:

### Option 1: Edit in Apps Script
1. Open Apps Script editor
2. Find the function you want to modify
3. Make changes
4. Save
5. No need to redeploy unless you changed deployment settings

### Option 2: Update from Repository
1. Get latest code from `setup-scripts/AllInOneDeployment.gs`
2. Copy entire file
3. Replace all code in Apps Script editor
4. Save

---

## ❓ Troubleshooting

### "Script function not found: doGet"
**Solution:** Make sure you saved the file (Ctrl+S) and wait a few seconds for Apps Script to compile

### Web app shows blank page
**Solution:**
1. Check Apps Script logs: View > Executions
2. Look for errors
3. Make sure all code was pasted correctly

### "Cannot find method getSheetByName"
**Solution:**
1. Make sure your sheet has the 7 tabs (Products, Transactions, Customers, etc.)
2. Run `setupDataSheets()` function to create them

### Products not showing
**Solution:**
1. Check **Products** sheet has data
2. Run `setupDataSheets()` to populate 119 products
3. Check browser console (F12) for JavaScript errors

### Authorize.net integration fails
**Solution:**
1. Verify credentials in **Locations** tab (columns I, J, K)
2. Check if using sandbox or production endpoint
3. Review AuthNetService.gs section for correct endpoint URL

---

## 💡 Benefits of Single-File Deployment

✅ **One paste operation** instead of 19 file copies
✅ **Easier to maintain** - all code in one place
✅ **Faster updates** - copy/paste entire file to update
✅ **No file management** - no need to track which files are where
✅ **Version control friendly** - one file to track changes

---

## 📊 File Size

- **AllInOneDeployment.gs**: ~1,300 lines
- Contains everything you need
- No additional files required
- No dependencies

---

## 🎉 You're Done!

Once deployed, you have a **complete POS system** with:
- 119 products across 17 categories
- Patient ID validation (JF123456 format)
- Customer LTV tracking
- Invoice generation (LOC-000001 format)
- Price overrides (Grandfathered, F&F)
- Split payment support (Cash + Card)
- Promo codes
- Authorize.net integration
- Multi-location ready
- Complete analytics

**Total time saved**: 2-3 hours of tedious file copying!

---

**Questions?** Check the logs in Apps Script (View > Executions) or review the main DEPLOYMENT.md guide!
