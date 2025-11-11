/**
 * Authorize.net Integration Service
 *
 * Handles Accept Hosted integration for secure payment processing
 */

/**
 * Get Accept Hosted token for checkout
 */
function getAcceptHostedToken(checkoutData) {
  const locationId = checkoutData.locationID || getConfig('DEFAULT_LOCATION');
  const credentials = getAuthNetCredentials(locationId);
  const endpoint = getAuthNetEndpoint(locationId);

  // Build the hosted payment page request
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
          "firstName": checkoutData.firstName,
          "lastName": checkoutData.lastName
        }
      },
      "hostedPaymentSettings": {
        "setting": [
          {
            "settingName": "hostedPaymentReturnOptions",
            "settingValue": JSON.stringify({
              "showReceipt": true,
              "url": checkoutData.returnUrl,
              "urlText": "Continue",
              "cancelUrl": checkoutData.cancelUrl,
              "cancelUrlText": "Cancel"
            })
          },
          {
            "settingName": "hostedPaymentButtonOptions",
            "settingValue": JSON.stringify({
              "text": "Pay $" + checkoutData.cardAmount.toFixed(2)
            })
          },
          {
            "settingName": "hostedPaymentPaymentOptions",
            "settingValue": JSON.stringify({
              "cardCodeRequired": true,
              "showCreditCard": true,
              "showBankAccount": false
            })
          },
          {
            "settingName": "hostedPaymentSecurityOptions",
            "settingValue": JSON.stringify({
              "captcha": false
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
            "settingName": "hostedPaymentBillingAddressOptions",
            "settingValue": JSON.stringify({
              "show": false,
              "required": false
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
    Logger.log('Requesting Accept Hosted token from: ' + endpoint);
    const response = UrlFetchApp.fetch(endpoint, options);
    const result = JSON.parse(response.getContentText());

    Logger.log('Authorize.net response: ' + JSON.stringify(result.messages));

    if (result.messages.resultCode === 'Ok') {
      return {
        success: true,
        token: result.token
      };
    } else {
      const errorMessage = result.messages.message[0].text;
      Logger.log('Authorize.net error: ' + errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }

  } catch (error) {
    Logger.log('Exception calling Authorize.net: ' + error.toString());
    return {
      success: false,
      error: 'Failed to connect to payment processor: ' + error.toString()
    };
  }
}

/**
 * Get Accept Hosted URL for a location
 */
function getAcceptHostedUrl(locationId) {
  const credentials = getAuthNetCredentials(locationId);

  if (credentials.environment === 'PRODUCTION') {
    return 'https://accept.authorize.net/payment/payment';
  } else {
    return 'https://test.authorize.net/payment/payment';
  }
}

/**
 * Verify transaction response from Authorize.net
 * This would be called by a webhook/callback
 */
function verifyAuthNetResponse(responseData) {
  // In a real implementation, you would:
  // 1. Verify the signature using the signature key
  // 2. Check that the transaction ID matches
  // 3. Verify the amount matches
  // 4. Update the transaction status

  // For now, we'll do basic validation
  if (!responseData.transId) {
    return {
      valid: false,
      error: 'Missing transaction ID'
    };
  }

  if (!responseData.responseCode || responseData.responseCode !== '1') {
    return {
      valid: false,
      error: 'Transaction was not approved',
      responseCode: responseData.responseCode
    };
  }

  return {
    valid: true,
    transId: responseData.transId,
    amount: responseData.amount
  };
}

/**
 * Create a direct charge (for testing or future use)
 * Note: This requires storing card data which we're avoiding with Accept Hosted
 */
function createDirectCharge(amount, invoiceNumber, description, locationId) {
  const credentials = getAuthNetCredentials(locationId);
  const endpoint = getAuthNetEndpoint(locationId);

  const request = {
    "createTransactionRequest": {
      "merchantAuthentication": {
        "name": credentials.apiLoginId,
        "transactionKey": credentials.transactionKey
      },
      "transactionRequest": {
        "transactionType": "authCaptureTransaction",
        "amount": amount.toFixed(2),
        "order": {
          "invoiceNumber": invoiceNumber,
          "description": description
        }
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
      return {
        success: true,
        transId: result.transactionResponse.transId,
        authCode: result.transactionResponse.authCode
      };
    } else {
      return {
        success: false,
        error: result.messages.message[0].text
      };
    }

  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Test Authorize.net credentials
 */
function testAuthNetConnection(locationId) {
  const credentials = getAuthNetCredentials(locationId);
  const endpoint = getAuthNetEndpoint(locationId);

  // Simple authentication test request
  const request = {
    "authenticateTestRequest": {
      "merchantAuthentication": {
        "name": credentials.apiLoginId,
        "transactionKey": credentials.transactionKey
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

    return {
      success: result.messages.resultCode === 'Ok',
      environment: credentials.environment,
      message: result.messages.message[0].text
    };

  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}
