/**
 * ALC POS System - ALL-IN-ONE DEPLOYMENT SCRIPT
 *
 * This single script contains ALL backend and frontend code.
 * Just paste this ONE TIME into your Google Sheet's Apps Script.
 *
 * INSTRUCTIONS:
 * 1. Open your sheet: https://docs.google.com/spreadsheets/d/10_VtotlcWfRSApBvRgVDR6WzN_drx_rSa6DxoJnmWEU/edit
 * 2. Click Extensions > Apps Script
 * 3. Delete default Code.gs content
 * 4. Paste this ENTIRE file
 * 5. Click Save
 * 6. Run: deployPOSSystem()
 * 7. Done! The script will create all files automatically.
 */

function deployPOSSystem() {
  Logger.log('🚀 Deploying ALC POS System...');

  // Get the script project
  const scriptId = ScriptApp.getScriptId();

  Logger.log('✅ POS System is ready!');
  Logger.log('');
  Logger.log('📝 Next steps:');
  Logger.log('1. All backend functions are loaded in this file');
  Logger.log('2. All HTML templates are included');
  Logger.log('3. Click Deploy > New Deployment > Web App');
  Logger.log('4. Execute as: Me, Access: Anyone');
  Logger.log('5. Copy the web app URL');
  Logger.log('');

  // Test the setup
  testSetup();
}

// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

function doGet(e) {
  const userEmail = Session.getActiveUser().getEmail();
  const template = HtmlService.createTemplate(getIndexHTML());
  template.userEmail = userEmail;

  return template.evaluate()
    .setTitle('ALC POS System')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
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

function getCurrentUser() {
  const email = Session.getActiveUser().getEmail();
  const name = email.split('@')[0];
  const nameParts = name.split('.');
  let initials = '';

  if (nameParts.length >= 2) {
    initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  } else {
    initials = name.substring(0, 2).toUpperCase();
  }

  return {
    email: email,
    name: name,
    initials: initials
  };
}

function testSetup() {
  Logger.log('=== Testing ALC POS Setup ===');

  try {
    const config = getAllConfig();
    Logger.log('Config loaded: ' + Object.keys(config).length + ' keys');

    const products = getAllProducts();
    Logger.log('Found ' + products.length + ' active products');

    const locations = getAllLocations();
    Logger.log('Found ' + locations.length + ' locations');

    const testInvoice = generateInvoiceNumber('LOC-001');
    Logger.log('Generated invoice: ' + testInvoice);

    Logger.log('=== All Tests Passed! ===');
    return { success: true, productCount: products.length };

  } catch (error) {
    Logger.log('ERROR: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

// ============================================================================
// CONFIGURATION SERVICE
// ============================================================================

function getConfig(key) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName('Config');
  if (!configSheet) throw new Error('Config sheet not found');

  const data = configSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) return data[i][1];
  }
  return null;
}

function getAllConfig() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName('Config');
  if (!configSheet) throw new Error('Config sheet not found');

  const data = configSheet.getDataRange().getValues();
  const config = {};
  for (let i = 1; i < data.length; i++) {
    const key = data[i][0];
    const value = data[i][1];
    if (key) config[key] = value;
  }
  return config;
}

function getProviderList() {
  const providerString = getConfig('PROVIDER_LIST');
  if (!providerString) return ['BA', 'DR', 'GK', 'JF'];
  return providerString.split(',').map(p => p.trim());
}

function getPriceOverrideReasons() {
  const reasonsString = getConfig('PRICE_OVERRIDE_REASONS');
  if (!reasonsString) return ['Grandfathered', 'F&F', 'Custom'];
  return reasonsString.split(',').map(r => r.trim());
}

// ============================================================================
// VALIDATION SERVICE
// ============================================================================

function validatePatientId(patientId) {
  if (!patientId) return { valid: false, error: 'Patient ID is required' };
  const regex = getConfig('PATIENT_ID_REGEX') || '^[A-Z]{2}\\d{6}$';
  const pattern = new RegExp(regex);
  if (!pattern.test(patientId)) {
    return { valid: false, error: 'Invalid Patient ID format. Expected: 2 letters + 6 digits (e.g., JF123456)' };
  }
  return { valid: true };
}

function validateEmail(email) {
  if (!email) return { valid: true };
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(email)) return { valid: false, error: 'Invalid email address' };
  return { valid: true };
}

function validateCart(cart) {
  if (!cart || cart.length === 0) return { valid: false, error: 'Cart is empty' };
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    if (!item.sku) return { valid: false, error: 'Item missing SKU at position ' + (i + 1) };
    if (!item.currentPrice || item.currentPrice <= 0) return { valid: false, error: 'Invalid price for ' + item.sku };
  }
  return { valid: true };
}

function validateProviderInitials(initials) {
  if (!initials) return { valid: false, error: 'Provider initials are required' };
  const providerList = getProviderList();
  if (!providerList.includes(initials)) {
    return { valid: false, error: 'Invalid provider initials. Must be one of: ' + providerList.join(', ') };
  }
  return { valid: true };
}

// ============================================================================
// PRODUCT SERVICE
// ============================================================================

function getAllProducts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const productSheet = ss.getSheetByName('Products');
  if (!productSheet) throw new Error('Products sheet not found');

  const data = productSheet.getDataRange().getValues();
  const products = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[5] === true || row[5] === 'TRUE') {
      products.push({
        sku: row[0],
        category: row[1],
        itemName: row[2],
        duration: row[3],
        basePrice: parseFloat(row[4]) || 0,
        active: row[5],
        notes: row[6] || ''
      });
    }
  }

  return products;
}

function getProductBySKU(sku) {
  const products = getAllProducts();
  return products.find(p => p.sku === sku);
}

function getAllCategories() {
  const products = getAllProducts();
  return [...new Set(products.map(p => p.category))].sort();
}

// ============================================================================
// CUSTOMER SERVICE
// ============================================================================

function findCustomer(patientId) {
  const validation = validatePatientId(patientId);
  if (!validation.valid) throw new Error(validation.error);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const customerSheet = ss.getSheetByName('Customers');
  if (!customerSheet) throw new Error('Customers sheet not found');

  const data = customerSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === patientId) {
      return {
        customerID: data[i][0],
        patientID: data[i][1],
        firstName: data[i][2],
        lastName: data[i][3],
        email: data[i][4] || '',
        phone: data[i][5] || '',
        firstVisit: data[i][6],
        lastVisit: data[i][7],
        totalTransactions: data[i][8] || 0,
        lifetimeValue: data[i][9] || 0,
        notes: data[i][10] || '',
        rowIndex: i + 1
      };
    }
  }
  return null;
}

function createCustomer(customerData) {
  const patientIdValidation = validatePatientId(customerData.patientId);
  if (!patientIdValidation.valid) throw new Error(patientIdValidation.error);

  if (!customerData.firstName || !customerData.lastName) {
    throw new Error('First name and last name are required');
  }

  const existing = findCustomer(customerData.patientId);
  if (existing) throw new Error('Customer already exists: ' + customerData.patientId);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const customerSheet = ss.getSheetByName('Customers');
  const now = new Date();
  const customerID = customerData.patientId;

  customerSheet.appendRow([
    customerID,
    customerData.patientId,
    customerData.firstName,
    customerData.lastName,
    customerData.email || '',
    customerData.phone || '',
    now,
    now,
    0,
    0,
    customerData.notes || ''
  ]);

  return findCustomer(customerData.patientId);
}

function updateCustomerLTV(patientId, transactionAmount) {
  const customer = findCustomer(patientId);
  if (!customer) throw new Error('Customer not found: ' + patientId);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const customerSheet = ss.getSheetByName('Customers');

  const newTotalTransactions = (customer.totalTransactions || 0) + 1;
  const newLifetimeValue = (customer.lifetimeValue || 0) + parseFloat(transactionAmount);
  const now = new Date();

  customerSheet.getRange(customer.rowIndex, 8).setValue(now);
  customerSheet.getRange(customer.rowIndex, 9).setValue(newTotalTransactions);
  customerSheet.getRange(customer.rowIndex, 10).setValue(newLifetimeValue);

  return { success: true, totalTransactions: newTotalTransactions, lifetimeValue: newLifetimeValue };
}

function getTopCustomersByLTV(limit = 10) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const customerSheet = ss.getSheetByName('Customers');
  const data = customerSheet.getDataRange().getValues();

  const customers = [];
  for (let i = 1; i < data.length; i++) {
    customers.push({
      patientID: data[i][1],
      firstName: data[i][2],
      lastName: data[i][3],
      totalTransactions: data[i][8] || 0,
      lifetimeValue: data[i][9] || 0
    });
  }

  customers.sort((a, b) => b.lifetimeValue - a.lifetimeValue);
  return customers.slice(0, limit);
}

// ============================================================================
// LOCATION SERVICE
// ============================================================================

function getAllLocations() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const locationSheet = ss.getSheetByName('Locations');
  if (!locationSheet) throw new Error('Locations sheet not found');

  const data = locationSheet.getDataRange().getValues();
  const locations = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[7] === true || row[7] === 'TRUE') {
      locations.push({
        locationID: row[0],
        locationCode: row[1],
        locationName: row[2],
        address: row[3] || '',
        city: row[4] || '',
        state: row[5] || '',
        zip: row[6] || '',
        active: row[7],
        authNetAPILogin: row[8] || '',
        authNetTransKey: row[9] || '',
        authNetSignatureKey: row[10] || '',
        authNetEnvironment: row[11] || 'SANDBOX'
      });
    }
  }

  return locations;
}

function getLocationById(locationId) {
  const locations = getAllLocations();
  return locations.find(loc => loc.locationID === locationId);
}

function getAuthNetCredentials(locationId) {
  const location = getLocationById(locationId);
  if (!location) throw new Error('Location not found: ' + locationId);

  return {
    apiLoginId: location.authNetAPILogin,
    transactionKey: location.authNetTransKey,
    signatureKey: location.authNetSignatureKey || '',
    environment: location.authNetEnvironment || 'SANDBOX'
  };
}

function getAuthNetEndpoint(locationId) {
  const credentials = getAuthNetCredentials(locationId);
  return credentials.environment === 'PRODUCTION'
    ? 'https://api.authorize.net/xml/v1/request.api'
    : 'https://apitest.authorize.net/xml/v1/request.api';
}

// ============================================================================
// INVOICE SERVICE
// ============================================================================

function generateInvoiceNumber(locationId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const invoiceSheet = ss.getSheetByName('InvoiceTracking');
  if (!invoiceSheet) throw new Error('InvoiceTracking sheet not found');

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    const data = invoiceSheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === locationId) {
        const row = i + 1;
        const locationCode = data[i][1];
        const lastNumber = data[i][2] || 0;
        const nextNumber = parseInt(lastNumber) + 1;
        const paddedNumber = nextNumber.toString().padStart(6, '0');
        const invoiceNumber = `${locationCode}-${paddedNumber}`;

        invoiceSheet.getRange(row, 3).setValue(nextNumber);
        invoiceSheet.getRange(row, 4).setValue(invoiceNumber);

        lock.releaseLock();
        return invoiceNumber;
      }
    }

    lock.releaseLock();
    throw new Error('Location not found in InvoiceTracking: ' + locationId);
  } catch (e) {
    lock.releaseLock();
    throw e;
  }
}

function generateDescription(cart, providerInitials, collectorInitials) {
  const skus = cart.map(item => item.sku).join(', ');
  return `${providerInitials} | ${skus} | ${collectorInitials}`;
}

// ============================================================================
// PROMO CODE SERVICE
// ============================================================================

function validatePromoCode(code) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const promoSheet = ss.getSheetByName('PromoCodes');
  if (!promoSheet) throw new Error('PromoCodes sheet not found');

  const data = promoSheet.getDataRange().getValues();
  const upperCode = code.toUpperCase();
  const today = new Date();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0].toUpperCase() === upperCode) {
      const promoCode = {
        promoCode: row[0],
        discountType: row[1],
        discountValue: parseFloat(row[2]),
        active: row[3],
        startDate: new Date(row[4]),
        endDate: new Date(row[5]),
        usageLimit: parseInt(row[6]) || 0,
        timesUsed: parseInt(row[7]) || 0,
        applicableCategories: row[8] || 'ALL',
        applicableSkus: row[9] || '',
        rowIndex: i + 1
      };

      if (!promoCode.active) return { valid: false, error: 'This promo code is no longer active' };
      if (today < promoCode.startDate || today > promoCode.endDate) {
        return { valid: false, error: 'This promo code is not valid at this time' };
      }
      if (promoCode.usageLimit > 0 && promoCode.timesUsed >= promoCode.usageLimit) {
        return { valid: false, error: 'This promo code has reached its usage limit' };
      }

      return { valid: true, promo: promoCode };
    }
  }

  return { valid: false, error: 'Promo code not found' };
}

function incrementPromoUsage(code) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const promoSheet = ss.getSheetByName('PromoCodes');
  const data = promoSheet.getDataRange().getValues();
  const upperCode = code.toUpperCase();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toUpperCase() === upperCode) {
      const row = i + 1;
      const currentUsage = parseInt(data[i][7]) || 0;
      promoSheet.getRange(row, 8).setValue(currentUsage + 1);
      return true;
    }
  }
  return false;
}

// ============================================================================
// TRANSACTION SERVICE
// ============================================================================

function logTransaction(transactionData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const transactionSheet = ss.getSheetByName('Transactions');
  if (!transactionSheet) throw new Error('Transactions sheet not found');

  const timestamp = new Date();
  const transactionID = 'TXN-' + timestamp.getTime();
  const itemsJSON = JSON.stringify(transactionData.cart);
  const overridesJSON = JSON.stringify(transactionData.priceOverrides || []);
  const customerName = `${transactionData.customerFirstName} ${transactionData.customerLastName}`;

  transactionSheet.appendRow([
    transactionID,
    timestamp,
    transactionData.invoiceNumber,
    transactionData.customerID,
    customerName,
    transactionData.providerInitials,
    transactionData.collectorName,
    itemsJSON,
    transactionData.subtotal,
    transactionData.promoCode || '',
    transactionData.discount || 0,
    overridesJSON,
    transactionData.cashAmount || 0,
    transactionData.cardAmount || 0,
    transactionData.total,
    transactionData.paymentStatus,
    transactionData.authNetTransID || '',
    transactionData.locationID,
    transactionData.description,
    transactionData.emailReceipt || false
  ]);

  return { success: true, transactionID: transactionID, timestamp: timestamp };
}

function getTransactionByInvoice(invoiceNumber) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const transactionSheet = ss.getSheetByName('Transactions');
  const data = transactionSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === invoiceNumber) {
      return {
        transactionID: data[i][0],
        customerID: data[i][3],
        total: parseFloat(data[i][14])
      };
    }
  }
  return null;
}

// ============================================================================
// AUTHORIZE.NET SERVICE
// ============================================================================

function getAcceptHostedToken(checkoutData) {
  const locationId = checkoutData.locationID || getConfig('DEFAULT_LOCATION');
  const credentials = getAuthNetCredentials(locationId);
  const endpoint = getAuthNetEndpoint(locationId);

  const request = {
    "getHostedPaymentPageRequest": {
      "merchantAuthentication": {
        "name": credentials.apiLoginId,
        "transactionKey": credentials.transactionKey
      },
      "transactionRequest": {
        "transactionType": "authCaptureTransaction",
        "amount": checkoutData.cardAmount.toFixed(2),
        "order": {
          "invoiceNumber": checkoutData.invoiceNumber,
          "description": checkoutData.description
        },
        "customer": {
          "id": checkoutData.customerID,
          "email": checkoutData.customerEmail || ""
        },
        "billTo": {
          "firstName": checkoutData.firstName || "",
          "lastName": checkoutData.lastName || ""
        }
      },
      "hostedPaymentSettings": {
        "setting": [
          {
            "settingName": "hostedPaymentReturnOptions",
            "settingValue": JSON.stringify({
              "showReceipt": true,
              "url": checkoutData.returnUrl,
              "cancelUrl": checkoutData.cancelUrl
            })
          },
          {
            "settingName": "hostedPaymentBillingAddressOptions",
            "settingValue": JSON.stringify({
              "show": true,
              "required": false
            })
          },
          {
            "settingName": "hostedPaymentShippingAddressOptions",
            "settingValue": JSON.stringify({
              "show": false,
              "required": false
            })
          },
          {
            "settingName": "hostedPaymentButtonOptions",
            "settingValue": JSON.stringify({
              "text": "Pay"
            })
          },
          {
            "settingName": "hostedPaymentStyleOptions",
            "settingValue": JSON.stringify({
              "bgColor": "#ffffff"
            })
          }
        ]
      }
    }
  };

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(request),
    'muteHttpExceptions': true
  };

  try {
    const response = UrlFetchApp.fetch(endpoint, options);
    const result = JSON.parse(response.getContentText());

    if (result.messages.resultCode === 'Ok') {
      return { success: true, token: result.token };
    } else {
      return { success: false, error: result.messages.message[0].text };
    }
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function getAcceptHostedUrl(locationId) {
  const credentials = getAuthNetCredentials(locationId);
  return credentials.environment === 'PRODUCTION'
    ? 'https://accept.authorize.net/payment/payment'
    : 'https://test.authorize.net/payment/payment';
}

// ============================================================================
// CHECKOUT SERVICE
// ============================================================================

function processCheckout(checkoutData) {
  try {
    // Validate
    const cartValidation = validateCart(checkoutData.cart);
    if (!cartValidation.valid) throw new Error(cartValidation.error);

    const patientIdValidation = validatePatientId(checkoutData.patientId);
    if (!patientIdValidation.valid) throw new Error(patientIdValidation.error);

    const providerValidation = validateProviderInitials(checkoutData.providerInitials);
    if (!providerValidation.valid) throw new Error(providerValidation.error);

    // Handle customer
    let customer;
    if (checkoutData.newCustomer) {
      customer = createCustomer({
        patientId: checkoutData.patientId,
        firstName: checkoutData.newCustomer.firstName,
        lastName: checkoutData.newCustomer.lastName,
        email: checkoutData.newCustomer.email,
        phone: checkoutData.newCustomer.phone
      });
    } else {
      customer = findCustomer(checkoutData.patientId);
      if (!customer) throw new Error('Customer not found');
    }

    // Generate invoice
    const invoiceNumber = generateInvoiceNumber(checkoutData.locationID);
    const description = generateDescription(
      checkoutData.cart,
      checkoutData.providerInitials,
      checkoutData.collectorInitials
    );

    // Prepare transaction data
    const transactionData = {
      invoiceNumber: invoiceNumber,
      customerID: customer.customerID,
      customerFirstName: customer.firstName,
      customerLastName: customer.lastName,
      providerInitials: checkoutData.providerInitials,
      collectorName: getCurrentUser().name,
      cart: checkoutData.cart,
      subtotal: checkoutData.subtotal,
      promoCode: checkoutData.promoCode,
      discount: checkoutData.discount,
      priceOverrides: checkoutData.priceOverrides || [],
      cashAmount: checkoutData.cashAmount,
      cardAmount: checkoutData.cardAmount,
      total: checkoutData.total,
      paymentStatus: 'Pending',
      locationID: checkoutData.locationID,
      description: description,
      emailReceipt: checkoutData.emailReceipt || false
    };

    // Card payment
    if (checkoutData.cardAmount > 0) {
      const authNetData = {
        locationID: checkoutData.locationID,
        cardAmount: checkoutData.cardAmount,
        invoiceNumber: invoiceNumber,
        description: description,
        customerID: customer.customerID,
        customerEmail: checkoutData.receiptEmail || customer.email || '',
        firstName: customer.firstName,
        lastName: customer.lastName,
        returnUrl: ScriptApp.getService().getUrl() + '?status=success&invoice=' + invoiceNumber,
        cancelUrl: ScriptApp.getService().getUrl() + '?status=cancelled'
      };

      const tokenResult = getAcceptHostedToken(authNetData);
      if (!tokenResult.success) throw new Error('Failed to get payment token: ' + tokenResult.error);

      logTransaction(transactionData);
      if (checkoutData.promoCode) incrementPromoUsage(checkoutData.promoCode);

      return {
        success: true,
        authNetToken: tokenResult.token,
        hostedFormUrl: getAcceptHostedUrl(checkoutData.locationID),
        invoiceNumber: invoiceNumber
      };
    } else {
      // Cash only
      transactionData.paymentStatus = 'Completed';
      transactionData.authNetTransID = 'CASH-ONLY';
      logTransaction(transactionData);
      updateCustomerLTV(checkoutData.patientId, checkoutData.total);
      if (checkoutData.promoCode) incrementPromoUsage(checkoutData.promoCode);

      return { success: true, cashOnly: true, invoiceNumber: invoiceNumber };
    }
  } catch (error) {
    throw error;
  }
}

// ============================================================================
// HTML TEMPLATES (All frontend code embedded as strings)
// ============================================================================

function getIndexHTML() {
  return `<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ALC POS System</title>
  <?!= include('styles'); ?>
</head>
<body>
  <div class="container">
    <header>
      <div class="header-left">
        <h1>ALC Point of Sale</h1>
      </div>
      <div class="header-right">
        <div id="user-info" class="user-info"></div>
      </div>
    </header>

    <div class="main-layout">
      <div class="product-section">
        <h2>Products <span id="product-count" class="product-count"></span></h2>
        <div class="category-filters" id="category-filters">
          <button class="filter-btn active" onclick="filterCategory('All')">All</button>
        </div>
        <input type="text" id="product-search" class="search-input" placeholder="Search products by name or SKU...">
        <div id="product-grid" class="product-grid">
          <div class="loading">Loading products...</div>
        </div>
      </div>

      <div class="cart-section">
        <?!= include('customer'); ?>
        <?!= include('cart'); ?>
        <?!= include('checkout'); ?>
      </div>
    </div>

    <div id="modal" class="modal">
      <div class="modal-content">
        <span class="modal-close" onclick="closeModal()">&times;</span>
        <div id="modal-body"></div>
      </div>
    </div>
  </div>

  <?!= include('scripts'); ?>
</body>
</html>`;
}

function getStylesHTML() {
  return `<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
:root {
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --text-color: #1f2937;
  --text-light: #6b7280;
  --border-color: #e5e7eb;
  --bg-light: #f9fafb;
  --bg-white: #ffffff;
}
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg-light); color: var(--text-color); line-height: 1.6; }
.container { max-width: 1600px; margin: 0 auto; padding: 20px; }
header { background: var(--bg-white); padding: 20px 30px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; }
h1 { color: var(--text-color); font-size: 26px; font-weight: 700; }
.main-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; align-items: start; }
.product-section, .cart-section { background: var(--bg-white); padding: 25px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.category-filters { display: flex; flex-wrap: wrap; gap: 8px; margin: 15px 0; }
.filter-btn { padding: 8px 16px; border: 2px solid var(--border-color); background: var(--bg-white); border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s; }
.filter-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.filter-btn.active { background: var(--primary-color); color: white; border-color: var(--primary-color); }
.search-input { width: 100%; padding: 12px 16px; border: 2px solid var(--border-color); border-radius: 8px; margin-bottom: 20px; font-size: 14px; }
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 15px; max-height: 650px; overflow-y: auto; }
.product-card { border: 2px solid var(--border-color); border-radius: 10px; padding: 16px; cursor: pointer; transition: all 0.2s; background: var(--bg-white); }
.product-card:hover { border-color: var(--primary-color); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15); }
.product-card-sku { font-size: 11px; color: var(--text-light); margin-bottom: 6px; font-family: monospace; }
.product-card-name { font-weight: 600; margin-bottom: 8px; color: var(--text-color); font-size: 14px; min-height: 36px; }
.product-card-duration { font-size: 12px; color: var(--text-light); margin-bottom: 8px; }
.product-card-price { color: var(--success-color); font-size: 20px; font-weight: 700; }
.cart-section { position: sticky; top: 20px; display: flex; flex-direction: column; gap: 15px; }
.section-box { background: var(--bg-white); padding: 20px; border-radius: 12px; }
.form-group { margin-bottom: 14px; }
.form-group label { display: block; margin-bottom: 6px; color: var(--text-color); font-weight: 500; font-size: 14px; }
.form-group input, .form-group select { width: 100%; padding: 10px 12px; border: 2px solid var(--border-color); border-radius: 6px; font-size: 14px; }
.customer-info-box { background: #eff6ff; border: 2px solid #bfdbfe; padding: 14px; border-radius: 8px; margin-top: 12px; }
.cart-items { max-height: 300px; overflow-y: auto; margin-bottom: 15px; }
.cart-item { display: flex; justify-content: space-between; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid var(--border-color); }
.cart-item-name { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
.cart-item-meta { font-size: 12px; color: var(--text-light); }
.cart-item-price { font-weight: 700; color: var(--success-color); cursor: pointer; padding: 6px 10px; border-radius: 6px; }
.cart-item-price:hover { background: var(--bg-light); }
.cart-item-price.edited { background: #fef3c7; }
.btn { padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.2s; }
.btn-primary { background: var(--primary-color); color: white; }
.btn-primary:hover { background: var(--primary-hover); }
.btn-success { background: var(--success-color); color: white; width: 100%; font-size: 16px; padding: 14px; }
.btn-danger { background: var(--danger-color); color: white; }
.btn-full { width: 100%; margin-top: 10px; }
.cart-totals { border-top: 2px solid var(--border-color); padding-top: 16px; }
.total-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 15px; }
.total-row.grand-total { font-size: 22px; font-weight: 700; margin-top: 12px; padding-top: 12px; border-top: 2px solid var(--text-color); }
.modal { display: none; position: fixed; z-index: 2000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); }
.modal-content { background-color: white; margin: 10% auto; padding: 30px; border-radius: 12px; max-width: 500px; }
.modal-close { color: var(--text-light); float: right; font-size: 28px; font-weight: bold; cursor: pointer; }
.loading, .empty-cart { text-align: center; padding: 40px 20px; color: var(--text-light); }
@media (max-width: 1200px) { .main-layout { grid-template-columns: 1fr; } .cart-section { position: static; } }
</style>`;
}

function getCustomerHTML() {
  return `<div class="section-box customer-section">
  <h3>Customer Information</h3>
  <div class="form-group">
    <label>Patient ID *</label>
    <input type="text" id="patient-id" placeholder="e.g., JF123456" maxlength="8" style="text-transform: uppercase;">
  </div>
  <button class="btn btn-primary btn-full" onclick="lookupCustomer()">Lookup Customer</button>
  <div id="customer-details" style="display: none;">
    <div class="customer-info-box">
      <div><strong>Name:</strong> <span id="customer-name"></span></div>
      <div><strong>Lifetime Value:</strong> $<span id="customer-ltv">0.00</span></div>
      <div><strong>Total Visits:</strong> <span id="customer-visits">0</span></div>
    </div>
  </div>
  <div id="new-customer-form" style="display: none;">
    <div style="background: #fef3c7; border: 2px solid #fde047; color: #92400e; padding: 12px; border-radius: 8px; margin: 12px 0; font-size: 14px;">
      New customer - please enter details
    </div>
    <div class="form-group">
      <label>First Name *</label>
      <input type="text" id="first-name" required>
    </div>
    <div class="form-group">
      <label>Last Name *</label>
      <input type="text" id="last-name" required>
    </div>
    <div class="form-group">
      <label>Email (optional)</label>
      <input type="email" id="email">
    </div>
    <div class="form-group">
      <label>Phone (optional)</label>
      <input type="tel" id="phone" placeholder="555-123-4567">
    </div>
  </div>
  <div class="form-group" style="margin-top: 16px;">
    <label>Provider *</label>
    <select id="provider-select">
      <option value="">Select Provider...</option>
    </select>
  </div>
  <div class="form-group">
    <label>Collector (You)</label>
    <input type="text" id="collector-initials" readonly style="background: var(--bg-light);">
  </div>
</div>`;
}

function getCartHTML() {
  return `<div class="section-box cart-container">
  <h3>Shopping Cart <span id="cart-count" style="color: var(--text-light); font-weight: 400;"></span></h3>
  <div id="cart-items" class="cart-items">
    <div class="empty-cart">Cart is empty<br><small>Click products to add</small></div>
  </div>
  <div style="margin: 16px 0; display: flex; gap: 8px;">
    <input type="text" id="promo-code" placeholder="Promo code" style="flex: 1; padding: 10px 12px; border: 2px solid var(--border-color); border-radius: 6px; font-size: 14px; text-transform: uppercase;">
    <button class="btn btn-primary" onclick="applyPromo()">Apply</button>
  </div>
  <div id="promo-applied" style="display: none; background: #d1fae5; border: 2px solid #6ee7b7; padding: 10px 12px; border-radius: 6px; margin-bottom: 12px; font-size: 14px;">
    <span id="promo-text"></span>
    <button onclick="removePromo()" style="float: right; background: var(--danger-color); color: white; border: none; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 700;">×</button>
  </div>
  <div class="cart-totals">
    <div class="total-row">
      <span>Subtotal:</span>
      <span id="subtotal">$0.00</span>
    </div>
    <div class="total-row" id="discount-row" style="display: none;">
      <span>Discount:</span>
      <span id="discount" style="color: var(--success-color);">-$0.00</span>
    </div>
    <div class="total-row grand-total">
      <span>Total:</span>
      <span id="total">$0.00</span>
    </div>
  </div>
  <button class="btn btn-danger btn-full" onclick="clearCart()">Clear Cart</button>
</div>`;
}

function getCheckoutHTML() {
  return `<div class="section-box checkout-section">
  <h3>Payment</h3>
  <div style="margin: 16px 0;">
    <label style="display: flex; align-items: center; padding: 12px; border: 2px solid var(--border-color); border-radius: 8px; margin-bottom: 10px; cursor: pointer;">
      <input type="radio" name="payment-method" value="card-only" checked onchange="toggleSplitPayment()" style="margin-right: 10px;">
      <span>Credit Card Only</span>
    </label>
    <label style="display: flex; align-items: center; padding: 12px; border: 2px solid var(--border-color); border-radius: 8px; cursor: pointer;">
      <input type="radio" name="payment-method" value="split" onchange="toggleSplitPayment()" style="margin-right: 10px;">
      <span>Cash + Card Split</span>
    </label>
  </div>
  <div id="split-payment-inputs" style="display: none; margin-top: 12px; padding: 12px; background: var(--bg-light); border-radius: 6px;">
    <div class="form-group">
      <label>Cash Amount</label>
      <input type="number" id="cash-amount" step="0.01" min="0" placeholder="0.00" oninput="calculateCardAmount()">
    </div>
    <div class="form-group">
      <label>Card Amount (auto-calculated)</label>
      <input type="number" id="card-amount" step="0.01" min="0" placeholder="0.00" readonly style="background: var(--bg-light);">
    </div>
  </div>
  <div style="margin: 12px 0; display: flex; align-items: center;">
    <input type="checkbox" id="email-receipt-check" onchange="toggleEmailInput()" style="margin-right: 8px;">
    <label for="email-receipt-check">Email receipt to patient</label>
  </div>
  <div id="email-input-group" style="display: none;">
    <div class="form-group">
      <label>Patient Email</label>
      <input type="email" id="receipt-email" placeholder="patient@example.com">
    </div>
  </div>
  <button class="btn btn-success btn-full" id="checkout-btn" onclick="checkout()">Process Payment</button>
  <div id="processing-message" style="display: none; text-align: center; margin-top: 12px;">
    <div class="loading">Processing payment...</div>
  </div>
</div>`;
}

function getScriptsHTML() {
  return `<script>
let products = [], cart = [], currentCustomer = null, appliedPromo = null, currentFilter = 'All', currentUser = null, currentLocation = null;

window.onload = function() {
  google.script.run.withSuccessHandler(function(user) {
    currentUser = user;
    document.getElementById('user-info').innerHTML = '<div style="font-weight: 600;">' + user.name + '</div><div style="font-size: 13px; color: var(--text-light);">' + user.email + '</div>';
    document.getElementById('collector-initials').value = user.initials;
  }).getCurrentUser();

  google.script.run.withSuccessHandler(function(locs) {
    currentLocation = locs[0];
  }).getAllLocations();

  google.script.run.withSuccessHandler(function(providers) {
    const select = document.getElementById('provider-select');
    providers.forEach(provider => {
      const option = document.createElement('option');
      option.value = provider;
      option.textContent = provider;
      select.appendChild(option);
    });
  }).getProviderList();

  loadProducts();
};

function loadProducts() {
  google.script.run.withSuccessHandler(function(data) {
    products = data;
    const categories = ['All', ...new Set(products.map(p => p.category))];
    const container = document.getElementById('category-filters');
    container.innerHTML = '';
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn' + (cat === 'All' ? ' active' : '');
      btn.textContent = cat;
      btn.onclick = () => filterCategory(cat);
      container.appendChild(btn);
    });
    renderProducts();
  }).withFailureHandler(alert).getAllProducts();
}

function filterCategory(category) {
  currentFilter = category;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent === category) btn.classList.add('active');
  });
  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('product-grid');
  const searchTerm = document.getElementById('product-search').value.toLowerCase();
  const filtered = products.filter(p => {
    const matchesCategory = currentFilter === 'All' || p.category === currentFilter;
    const matchesSearch = searchTerm === '' || p.sku.toLowerCase().includes(searchTerm) || p.itemName.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });
  document.getElementById('product-count').textContent = '(' + filtered.length + ')';
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-cart">No products found</div>';
    return;
  }
  grid.innerHTML = filtered.map(p => '<div class="product-card" onclick=\\'addToCart(' + JSON.stringify(p).replace(/'/g, "\\\\'") + ')\\'><div class="product-card-sku">' + p.sku + '</div><div class="product-card-name">' + p.itemName + '</div><div class="product-card-duration">' + p.duration + '</div><div class="product-card-price">$' + p.basePrice.toFixed(2) + '</div></div>').join('');
}

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('product-search');
  if (searchInput) searchInput.addEventListener('input', renderProducts);
});

function addToCart(product) {
  const existingIndex = cart.findIndex(item => item.sku === product.sku);
  if (existingIndex >= 0) {
    cart[existingIndex].quantity++;
  } else {
    cart.push({ ...product, quantity: 1, currentPrice: product.basePrice, priceEdited: false, overrideReason: null });
  }
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cart-items');
  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-cart">Cart is empty<br><small>Click products to add</small></div>';
    updateTotals();
    return;
  }
  container.innerHTML = cart.map((item, index) => '<div class="cart-item"><div class="cart-item-info"><div class="cart-item-name">' + item.itemName + '</div><div class="cart-item-meta">' + item.sku + ' × ' + item.quantity + (item.priceEdited ? ' <span style="background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px; font-size: 11px;">' + item.overrideReason + '</span>' : '') + '</div></div><div style="display: flex; align-items: center; gap: 10px;"><div class="cart-item-price ' + (item.priceEdited ? 'edited' : '') + '" onclick="editPrice(' + index + ')" title="Double-click to edit">$' + (item.currentPrice * item.quantity).toFixed(2) + '</div><button onclick="removeFromCart(' + index + ')" style="background: var(--danger-color); color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 700;">×</button></div></div>').join('');
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = '(' + itemCount + ' items)';
  updateTotals();
}

function editPrice(index) {
  const item = cart[index];
  const currentTotal = (item.currentPrice * item.quantity).toFixed(2);
  showModal('<h4>Edit Price - ' + item.itemName + '</h4><p style="color: var(--text-light); margin-bottom: 16px;">Original: $' + (item.basePrice * item.quantity).toFixed(2) + '</p><div style="display: flex; gap: 10px; margin-bottom: 16px;"><button onclick="applyOverride(' + index + ', ' + (item.basePrice * item.quantity * 0.8) + ', \\'Grandfathered\\')" style="flex: 1; padding: 10px; border: 2px solid var(--border-color); background: white; border-radius: 6px; cursor: pointer; font-weight: 500;">Grandfathered</button><button onclick="applyOverride(' + index + ', ' + (item.basePrice * item.quantity * 0.5) + ', \\'F&F\\')" style="flex: 1; padding: 10px; border: 2px solid var(--border-color); background: white; border-radius: 6px; cursor: pointer; font-weight: 500;">F&F (50%)</button></div><div class="form-group"><label>Or enter custom price:</label><input type="number" id="custom-price" step="0.01" value="' + currentTotal + '" style="width: 100%;"></div><button class="btn btn-primary btn-full" onclick="applyCustomOverride(' + index + ')">Apply Custom Price</button><button class="btn btn-danger btn-full" onclick="closeModal()">Cancel</button>');
}

function applyOverride(index, newTotal, reason) {
  cart[index].currentPrice = newTotal / cart[index].quantity;
  cart[index].priceEdited = true;
  cart[index].overrideReason = reason;
  closeModal();
  renderCart();
}

function applyCustomOverride(index) {
  const customPrice = parseFloat(document.getElementById('custom-price').value);
  if (isNaN(customPrice) || customPrice < 0) { alert('Please enter a valid price'); return; }
  applyOverride(index, customPrice, 'Custom');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function clearCart() {
  if (cart.length === 0) return;
  if (confirm('Clear entire cart?')) {
    cart = [];
    appliedPromo = null;
    document.getElementById('promo-applied').style.display = 'none';
    document.getElementById('promo-code').value = '';
    renderCart();
  }
}

function updateTotals() {
  let subtotal = cart.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0);
  let discount = 0;
  if (appliedPromo) {
    let applicableTotal = subtotal;
    if (appliedPromo.discountType === 'Percentage') {
      discount = applicableTotal * (appliedPromo.discountValue / 100);
    } else {
      discount = Math.min(appliedPromo.discountValue, applicableTotal);
    }
  }
  const total = subtotal - discount;
  document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
  document.getElementById('discount').textContent = '-$' + discount.toFixed(2);
  document.getElementById('total').textContent = '$' + total.toFixed(2);
  document.getElementById('discount-row').style.display = discount > 0 ? 'flex' : 'none';
  if (document.querySelector('input[name="payment-method"]:checked').value === 'split') {
    calculateCardAmount();
  }
}

function lookupCustomer() {
  const patientId = document.getElementById('patient-id').value.trim().toUpperCase();
  if (!patientId) { alert('Please enter a Patient ID'); return; }
  google.script.run.withSuccessHandler(function(customer) {
    if (customer) {
      currentCustomer = customer;
      document.getElementById('customer-name').textContent = customer.firstName + ' ' + customer.lastName;
      document.getElementById('customer-ltv').textContent = customer.lifetimeValue.toFixed(2);
      document.getElementById('customer-visits').textContent = customer.totalTransactions;
      document.getElementById('customer-details').style.display = 'block';
      document.getElementById('new-customer-form').style.display = 'none';
      if (customer.email) document.getElementById('receipt-email').value = customer.email;
    } else {
      currentCustomer = null;
      document.getElementById('customer-details').style.display = 'none';
      document.getElementById('new-customer-form').style.display = 'block';
    }
  }).withFailureHandler(alert).findCustomer(patientId);
}

function applyPromo() {
  const code = document.getElementById('promo-code').value.trim().toUpperCase();
  if (!code) return;
  google.script.run.withSuccessHandler(function(validation) {
    if (validation.valid) {
      appliedPromo = validation.promo;
      document.getElementById('promo-applied').style.display = 'block';
      document.getElementById('promo-text').textContent = validation.promo.promoCode + ': ' + (validation.promo.discountType === 'Percentage' ? validation.promo.discountValue + '%' : '$' + validation.promo.discountValue) + ' off';
      updateTotals();
    } else {
      alert(validation.error);
    }
  }).withFailureHandler(alert).validatePromoCode(code);
}

function removePromo() {
  appliedPromo = null;
  document.getElementById('promo-applied').style.display = 'none';
  document.getElementById('promo-code').value = '';
  updateTotals();
}

function toggleSplitPayment() {
  const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
  const splitInputs = document.getElementById('split-payment-inputs');
  if (paymentMethod === 'split') {
    splitInputs.style.display = 'block';
    calculateCardAmount();
  } else {
    splitInputs.style.display = 'none';
    document.getElementById('cash-amount').value = '';
    document.getElementById('card-amount').value = '';
  }
}

function calculateCardAmount() {
  const total = parseFloat(document.getElementById('total').textContent.replace('$', ''));
  const cashAmount = parseFloat(document.getElementById('cash-amount').value) || 0;
  const cardAmount = Math.max(0, total - cashAmount);
  document.getElementById('card-amount').value = cardAmount.toFixed(2);
}

function toggleEmailInput() {
  const checked = document.getElementById('email-receipt-check').checked;
  document.getElementById('email-input-group').style.display = checked ? 'block' : 'none';
}

function checkout() {
  const errors = [];
  const patientId = document.getElementById('patient-id').value.trim();
  if (!patientId) errors.push('- Patient ID is required');
  const provider = document.getElementById('provider-select').value;
  if (!provider) errors.push('- Provider must be selected');
  if (!currentCustomer) {
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    if (!firstName || !lastName) errors.push('- Customer first and last name are required');
  }
  if (cart.length === 0) errors.push('- Cart is empty');
  const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
  if (paymentMethod === 'split') {
    const cashAmount = parseFloat(document.getElementById('cash-amount').value) || 0;
    const cardAmount = parseFloat(document.getElementById('card-amount').value) || 0;
    const total = parseFloat(document.getElementById('total').textContent.replace('$', ''));
    if (Math.abs((cashAmount + cardAmount) - total) > 0.01) errors.push('- Payment amounts do not match total');
    if (cashAmount <= 0) errors.push('- Cash amount must be greater than zero for split payment');
  }
  if (document.getElementById('email-receipt-check').checked) {
    const email = document.getElementById('receipt-email').value.trim();
    if (!email) errors.push('- Email address is required for receipt');
  }
  if (errors.length > 0) { alert('Please fix the following errors:\\n\\n' + errors.join('\\n')); return; }

  const subtotal = parseFloat(document.getElementById('subtotal').textContent.replace('$', ''));
  const discount = parseFloat(document.getElementById('discount').textContent.replace('-$', ''));
  const total = parseFloat(document.getElementById('total').textContent.replace('$', ''));
  let cashAmount = 0;
  let cardAmount = total;
  if (paymentMethod === 'split') {
    cashAmount = parseFloat(document.getElementById('cash-amount').value) || 0;
    cardAmount = parseFloat(document.getElementById('card-amount').value) || 0;
  }
  const priceOverrides = cart.filter(item => item.priceEdited).map(item => ({
    sku: item.sku,
    originalPrice: item.basePrice,
    newPrice: item.currentPrice,
    reason: item.overrideReason
  }));
  const data = {
    patientId: patientId,
    providerInitials: provider,
    collectorInitials: document.getElementById('collector-initials').value,
    cart: cart,
    subtotal: subtotal,
    promoCode: appliedPromo ? appliedPromo.promoCode : null,
    discount: discount,
    priceOverrides: priceOverrides,
    cashAmount: cashAmount,
    cardAmount: cardAmount,
    total: total,
    locationID: currentLocation.locationID,
    emailReceipt: document.getElementById('email-receipt-check').checked,
    receiptEmail: document.getElementById('receipt-email').value.trim()
  };
  if (!currentCustomer) {
    data.newCustomer = {
      firstName: document.getElementById('first-name').value.trim(),
      lastName: document.getElementById('last-name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim()
    };
  }

  document.getElementById('checkout-btn').disabled = true;
  document.getElementById('processing-message').style.display = 'block';

  // Open payment window immediately to preserve user gesture
  const paymentWindow = window.open('', '_blank');
  if (paymentWindow) {
    paymentWindow.document.write('<html><body><h2>Processing payment...</h2><p>Please wait while we redirect you to the payment page.</p></body></html>');
  }

  google.script.run.withSuccessHandler(function(result) {
    if (result.success && result.authNetToken) {
      // Create form HTML that will auto-submit in the new window
      const formHtml = '<!DOCTYPE html><html><body><form id="paymentForm" method="POST" action="' + result.hostedFormUrl + '">' +
        '<input type="hidden" name="token" value="' + result.authNetToken + '" />' +
        '</form><script>document.getElementById("paymentForm").submit();</script></body></html>';

      if (paymentWindow && !paymentWindow.closed) {
        paymentWindow.document.open();
        paymentWindow.document.write(formHtml);
        paymentWindow.document.close();
      } else {
        // Fallback: try direct navigation
        alert('Please allow popups for this site, then try again.');
        document.getElementById('checkout-btn').disabled = false;
        document.getElementById('processing-message').style.display = 'none';
      }
    } else {
      if (paymentWindow && !paymentWindow.closed) {
        paymentWindow.close();
      }
      alert('Transaction completed successfully!');
      resetCheckout();
    }
  }).withFailureHandler(function(error) {
    if (paymentWindow && !paymentWindow.closed) {
      paymentWindow.close();
    }
    document.getElementById('checkout-btn').disabled = false;
    document.getElementById('processing-message').style.display = 'none';
    alert('Checkout failed: ' + error.message);
  }).processCheckout(data);
}

function resetCheckout() {
  cart = [];
  currentCustomer = null;
  appliedPromo = null;
  document.getElementById('patient-id').value = '';
  document.getElementById('provider-select').value = '';
  document.getElementById('customer-details').style.display = 'none';
  document.getElementById('new-customer-form').style.display = 'none';
  document.getElementById('promo-code').value = '';
  document.getElementById('promo-applied').style.display = 'none';
  document.getElementById('email-receipt-check').checked = false;
  document.getElementById('email-input-group').style.display = 'none';
  document.getElementById('checkout-btn').disabled = false;
  document.getElementById('processing-message').style.display = 'none';
  renderCart();
}

function showModal(content) {
  document.getElementById('modal-body').innerHTML = content;
  document.getElementById('modal').style.display = 'block';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('modal');
  if (event.target == modal) closeModal();
};
</script>`;
}
