/**
 * Configuration Management Service
 *
 * Loads and manages system configuration from the Config sheet
 */

/**
 * Get a single configuration value by key
 */
function getConfig(key) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName('Config');

  if (!configSheet) {
    throw new Error('Config sheet not found');
  }

  const data = configSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      return data[i][1];
    }
  }

  Logger.log('Config key not found: ' + key);
  return null;
}

/**
 * Get all configuration as an object
 */
function getAllConfig() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName('Config');

  if (!configSheet) {
    throw new Error('Config sheet not found');
  }

  const data = configSheet.getDataRange().getValues();
  const config = {};

  for (let i = 1; i < data.length; i++) {
    const key = data[i][0];
    const value = data[i][1];
    if (key) {
      config[key] = value;
    }
  }

  return config;
}

/**
 * Set a configuration value
 */
function setConfig(key, value) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName('Config');

  if (!configSheet) {
    throw new Error('Config sheet not found');
  }

  const data = configSheet.getDataRange().getValues();

  // Check if key exists
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      configSheet.getRange(i + 1, 2).setValue(value);
      Logger.log('Updated config: ' + key + ' = ' + value);
      return true;
    }
  }

  // Key doesn't exist, add new row
  configSheet.appendRow([key, value, '']);
  Logger.log('Added new config: ' + key + ' = ' + value);
  return true;
}

/**
 * Get provider list from config
 */
function getProviderList() {
  const providerString = getConfig('PROVIDER_LIST');
  if (!providerString) {
    return ['BA', 'DR', 'GK', 'JF']; // Default list
  }
  return providerString.split(',').map(p => p.trim());
}

/**
 * Get price override reasons from config
 */
function getPriceOverrideReasons() {
  const reasonsString = getConfig('PRICE_OVERRIDE_REASONS');
  if (!reasonsString) {
    return ['Grandfathered', 'F&F', 'Custom']; // Default list
  }
  return reasonsString.split(',').map(r => r.trim());
}

/**
 * Check if a feature is enabled
 */
function isFeatureEnabled(featureName) {
  const value = getConfig(featureName);
  return value === true || value === 'TRUE' || value === 'true';
}
