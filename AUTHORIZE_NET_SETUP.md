# 🔐 Authorize.net Setup Guide

## The Error You're Seeing

```
Checkout failed: Error: Failed to get payment token:
User authentication failed due to invalid authentication values.
```

This means your **Authorize.net credentials are not set up** in the Locations sheet yet.

---

## ✅ Quick Fix (5 minutes)

### Step 1: Get Your Authorize.net Credentials

#### For SANDBOX Testing (Recommended First):
1. Go to **https://sandbox.authorize.net**
2. Login (or create a free sandbox account)
3. Click **Account** → **Settings** → **API Credentials & Keys**
4. Note your **API Login ID** (looks like: 5KP3u95bQpv)
5. Click **New Transaction Key**
6. Copy the **Transaction Key** (shown only once!)
7. Save both values somewhere safe

#### For PRODUCTION (Live Payments):
1. Go to **https://account.authorize.net**
2. Login to your production account
3. Click **Account** → **Settings** → **API Credentials & Keys**
4. Note your **API Login ID**
5. Generate a **New Transaction Key**
6. Copy both values

⚠️ **IMPORTANT**: Never mix sandbox credentials with production environment or vice versa!

---

### Step 2: Enter Credentials in Your Google Sheet

1. Open your sheet: https://docs.google.com/spreadsheets/d/10_VtotlcWfRSApBvRgVDR6WzN_drx_rSa6DxoJnmWEU/edit
2. Go to the **Locations** tab (bottom tabs)
3. Find row 2 (LOC-001)
4. Enter your credentials:

   | Column | Header | What to Enter | Example |
   |--------|--------|---------------|---------|
   | **I** | AuthNet_API_Login | Your API Login ID | 5KP3u95bQpv |
   | **J** | AuthNet_TransKey | Your Transaction Key | 37dP8Tn3Bp2z9w5K |
   | **K** | AuthNet_SignatureKey | Leave blank for now | (optional) |
   | **L** | Environment | SANDBOX or PRODUCTION | SANDBOX |

5. **Save the sheet** (it auto-saves, but wait a few seconds)

---

### Step 3: Test Your Connection

1. In your sheet, go to **Extensions** → **Apps Script**
2. Copy the diagnostic script from `setup-scripts/DiagnoseAuthNet.gs`
3. Create a new file in Apps Script (File → New → Script file)
4. Name it "DiagnoseAuthNet"
5. Paste the code
6. Save (Ctrl+S)
7. Select function: **`diagnoseAuthNetSetup`** from dropdown
8. Click **Run** ▶️
9. Check the **Execution log** (View → Executions)
10. It will show you if credentials are set up correctly

Then test the connection:
1. Select function: **`testAuthNetConnection`** from dropdown
2. Click **Run** ▶️
3. Check the **Execution log**
4. You should see: ✅ SUCCESS! Credentials are valid!

---

### Step 4: Try Checkout Again

1. Go back to your POS web app
2. Refresh the page (F5)
3. Add a product to cart
4. Enter a Patient ID (e.g., JF123456)
5. Complete checkout
6. Should now redirect to Authorize.net payment page!

---

## 🧪 Testing with Sandbox

When using **SANDBOX** environment:
- Use test credit cards (real cards will NOT work in sandbox!)
- Test Card: **4111 1111 1111 1111**
- Expiration: Any future date (e.g., 12/2028)
- CVV: Any 3 digits (e.g., 123)
- Zip: Any 5 digits (e.g., 12345)

Other test cards:
- **Visa**: 4007000000027
- **Mastercard**: 5424000000000015
- **Amex**: 370000000000002
- **Discover**: 6011000000000012

---

## 🔍 Troubleshooting

### Error: "User authentication failed"
**Cause**: Credentials are incorrect or not entered
**Fix**:
1. Double-check API Login ID and Transaction Key
2. Make sure there are no extra spaces
3. Verify you copied the full value
4. Run `diagnoseAuthNetSetup()` to check

### Error: "The merchant login ID or password is invalid"
**Cause**: Using production credentials with SANDBOX endpoint (or vice versa)
**Fix**:
1. Check column L (Environment) matches your credentials
2. If you have sandbox credentials, set Environment to "SANDBOX"
3. If you have production credentials, set Environment to "PRODUCTION"

### Credentials look correct but still failing
**Cause**: Transaction Key may have expired or been regenerated
**Fix**:
1. Go back to Authorize.net dashboard
2. Generate a **NEW Transaction Key**
3. Update column J in Locations sheet
4. Try again

### Can't find Locations sheet
**Cause**: Setup script hasn't been run yet
**Fix**:
1. Go to Apps Script editor
2. Find the `AllInOneDeployment.gs` file
3. Look for function: `setupDataSheets()`
4. Select it from dropdown
5. Click Run ▶️
6. This will create all 7 required sheets

---

## 📊 Visual Guide: Where to Enter Credentials

```
Locations Sheet - Row 2 (LOC-001)
┌────┬─────┬──────┬─────────┬──────┬───────┬─────┬────────┬─────────────┬────────────────┬──────────────────┬─────────────┐
│ A  │  B  │  C   │    D    │  E   │   F   │  G  │   H    │      I      │       J        │        K         │      L      │
├────┼─────┼──────┼─────────┼──────┼───────┼─────┼────────┼─────────────┼────────────────┼──────────────────┼─────────────┤
│LOC │ LOC │ Main │ 123 St  │ City │ State │ Zip │  TRUE  │ 5KP3u95bQpv │ 37dP8Tn3Bp2z...│ (leave blank)    │  SANDBOX    │
│-001│     │Office│         │      │       │     │        │     ↑       │       ↑        │                  │      ↑      │
└────┴─────┴──────┴─────────┴──────┴───────┴─────┴────────┴─────────────┴────────────────┴──────────────────┴─────────────┘
                                                             API Login    Transaction Key                     Environment
                                                                ID
```

Enter your credentials in the highlighted columns (I, J, L).

---

## 🎯 Quick Checklist

Before trying checkout again:

- [ ] Created Authorize.net sandbox account (or have production account)
- [ ] Got API Login ID from Authorize.net dashboard
- [ ] Generated Transaction Key from Authorize.net dashboard
- [ ] Opened my Google Sheet's Locations tab
- [ ] Entered API Login ID in column I, row 2
- [ ] Entered Transaction Key in column J, row 2
- [ ] Set Environment to "SANDBOX" in column L, row 2
- [ ] Saved the sheet (waited for auto-save)
- [ ] Ran `diagnoseAuthNetSetup()` to verify (optional)
- [ ] Ran `testAuthNetConnection()` to test (optional)
- [ ] Refreshed the POS web app
- [ ] Ready to test checkout!

---

## 🚀 After Successful Setup

Once credentials are working:
1. Test transactions will appear in your Authorize.net sandbox dashboard
2. All transactions are logged in the **Transactions** sheet
3. Customer LTV is tracked in the **Customers** sheet
4. Invoice numbers increment in the **InvoiceTracking** sheet

---

## 💡 Pro Tips

1. **Use Sandbox First**: Always test with sandbox before going live
2. **Rotate Keys Regularly**: Change Transaction Keys every 3-6 months for security
3. **Never Commit Credentials**: Don't share your sheet publicly with credentials in it
4. **Multiple Locations**: When you add more locations, enter separate credentials for each in the Locations sheet
5. **Production Checklist**: Before switching to PRODUCTION, test thoroughly in SANDBOX

---

## 📞 Still Having Issues?

If you've followed all steps and still getting errors:

1. Check Apps Script **Execution log**:
   - In Apps Script editor → View → Executions
   - Look for detailed error messages

2. Check Browser Console:
   - In POS web app, press F12
   - Go to Console tab
   - Look for JavaScript errors

3. Verify Sheet Structure:
   - Make sure all 7 sheets exist (Products, Transactions, Customers, InvoiceTracking, PromoCodes, Locations, Config)
   - Run `setupDataSheets()` if any are missing

4. Test Credentials Manually:
   - Go to Authorize.net dashboard
   - Test a transaction manually
   - Verify the account is active

---

**Next**: Once Authorize.net is working, see SINGLE_FILE_DEPLOYMENT.md for full system guide!
