# Questions to Answer Before Building

Before we start Phase 1 implementation, please answer these questions to ensure the system meets your exact needs:

## 1. Staff & Access

**Q: How many receptionists will use this system?**
- [ ] Just me
- [ ] 2-5 people
- [ ] 6-10 people
- [ ] More than 10

**Q: Should collector initials be:**
- [ ] Entered at login and remembered for the session
- [ ] Entered for each transaction
- [ ] Auto-detected from Google account

**Your answer:** _______________

---

## 2. Product Configuration

**Q: Are Provider Initials (BA, DR, etc.) tied to specific products?**
- [ ] Yes - each product has a fixed provider (already in your SKU list)
- [ ] No - the provider varies based on who performed the service
- [ ] Sometimes - depends on the appointment

**Your answer:** _______________

**Q: How many SKUs (products) do you have in total?**
- [ ] Less than 20
- [ ] 20-50
- [ ] 50-100
- [ ] More than 100

**Your answer:** _______________

**Q: Do you need me to help import your existing SKU list?**
- [ ] Yes, I have it in a spreadsheet
- [ ] Yes, I have it in another format: _______________
- [ ] No, I'll enter them manually
- [ ] I need help creating the SKU list

**Your answer:** _______________

---

## 3. Pricing & Discounts

**Q: Do you charge sales tax?**
- [ ] Yes - what rate? _______________% (e.g., 8.75 for 8.75%)
- [ ] No
- [ ] It varies by location

**Your answer:** _______________

**Q: When receptionist edits price for grandfathered patients, should the system:**
- [ ] Just apply the new price, no questions asked
- [ ] Require a reason/note (e.g., "Grandfathered pricing")
- [ ] Require manager approval
- [ ] Log it but allow it

**Your answer:** _______________

**Q: For promo codes, should they:**
- [ ] Apply to cart total only
- [ ] Apply to specific products/categories only
- [ ] Either (configurable per promo code)

**Your answer:** _______________

---

## 4. Payment & Refunds

**Q: Do patients ever pay in partial/installment payments?**
- [ ] No - always full payment at checkout
- [ ] Yes - sometimes split into 2+ payments
- [ ] Yes - we offer payment plans (need to track)

**Your answer:** _______________

**Q: How should refunds be handled?**
- [ ] Process refunds through Authorize.net separately (manual)
- [ ] Add a "Refund" button in the POS system
- [ ] Don't need refund functionality yet

**Your answer:** _______________

**Q: Do you need to support payments from saved payment methods (customer profiles)?**
- [ ] No - always enter card info each time (current workflow)
- [ ] Yes - save cards for returning customers
- [ ] Maybe in the future

**Your answer:** _______________

---

## 5. Customer Data

**Q: What format are your Patient IDs in?**
- Example: PAT-1234, just numbers (1234), etc.

**Your answer:** _______________

**Q: Do you have an existing customer database to import?**
- [ ] Yes - in a spreadsheet (send me a sample row)
- [ ] Yes - in another system: _______________
- [ ] No - starting fresh

**Your answer:** _______________

**Q: Should the system send email receipts automatically?**
- [ ] Yes - to customer email on file
- [ ] Yes - but ask for email each time
- [ ] No - we'll email manually if needed
- [ ] Not yet, but maybe later

**Your answer:** _______________

---

## 6. Invoicing

**Q: Your current invoice format is SP-Rx-XXXXX, SP-Labs-XXXXX, SP-Consult-XXXXX. What should happen when a cart has mixed items?**
- [ ] Use SP-Mixed-XXXXX (new category)
- [ ] Use the category of the highest-value item
- [ ] Create separate invoices for each category
- [ ] Other: _______________

**Your answer:** _______________

**Q: Do you need to maintain your existing invoice number sequence?**
- [ ] No - start fresh at 00001 for each category
- [ ] Yes - current numbers are:
  - SP-Rx-_______________
  - SP-Labs-_______________
  - SP-Consult-_______________

**Your answer:** _______________

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

**Your answer:** _______________

**Q: How often do you need to pull reports?**
- [ ] Daily
- [ ] Weekly
- [ ] Monthly
- [ ] As needed

**Your answer:** _______________

---

## 8. Multi-Location (Future)

**Q: When do you plan to franchise/expand to multiple locations?**
- [ ] Within 3 months
- [ ] 3-6 months
- [ ] 6-12 months
- [ ] 1+ years
- [ ] Not sure yet

**Your answer:** _______________

**Q: Will each location:**
- [ ] Have its own Authorize.net account
- [ ] Share a single Authorize.net account (separate sub-accounts)
- [ ] Not sure yet

**Your answer:** _______________

---

## 9. Product Bundles & Packages

**Q: Do you offer any bundled services?**
- Example: "Initial Consult + Blood Panel" as a discounted package

- [ ] No - everything is sold separately
- [ ] Yes - we have bundles (list them):
  - _______________
  - _______________
- [ ] Not yet, but interested in this feature

**Your answer:** _______________

---

## 10. Inventory Tracking

**Q: Do you need to track inventory/stock levels for physical products?**
- [ ] No - all services or unlimited stock
- [ ] Yes - for certain items (which ones?): _______________
- [ ] Not yet, but maybe later

**Your answer:** _______________

---

## 11. Authorize.net Specifics

**Q: Do you already have an Authorize.net account?**
- [ ] Yes - production account (we'll use sandbox for testing first)
- [ ] Yes - sandbox account only
- [ ] No - need to create one
- [ ] Not sure

**Your answer:** _______________

**Q: Do you want to use:**
- [ ] Accept Hosted (recommended - Authorize.net hosts the payment form, more secure)
- [ ] Accept.js (custom form, you style it, we handle tokens)
- [ ] Not sure - use what's best

**Your answer:** _______________

---

## 12. Timeline & Launch

**Q: What's your ideal timeline to go live?**
- [ ] ASAP - within 1-2 weeks
- [ ] 3-4 weeks
- [ ] 1-2 months
- [ ] No rush - get it right

**Your answer:** _______________

**Q: Do you want to:**
- [ ] Build it all at once, then launch
- [ ] Launch basic version first (checkout only), add features later
- [ ] Test with one receptionist first, then roll out to everyone

**Your answer:** _______________

---

## 13. Special Requirements

**Q: Are there any other specific requirements or workflows I should know about?**

**Your answer:**
_______________
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
