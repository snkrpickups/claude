/**
 * Input Validation Service
 *
 * Validates user inputs for patient IDs, emails, prices, etc.
 */

/**
 * Validate Patient ID format (e.g., JF123456)
 */
function validatePatientId(patientId) {
  if (!patientId) {
    return {
      valid: false,
      error: 'Patient ID is required'
    };
  }

  const regex = getConfig('PATIENT_ID_REGEX') || '^[A-Z]{2}\\d{6}$';
  const pattern = new RegExp(regex);

  if (!pattern.test(patientId)) {
    return {
      valid: false,
      error: 'Invalid Patient ID format. Expected format: 2 letters + 6 digits (e.g., JF123456)'
    };
  }

  return {
    valid: true
  };
}

/**
 * Validate email address
 */
function validateEmail(email) {
  if (!email) {
    return { valid: true }; // Email is optional
  }

  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!pattern.test(email)) {
    return {
      valid: false,
      error: 'Invalid email address'
    };
  }

  return {
    valid: true
  };
}

/**
 * Validate phone number
 */
function validatePhone(phone) {
  if (!phone) {
    return { valid: true }; // Phone is optional
  }

  // Remove all non-digits
  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length < 10) {
    return {
      valid: false,
      error: 'Phone number must be at least 10 digits'
    };
  }

  return {
    valid: true
  };
}

/**
 * Validate price (must be positive number)
 */
function validatePrice(price) {
  const numPrice = parseFloat(price);

  if (isNaN(numPrice)) {
    return {
      valid: false,
      error: 'Price must be a number'
    };
  }

  if (numPrice < 0) {
    return {
      valid: false,
      error: 'Price cannot be negative'
    };
  }

  return {
    valid: true,
    value: numPrice
  };
}

/**
 * Validate provider initials
 */
function validateProviderInitials(initials) {
  if (!initials) {
    return {
      valid: false,
      error: 'Provider initials are required'
    };
  }

  const providerList = getProviderList();

  if (!providerList.includes(initials)) {
    return {
      valid: false,
      error: 'Invalid provider initials. Must be one of: ' + providerList.join(', ')
    };
  }

  return {
    valid: true
  };
}

/**
 * Validate cart items
 */
function validateCart(cart) {
  if (!cart || cart.length === 0) {
    return {
      valid: false,
      error: 'Cart is empty'
    };
  }

  // Check each item
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];

    if (!item.sku) {
      return {
        valid: false,
        error: 'Item missing SKU at position ' + (i + 1)
      };
    }

    if (!item.currentPrice || item.currentPrice <= 0) {
      return {
        valid: false,
        error: 'Invalid price for ' + item.sku
      };
    }

    if (!item.quantity || item.quantity <= 0) {
      return {
        valid: false,
        error: 'Invalid quantity for ' + item.sku
      };
    }
  }

  return {
    valid: true
  };
}

/**
 * Validate split payment amounts
 */
function validateSplitPayment(cashAmount, cardAmount, total) {
  const cash = parseFloat(cashAmount) || 0;
  const card = parseFloat(cardAmount) || 0;
  const expectedTotal = parseFloat(total);

  if (cash < 0 || card < 0) {
    return {
      valid: false,
      error: 'Payment amounts cannot be negative'
    };
  }

  const paymentTotal = cash + card;
  const difference = Math.abs(paymentTotal - expectedTotal);

  // Allow 1 cent difference for rounding
  if (difference > 0.01) {
    return {
      valid: false,
      error: `Payment amounts ($${paymentTotal.toFixed(2)}) don't match total ($${expectedTotal.toFixed(2)})`
    };
  }

  if (cash > 0 && card === 0) {
    return {
      valid: false,
      error: 'Cash-only payments not supported. Use split payment or card only.'
    };
  }

  return {
    valid: true,
    cashAmount: cash,
    cardAmount: card
  };
}
