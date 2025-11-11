# Questions to Answer Before Building

Before we start Phase 1 implementation, please answer these questions to ensure the system meets your exact needs:

## 1. Staff & Access

**Q: How many receptionists will use this system?**
- [ ] Just me
- [ ] 2-5 people
- [x] 6-10 people
- [ ] More than 10

**Q: Should collector initials be:**
- [ ] Entered at login and remembered for the session
- [ ] Entered for each transaction
- [x] Auto-detected from Google account

**Your answer:** ___6-10 people, auto detected from google account____________

---

## 2. Product Configuration

**Q: Are Provider Initials (BA, DR, etc.) tied to specific products?**
- [ ] Yes - each product has a fixed provider (already in your SKU list)
- [ ] No - the provider varies based on who performed the service
- [ ] Sometimes - depends on the appointment

**Your answer:** _____No__________

**Q: How many SKUs (products) do you have in total?**
- [ ] Less than 20
- [ ] 20-50
- [ ] 50-100
- [ ] More than 100

**Your answer:** ______100 0r more_________

**Q: Do you need me to help import your existing SKU list?**
- [ ] Yes, I have it in a spreadsheet
- [ ] Yes, I have it in another format: _______________
- [ ] No, I'll enter them manually
- [ ] I need help creating the SKU list

**Your answer:** ____Yes i have it in a spreadsheet___________

---

## 3. Pricing & Discounts

**Q: Do you charge sales tax?**
- [ ] Yes - what rate? _______________% (e.g., 8.75 for 8.75%)
- [ ] No
- [ ] It varies by location

**Your answer:** ______No_________

**Q: When receptionist edits price for grandfathered patients, should the system:**
- [ ] Just apply the new price, no questions asked
- [ ] Require a reason/note (e.g., "Grandfathered pricing")
- [ ] Require manager approval
- [ ] Log it but allow it

**Your answer:** ______Put grandfathered pricing but have an option to click so they dont have to type, F&F is another option_________

**Q: For promo codes, should they:**
- [ ] Apply to cart total only
- [ ] Apply to specific products/categories only
- [ ] Either (configurable per promo code)

**Your answer:** ____Either___________

---

## 4. Payment & Refunds

**Q: Do patients ever pay in partial/installment payments?**
- [ ] No - always full payment at checkout
- [ ] Yes - sometimes split into 2+ payments
- [ ] Yes - we offer payment plans (need to track)

**Your answer:** _______Sometimes they pay cash and card, no payment plans________

**Q: How should refunds be handled?**
- [ ] Process refunds through Authorize.net separately (manual)
- [ ] Add a "Refund" button in the POS system
- [ ] Don't need refund functionality yet

**Your answer:** ______manual, seperately_________

**Q: Do you need to support payments from saved payment methods (customer profiles)?**
- [ ] No - always enter card info each time (current workflow)
- [ ] Yes - save cards for returning customers
- [ ] Maybe in the future

**Your answer:** ________Maybe in future_______

---

## 5. Customer Data

**Q: What format are your Patient IDs in?**
- Example: PAT-1234, just numbers (1234), etc.

**Your answer:** _____ex: JF123456__________

**Q: Do you have an existing customer database to import?**
- [ ] Yes - in a spreadsheet (send me a sample row)
- [ ] Yes - in another system: _______________
- [ ] No - starting fresh

**Your answer:** _________No______

**Q: Should the system send email receipts automatically?**
- [ ] Yes - to customer email on file
- [ ] Yes - but ask for email each time
- [ ] No - we'll email manually if needed
- [ ] Not yet, but maybe later

**Your answer:** ________Email only if patient wants_______

---

## 6. Invoicing

**Q: Your current invoice format is SP-Rx-XXXXX, SP-Labs-XXXXX, SP-Consult-XXXXX. What should happen when a cart has mixed items?**
- [ ] Use SP-Mixed-XXXXX (new category)
- [ ] Use the category of the highest-value item
- [ ] Create separate invoices for each category
- [ ] Other: _______________

**Your answer:** ___In order to fix this, Invoice # should just be Location Code-000001 and its a rolling count, we will categorize it by SKU ____________

**Q: Do you need to maintain your existing invoice number sequence?**
- [ ] No - start fresh at 00001 for each category
- [ ] Yes - current numbers are:
  - SP-Rx-_______________
  - SP-Labs-_______________
  - SP-Consult-_______________

**Your answer:** ___No____________

---

## 7. Reporting & Analytics

**Q: What reports do you need to run? (check all that apply)**
- [ ] Daily sales summary
- [ ] Product performance (units sold, revenue)
- [ ] Category performance (Rx vs Labs vs Consult)
- [ ] Customer LTV ranking
- [ ] Receptionist performance (who processed most transactions)
- [ ] Promo code usage
- [ ] Custom reports (describe): _______________

**Your answer:** _______All________

**Q: How often do you need to pull reports?**
- [ ] Daily
- [ ] Weekly
- [ ] Monthly
- [ ] As needed

**Your answer:** _________AS needed______

---

## 8. Multi-Location (Future)

**Q: When do you plan to franchise/expand to multiple locations?**
- [ ] Within 3 months
- [ ] 3-6 months
- [ ] 6-12 months
- [ ] 1+ years
- [ ] Not sure yet

**Your answer:** ______Within 3 months_________

**Q: Will each location:**
- [ ] Have its own Authorize.net account
- [ ] Share a single Authorize.net account (separate sub-accounts)
- [ ] Not sure yet

**Your answer:** ______They all have their own authorize accounts_________

---

## 9. Product Bundles & Packages

**Q: Do you offer any bundled services?**
- Example: "Initial Consult + Blood Panel" as a discounted package

- [ ] No - everything is sold separately
- [ ] Yes - we have bundles (list them):
  - _______________
  - _______________
- [ ] Not yet, but interested in this feature

**Your answer:** ___We have some bundles yes____________

---

## 10. Inventory Tracking

**Q: Do you need to track inventory/stock levels for physical products?**
- [ ] No - all services or unlimited stock
- [ ] Yes - for certain items (which ones?): _______________
- [ ] Not yet, but maybe later

**Your answer:** _______No________

---

## 11. Authorize.net Specifics

**Q: Do you already have an Authorize.net account?**
- [ ] Yes - production account (we'll use sandbox for testing first)
- [ ] Yes - sandbox account only
- [ ] No - need to create one
- [ ] Not sure

**Your answer:** _______Yes, i have sandbox and live account, will use sandbox first________

**Q: Do you want to use:**
- [ ] Accept Hosted (recommended - Authorize.net hosts the payment form, more secure)
- [ ] Accept.js (custom form, you style it, we handle tokens)
- [ ] Not sure - use what's best

**Your answer:** ______Accept hosted_________

---

## 12. Timeline & Launch

**Q: What's your ideal timeline to go live?**
- [ ] ASAP - within 1-2 weeks
- [ ] 3-4 weeks
- [ ] 1-2 months
- [ ] No rush - get it right

**Your answer:** _____ASAP__________

**Q: Do you want to:**
- [ ] Build it all at once, then launch
- [ ] Launch basic version first (checkout only), add features later
- [ ] Test with one receptionist first, then roll out to everyone

**Your answer:** ______Build it all_________

---

## 13. Special Requirements

**Q: Are there any other specific requirements or workflows I should know about?**

**Your answer:**
_______Description field should be, example: BA | SKU(s) | GK________
_______________
_______________

---

## 14. Current Data

**Q: Can you provide samples of:**
- [ ] Your current product/SKU list (even if incomplete)
- [ ] Example invoice numbers you've used
- [ ] Sample customer records (anonymized is fine)

**Your answer:** (attach files or paste here)

---
SKU	Category	Item Name	Duration	Price
WL-SEM-O-10WK	Weight Loss	Semaglutide Oral	10 weeks	$850.00
WL-SEM-I-10WK	Weight Loss	Semaglutide Injectable	10 weeks	$1,000.00
WL-TIRZ-O-4WK	Weight Loss	Tirzepatide Oral	4 weeks	$450.00
WL-TIRZ-STD-2.5+5-10WK	Weight Loss	Tirzepatide Standard 2.5mg + 5mg inj	10 weeks	$1,195.00
WL-TIRZ-STD-2.5-10WK	Weight Loss	Tirzepatide Standard 2.5mg inj	10 weeks	$1,195.00
WL-TIRZ-HM-5-10WK	Weight Loss	Tirzepatide High Maintenance 5mg/7.5mg/10mg inj	10 weeks	$1,595.00
WL-TIRZ-HM-12.5-10WK	Weight Loss	Tirzepatide High Maintenance 12.5mg inj	10 weeks	$1,895.00
HRT-M-CLOMID-10WK	HRT Male	Clomid	10 weeks	$295.00
HRT-M-ENCL-10WK	HRT Male	Enclomiphene	10 weeks	$495.00
HRT-M-GONAD-10WK	HRT Male	Gonadorelin	10 weeks	$295.00
HRT-M-TEST-10WK	HRT Male	Testosterone	10 weeks	$420.00
HRT-M-TEST-GONAD-10WK	HRT Male	Testosterone + Gonadorelin	10 weeks	$460.00
HRT-M-A-10WK	HRT Male	Anastrozole	10 weeks	$0.00
HRT-F-STD-10WK	HRT Female	Female HRT Package	10 weeks	$435.00
HRT-F-STD-S-10WK	HRT Female	Female HRT Package Surcharge	one time	$50.00
HRT-F-CREAM-E2	HRT Female	E2 Vaginal Cream 35ml	as needed	$175.00
HRT-F-PROG-10WK	HRT Female	Female HRT - Progesterone Only	10 weeks	$295.00
HRT-F-DHEA-10WK	HRT Female	Female HRT - DHEA Only	10 weeks	$295.00
PEL-MF-STD	Pellet Therapy	Male/Female Pellet (3–4 months)	3-4 months	$550.00
PEL-ORAL-PROG-3M	Pellet Therapy	Women’s Oral Progesterone	3 months	$110.00
PEL-ORAL-PROG-4M	Pellet Therapy	Women’s Oral Progesterone	4 months	$150.00
SP-MP-STRIP-20	Sexual Performance	MP Strips (#20)	package	$325.00
SP-MP-STRIP-30	Sexual Performance	MP Strips (#30)	package	$407.00
SP-MP-TAB-30	Sexual Performance	MP Tab (#30)	package	$195.00
SP-MP-TROCHE-10	Sexual Performance	MP Troche (#10)	package	$195.00
SP-PT141-10WK	Sexual Performance	PT-141 Injectable	10 weeks	$350.00
SP-TRIMIX	Sexual Performance	Trimix	as needed	$195.00
PEP-5AMINO-O-10WK	Peptides	5-Amino Oral	10 weeks	$650.00
PEP-BPC157-O-30D	Peptides	BPC-157 Oral 60 Count	30 days	$800.00
PEP-BPC157-O-60D	Peptides	BPC-157 Oral 120 Count	60 days	$1,000.00
PEP-BPC157-I-30D	Peptides	BPC-157 Injectable 30 day	30 days	$550.00
PEP-BPC157-I-60D	Peptides	BPC-157 Injectable 60 day	60 days	$1,000.00
PEP-CJC-10WK	Peptides	CJC-1295 / Ipamorelin	10 weeks	$800.00
PEP-DSIP-10WK	Peptides	DSIP	10 weeks	$350.00
PEP-GLUT-10WK	Peptides	Glutathione	10 weeks	$325.00
PEP-HGH-I-30D	Peptides	HGH (Zomacton, injectable)	30 days	$1,200.00
PEP-IGF-LR3-10WK	Peptides	IGF-LR3	10 weeks	$850.00
PEP-LDN-10WK	Peptides	LDN	10 weeks	$265.00
PEP-LIPO-10WK	Peptides	Lipotropic	10 weeks	$195.00
PEP-NAD-I-10WK	Peptides	NAD+ Injectable	10 weeks	$595.00
PEP-NAD-B12-10WK	Peptides	NAD+ + B12 Oral	10 weeks	$595.00
PEP-PDA-10WK	Peptides	PDA 200mcg (inj/oral)	10 weeks	$675.00
PEP-PDA-O-10WK	Peptides	PDA 400mcg (inj/oral)	10 weeks	$800.00
PEP-PPS-10WK	Peptides	PPS Injectable	10 weeks	$675.00
PEP-SERM-10WK	Peptides	Sermorelin (inj/oral)	10 weeks	$800.00
COS-BOTOX-U	Cosmetic Facial	Botox ($14/unit)	per unit	$14.00
COS-MICRO-EXO-FACE-NECK	Cosmetic Facial	Microneedling w/ Exosomes (face & neck)	per session	$1,000.00
COS-MICRO-EXO-PACK	Cosmetic Facial	Microneedling w/ Exosomes Package (4)	package	$3,000.00
COS-MICRO-FACE-NECK	Cosmetic Facial	Microneedling (face & neck)	per session	$425.00
COS-MICRO-PACK	Cosmetic Facial	Microneedling Package (3)	package	$1,000.00
COS-VAMPIRE-FACE	Cosmetic Facial	Vampire/PRP Facial or Facelift	per session	custom
COS-VAMPIRE-PACK	Cosmetic Facial	Vampire/PRP Package (3)	package	$2,500.00
HAIR-VAMPIRE-PRP	Cosmetic Hair	Vampire/PRP Hair (per session)	per session	$900.00
HAIR-EXO-PRP-PACK	Cosmetic Hair	Exosomes add-on to PRP (3 PRP + 6 Exosomes)	package	$4,500.00
HAIR-EXO-LOSS	Cosmetic Hair	Exosomes for Hair Loss	per session	$1,000.00
HAIR-TOPICAL-30ML	Cosmetic Hair	Topical Hair Cream (30ml)	30ml	$250.00
COS-CREAM-E3-30	Cosmetic Creams	E3 Face Cream (30ml)	30ml	$100.00
COS-CREAM-E3-60	Cosmetic Creams	E3 Face Cream (60ml)	60ml	$150.00
COS-CREAM-TRI-30	Cosmetic Creams	Tretinoin Face Cream (30ml)	30ml	$100.00
IV-BASIC	IV Therapy	Basic IV	per session	$99.00
IV-LIPO	IV Therapy	Lipotropic Add-on	per session	$20.00
IV-NAD	IV Therapy	NAD+ Add-on	per session	$20.00
IV-GLUT	IV Therapy	Glutathione Add-on	per session	$20.00
PROC-PSHOT-INIT	Procedures	P-Shot Initial	per session	$1,900.00
PROC-PSHOT-RETURN	Procedures	P-Shot Return	per session	$1,500.00
PROC-PSHOT-RETURN2	Procedures	P-Shot Return (higher)	per session	$1,600.00
PROC-OSHOT	Procedures	O-Shot	per session	$1,500.00
PROC-PRP	Procedures	PRP Injection	per session	custom
PROC-PROL	Procedures	Prolotherapy	per session	custom
PROC-PIT	Procedures	PIT	per session	$350.00
PROC-PSHOT-BOTOX	Procedures	P-Shot Botox	per session	$800.00
COMP-FU-7M	Compassionate Care	Follow-up	7 months	$150.00
SHIP-STANDARD	Shipping	Standard Shipping	one time	$25.00
SHIP-COLD	Shipping	Cold Shipping	one time	$50.00
CONS-INITIAL	Consult	Initial Consult	one time	$150.00
DEPOSIT-PELLET	Deposits	Pellet Deposit	one time	$100.00
DEPOSIT-PSHOT	Deposits	P Shot Deposit	one time	$200.00
DEPOSIT-OSHOT	Deposits	O Shot Deposit	one time	$200.00
DEPOSIT-MISC	Deposits	Miscellaneous Deposit	one time	custom
SUPPS-VITAMIN-D	Supplements	Vitamin D	one time	$42.00
LAB-INIT-A-M	Labs	Panel A (Male)	one time	$150.00
LAB-INIT-B-M	Labs	Panel B (Male)	one time	$165.00
LAB-INIT-A-F	Labs	Panel A (Female)	one time	$150.00
LAB-INIT-B-F	Labs	Panel B (Female)	one time	$165.00
LAB-FU-A-M	Labs	Panel A (Male)	one time	$150.00
LAB-FU-B-M	Labs	Panel B (Male)	one time	$165.00
LAB-FU-A-F	Labs	Panel A (Female)	one time	$150.00
LAB-FU-B-F	Labs	Panel B (Female)	one time	$165.00
LAB-ADD-CMP	Labs	CMP	one time	$6.00
LAB-ADD-CBC	Labs	CBC	one time	$5.00
LAB-ADD-LIPID	Labs	Lipid	one time	$15.00
LAB-ADD-THY	Labs	Panel C (Thyroid)	one time	$45.00
LAB-ADD-VITD	Labs	Panel D (Vitamin D)	one time	$40.00
LAB-ADD-CORT	Labs	Cortisol	one time	$24.00
LAB-ADD-TSH	Labs	TSH	one time	$15.00
LAB-ADD-IRON	Labs	Iron Panel	one time	$15.00
LAB-ADD-B12	Labs	Vitamin B12	one time	$12.00
LAB-SPEC-IGE	Labs	Allergy-IGE	one time	$400.00
LAB-SPEC-IGG	Labs	Sensitivity-IGG	one time	$400.00
LAB-SPEC-CARD-BASIC	Labs	Cardio Pro Basic	one time	$199.00
LAB-SPEC-CARD-ADV	Labs	Cardio Pro Advanced	one time	$270.00
LAB-SPEC-CARD-PLUS	Labs	Cardio Pro Advanced Plus	one time	$389.00
LAB-CS-ALCAT	Labs	ALCAT	one time	$750.00
LAB-CS-METHYL	Labs	MethylDetox Profile	one time	$479.00
LAB-CS-CNA	Labs	Cellular Nutrition Assay (CNA)	one time	$600.00
LAB-CS-MNT	Labs	Micronutrient (MNT)	one time	$400.00
LAB-CS-TELO	Labs	Telomere (add to CNA only)	one time	$250.00
LAB-CS-HIST	Labs	Histamine (add to ALCAT & CNA)	one time	$400.00
LAB-CARD-SVH	Labs	Smart Vascular Health	one time	$275.00
LAB-GEN-ADR-STRESS	Labs	Adrenal Stress Test (Saliva)	one time	$250.00
SP-TRIMIX-PHEN-I	Sexual Performance	Trimix & Phenylephrine	as needed	$400.00
HRT-F-VAGINALESTRADIOL-CREAM-70ML	Female HRT	Vaginal Estradiol	as needed	$250.00
WL-SEM-I-5WK	Weight Loss	Semaglutide Injectable 5wk	5 weeks	$535.00
WL-TIRZ-I-2.5+5-5WK	Weight Loss	Tirzepatide Standard 2.5mg + 5mg inj 5wk	5 weeks	$675.00
WL-TIRZ-I-2.5-5WK	Weight Loss	Tirzepatide Standard 2.5mg inj 5wk	5 weeks	$675.00
WL-TIRZ-HM-5-5WK	Weight Loss	Tirzepatide High Maintenance 5mg/7.5mg/10mg inj 5wk	5 weeks	$800.00
WL-TIRZ-HM-12.5-5WK     	Weight Loss	Tirzepatide High Maintenance 12.5mg inj 5wk	5 weeks	$950.00

## Next Steps

Once you answer these questions:

1. I'll customize the system to your exact needs
2. We'll set up your Google Sheet with your actual data
3. Configure Authorize.net sandbox
4. Build and test Phase 1 (basic POS)
5. Iterate based on your feedback
6. Launch in production

**Estimated time to working prototype: 1-2 weeks**

---

## Contact Me When Ready

Reply with:
- Answers to the questions above
- Your current SKU list (if you have it)
- Any screenshots of your current process
- Questions you have about the system

Then we'll get started building!
