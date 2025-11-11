/**
 * Customer Management Service
 *
 * Handles customer CRUD operations and LTV tracking
 */

/**
 * Find customer by Patient ID
 */
function findCustomer(patientId) {
  // Validate format first
  const validation = validatePatientId(patientId);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const customerSheet = ss.getSheetByName('Customers');

  if (!customerSheet) {
    throw new Error('Customers sheet not found');
  }

  const data = customerSheet.getDataRange().getValues();

  // Search for patient (column 2 = PatientID)
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

  return null; // Customer not found
}

/**
 * Create new customer
 */
function createCustomer(customerData) {
  // Validate inputs
  const patientIdValidation = validatePatientId(customerData.patientId);
  if (!patientIdValidation.valid) {
    throw new Error(patientIdValidation.error);
  }

  if (!customerData.firstName || !customerData.lastName) {
    throw new Error('First name and last name are required');
  }

  // Check if customer already exists
  const existing = findCustomer(customerData.patientId);
  if (existing) {
    throw new Error('Customer with Patient ID ' + customerData.patientId + ' already exists');
  }

  // Validate optional fields
  if (customerData.email) {
    const emailValidation = validateEmail(customerData.email);
    if (!emailValidation.valid) {
      throw new Error(emailValidation.error);
    }
  }

  if (customerData.phone) {
    const phoneValidation = validatePhone(customerData.phone);
    if (!phoneValidation.valid) {
      throw new Error(phoneValidation.error);
    }
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const customerSheet = ss.getSheetByName('Customers');
  const now = new Date();

  // Use PatientID as CustomerID
  const customerID = customerData.patientId;

  customerSheet.appendRow([
    customerID,
    customerData.patientId,
    customerData.firstName,
    customerData.lastName,
    customerData.email || '',
    customerData.phone || '',
    now, // FirstVisit
    now, // LastVisit
    0, // TotalTransactions
    0, // LifetimeValue
    customerData.notes || ''
  ]);

  Logger.log('Created new customer: ' + customerID);

  // Return the newly created customer
  return findCustomer(customerData.patientId);
}

/**
 * Update customer LTV after a transaction
 */
function updateCustomerLTV(patientId, transactionAmount) {
  const customer = findCustomer(patientId);

  if (!customer) {
    throw new Error('Customer not found: ' + patientId);
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const customerSheet = ss.getSheetByName('Customers');

  const newTotalTransactions = (customer.totalTransactions || 0) + 1;
  const newLifetimeValue = (customer.lifetimeValue || 0) + parseFloat(transactionAmount);
  const now = new Date();

  // Update the row
  customerSheet.getRange(customer.rowIndex, 8).setValue(now); // LastVisit
  customerSheet.getRange(customer.rowIndex, 9).setValue(newTotalTransactions); // TotalTransactions
  customerSheet.getRange(customer.rowIndex, 10).setValue(newLifetimeValue); // LifetimeValue

  Logger.log(`Updated customer LTV: ${patientId} - Transactions: ${newTotalTransactions}, LTV: $${newLifetimeValue.toFixed(2)}`);

  return {
    success: true,
    totalTransactions: newTotalTransactions,
    lifetimeValue: newLifetimeValue
  };
}

/**
 * Get customer LTV ranking (top customers)
 */
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

  // Sort by LTV descending
  customers.sort((a, b) => b.lifetimeValue - a.lifetimeValue);

  return customers.slice(0, limit);
}

/**
 * Update customer contact info
 */
function updateCustomerInfo(patientId, updates) {
  const customer = findCustomer(patientId);

  if (!customer) {
    throw new Error('Customer not found: ' + patientId);
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const customerSheet = ss.getSheetByName('Customers');
  const row = customer.rowIndex;

  if (updates.email !== undefined) {
    const validation = validateEmail(updates.email);
    if (!validation.valid) throw new Error(validation.error);
    customerSheet.getRange(row, 5).setValue(updates.email);
  }

  if (updates.phone !== undefined) {
    const validation = validatePhone(updates.phone);
    if (!validation.valid) throw new Error(validation.error);
    customerSheet.getRange(row, 6).setValue(updates.phone);
  }

  if (updates.notes !== undefined) {
    customerSheet.getRange(row, 11).setValue(updates.notes);
  }

  Logger.log('Updated customer info: ' + patientId);
  return true;
}

/**
 * Get all customers (for reporting)
 */
function getAllCustomers() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const customerSheet = ss.getSheetByName('Customers');
  const data = customerSheet.getDataRange().getValues();

  const customers = [];
  for (let i = 1; i < data.length; i++) {
    customers.push({
      customerID: data[i][0],
      patientID: data[i][1],
      firstName: data[i][2],
      lastName: data[i][3],
      email: data[i][4],
      totalTransactions: data[i][8] || 0,
      lifetimeValue: data[i][9] || 0
    });
  }

  return customers;
}
