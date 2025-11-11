/**
 * ALC POS System - Main Entry Point
 *
 * This is the main entry point for the Google Apps Script web application.
 * It handles routing and serves the HTML interface.
 */

/**
 * Serves the main HTML interface when someone accesses the web app
 */
function doGet(e) {
  // Get user email for auto-detecting collector initials
  const userEmail = Session.getActiveUser().getEmail();

  const template = HtmlService.createTemplateFromFile('index');
  template.userEmail = userEmail;

  return template.evaluate()
    .setTitle('ALC POS System')
    .setFaviconUrl('https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Include helper for HTML templates
 * Allows modular HTML files
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Get current user's information
 */
function getCurrentUser() {
  const email = Session.getActiveUser().getEmail();
  const name = email.split('@')[0];

  // Generate initials from email (first letter of first and last name parts)
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

/**
 * Test function to verify setup
 */
function testSetup() {
  Logger.log('=== Testing ALC POS Setup ===');

  try {
    // Test Config
    Logger.log('Testing Config...');
    const config = getAllConfig();
    Logger.log('Config loaded: ' + Object.keys(config).length + ' keys');

    // Test Products
    Logger.log('Testing Products...');
    const products = getAllProducts();
    Logger.log('Found ' + products.length + ' active products');

    // Test Locations
    Logger.log('Testing Locations...');
    const locations = getAllLocations();
    Logger.log('Found ' + locations.length + ' locations');

    // Test Invoice Generation
    Logger.log('Testing Invoice Generation...');
    const testInvoice = generateInvoiceNumber('LOC-001');
    Logger.log('Generated invoice: ' + testInvoice);

    Logger.log('=== All Tests Passed! ===');
    return {
      success: true,
      productCount: products.length,
      locationCount: locations.length,
      testInvoice: testInvoice
    };

  } catch (error) {
    Logger.log('ERROR: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Reset invoice counter (use with caution!)
 */
function resetInvoiceCounter(locationId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('InvoiceTracking');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === locationId) {
      sheet.getRange(i + 1, 3).setValue(0); // Reset LastNumber
      Logger.log('Reset invoice counter for ' + locationId);
      return true;
    }
  }

  return false;
}

/**
 * Manual backup function (creates a copy of the spreadsheet)
 */
function createBackup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd_HH-mm');
  const backupName = 'ALC_POS_Backup_' + timestamp;

  const backup = ss.copy(backupName);
  Logger.log('Backup created: ' + backupName);

  return {
    success: true,
    backupName: backupName,
    backupId: backup.getId()
  };
}
