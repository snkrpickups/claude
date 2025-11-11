/**
 * Transaction Service
 *
 * Handles transaction logging and processing
 */

/**
 * Log a completed transaction
 */
function logTransaction(transactionData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const transactionSheet = ss.getSheetByName('Transactions');

  if (!transactionSheet) {
    throw new Error('Transactions sheet not found');
  }

  // Generate transaction ID
  const timestamp = new Date();
  const transactionID = 'TXN-' + timestamp.getTime();

  // Convert cart to JSON string
  const itemsJSON = JSON.stringify(transactionData.cart);

  // Convert price overrides to JSON string (if any)
  const overridesJSON = JSON.stringify(transactionData.priceOverrides || []);

  // Customer name
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

  Logger.log(`Transaction logged: ${transactionID} - Invoice: ${transactionData.invoiceNumber} - Total: $${transactionData.total}`);

  return {
    success: true,
    transactionID: transactionID,
    timestamp: timestamp
  };
}

/**
 * Get transactions by date range
 */
function getTransactionsByDateRange(startDate, endDate) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const transactionSheet = ss.getSheetByName('Transactions');
  const data = transactionSheet.getDataRange().getValues();

  const transactions = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let i = 1; i < data.length; i++) {
    const txnDate = new Date(data[i][1]);

    if (txnDate >= start && txnDate <= end) {
      transactions.push({
        transactionID: data[i][0],
        timestamp: data[i][1],
        invoiceNumber: data[i][2],
        customerID: data[i][3],
        customerName: data[i][4],
        providerInitials: data[i][5],
        collectorName: data[i][6],
        items: JSON.parse(data[i][7] || '[]'),
        subtotal: parseFloat(data[i][8]),
        promoCode: data[i][9],
        discount: parseFloat(data[i][10]),
        priceOverrides: JSON.parse(data[i][11] || '[]'),
        cashAmount: parseFloat(data[i][12]),
        cardAmount: parseFloat(data[i][13]),
        total: parseFloat(data[i][14]),
        paymentStatus: data[i][15],
        authNetTransID: data[i][16],
        locationID: data[i][17],
        description: data[i][18]
      });
    }
  }

  return transactions;
}

/**
 * Get transactions by customer
 */
function getTransactionsByCustomer(customerID) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const transactionSheet = ss.getSheetByName('Transactions');
  const data = transactionSheet.getDataRange().getValues();

  const transactions = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][3] === customerID) {
      transactions.push({
        transactionID: data[i][0],
        timestamp: data[i][1],
        invoiceNumber: data[i][2],
        items: JSON.parse(data[i][7] || '[]'),
        total: parseFloat(data[i][14]),
        paymentStatus: data[i][15]
      });
    }
  }

  return transactions;
}

/**
 * Get transaction by invoice number
 */
function getTransactionByInvoice(invoiceNumber) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const transactionSheet = ss.getSheetByName('Transactions');
  const data = transactionSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === invoiceNumber) {
      return {
        transactionID: data[i][0],
        timestamp: data[i][1],
        invoiceNumber: data[i][2],
        customerID: data[i][3],
        customerName: data[i][4],
        providerInitials: data[i][5],
        collectorName: data[i][6],
        items: JSON.parse(data[i][7] || '[]'),
        subtotal: parseFloat(data[i][8]),
        promoCode: data[i][9],
        discount: parseFloat(data[i][10]),
        priceOverrides: JSON.parse(data[i][11] || '[]'),
        cashAmount: parseFloat(data[i][12]),
        cardAmount: parseFloat(data[i][13]),
        total: parseFloat(data[i][14]),
        paymentStatus: data[i][15],
        authNetTransID: data[i][16],
        locationID: data[i][17],
        description: data[i][18]
      };
    }
  }

  return null;
}

/**
 * Get all transactions (for reporting)
 */
function getAllTransactions(limit = 100) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const transactionSheet = ss.getSheetByName('Transactions');
  const data = transactionSheet.getDataRange().getValues();

  const transactions = [];

  // Start from most recent (bottom of sheet)
  for (let i = Math.max(1, data.length - limit); i < data.length; i++) {
    transactions.push({
      transactionID: data[i][0],
      timestamp: data[i][1],
      invoiceNumber: data[i][2],
      customerID: data[i][3],
      customerName: data[i][4],
      total: parseFloat(data[i][14]),
      paymentStatus: data[i][15],
      locationID: data[i][17]
    });
  }

  // Reverse to show newest first
  return transactions.reverse();
}

/**
 * Update transaction status (e.g., after Authorize.net callback)
 */
function updateTransactionStatus(transactionID, status, authNetTransID) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const transactionSheet = ss.getSheetByName('Transactions');
  const data = transactionSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === transactionID) {
      const row = i + 1;
      transactionSheet.getRange(row, 16).setValue(status); // PaymentStatus
      if (authNetTransID) {
        transactionSheet.getRange(row, 17).setValue(authNetTransID); // AuthNetTransID
      }
      Logger.log(`Updated transaction status: ${transactionID} -> ${status}`);
      return true;
    }
  }

  return false;
}
