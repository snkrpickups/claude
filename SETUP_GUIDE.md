# ALC POS System - Setup Guide

**Complete step-by-step instructions to deploy your POS system**

---

## Part 1: Create Google Sheet (15 minutes)

### Step 1: Create New Google Sheet

1. Go to https://sheets.google.com
2. Click **+ Blank** to create new spreadsheet
3. Rename to: **ALC_POS_System**

### Step 2: Create 7 Tabs

Rename/create these tabs at the bottom:
1. **Products** (rename Sheet1)
2. **Transactions** (click + to add)
3. **Customers** (click + to add)
4. **InvoiceTracking** (click + to add)
5. **PromoCodes** (click + to add)
6. **Locations** (click + to add)
7. **Config** (click + to add)

---

## Part 2: Set Up Each Sheet

### TAB 1: Products

**Row 1 (Headers):**
```
SKU | Category | ItemName | Duration | BasePrice | Active | Notes
```

**Copy this data starting at Row 2:**

```
WL-SEM-O-10WK	Weight Loss	Semaglutide Oral 10 weeks	10 weeks	850	TRUE
WL-SEM-I-10WK	Weight Loss	Semaglutide Injectable 10 weeks	10 weeks	1000	TRUE
WL-TIRZ-O-4WK	Weight Loss	Tirzepatide Oral 4 weeks	4 weeks	450	TRUE
WL-TIRZ-STD-2.5+5-10WK	Weight Loss	Tirzepatide Standard 2.5mg + 5mg inj 10 weeks	10 weeks	1195	TRUE
WL-TIRZ-STD-2.5-10WK	Weight Loss	Tirzepatide Standard 2.5mg inj 10 weeks	10 weeks	1195	TRUE
WL-TIRZ-HM-5-10WK	Weight Loss	Tirzepatide High Maintenance 5mg/7.5mg/10mg inj 10 weeks	10 weeks	1595	TRUE
WL-TIRZ-HM-12.5-10WK	Weight Loss	Tirzepatide High Maintenance 12.5mg inj 10 weeks	10 weeks	1895	TRUE
HRT-M-CLOMID-10WK	HRT Male	Clomid 10 weeks	10 weeks	295	TRUE
HRT-M-ENCL-10WK	HRT Male	Enclomiphene 10 weeks	10 weeks	495	TRUE
HRT-M-GONAD-10WK	HRT Male	Gonadorelin 10 weeks	10 weeks	295	TRUE
HRT-M-TEST-10WK	HRT Male	Testosterone 10 weeks	10 weeks	420	TRUE
HRT-M-TEST-GONAD-10WK	HRT Male	Testosterone + Gonadorelin 10 weeks	10 weeks	460	TRUE
HRT-M-A-10WK	HRT Male	Anastrozole 10 weeks	10 weeks	0	TRUE	Free with package
HRT-F-STD-10WK	HRT Female	Female HRT Package 10 weeks	10 weeks	435	TRUE
HRT-F-STD-S-10WK	HRT Female	Female HRT Package Surcharge	one time	50	TRUE
HRT-F-CREAM-E2	HRT Female	E2 Vaginal Cream 35ml	as needed	175	TRUE
HRT-F-PROG-10WK	HRT Female	Female HRT - Progesterone Only 10 weeks	10 weeks	295	TRUE
HRT-F-DHEA-10WK	HRT Female	Female HRT - DHEA Only 10 weeks	10 weeks	295	TRUE
PEL-MF-STD	Pellet Therapy	Male/Female Pellet (3–4 months)	3-4 months	550	TRUE
PEL-ORAL-PROG-3M	Pellet Therapy	Women's Oral Progesterone 3 months	3 months	110	TRUE
PEL-ORAL-PROG-4M	Pellet Therapy	Women's Oral Progesterone 4 months	4 months	150	TRUE
SP-MP-STRIP-20	Sexual Performance	MP Strips (#20)	package	325	TRUE
SP-MP-STRIP-30	Sexual Performance	MP Strips (#30)	package	407	TRUE
SP-MP-TAB-30	Sexual Performance	MP Tab (#30)	package	195	TRUE
SP-MP-TROCHE-10	Sexual Performance	MP Troche (#10)	package	195	TRUE
SP-PT141-10WK	Sexual Performance	PT-141 Injectable 10 weeks	10 weeks	350	TRUE
SP-TRIMIX	Sexual Performance	Trimix	as needed	195	TRUE
PEP-5AMINO-O-10WK	Peptides	5-Amino Oral 10 weeks	10 weeks	650	TRUE
PEP-BPC157-O-30D	Peptides	BPC-157 Oral 60 Count 30 days	30 days	800	TRUE
PEP-BPC157-O-60D	Peptides	BPC-157 Oral 120 Count 60 days	60 days	1000	TRUE
PEP-BPC157-I-30D	Peptides	BPC-157 Injectable 30 day	30 days	550	TRUE
PEP-BPC157-I-60D	Peptides	BPC-157 Injectable 60 day	60 days	1000	TRUE
PEP-CJC-10WK	Peptides	CJC-1295 / Ipamorelin 10 weeks	10 weeks	800	TRUE
PEP-DSIP-10WK	Peptides	DSIP 10 weeks	10 weeks	350	TRUE
PEP-GLUT-10WK	Peptides	Glutathione 10 weeks	10 weeks	325	TRUE
PEP-HGH-I-30D	Peptides	HGH (Zomacton, injectable) 30 days	30 days	1200	TRUE
PEP-IGF-LR3-10WK	Peptides	IGF-LR3 10 weeks	10 weeks	850	TRUE
PEP-LDN-10WK	Peptides	LDN 10 weeks	10 weeks	265	TRUE
PEP-LIPO-10WK	Peptides	Lipotropic 10 weeks	10 weeks	195	TRUE
PEP-NAD-I-10WK	Peptides	NAD+ Injectable 10 weeks	10 weeks	595	TRUE
PEP-NAD-B12-10WK	Peptides	NAD+ + B12 Oral 10 weeks	10 weeks	595	TRUE
PEP-PDA-10WK	Peptides	PDA 200mcg (inj/oral) 10 weeks	10 weeks	675	TRUE
PEP-PDA-O-10WK	Peptides	PDA 400mcg (inj/oral) 10 weeks	10 weeks	800	TRUE
PEP-PPS-10WK	Peptides	PPS Injectable 10 weeks	10 weeks	675	TRUE
PEP-SERM-10WK	Peptides	Sermorelin (inj/oral) 10 weeks	10 weeks	800	TRUE
COS-BOTOX-U	Cosmetic Facial	Facial Botox ($14/unit)	per unit	14	TRUE
COS-MICRO-EXO-FACE-NECK	Cosmetic Facial	Microneedling w/ Exosomes (face & neck)	per session	1000	TRUE
COS-MICRO-EXO-PACK	Cosmetic Facial	Microneedling w/ Exosomes Package (4)	package	3000	TRUE
COS-MICRO-FACE-NECK	Cosmetic Facial	Microneedling (face & neck)	per session	425	TRUE
COS-MICRO-PACK	Cosmetic Facial	Microneedling Package (3)	package	1000	TRUE
COS-VAMPIRE-FACE	Cosmetic Facial	Vampire/PRP Facial or Facelift	per session	0	TRUE	Custom pricing
COS-VAMPIRE-PACK	Cosmetic Facial	Vampire/PRP Package (3)	package	2500	TRUE
HAIR-VAMPIRE-PRP	Cosmetic Hair	Vampire/PRP Hair (per session)	per session	900	TRUE
HAIR-EXO-PRP-PACK	Cosmetic Hair	Exosomes add-on to PRP (3 PRP + 6 Exosomes)	package	4500	TRUE
HAIR-EXO-LOSS	Cosmetic Hair	Exosomes for Hair Loss	per session	1000	TRUE
HAIR-TOPICAL-30ML	Cosmetic Hair	Topical Hair Cream (30ml)	30ml	250	TRUE
COS-CREAM-E3-30	Cosmetic Creams	E3 Face Cream (30ml)	30ml	100	TRUE
COS-CREAM-E3-60	Cosmetic Creams	E3 Face Cream (60ml)	60ml	150	TRUE
COS-CREAM-TRI-30	Cosmetic Creams	Tretinoin Face Cream (30ml)	30ml	100	TRUE
IV-BASIC	IV Therapy	Basic IV	per session	99	TRUE
IV-LIPO	IV Therapy	Lipotropic Add-on	per session	20	TRUE
IV-NAD	IV Therapy	NAD+ Add-on	per session	20	TRUE
IV-GLUT	IV Therapy	Glutathione Add-on	per session	20	TRUE
PROC-PSHOT-INIT	Procedures	P-Shot Initial	per session	1900	TRUE
PROC-PSHOT-RETURN	Procedures	P-Shot Return	per session	1500	TRUE
PROC-PSHOT-RETURN2	Procedures	P-Shot Return (higher)	per session	1600	TRUE
PROC-OSHOT	Procedures	O-Shot	per session	1500	TRUE
PROC-PRP	Procedures	PRP Injection	per session	0	TRUE	Custom pricing
PROC-PROL	Procedures	Prolotherapy	per session	0	TRUE	Custom pricing
PROC-PIT	Procedures	PIT	per session	350	TRUE
PROC-PSHOT-BOTOX	Procedures	P-Shot Botox	per session	800	TRUE
COMP-FU-7M	Compassionate Care	Follow-up 7 months	7M	150	TRUE
SHIP-STANDARD	Shipping	Standard Shipping	one time	25	TRUE
SHIP-COLD	Shipping	Cold Shipping	one time	50	TRUE
CONS-INITIAL	Consult	Initial Consult	one time	150	TRUE
DEPOSIT-PELLET	Deposits	Pellet Deposit	one time	100	TRUE
DEPOSIT-PSHOT	Deposits	P Shot Deposit	one time	200	TRUE
DEPOSIT-OSHOT	Deposits	O Shot Deposit	one time	200	TRUE
DEPOSIT-MISC	Deposits	Miscellaneous Deposit	one time	0	TRUE	Custom amount
SUPPS-VITAMIN-D	Supplements	Vitamin D	one time	42	TRUE
LAB-INIT-A-M	Labs	Panel A (Male)	one time	150	TRUE
LAB-INIT-B-M	Labs	Panel B (Male)	one time	165	TRUE
LAB-INIT-A-F	Labs	Panel A (Female)	one time	150	TRUE
LAB-INIT-B-F	Labs	Panel B (Female)	one time	165	TRUE
LAB-FU-A-M	Labs	Panel A (Male)	one time	150	TRUE
LAB-FU-B-M	Labs	Panel B (Male)	one time	165	TRUE
LAB-FU-A-F	Labs	Panel A (Female)	one time	150	TRUE
LAB-FU-B-F	Labs	Panel B (Female)	one time	165	TRUE
LAB-ADD-CMP	Labs	CMP	one time	6	TRUE
LAB-ADD-CBC	Labs	CBC	one time	5	TRUE
LAB-ADD-LIPID	Labs	Lipid	one time	15	TRUE
LAB-ADD-THY	Labs	Panel C (Thyroid)	one time	45	TRUE
LAB-ADD-VITD	Labs	Panel D (Vitamin D)	one time	40	TRUE
LAB-ADD-CORT	Labs	Cortisol	one time	24	TRUE
LAB-ADD-TSH	Labs	TSH	one time	15	TRUE
LAB-ADD-IRON	Labs	Iron Panel	one time	15	TRUE
LAB-ADD-B12	Labs	Vitamin B12	one time	12	TRUE
LAB-SPEC-IGE	Labs	Allergy-IGE	one time	400	TRUE
LAB-SPEC-IGG	Labs	Sensitivity-IGG	one time	400	TRUE
LAB-SPEC-CARD-BASIC	Labs	Cardio Pro Basic	one time	199	TRUE
LAB-SPEC-CARD-ADV	Labs	Cardio Pro Advanced	one time	270	TRUE
LAB-SPEC-CARD-PLUS	Labs	Cardio Pro Advanced Plus	one time	389	TRUE
LAB-CS-ALCAT	Labs	ALCAT	one time	750	TRUE
LAB-CS-METHYL	Labs	MethylDetox Profile	one time	479	TRUE
LAB-CS-CNA	Labs	Cellular Nutrition Assay (CNA)	one time	600	TRUE
LAB-CS-MNT	Labs	Micronutrient (MNT)	one time	400	TRUE
LAB-CS-TELO	Labs	Telomere (add to CNA only)	one time	250	TRUE
LAB-CS-HIST	Labs	Histamine (add to ALCAT & CNA)	one time	400	TRUE
LAB-CARD-SVH	Labs	Smart Vascular Health	one time	275	TRUE
LAB-GEN-ADR-STRESS	Labs	Adrenal Stress Test (Saliva)	one time	250	TRUE
SP-TRIMIX-PHEN-I	Sexual Performance	Trimix & Phenylephrine	as needed	400	TRUE
HRT-F-VAGINALESTRADIOL-CREAM-70ML	HRT Female	Vaginal Estradiol	as needed	250	TRUE
WL-SEM-I-5WK	Weight Loss	Semaglutide Injectable 5wk	5 weeks	535	TRUE
WL-TIRZ-I-2.5+5-5WK	Weight Loss	Tirzepatide Standard 2.5mg + 5mg inj 5wk	5 weeks	675	TRUE
WL-TIRZ-I-2.5-5WK	Weight Loss	Tirzepatide Standard 2.5mg inj 5wk	5 weeks	675	TRUE
WL-TIRZ-HM-5-5WK	Weight Loss	Tirzepatide High Maintenance 5mg/7.5mg/10mg inj 5wk	5 weeks	800	TRUE
WL-TIRZ-HM-12.5-5WK	Weight Loss	Tirzepatide High Maintenance 12.5mg inj 5wk	5 weeks	950	TRUE
```

**TIP:** Copy from the data/products.json file or import via CSV

### TAB 2: Transactions

**Row 1 (Headers):**
```
TransactionID | Timestamp | InvoiceNumber | CustomerID | CustomerName | ProviderInitials | CollectorName | Items | Subtotal | PromoCode | Discount | PriceOverrides | CashAmount | CardAmount | Total | PaymentStatus | AuthNetTransID | LocationID | Description | EmailReceipt
```

**Leave rows 2+ empty** (will be populated by transactions)

### TAB 3: Customers

**Row 1 (Headers):**
```
CustomerID | PatientID | FirstName | LastName | Email | Phone | FirstVisit | LastVisit | TotalTransactions | LifetimeValue | Notes
```

**Leave rows 2+ empty** (will be populated when customers check out)

### TAB 4: InvoiceTracking

**Row 1 (Headers) + Initial Data:**
```
LocationID | LocationCode | LastNumber | CurrentFormat
LOC-001 | LOC | 0 | LOC-000000
```

### TAB 5: PromoCodes

**Row 1 (Headers):**
```
PromoCode | DiscountType | DiscountValue | Active | StartDate | EndDate | UsageLimit | TimesUsed | ApplicableCategories | ApplicableSkus
```

**Sample promo code (Row 2):**
```
WELCOME10 | Percentage | 10 | TRUE | 2025-01-01 | 2025-12-31 | 1000 | 0 | ALL |
```

### TAB 6: Locations

**Row 1 (Headers) + Your Location:**
```
LocationID | LocationCode | LocationName | Address | City | State | Zip | Active | AuthNetAPILogin | AuthNetTransKey | AuthNetSignatureKey | AuthNetEnvironment
LOC-001 | LOC | Main Clinic | 123 Main St | Your City | CA | 12345 | TRUE | [PASTE_SANDBOX_API_LOGIN] | [PASTE_SANDBOX_TRANS_KEY] | [PASTE_SANDBOX_SIG_KEY] | SANDBOX
```

**IMPORTANT:** Get your Authorize.net sandbox credentials from https://sandbox.authorize.net/

### TAB 7: Config

**Row 1 (Headers) + Configuration:**
```
ConfigKey | ConfigValue | Description
DEFAULT_LOCATION | LOC-001 | Default location for POS
PATIENT_ID_REGEX | ^[A-Z]{2}\d{6}$ | Patient ID format validation
ENABLE_SPLIT_PAYMENT | TRUE | Allow cash + card splits
ENABLE_EMAIL_RECEIPT | TRUE | Enable email receipt option
PRICE_OVERRIDE_REASONS | Grandfathered,F&F,Custom | Quick override reasons
PROVIDER_LIST | BA,DR,GK,JF | Available provider initials
COLLECTOR_AUTO_DETECT | TRUE | Auto-detect from Google account
COMPANY_NAME | ALC | Company name for receipts
TAX_RATE | 0 | Tax rate (0 = no tax)
CURRENCY | USD | Currency code
```

---

## Part 3: Set Up Google Apps Script (10 minutes)

### Step 1: Open Script Editor

1. In your Google Sheet, click **Extensions** > **Apps Script**
2. You'll see a default `Code.gs` file
3. Delete all the default code

### Step 2: Create File Structure

Click the **+** next to Files and create these files:

**Backend Files:**
- `Code.gs` (already exists)
- `Config.gs`
- `Validator.gs`
- `ProductService.gs`
- `CustomerService.gs`
- `InvoiceService.gs`
- `TransactionService.gs`
- `PromoCodeService.gs`
- `AuthNetService.gs`
- `AnalyticsService.gs`
- `LocationService.gs`

**Frontend Files (HTML):**
- `index.html`
- `styles.html`
- `customer.html`
- `cart.html`
- `checkout.html`
- `scripts.html`

### Step 3: Copy Code

I'll provide all the code in separate files. Copy each file's content into the corresponding Apps Script file.

---

## Part 4: Deploy Web App (5 minutes)

### Step 1: Deploy

1. Click **Deploy** > **New deployment**
2. Click gear icon ⚙️ > Select **Web app**
3. Fill in:
   - **Description:** ALC POS v1.0
   - **Execute as:** Me
   - **Who has access:** Anyone with the link (or specific people)
4. Click **Deploy**
5. Click **Authorize access**
6. Choose your Google account
7. Click **Advanced** > **Go to ALC_POS_System (unsafe)** > **Allow**
8. Copy the **Web app URL**
9. Bookmark it!

### Step 2: Test

1. Open the web app URL
2. You should see the POS interface
3. Products should load
4. Try adding items to cart

---

## Part 5: Configure Authorize.net (15 minutes)

### Step 1: Create Sandbox Account

1. Go to https://developer.authorize.net/hello_world/sandbox/
2. Click **Get sandbox account**
3. Fill in your info
4. Activate your account via email

### Step 2: Get API Credentials

1. Log into https://sandbox.authorize.net/
2. Go to **Account** > **Settings** > **API Credentials & Keys**
3. Copy these three values:
   - **API Login ID**
   - **Transaction Key** (generate new one if needed)
   - **Signature Key** (generate new one)

### Step 3: Add to Google Sheet

1. Go to **Locations** tab
2. Paste credentials into Row 2 (your location):
   - Column I: API Login ID
   - Column J: Transaction Key
   - Column K: Signature Key
3. Make sure Column L says **SANDBOX**

---

## Part 6: Test Full Checkout (10 minutes)

### Test Scenario 1: Simple Checkout

1. Open POS web app
2. Enter Patient ID: **JF123456**
3. System should show "New customer" form
4. Enter:
   - First Name: John
   - Last Name: Test
5. Select Provider: **BA**
6. Click product: **CONS-INITIAL** ($150)
7. Review cart (should show $150 total)
8. Click **Checkout**
9. Choose **Credit Card Only**
10. You should redirect to Authorize.net hosted form
11. Use test card: **4111111111111111**
    - Exp: 12/2029
    - CVV: 123
12. Click **Pay**
13. Should redirect back with success message

### Test Scenario 2: Split Payment

1. Add **WL-SEM-I-10WK** ($1000) to cart
2. Click **Checkout**
3. Choose **Cash + Card Split**
4. Enter Cash Amount: **500**
5. Card amount should auto-calc to **500**
6. Proceed with card payment for $500

### Test Scenario 3: Price Override

1. Add **HRT-M-TEST-10WK** ($420) to cart
2. Double-click on price in cart
3. Click **Grandfathered** button
4. Enter new price: **350**
5. Cart should update to $350 with indicator
6. Checkout (should charge $350)

### Test Scenario 4: Promo Code

1. Add any items totaling $500
2. Enter promo code: **WELCOME10**
3. Click **Apply**
4. Should show 10% discount (-$50)
5. Total should be $450

---

## Part 7: Train Your Team (30 minutes)

### Receptionist Training Checklist

- [ ] How to open the POS (bookmark the URL)
- [ ] How to enter Patient ID
- [ ] How to lookup returning customers
- [ ] How to add products to cart
- [ ] How to select provider (dropdown)
- [ ] How to apply promo codes
- [ ] How to override prices (Grandfathered / F&F buttons)
- [ ] How to choose payment method (card vs split)
- [ ] How to enter cash amount for split payments
- [ ] What to do if payment fails
- [ ] How to email receipt if patient requests
- [ ] How to clear cart and start over

### Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| Products not loading | Check Products sheet name is exactly "Products" |
| Customer lookup fails | Verify Patient ID format (2 letters + 6 numbers) |
| Authorize.net error | Check credentials in Locations sheet |
| Price won't edit | Make sure ENABLE_PRICE_OVERRIDE = TRUE in Config |
| Invoice number wrong | Check InvoiceTracking sheet has correct location |

---

## Part 8: Go Live (Production)

### When You're Ready

1. Get Authorize.net **production** credentials
2. Update **Locations** sheet:
   - Replace sandbox credentials with production ones
   - Change **AuthNetEnvironment** from SANDBOX to **PRODUCTION**
3. Test one more time with real card
4. Monitor first 10-20 transactions closely
5. Celebrate! 🎉

---

## Part 9: Multi-Location Setup (When Franchising)

### Adding New Location

1. Go to **Locations** sheet
2. Add new row:
   ```
   LOC-002 | LOC1 | Franchise Location 1 | Address | City | State | Zip | TRUE | [THEIR_API_LOGIN] | [THEIR_TRANS_KEY] | [THEIR_SIG_KEY] | PRODUCTION
   ```
3. Go to **InvoiceTracking** sheet
4. Add new row:
   ```
   LOC-002 | LOC1 | 0 | LOC1-000000
   ```
5. Deploy new version of web app
6. Franchise location can now select their location at login

---

## Maintenance & Support

### Daily
- Monitor transactions in Transactions sheet
- Check for errors in execution logs (Apps Script > Executions)

### Weekly
- Review analytics dashboard
- Check promo code usage
- Verify invoice number sequence is correct

### Monthly
- Backup Google Sheet (File > Make a copy)
- Review price override frequency
- Update product catalog as needed
- Add new promo codes for marketing

### As Needed
- Add new products to Products sheet
- Update provider list in Config sheet
- Add new locations for franchises
- Generate reports from analytics dashboard

---

## Need Help?

**Check these first:**
1. Apps Script logs: Apps Script Editor > Executions
2. Browser console: F12 > Console tab
3. Authorize.net sandbox dashboard: Transaction history

**Common fixes:**
- Clear browser cache
- Re-deploy web app
- Check sheet names (case-sensitive!)
- Verify API credentials

---

## Success Checklist

Setup is complete when:

- [ ] All 7 Google Sheets tabs are created and populated
- [ ] All 119 products are in Products sheet with TRUE in Active column
- [ ] Config sheet has all settings
- [ ] Locations sheet has Authorize.net sandbox credentials
- [ ] Apps Script files are created and code is pasted
- [ ] Web app is deployed and URL is bookmarked
- [ ] Test transaction completes successfully
- [ ] Team is trained on basic checkout flow
- [ ] You've celebrated building an awesome system! 🚀

---

**Estimated Total Setup Time: 1-2 hours**

**Your POS system is now ready to revolutionize your checkout process!**
