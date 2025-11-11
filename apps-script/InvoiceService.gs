/**
 * Invoice Management Service
 *
 * Generates invoice numbers in LOC-000001 format
 */

/**
 * Generate next invoice number for a location
 */
function generateInvoiceNumber(locationId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const invoiceSheet = ss.getSheetByName('InvoiceTracking');

  if (!invoiceSheet) {
    throw new Error('InvoiceTracking sheet not found');
  }

  // Use lock to prevent race conditions with concurrent checkouts
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // Wait up to 30 seconds for lock

    const data = invoiceSheet.getDataRange().getValues();

    // Find the location's row
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === locationId) {
        const row = i + 1;
        const locationCode = data[i][1];
        const lastNumber = data[i][2] || 0;
        const nextNumber = parseInt(lastNumber) + 1;

        // Format: LOC-000001
        const paddedNumber = nextNumber.toString().padStart(6, '0');
        const invoiceNumber = `${locationCode}-${paddedNumber}`;

        // Update the sheet
        invoiceSheet.getRange(row, 3).setValue(nextNumber); // LastNumber
        invoiceSheet.getRange(row, 4).setValue(invoiceNumber); // CurrentFormat

        Logger.log(`Generated invoice number: ${invoiceNumber}`);

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

/**
 * Generate transaction description
 * Format: "BA | SKU1, SKU2 | GK"
 */
function generateDescription(cart, providerInitials, collectorInitials) {
  // Extract SKUs from cart
  const skus = cart.map(item => item.sku).join(', ');

  // Format: Provider | SKUs | Collector
  const description = `${providerInitials} | ${skus} | ${collectorInitials}`;

  return description;
}

/**
 * Get current invoice number (without incrementing)
 */
function getCurrentInvoiceNumber(locationId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const invoiceSheet = ss.getSheetByName('InvoiceTracking');
  const data = invoiceSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === locationId) {
      return data[i][3]; // CurrentFormat
    }
  }

  return null;
}

/**
 * Set invoice number (for manual corrections)
 */
function setInvoiceNumber(locationId, number) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const invoiceSheet = ss.getSheetByName('InvoiceTracking');
  const data = invoiceSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === locationId) {
      const row = i + 1;
      const locationCode = data[i][1];
      const paddedNumber = number.toString().padStart(6, '0');
      const invoiceNumber = `${locationCode}-${paddedNumber}`;

      invoiceSheet.getRange(row, 3).setValue(number); // LastNumber
      invoiceSheet.getRange(row, 4).setValue(invoiceNumber); // CurrentFormat

      Logger.log(`Manually set invoice number: ${invoiceNumber}`);
      return invoiceNumber;
    }
  }

  throw new Error('Location not found: ' + locationId);
}

/**
 * Validate invoice number format
 */
function validateInvoiceNumber(invoiceNumber) {
  // Format: LOC-000001 or LOC1-000001, etc.
  const pattern = /^[A-Z0-9]+-\d{6}$/;

  if (!pattern.test(invoiceNumber)) {
    return {
      valid: false,
      error: 'Invalid invoice number format. Expected: LOC-000001'
    };
  }

  return {
    valid: true
  };
}
