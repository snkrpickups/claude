/**
 * Location Management Service
 *
 * Handles multi-location operations and Authorize.net credential routing
 */

/**
 * Get all active locations
 */
function getAllLocations() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const locationSheet = ss.getSheetByName('Locations');

  if (!locationSheet) {
    throw new Error('Locations sheet not found');
  }

  const data = locationSheet.getDataRange().getValues();
  const locations = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    // Only include active locations
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

/**
 * Get location by ID
 */
function getLocationById(locationId) {
  const locations = getAllLocations();
  return locations.find(loc => loc.locationID === locationId);
}

/**
 * Get default location
 */
function getDefaultLocation() {
  const defaultLocationId = getConfig('DEFAULT_LOCATION') || 'LOC-001';
  return getLocationById(defaultLocationId);
}

/**
 * Get Authorize.net credentials for a location
 */
function getAuthNetCredentials(locationId) {
  const location = getLocationById(locationId);

  if (!location) {
    throw new Error('Location not found: ' + locationId);
  }

  if (!location.authNetAPILogin || !location.authNetTransKey) {
    throw new Error('Authorize.net credentials not configured for location: ' + locationId);
  }

  return {
    apiLoginId: location.authNetAPILogin,
    transactionKey: location.authNetTransKey,
    signatureKey: location.authNetSignatureKey || '',
    environment: location.authNetEnvironment || 'SANDBOX'
  };
}

/**
 * Get Authorize.net API endpoint for a location
 */
function getAuthNetEndpoint(locationId) {
  const credentials = getAuthNetCredentials(locationId);

  if (credentials.environment === 'PRODUCTION') {
    return 'https://api.authorize.net/xml/v1/request.api';
  } else {
    return 'https://apitest.authorize.net/xml/v1/request.api';
  }
}

/**
 * Add new location (for franchising)
 */
function addLocation(locationData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const locationSheet = ss.getSheetByName('Locations');

  // Check if locationID already exists
  const existing = getLocationById(locationData.locationID);
  if (existing) {
    throw new Error('Location with ID ' + locationData.locationID + ' already exists');
  }

  locationSheet.appendRow([
    locationData.locationID,
    locationData.locationCode,
    locationData.locationName,
    locationData.address || '',
    locationData.city || '',
    locationData.state || '',
    locationData.zip || '',
    true, // active
    locationData.authNetAPILogin || '',
    locationData.authNetTransKey || '',
    locationData.authNetSignatureKey || '',
    locationData.authNetEnvironment || 'SANDBOX'
  ]);

  // Also add to InvoiceTracking
  const invoiceSheet = ss.getSheetByName('InvoiceTracking');
  invoiceSheet.appendRow([
    locationData.locationID,
    locationData.locationCode,
    0, // LastNumber
    locationData.locationCode + '-000000' // CurrentFormat
  ]);

  Logger.log('Added new location: ' + locationData.locationID);
  return true;
}

/**
 * Update location Authorize.net credentials
 */
function updateLocationAuthNet(locationId, credentials) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const locationSheet = ss.getSheetByName('Locations');
  const data = locationSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === locationId) {
      const row = i + 1;

      if (credentials.apiLoginId !== undefined) {
        locationSheet.getRange(row, 9).setValue(credentials.apiLoginId);
      }
      if (credentials.transactionKey !== undefined) {
        locationSheet.getRange(row, 10).setValue(credentials.transactionKey);
      }
      if (credentials.signatureKey !== undefined) {
        locationSheet.getRange(row, 11).setValue(credentials.signatureKey);
      }
      if (credentials.environment !== undefined) {
        locationSheet.getRange(row, 12).setValue(credentials.environment);
      }

      Logger.log('Updated Authorize.net credentials for location: ' + locationId);
      return true;
    }
  }

  throw new Error('Location not found: ' + locationId);
}

/**
 * Deactivate location
 */
function deactivateLocation(locationId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const locationSheet = ss.getSheetByName('Locations');
  const data = locationSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === locationId) {
      locationSheet.getRange(i + 1, 8).setValue(false); // Set active to FALSE
      Logger.log('Deactivated location: ' + locationId);
      return true;
    }
  }

  throw new Error('Location not found: ' + locationId);
}
