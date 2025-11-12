# Google Sheets Automated Setup Script

## 🚀 One-Click Setup for ALC POS System

This script **automatically creates and populates all 7 Google Sheets** needed for your POS system in **30 seconds**.

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Create New Google Sheet
1. Go to https://sheets.google.com
2. Click **+ Blank** to create new spreadsheet
3. Rename it to: `ALC_POS_System`

### Step 2: Open Apps Script
1. In your sheet, click **Extensions** > **Apps Script**
2. You'll see a default `Code.gs` file with some code

### Step 3: Replace with Setup Script
1. **Delete all the default code** in Code.gs
2. Open the file `SetupGoogleSheets.gs` from this folder
3. **Copy all the code** (Ctrl+A, Ctrl+C)
4. **Paste into Code.gs** in Apps Script (Ctrl+V)
5. Click the **Save** icon 💾 (or Ctrl+S)

### Step 4: Run the Setup
1. At the top, select function: **`setupALCPOSSystem`** from dropdown
2. Click the **Run** button ▶️
3. You'll see "Authorization required" popup
4. Click **Review permissions**
5. Choose your Google account
6. Click **Advanced**
7. Click **Go to Untitled project (unsafe)**
8. Click **Allow**

### Step 5: Wait for Completion
- Script will run for 30-60 seconds
- You'll see a success popup when done
- Check execution log: **View** > **Logs** to see progress

### Step 6: Verify Setup
1. Go back to your Google Sheet
2. You should now see **7 tabs** at the bottom:
   - Products (with 119 products!)
   - Transactions (empty)
   - Customers (empty)
   - InvoiceTracking (initialized)
   - PromoCodes (3 sample codes)
   - Locations (1 location ready)
   - Config (all settings)

---

## ✅ What This Script Does

### Automatically Creates:
- ✅ All 7 required sheets
- ✅ Proper headers for each sheet
- ✅ **119 products** fully populated
- ✅ Invoice tracking initialized (starts at 0)
- ✅ 3 sample promo codes (WELCOME10, FIRST50, SUMMER25)
- ✅ 1 location template (ready for your Auth.net credentials)
- ✅ Complete configuration with all settings

### Formatting:
- ✅ Bold blue headers on all sheets
- ✅ Frozen header rows
- ✅ Auto-sized columns
- ✅ Highlighted cells that need your input

---

## 🎯 After Running the Script

### You Need To Do:

**1. Add Authorize.net Credentials** (Required)
- Go to **Locations** tab
- Row 2, columns I, J, K are highlighted in yellow
- Replace with your actual credentials from sandbox.authorize.net:
  - Column I: API Login ID
  - Column J: Transaction Key
  - Column K: Signature Key

**2. Review Products** (Optional)
- Go to **Products** tab
- All 119 products are loaded
- Adjust prices if needed
- Add/remove products as needed

**3. Customize Config** (Optional)
- Go to **Config** tab
- Update provider list (row 7) if you have different initials
- Update company name (row 9) if needed
- Adjust other settings as needed

---

## 📋 What Gets Created

### Products Sheet (119 rows)
```
SKU                    | Category      | ItemName                | Duration  | BasePrice | Active | Notes
WL-SEM-O-10WK         | Weight Loss   | Semaglutide Oral...     | 10 weeks  | 850       | TRUE   |
HRT-M-TEST-10WK       | HRT Male      | Testosterone...         | 10 weeks  | 420       | TRUE   |
... (117 more products)
```

### Transactions Sheet (Empty, ready for data)
```
TransactionID | Timestamp | InvoiceNumber | CustomerID | CustomerName | ... (20 columns total)
(empty - will fill as transactions are processed)
```

### Customers Sheet (Empty, ready for data)
```
CustomerID | PatientID | FirstName | LastName | Email | Phone | ... (11 columns total)
(empty - will fill as customers check out)
```

### InvoiceTracking Sheet (Initialized)
```
LocationID | LocationCode | LastNumber | CurrentFormat
LOC-001    | LOC          | 0          | LOC-000000
```

### PromoCodes Sheet (3 samples)
```
PromoCode  | DiscountType | DiscountValue | Active | StartDate  | EndDate    | ...
WELCOME10  | Percentage   | 10            | TRUE   | Today      | +1 year    | ...
FIRST50    | Fixed        | 50            | TRUE   | Today      | +1 year    | ...
SUMMER25   | Percentage   | 25            | FALSE  | Today      | +1 year    | ...
```

### Locations Sheet (1 template)
```
LocationID | LocationCode | LocationName | ... | AuthNetAPILogin        | AuthNetTransKey        | ...
LOC-001    | LOC          | Main Clinic  | ... | PASTE_API_LOGIN_HERE   | PASTE_TRANS_KEY_HERE  | ...
                                                 ↑ Highlighted in yellow - needs your input
```

### Config Sheet (10 settings)
```
ConfigKey                 | ConfigValue              | Description
DEFAULT_LOCATION          | LOC-001                  | Default location for POS
PATIENT_ID_REGEX          | ^[A-Z]{2}\d{6}$          | Patient ID format validation
ENABLE_SPLIT_PAYMENT      | TRUE                     | Allow cash + card splits
... (7 more settings)
```

---

## 🔧 Testing Your Setup

After the script runs, you can test it:

### Test Function 1: Verify All Sheets
1. In Apps Script, select function: **`testSetupComplete`**
2. Click **Run** ▶️
3. Check **View** > **Logs**
4. Should see: `✅ All sheets present and ready!`

### Manual Verification
Go through each tab and verify:
- ✅ **Products**: Should have 119 rows of products
- ✅ **Transactions**: Headers only (will fill during use)
- ✅ **Customers**: Headers only (will fill during use)
- ✅ **InvoiceTracking**: One row with LOC-001 starting at 0
- ✅ **PromoCodes**: 3 sample promo codes
- ✅ **Locations**: 1 location with placeholders for Auth.net
- ✅ **Config**: 10 configuration rows

---

## ❓ Troubleshooting

### "Script function not found: setupALCPOSSystem"
**Solution:** Make sure you copied the entire script into Code.gs and saved it (Ctrl+S)

### "Authorization required"
**Solution:** This is normal! Click "Review permissions" and allow the script to access your sheets

### "Cannot find method getSheetByName"
**Solution:** Make sure you're running this in Google Apps Script (Extensions > Apps Script), not in the sheet itself

### Script runs but sheets are empty
**Solution:**
1. Check Apps Script logs: View > Logs
2. Look for any error messages
3. Make sure you selected `setupALCPOSSystem` function before clicking Run

### Some products missing
**Solution:** The script should create all 119 products. If some are missing, run the script again (it will overwrite and fix)

---

## 🔄 Re-Running the Script

**Can I run it again?**
YES! The script is designed to be re-runnable:
- It will **clear existing sheets** and recreate them
- Your manual edits will be **overwritten**
- Use this if you want to reset to defaults

**To preserve your data:**
- Make a copy of your sheet first (File > Make a copy)
- Or manually edit the sheets instead of re-running

---

## ⏱️ Time Savings

**Manual Setup:** 2-3 hours (tedious!)
- Create 7 tabs
- Type headers for each
- Copy/paste 119 products
- Set up config manually
- Format everything

**With This Script:** 30 seconds ⚡
- One click
- Everything automated
- Perfect formatting
- No mistakes

**You save:** 2-3 hours of boring work!

---

## 📝 Next Steps

After running this script successfully:

1. ✅ Add your Authorize.net credentials (Locations tab)
2. ✅ Review and adjust products/prices if needed
3. ✅ Continue with **Step 2** in DEPLOYMENT.md (Set Up Apps Script with backend code)
4. ✅ Copy all the backend .gs files (Code.gs, ProductService.gs, etc.)
5. ✅ Copy all the frontend .html files
6. ✅ Deploy your web app
7. ✅ Test and go live!

---

## 💡 Tips

- **Backup:** File > Make a copy before making major changes
- **Version History:** File > Version history to see all changes
- **Collaboration:** Share with team members (click Share button)
- **Protection:** Protect sheets you don't want edited (Data > Protect sheets and ranges)

---

## 🎉 Success!

Once you see all 7 tabs with data, you're ready to continue with the deployment!

The hardest part (data entry) is now done. The rest is just copy/pasting code!

**Time saved:** 2-3 hours ⏰
**Effort saved:** Massive! 🚀
**Errors prevented:** All of them! ✅

---

**Questions?** Check the main DEPLOYMENT.md guide or review the script comments for details!
