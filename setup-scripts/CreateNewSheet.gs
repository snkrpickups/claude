/**
 * ALC POS System - Create New Google Sheet
 *
 * This script creates a BRAND NEW Google Sheet and sets up all 7 tabs automatically.
 *
 * HOW TO USE (Standalone - No Sheet Required):
 * 1. Go to https://script.google.com
 * 2. Click "New Project"
 * 3. Copy this entire script into Code.gs
 * 4. Click "Run" and select "createNewALCPOSSheet"
 * 5. Authorize when prompted
 * 6. Check the logs for your new sheet URL
 * 7. Open the URL - your sheet is ready!
 */

function createNewALCPOSSheet() {
  Logger.log('🚀 Creating new ALC POS System Google Sheet...');

  try {
    // Create brand new spreadsheet
    const ss = SpreadsheetApp.create('ALC_POS_System');

    Logger.log('✅ New spreadsheet created!');
    Logger.log('📎 URL: ' + ss.getUrl());

    // Delete default Sheet1
    const defaultSheet = ss.getSheets()[0];

    // Set up all sheets
    Logger.log('📋 Creating and populating sheets...');
    setupProductsSheet(ss);
    setupTransactionsSheet(ss);
    setupCustomersSheet(ss);
    setupInvoiceTrackingSheet(ss);
    setupPromoCodesSheet(ss);
    setupLocationsSheet(ss);
    setupConfigSheet(ss);

    // Now delete default sheet (after we have others)
    if (defaultSheet.getName() === 'Sheet1') {
      ss.deleteSheet(defaultSheet);
    }

    // Format sheets
    formatSheets(ss);

    // Move Products sheet to first position
    const productsSheet = ss.getSheetByName('Products');
    ss.setActiveSheet(productsSheet);
    ss.moveActiveSheet(1);

    const url = ss.getUrl();

    Logger.log('');
    Logger.log('✅ ✅ ✅ SUCCESS! ✅ ✅ ✅');
    Logger.log('');
    Logger.log('📊 Your ALC POS System sheet is ready!');
    Logger.log('');
    Logger.log('🔗 Open this URL:');
    Logger.log(url);
    Logger.log('');
    Logger.log('📝 Next steps:');
    Logger.log('   1. Open the URL above');
    Logger.log('   2. Go to Locations tab');
    Logger.log('   3. Add your Authorize.net credentials (columns I, J, K)');
    Logger.log('   4. Bookmark the sheet');
    Logger.log('   5. Continue with DEPLOYMENT.md Step 2');
    Logger.log('');

    // Try to show dialog (only works if run from sheet context)
    try {
      SpreadsheetApp.getUi().alert(
        '✅ Success!\n\n' +
        'Your new ALC POS System sheet has been created!\n\n' +
        'Check the logs (View > Logs) for the URL.\n\n' +
        'The sheet will open in a new tab.'
      );
    } catch (e) {
      // Running standalone, can't show UI
      Logger.log('ℹ️  Copy the URL from the logs above to open your sheet');
    }

    return {
      success: true,
      url: url,
      message: 'Sheet created successfully! Open the URL from the logs.'
    };

  } catch (error) {
    Logger.log('❌ Error creating sheet: ' + error.toString());
    throw error;
  }
}

/**
 * Alternative: Setup in existing sheet (if you already created one)
 */
function setupExistingSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  Logger.log('🚀 Setting up existing sheet: ' + ss.getName());

  // Delete default Sheet1 if empty
  try {
    const sheet1 = ss.getSheetByName('Sheet1');
    if (sheet1 && sheet1.getLastRow() <= 1) {
      // Keep it for now, will delete after creating others
    }
  } catch (e) {}

  // Create all sheets
  Logger.log('📋 Creating sheets...');
  setupProductsSheet(ss);
  setupTransactionsSheet(ss);
  setupCustomersSheet(ss);
  setupInvoiceTrackingSheet(ss);
  setupPromoCodesSheet(ss);
  setupLocationsSheet(ss);
  setupConfigSheet(ss);

  // Now delete Sheet1 if it exists
  try {
    const sheet1 = ss.getSheetByName('Sheet1');
    if (sheet1 && sheet1.getLastRow() <= 1) {
      ss.deleteSheet(sheet1);
    }
  } catch (e) {}

  // Format sheets
  formatSheets(ss);

  Logger.log('✅ Setup complete!');

  SpreadsheetApp.getUi().alert(
    '✅ Setup Complete!\n\n' +
    'All 7 sheets have been created and populated.\n\n' +
    'Next steps:\n' +
    '1. Go to "Locations" tab\n' +
    '2. Add your Authorize.net credentials (columns I, J, K)\n' +
    '3. Continue with deployment guide'
  );
}

// ============================================================================
// SHEET SETUP FUNCTIONS
// ============================================================================

function setupProductsSheet(ss) {
  Logger.log('  📦 Products...');
  let sheet = ss.getSheetByName('Products');
  if (!sheet) {
    sheet = ss.insertSheet('Products');
  } else {
    sheet.clear();
  }

  const headers = ['SKU', 'Category', 'ItemName', 'Duration', 'BasePrice', 'Active', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  const products = [
    ['WL-SEM-O-10WK', 'Weight Loss', 'Semaglutide Oral 10 weeks', '10 weeks', 850, true, ''],
    ['WL-SEM-I-10WK', 'Weight Loss', 'Semaglutide Injectable 10 weeks', '10 weeks', 1000, true, ''],
    ['WL-TIRZ-O-4WK', 'Weight Loss', 'Tirzepatide Oral 4 weeks', '4 weeks', 450, true, ''],
    ['WL-TIRZ-STD-2.5+5-10WK', 'Weight Loss', 'Tirzepatide Standard 2.5mg + 5mg inj 10 weeks', '10 weeks', 1195, true, ''],
    ['WL-TIRZ-STD-2.5-10WK', 'Weight Loss', 'Tirzepatide Standard 2.5mg inj 10 weeks', '10 weeks', 1195, true, ''],
    ['WL-TIRZ-HM-5-10WK', 'Weight Loss', 'Tirzepatide High Maintenance 5mg/7.5mg/10mg inj 10 weeks', '10 weeks', 1595, true, ''],
    ['WL-TIRZ-HM-12.5-10WK', 'Weight Loss', 'Tirzepatide High Maintenance 12.5mg inj 10 weeks', '10 weeks', 1895, true, ''],
    ['HRT-M-CLOMID-10WK', 'HRT Male', 'Clomid 10 weeks', '10 weeks', 295, true, ''],
    ['HRT-M-ENCL-10WK', 'HRT Male', 'Enclomiphene 10 weeks', '10 weeks', 495, true, ''],
    ['HRT-M-GONAD-10WK', 'HRT Male', 'Gonadorelin 10 weeks', '10 weeks', 295, true, ''],
    ['HRT-M-TEST-10WK', 'HRT Male', 'Testosterone 10 weeks', '10 weeks', 420, true, ''],
    ['HRT-M-TEST-GONAD-10WK', 'HRT Male', 'Testosterone + Gonadorelin 10 weeks', '10 weeks', 460, true, ''],
    ['HRT-M-A-10WK', 'HRT Male', 'Anastrozole 10 weeks', '10 weeks', 0, true, 'Free with package'],
    ['HRT-F-STD-10WK', 'HRT Female', 'Female HRT Package 10 weeks', '10 weeks', 435, true, ''],
    ['HRT-F-STD-S-10WK', 'HRT Female', 'Female HRT Package Surcharge', 'one time', 50, true, ''],
    ['HRT-F-CREAM-E2', 'HRT Female', 'E2 Vaginal Cream 35ml', 'as needed', 175, true, ''],
    ['HRT-F-PROG-10WK', 'HRT Female', 'Female HRT - Progesterone Only 10 weeks', '10 weeks', 295, true, ''],
    ['HRT-F-DHEA-10WK', 'HRT Female', 'Female HRT - DHEA Only 10 weeks', '10 weeks', 295, true, ''],
    ['PEL-MF-STD', 'Pellet Therapy', 'Male/Female Pellet (3–4 months)', '3-4 months', 550, true, ''],
    ['PEL-ORAL-PROG-3M', 'Pellet Therapy', 'Women\'s Oral Progesterone 3 months', '3 months', 110, true, ''],
    ['PEL-ORAL-PROG-4M', 'Pellet Therapy', 'Women\'s Oral Progesterone 4 months', '4 months', 150, true, ''],
    ['SP-MP-STRIP-20', 'Sexual Performance', 'MP Strips (#20)', 'package', 325, true, ''],
    ['SP-MP-STRIP-30', 'Sexual Performance', 'MP Strips (#30)', 'package', 407, true, ''],
    ['SP-MP-TAB-30', 'Sexual Performance', 'MP Tab (#30)', 'package', 195, true, ''],
    ['SP-MP-TROCHE-10', 'Sexual Performance', 'MP Troche (#10)', 'package', 195, true, ''],
    ['SP-PT141-10WK', 'Sexual Performance', 'PT-141 Injectable 10 weeks', '10 weeks', 350, true, ''],
    ['SP-TRIMIX', 'Sexual Performance', 'Trimix', 'as needed', 195, true, ''],
    ['PEP-5AMINO-O-10WK', 'Peptides', '5-Amino Oral 10 weeks', '10 weeks', 650, true, ''],
    ['PEP-BPC157-O-30D', 'Peptides', 'BPC-157 Oral 60 Count 30 days', '30 days', 800, true, ''],
    ['PEP-BPC157-O-60D', 'Peptides', 'BPC-157 Oral 120 Count 60 days', '60 days', 1000, true, ''],
    ['PEP-BPC157-I-30D', 'Peptides', 'BPC-157 Injectable 30 day', '30 days', 550, true, ''],
    ['PEP-BPC157-I-60D', 'Peptides', 'BPC-157 Injectable 60 day', '60 days', 1000, true, ''],
    ['PEP-CJC-10WK', 'Peptides', 'CJC-1295 / Ipamorelin 10 weeks', '10 weeks', 800, true, ''],
    ['PEP-DSIP-10WK', 'Peptides', 'DSIP 10 weeks', '10 weeks', 350, true, ''],
    ['PEP-GLUT-10WK', 'Peptides', 'Glutathione 10 weeks', '10 weeks', 325, true, ''],
    ['PEP-HGH-I-30D', 'Peptides', 'HGH (Zomacton, injectable) 30 days', '30 days', 1200, true, ''],
    ['PEP-IGF-LR3-10WK', 'Peptides', 'IGF-LR3 10 weeks', '10 weeks', 850, true, ''],
    ['PEP-LDN-10WK', 'Peptides', 'LDN 10 weeks', '10 weeks', 265, true, ''],
    ['PEP-LIPO-10WK', 'Peptides', 'Lipotropic 10 weeks', '10 weeks', 195, true, ''],
    ['PEP-NAD-I-10WK', 'Peptides', 'NAD+ Injectable 10 weeks', '10 weeks', 595, true, ''],
    ['PEP-NAD-B12-10WK', 'Peptides', 'NAD+ + B12 Oral 10 weeks', '10 weeks', 595, true, ''],
    ['PEP-PDA-10WK', 'Peptides', 'PDA 200mcg (inj/oral) 10 weeks', '10 weeks', 675, true, ''],
    ['PEP-PDA-O-10WK', 'Peptides', 'PDA 400mcg (inj/oral) 10 weeks', '10 weeks', 800, true, ''],
    ['PEP-PPS-10WK', 'Peptides', 'PPS Injectable 10 weeks', '10 weeks', 675, true, ''],
    ['PEP-SERM-10WK', 'Peptides', 'Sermorelin (inj/oral) 10 weeks', '10 weeks', 800, true, ''],
    ['COS-BOTOX-U', 'Cosmetic Facial', 'Facial Botox ($14/unit)', 'per unit', 14, true, ''],
    ['COS-MICRO-EXO-FACE-NECK', 'Cosmetic Facial', 'Microneedling w/ Exosomes (face & neck)', 'per session', 1000, true, ''],
    ['COS-MICRO-EXO-PACK', 'Cosmetic Facial', 'Microneedling w/ Exosomes Package (4)', 'package', 3000, true, ''],
    ['COS-MICRO-FACE-NECK', 'Cosmetic Facial', 'Microneedling (face & neck)', 'per session', 425, true, ''],
    ['COS-MICRO-PACK', 'Cosmetic Facial', 'Microneedling Package (3)', 'package', 1000, true, ''],
    ['COS-VAMPIRE-FACE', 'Cosmetic Facial', 'Vampire/PRP Facial or Facelift', 'per session', 0, true, 'Custom pricing'],
    ['COS-VAMPIRE-PACK', 'Cosmetic Facial', 'Vampire/PRP Package (3)', 'package', 2500, true, ''],
    ['HAIR-VAMPIRE-PRP', 'Cosmetic Hair', 'Vampire/PRP Hair (per session)', 'per session', 900, true, ''],
    ['HAIR-EXO-PRP-PACK', 'Cosmetic Hair', 'Exosomes add-on to PRP (3 PRP + 6 Exosomes)', 'package', 4500, true, ''],
    ['HAIR-EXO-LOSS', 'Cosmetic Hair', 'Exosomes for Hair Loss', 'per session', 1000, true, ''],
    ['HAIR-TOPICAL-30ML', 'Cosmetic Hair', 'Topical Hair Cream (30ml)', '30ml', 250, true, ''],
    ['COS-CREAM-E3-30', 'Cosmetic Creams', 'E3 Face Cream (30ml)', '30ml', 100, true, ''],
    ['COS-CREAM-E3-60', 'Cosmetic Creams', 'E3 Face Cream (60ml)', '60ml', 150, true, ''],
    ['COS-CREAM-TRI-30', 'Cosmetic Creams', 'Tretinoin Face Cream (30ml)', '30ml', 100, true, ''],
    ['IV-BASIC', 'IV Therapy', 'Basic IV', 'per session', 99, true, ''],
    ['IV-LIPO', 'IV Therapy', 'Lipotropic Add-on', 'per session', 20, true, ''],
    ['IV-NAD', 'IV Therapy', 'NAD+ Add-on', 'per session', 20, true, ''],
    ['IV-GLUT', 'IV Therapy', 'Glutathione Add-on', 'per session', 20, true, ''],
    ['PROC-PSHOT-INIT', 'Procedures', 'P-Shot Initial', 'per session', 1900, true, ''],
    ['PROC-PSHOT-RETURN', 'Procedures', 'P-Shot Return', 'per session', 1500, true, ''],
    ['PROC-PSHOT-RETURN2', 'Procedures', 'P-Shot Return (higher)', 'per session', 1600, true, ''],
    ['PROC-OSHOT', 'Procedures', 'O-Shot', 'per session', 1500, true, ''],
    ['PROC-PRP', 'Procedures', 'PRP Injection', 'per session', 0, true, 'Custom pricing'],
    ['PROC-PROL', 'Procedures', 'Prolotherapy', 'per session', 0, true, 'Custom pricing'],
    ['PROC-PIT', 'Procedures', 'PIT', 'per session', 350, true, ''],
    ['PROC-PSHOT-BOTOX', 'Procedures', 'P-Shot Botox', 'per session', 800, true, ''],
    ['COMP-FU-7M', 'Compassionate Care', 'Follow-up 7 months', '7M', 150, true, ''],
    ['SHIP-STANDARD', 'Shipping', 'Standard Shipping', 'one time', 25, true, ''],
    ['SHIP-COLD', 'Shipping', 'Cold Shipping', 'one time', 50, true, ''],
    ['CONS-INITIAL', 'Consult', 'Initial Consult', 'one time', 150, true, ''],
    ['DEPOSIT-PELLET', 'Deposits', 'Pellet Deposit', 'one time', 100, true, ''],
    ['DEPOSIT-PSHOT', 'Deposits', 'P Shot Deposit', 'one time', 200, true, ''],
    ['DEPOSIT-OSHOT', 'Deposits', 'O Shot Deposit', 'one time', 200, true, ''],
    ['DEPOSIT-MISC', 'Deposits', 'Miscellaneous Deposit', 'one time', 0, true, 'Custom amount'],
    ['SUPPS-VITAMIN-D', 'Supplements', 'Vitamin D', 'one time', 42, true, ''],
    ['LAB-INIT-A-M', 'Labs', 'Panel A (Male)', 'one time', 150, true, ''],
    ['LAB-INIT-B-M', 'Labs', 'Panel B (Male)', 'one time', 165, true, ''],
    ['LAB-INIT-A-F', 'Labs', 'Panel A (Female)', 'one time', 150, true, ''],
    ['LAB-INIT-B-F', 'Labs', 'Panel B (Female)', 'one time', 165, true, ''],
    ['LAB-FU-A-M', 'Labs', 'Panel A (Male)', 'one time', 150, true, ''],
    ['LAB-FU-B-M', 'Labs', 'Panel B (Male)', 'one time', 165, true, ''],
    ['LAB-FU-A-F', 'Labs', 'Panel A (Female)', 'one time', 150, true, ''],
    ['LAB-FU-B-F', 'Labs', 'Panel B (Female)', 'one time', 165, true, ''],
    ['LAB-ADD-CMP', 'Labs', 'CMP', 'one time', 6, true, ''],
    ['LAB-ADD-CBC', 'Labs', 'CBC', 'one time', 5, true, ''],
    ['LAB-ADD-LIPID', 'Labs', 'Lipid', 'one time', 15, true, ''],
    ['LAB-ADD-THY', 'Labs', 'Panel C (Thyroid)', 'one time', 45, true, ''],
    ['LAB-ADD-VITD', 'Labs', 'Panel D (Vitamin D)', 'one time', 40, true, ''],
    ['LAB-ADD-CORT', 'Labs', 'Cortisol', 'one time', 24, true, ''],
    ['LAB-ADD-TSH', 'Labs', 'TSH', 'one time', 15, true, ''],
    ['LAB-ADD-IRON', 'Labs', 'Iron Panel', 'one time', 15, true, ''],
    ['LAB-ADD-B12', 'Labs', 'Vitamin B12', 'one time', 12, true, ''],
    ['LAB-SPEC-IGE', 'Labs', 'Allergy-IGE', 'one time', 400, true, ''],
    ['LAB-SPEC-IGG', 'Labs', 'Sensitivity-IGG', 'one time', 400, true, ''],
    ['LAB-SPEC-CARD-BASIC', 'Labs', 'Cardio Pro Basic', 'one time', 199, true, ''],
    ['LAB-SPEC-CARD-ADV', 'Labs', 'Cardio Pro Advanced', 'one time', 270, true, ''],
    ['LAB-SPEC-CARD-PLUS', 'Labs', 'Cardio Pro Advanced Plus', 'one time', 389, true, ''],
    ['LAB-CS-ALCAT', 'Labs', 'ALCAT', 'one time', 750, true, ''],
    ['LAB-CS-METHYL', 'Labs', 'MethylDetox Profile', 'one time', 479, true, ''],
    ['LAB-CS-CNA', 'Labs', 'Cellular Nutrition Assay (CNA)', 'one time', 600, true, ''],
    ['LAB-CS-MNT', 'Labs', 'Micronutrient (MNT)', 'one time', 400, true, ''],
    ['LAB-CS-TELO', 'Labs', 'Telomere (add to CNA only)', 'one time', 250, true, ''],
    ['LAB-CS-HIST', 'Labs', 'Histamine (add to ALCAT & CNA)', 'one time', 400, true, ''],
    ['LAB-CARD-SVH', 'Labs', 'Smart Vascular Health', 'one time', 275, true, ''],
    ['LAB-GEN-ADR-STRESS', 'Labs', 'Adrenal Stress Test (Saliva)', 'one time', 250, true, ''],
    ['SP-TRIMIX-PHEN-I', 'Sexual Performance', 'Trimix & Phenylephrine', 'as needed', 400, true, ''],
    ['HRT-F-VAGINALESTRADIOL-CREAM-70ML', 'HRT Female', 'Vaginal Estradiol', 'as needed', 250, true, ''],
    ['WL-SEM-I-5WK', 'Weight Loss', 'Semaglutide Injectable 5wk', '5 weeks', 535, true, ''],
    ['WL-TIRZ-I-2.5+5-5WK', 'Weight Loss', 'Tirzepatide Standard 2.5mg + 5mg inj 5wk', '5 weeks', 675, true, ''],
    ['WL-TIRZ-I-2.5-5WK', 'Weight Loss', 'Tirzepatide Standard 2.5mg inj 5wk', '5 weeks', 675, true, ''],
    ['WL-TIRZ-HM-5-5WK', 'Weight Loss', 'Tirzepatide High Maintenance 5mg/7.5mg/10mg inj 5wk', '5 weeks', 800, true, ''],
    ['WL-TIRZ-HM-12.5-5WK', 'Weight Loss', 'Tirzepatide High Maintenance 12.5mg inj 5wk', '5 weeks', 950, true, '']
  ];

  sheet.getRange(2, 1, products.length, 7).setValues(products);
  Logger.log(`     ✅ ${products.length} products`);
}

function setupTransactionsSheet(ss) {
  Logger.log('  💳 Transactions...');
  let sheet = ss.getSheetByName('Transactions');
  if (!sheet) sheet = ss.insertSheet('Transactions');
  else sheet.clear();

  const headers = ['TransactionID', 'Timestamp', 'InvoiceNumber', 'CustomerID', 'CustomerName', 'ProviderInitials', 'CollectorName', 'Items', 'Subtotal', 'PromoCode', 'Discount', 'PriceOverrides', 'CashAmount', 'CardAmount', 'Total', 'PaymentStatus', 'AuthNetTransID', 'LocationID', 'Description', 'EmailReceipt'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  Logger.log('     ✅ Headers set');
}

function setupCustomersSheet(ss) {
  Logger.log('  👥 Customers...');
  let sheet = ss.getSheetByName('Customers');
  if (!sheet) sheet = ss.insertSheet('Customers');
  else sheet.clear();

  const headers = ['CustomerID', 'PatientID', 'FirstName', 'LastName', 'Email', 'Phone', 'FirstVisit', 'LastVisit', 'TotalTransactions', 'LifetimeValue', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  Logger.log('     ✅ Headers set');
}

function setupInvoiceTrackingSheet(ss) {
  Logger.log('  🧾 InvoiceTracking...');
  let sheet = ss.getSheetByName('InvoiceTracking');
  if (!sheet) sheet = ss.insertSheet('InvoiceTracking');
  else sheet.clear();

  const headers = ['LocationID', 'LocationCode', 'LastNumber', 'CurrentFormat'];
  const data = [['LOC-001', 'LOC', 0, 'LOC-000000']];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, data.length, headers.length).setValues(data);
  Logger.log('     ✅ Initialized');
}

function setupPromoCodesSheet(ss) {
  Logger.log('  🏷️  PromoCodes...');
  let sheet = ss.getSheetByName('PromoCodes');
  if (!sheet) sheet = ss.insertSheet('PromoCodes');
  else sheet.clear();

  const headers = ['PromoCode', 'DiscountType', 'DiscountValue', 'Active', 'StartDate', 'EndDate', 'UsageLimit', 'TimesUsed', 'ApplicableCategories', 'ApplicableSkus'];
  const today = new Date();
  const nextYear = new Date();
  nextYear.setFullYear(today.getFullYear() + 1);
  const data = [
    ['WELCOME10', 'Percentage', 10, true, today, nextYear, 1000, 0, 'ALL', ''],
    ['FIRST50', 'Fixed', 50, true, today, nextYear, 100, 0, 'Consult', ''],
    ['SUMMER25', 'Percentage', 25, false, today, nextYear, 500, 0, 'Weight Loss', '']
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, data.length, headers.length).setValues(data);
  Logger.log('     ✅ 3 sample codes');
}

function setupLocationsSheet(ss) {
  Logger.log('  📍 Locations...');
  let sheet = ss.getSheetByName('Locations');
  if (!sheet) sheet = ss.insertSheet('Locations');
  else sheet.clear();

  const headers = ['LocationID', 'LocationCode', 'LocationName', 'Address', 'City', 'State', 'Zip', 'Active', 'AuthNetAPILogin', 'AuthNetTransKey', 'AuthNetSignatureKey', 'AuthNetEnvironment'];
  const data = [['LOC-001', 'LOC', 'Main Clinic', '123 Main St', 'Your City', 'CA', '12345', true, 'PASTE_API_LOGIN_HERE', 'PASTE_TRANS_KEY_HERE', 'PASTE_SIGNATURE_KEY_HERE', 'SANDBOX']];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, data.length, headers.length).setValues(data);
  sheet.getRange(2, 9, 1, 3).setBackground('#fff3cd');
  Logger.log('     ✅ Template created');
}

function setupConfigSheet(ss) {
  Logger.log('  ⚙️  Config...');
  let sheet = ss.getSheetByName('Config');
  if (!sheet) sheet = ss.insertSheet('Config');
  else sheet.clear();

  const headers = ['ConfigKey', 'ConfigValue', 'Description'];
  const data = [
    ['DEFAULT_LOCATION', 'LOC-001', 'Default location for POS'],
    ['PATIENT_ID_REGEX', '^[A-Z]{2}\\d{6}$', 'Patient ID format validation (2 letters + 6 digits)'],
    ['ENABLE_SPLIT_PAYMENT', 'TRUE', 'Allow cash + card splits'],
    ['ENABLE_EMAIL_RECEIPT', 'TRUE', 'Enable email receipt option'],
    ['PRICE_OVERRIDE_REASONS', 'Grandfathered,F&F,Custom', 'Quick override reasons'],
    ['PROVIDER_LIST', 'BA,DR,GK,JF', 'Available provider initials'],
    ['COLLECTOR_AUTO_DETECT', 'TRUE', 'Auto-detect from Google account'],
    ['COMPANY_NAME', 'ALC', 'Company name for receipts'],
    ['TAX_RATE', '0', 'Tax rate (0 = no tax, 0.0875 = 8.75%)'],
    ['CURRENCY', 'USD', 'Currency code']
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, data.length, headers.length).setValues(data);
  Logger.log('     ✅ Settings loaded');
}

function formatSheets(ss) {
  Logger.log('  🎨 Formatting...');
  const sheets = ss.getSheets();
  sheets.forEach(sheet => {
    const lastCol = sheet.getLastColumn();
    if (lastCol > 0) {
      const headerRange = sheet.getRange(1, 1, 1, lastCol);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4a86e8');
      headerRange.setFontColor('#ffffff');
      headerRange.setHorizontalAlignment('center');
      sheet.setFrozenRows(1);
      for (let i = 1; i <= lastCol; i++) {
        sheet.autoResizeColumn(i);
      }
    }
  });
  Logger.log('     ✅ All sheets formatted');
}
