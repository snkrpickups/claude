/**
 * Promo Code Service
 *
 * Validates and applies promo codes with configurable application rules
 */

/**
 * Validate a promo code
 */
function validatePromoCode(code) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const promoSheet = ss.getSheetByName('PromoCodes');

  if (!promoSheet) {
    throw new Error('PromoCodes sheet not found');
  }

  const data = promoSheet.getDataRange().getValues();
  const upperCode = code.toUpperCase();
  const today = new Date();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    if (row[0].toUpperCase() === upperCode) {
      // Found the promo code, check if it's valid
      const promoCode = {
        promoCode: row[0],
        discountType: row[1], // "Percentage" or "Fixed"
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

      // Check if active
      if (!promoCode.active) {
        return {
          valid: false,
          error: 'This promo code is no longer active'
        };
      }

      // Check date range
      if (today < promoCode.startDate || today > promoCode.endDate) {
        return {
          valid: false,
          error: 'This promo code is not valid at this time'
        };
      }

      // Check usage limit
      if (promoCode.usageLimit > 0 && promoCode.timesUsed >= promoCode.usageLimit) {
        return {
          valid: false,
          error: 'This promo code has reached its usage limit'
        };
      }

      return {
        valid: true,
        promo: promoCode
      };
    }
  }

  return {
    valid: false,
    error: 'Promo code not found'
  };
}

/**
 * Calculate discount for a promo code on a cart
 */
function calculatePromoDiscount(promo, cart) {
  let applicableTotal = 0;

  // Determine which items the promo applies to
  if (promo.applicableCategories === 'ALL') {
    // Apply to entire cart
    applicableTotal = cart.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0);
  } else {
    // Apply only to specific categories or SKUs
    const categories = promo.applicableCategories.split(',').map(c => c.trim().toUpperCase());
    const skus = promo.applicableSkus ? promo.applicableSkus.split(',').map(s => s.trim().toUpperCase()) : [];

    cart.forEach(item => {
      const categoryMatch = categories.includes(item.category.toUpperCase());
      const skuMatch = skus.length === 0 || skus.includes(item.sku.toUpperCase());

      if (categoryMatch || skuMatch) {
        applicableTotal += item.currentPrice * item.quantity;
      }
    });
  }

  // Calculate discount
  let discount = 0;
  if (promo.discountType === 'Percentage') {
    discount = applicableTotal * (promo.discountValue / 100);
  } else {
    discount = Math.min(promo.discountValue, applicableTotal); // Can't discount more than total
  }

  return {
    applicableTotal: applicableTotal,
    discount: discount,
    finalTotal: applicableTotal - discount
  };
}

/**
 * Increment promo code usage counter
 */
function incrementPromoUsage(code) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const promoSheet = ss.getSheetByName('PromoCodes');
  const data = promoSheet.getDataRange().getValues();
  const upperCode = code.toUpperCase();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toUpperCase() === upperCode) {
      const row = i + 1;
      const currentUsage = parseInt(data[i][7]) || 0;
      promoSheet.getRange(row, 8).setValue(currentUsage + 1); // Increment TimesUsed
      Logger.log(`Incremented promo usage: ${code} (now ${currentUsage + 1})`);
      return true;
    }
  }

  return false;
}

/**
 * Create new promo code (admin function)
 */
function createPromoCode(promoData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const promoSheet = ss.getSheetByName('PromoCodes');

  // Check if code already exists
  const validation = validatePromoCode(promoData.code);
  if (validation.valid) {
    throw new Error('Promo code already exists: ' + promoData.code);
  }

  promoSheet.appendRow([
    promoData.code.toUpperCase(),
    promoData.discountType, // "Percentage" or "Fixed"
    promoData.discountValue,
    true, // active
    promoData.startDate || new Date(),
    promoData.endDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    promoData.usageLimit || 0,
    0, // timesUsed
    promoData.applicableCategories || 'ALL',
    promoData.applicableSkus || ''
  ]);

  Logger.log('Created new promo code: ' + promoData.code);
  return true;
}

/**
 * Deactivate promo code
 */
function deactivatePromoCode(code) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const promoSheet = ss.getSheetByName('PromoCodes');
  const data = promoSheet.getDataRange().getValues();
  const upperCode = code.toUpperCase();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toUpperCase() === upperCode) {
      promoSheet.getRange(i + 1, 4).setValue(false); // Set active to FALSE
      Logger.log('Deactivated promo code: ' + code);
      return true;
    }
  }

  throw new Error('Promo code not found: ' + code);
}

/**
 * Get all active promo codes (for admin view)
 */
function getAllPromoCodes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const promoSheet = ss.getSheetByName('PromoCodes');
  const data = promoSheet.getDataRange().getValues();

  const promos = [];
  for (let i = 1; i < data.length; i++) {
    promos.push({
      promoCode: data[i][0],
      discountType: data[i][1],
      discountValue: data[i][2],
      active: data[i][3],
      startDate: data[i][4],
      endDate: data[i][5],
      usageLimit: data[i][6],
      timesUsed: data[i][7],
      applicableCategories: data[i][8],
      applicableSkus: data[i][9]
    });
  }

  return promos;
}
