/**
 * Checkout Processing Service
 *
 * Orchestrates the complete checkout flow
 */

/**
 * Main checkout processing function
 * Called from frontend when user clicks "Process Payment"
 */
function processCheckout(checkoutData) {
  try {
    Logger.log('Starting checkout process');
    Logger.log('Checkout data: ' + JSON.stringify(checkoutData));

    // Step 1: Validate all inputs
    validateCheckoutData(checkoutData);

    // Step 2: Handle customer (create if new, or get existing)
    let customer;
    if (checkoutData.newCustomer) {
      customer = createCustomer({
        patientId: checkoutData.patientId,
        firstName: checkoutData.newCustomer.firstName,
        lastName: checkoutData.newCustomer.lastName,
        email: checkoutData.newCustomer.email,
        phone: checkoutData.newCustomer.phone
      });
      Logger.log('Created new customer: ' + customer.customerID);
    } else {
      customer = findCustomer(checkoutData.patientId);
      if (!customer) {
        throw new Error('Customer not found');
      }
      Logger.log('Found existing customer: ' + customer.customerID);
    }

    // Step 3: Generate invoice number
    const invoiceNumber = generateInvoiceNumber(checkoutData.locationID);
    Logger.log('Generated invoice: ' + invoiceNumber);

    // Step 4: Generate description (Provider | SKUs | Collector)
    const description = generateDescription(
      checkoutData.cart,
      checkoutData.providerInitials,
      checkoutData.collectorInitials
    );
    Logger.log('Description: ' + description);

    // Step 5: Prepare transaction data
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

    // Step 6: If card payment required, get Authorize.net token
    if (checkoutData.cardAmount > 0) {
      Logger.log('Card payment required: $' + checkoutData.cardAmount);

      // Prepare Authorize.net request
      const authNetData = {
        locationID: checkoutData.locationID,
        cardAmount: checkoutData.cardAmount,
        invoiceNumber: invoiceNumber,
        description: description,
        customerID: customer.customerID,
        customerEmail: checkoutData.receiptEmail || customer.email || '',
        firstName: customer.firstName,
        lastName: customer.lastName,
        returnUrl: getWebAppUrl() + '?status=success&invoice=' + invoiceNumber,
        cancelUrl: getWebAppUrl() + '?status=cancelled'
      };

      const tokenResult = getAcceptHostedToken(authNetData);

      if (!tokenResult.success) {
        throw new Error('Failed to get payment token: ' + tokenResult.error);
      }

      Logger.log('Got Authorize.net token');

      // Log transaction with pending status
      const transactionResult = logTransaction(transactionData);
      Logger.log('Transaction logged: ' + transactionResult.transactionID);

      // Increment promo usage if applicable
      if (checkoutData.promoCode) {
        incrementPromoUsage(checkoutData.promoCode);
      }

      // Return success with token (frontend will redirect to Authorize.net)
      return {
        success: true,
        authNetToken: tokenResult.token,
        hostedFormUrl: getAcceptHostedUrl(checkoutData.locationID),
        transactionID: transactionResult.transactionID,
        invoiceNumber: invoiceNumber
      };

    } else {
      // Cash only payment (no card)
      transactionData.paymentStatus = 'Completed';
      transactionData.authNetTransID = 'CASH-ONLY';

      const transactionResult = logTransaction(transactionData);
      Logger.log('Cash transaction logged: ' + transactionResult.transactionID);

      // Update customer LTV immediately
      updateCustomerLTV(checkoutData.patientId, checkoutData.total);

      // Increment promo usage if applicable
      if (checkoutData.promoCode) {
        incrementPromoUsage(checkoutData.promoCode);
      }

      return {
        success: true,
        cashOnly: true,
        transactionID: transactionResult.transactionID,
        invoiceNumber: invoiceNumber
      };
    }

  } catch (error) {
    Logger.log('Checkout error: ' + error.toString());
    throw error;
  }
}

/**
 * Validate checkout data
 */
function validateCheckoutData(data) {
  // Validate cart
  const cartValidation = validateCart(data.cart);
  if (!cartValidation.valid) {
    throw new Error(cartValidation.error);
  }

  // Validate patient ID
  const patientIdValidation = validatePatientId(data.patientId);
  if (!patientIdValidation.valid) {
    throw new Error(patientIdValidation.error);
  }

  // Validate provider
  const providerValidation = validateProviderInitials(data.providerInitials);
  if (!providerValidation.valid) {
    throw new Error(providerValidation.error);
  }

  // Validate split payment if applicable
  if (data.cashAmount > 0) {
    const splitValidation = validateSplitPayment(data.cashAmount, data.cardAmount, data.total);
    if (!splitValidation.valid) {
      throw new Error(splitValidation.error);
    }
  }

  return true;
}

/**
 * Handle Authorize.net callback/response
 * This would be called when Authorize.net redirects back
 */
function handleAuthNetCallback(params) {
  try {
    const invoiceNumber = params.invoice;

    if (params.status === 'success') {
      // Find the transaction
      const transaction = getTransactionByInvoice(invoiceNumber);

      if (!transaction) {
        throw new Error('Transaction not found: ' + invoiceNumber);
      }

      // Update transaction status
      updateTransactionStatus(transaction.transactionID, 'Completed', params.transId || '');

      // Update customer LTV
      updateCustomerLTV(transaction.customerID, transaction.total);

      Logger.log('Payment completed: ' + invoiceNumber);

      return {
        success: true,
        message: 'Payment completed successfully!',
        invoice: invoiceNumber
      };

    } else {
      // Payment cancelled or failed
      Logger.log('Payment cancelled: ' + invoiceNumber);

      return {
        success: false,
        message: 'Payment was cancelled'
      };
    }

  } catch (error) {
    Logger.log('Callback error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Get current web app URL for callbacks
 */
function getWebAppUrl() {
  return ScriptApp.getService().getUrl();
}

/**
 * Process a test transaction (for development/testing)
 */
function testCheckout() {
  const testData = {
    patientId: 'JF123456',
    providerInitials: 'BA',
    collectorInitials: 'GK',
    cart: [
      {
        sku: 'CONS-INITIAL',
        category: 'Consult',
        itemName: 'Initial Consult',
        basePrice: 150,
        currentPrice: 150,
        quantity: 1,
        priceEdited: false
      }
    ],
    subtotal: 150,
    promoCode: null,
    discount: 0,
    priceOverrides: [],
    cashAmount: 0,
    cardAmount: 150,
    total: 150,
    locationID: getConfig('DEFAULT_LOCATION') || 'LOC-001',
    emailReceipt: false,
    receiptEmail: '',
    newCustomer: {
      firstName: 'John',
      lastName: 'Test',
      email: 'john@test.com',
      phone: '555-123-4567'
    }
  };

  return processCheckout(testData);
}
