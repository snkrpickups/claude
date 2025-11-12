/**
 * AUTHORIZE.NET DIAGNOSTIC TOOL
 *
 * Run this to check your Authorize.net credentials setup
 * It will tell you exactly what's wrong and how to fix it
 */

function diagnoseAuthNetSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const locationsSheet = ss.getSheetByName('Locations');

  if (!locationsSheet) {
    Logger.log('❌ ERROR: Locations sheet not found!');
    Logger.log('➡️  FIX: Run setupDataSheets() first to create all required sheets');
    return;
  }

  const data = locationsSheet.getDataRange().getValues();

  if (data.length < 2) {
    Logger.log('❌ ERROR: Locations sheet is empty!');
    Logger.log('➡️  FIX: Run setupDataSheets() to populate the Locations sheet');
    return;
  }

  Logger.log('==================================================');
  Logger.log('📊 AUTHORIZE.NET CREDENTIALS DIAGNOSTIC');
  Logger.log('==================================================\n');

  // Check each location
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const locationID = row[0];
    const locationName = row[2];
    const apiLoginId = row[8];
    const transactionKey = row[9];
    const signatureKey = row[10];
    const environment = row[11] || 'SANDBOX';

    Logger.log(`\n🏢 Location: ${locationName} (${locationID})`);
    Logger.log(`   Environment: ${environment}`);
    Logger.log('   ---');

    // Check API Login ID (Column I)
    if (!apiLoginId || apiLoginId === '' || apiLoginId.includes('YOUR_') || apiLoginId === 'API_LOGIN_ID') {
      Logger.log('   ❌ API Login ID: NOT SET');
      Logger.log('      Cell: I' + (i + 1));
      Logger.log('      Action: Enter your Authorize.net API Login ID');
    } else {
      Logger.log('   ✅ API Login ID: ' + apiLoginId.substring(0, 4) + '****');
    }

    // Check Transaction Key (Column J)
    if (!transactionKey || transactionKey === '' || transactionKey.includes('YOUR_') || transactionKey === 'TRANSACTION_KEY') {
      Logger.log('   ❌ Transaction Key: NOT SET');
      Logger.log('      Cell: J' + (i + 1));
      Logger.log('      Action: Enter your Authorize.net Transaction Key');
    } else {
      Logger.log('   ✅ Transaction Key: ' + transactionKey.substring(0, 4) + '****');
    }

    // Check Signature Key (Column K) - Optional
    if (!signatureKey || signatureKey === '' || signatureKey.includes('YOUR_')) {
      Logger.log('   ⚠️  Signature Key: NOT SET (optional)');
      Logger.log('      Cell: K' + (i + 1));
    } else {
      Logger.log('   ✅ Signature Key: ' + signatureKey.substring(0, 4) + '****');
    }
  }

  Logger.log('\n\n==================================================');
  Logger.log('📝 HOW TO GET YOUR AUTHORIZE.NET CREDENTIALS');
  Logger.log('==================================================');
  Logger.log('');
  Logger.log('For SANDBOX (Testing):');
  Logger.log('1. Go to: https://sandbox.authorize.net');
  Logger.log('2. Login to your sandbox account');
  Logger.log('3. Click "Account" → "Settings" → "API Credentials & Keys"');
  Logger.log('4. Copy your API Login ID');
  Logger.log('5. Generate a new Transaction Key if needed');
  Logger.log('');
  Logger.log('For PRODUCTION (Live):');
  Logger.log('1. Go to: https://account.authorize.net');
  Logger.log('2. Login to your production account');
  Logger.log('3. Click "Account" → "Settings" → "API Credentials & Keys"');
  Logger.log('4. Copy your API Login ID');
  Logger.log('5. Generate a new Transaction Key if needed');
  Logger.log('');
  Logger.log('⚠️  IMPORTANT:');
  Logger.log('   - For testing, use SANDBOX credentials with SANDBOX environment');
  Logger.log('   - Never mix production credentials with sandbox environment!');
  Logger.log('   - Update column L (Environment) to match your credentials');
  Logger.log('');
  Logger.log('==================================================');
  Logger.log('📍 WHERE TO ENTER CREDENTIALS IN YOUR SHEET');
  Logger.log('==================================================');
  Logger.log('');
  Logger.log('1. Go to the "Locations" tab in your spreadsheet');
  Logger.log('2. Find row 2 (LOC-001)');
  Logger.log('3. Enter credentials in these columns:');
  Logger.log('   - Column I: API Login ID');
  Logger.log('   - Column J: Transaction Key');
  Logger.log('   - Column K: Signature Key (optional)');
  Logger.log('   - Column L: Environment (SANDBOX or PRODUCTION)');
  Logger.log('');
  Logger.log('==================================================');
  Logger.log('\n✅ Run this diagnostic again after updating credentials');
  Logger.log('\n');
}


/**
 * TEST YOUR AUTHORIZE.NET CONNECTION
 *
 * Run this AFTER entering credentials to test the connection
 * This will make a test API call to verify credentials work
 */

function testAuthNetConnection() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const locationsSheet = ss.getSheetByName('Locations');

  if (!locationsSheet) {
    Logger.log('❌ Locations sheet not found. Run setupDataSheets() first.');
    return;
  }

  const data = locationsSheet.getDataRange().getValues();
  const row = data[1]; // First location (LOC-001)

  const locationID = row[0];
  const apiLoginId = row[8];
  const transactionKey = row[9];
  const environment = row[11] || 'SANDBOX';

  Logger.log('==================================================');
  Logger.log('🔌 TESTING AUTHORIZE.NET CONNECTION');
  Logger.log('==================================================\n');
  Logger.log('Location: ' + locationID);
  Logger.log('Environment: ' + environment);
  Logger.log('API Login ID: ' + apiLoginId.substring(0, 4) + '****\n');

  // Determine endpoint
  const endpoint = environment === 'PRODUCTION'
    ? 'https://api.authorize.net/xml/v1/request.api'
    : 'https://apitest.authorize.net/xml/v1/request.api';

  Logger.log('Endpoint: ' + endpoint + '\n');

  // Create a simple authentication test request
  const request = {
    "authenticateTestRequest": {
      "merchantAuthentication": {
        "name": apiLoginId,
        "transactionKey": transactionKey
      }
    }
  };

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(request),
    'muteHttpExceptions': true
  };

  Logger.log('Making API call...\n');

  try {
    const response = UrlFetchApp.fetch(endpoint, options);
    const result = JSON.parse(response.getContentText());

    Logger.log('Response received:');
    Logger.log(JSON.stringify(result, null, 2));
    Logger.log('');

    if (result.messages && result.messages.resultCode === 'Ok') {
      Logger.log('✅ SUCCESS! Credentials are valid!');
      Logger.log('   Your Authorize.net connection is working correctly.');
      Logger.log('   You can now process payments through the POS system.\n');
      return true;
    } else if (result.messages && result.messages.message) {
      const errorMsg = result.messages.message[0];
      Logger.log('❌ AUTHENTICATION FAILED');
      Logger.log('   Error Code: ' + errorMsg.code);
      Logger.log('   Error Message: ' + errorMsg.text);
      Logger.log('');

      if (errorMsg.code === 'E00007') {
        Logger.log('💡 This error means your credentials are INVALID.');
        Logger.log('   Common causes:');
        Logger.log('   1. API Login ID is incorrect');
        Logger.log('   2. Transaction Key is incorrect');
        Logger.log('   3. Using PRODUCTION credentials with SANDBOX endpoint (or vice versa)');
        Logger.log('');
        Logger.log('   ➡️  Double-check your credentials in the Locations sheet (columns I, J, L)');
        Logger.log('   ➡️  Verify you\'re using the correct environment (SANDBOX vs PRODUCTION)');
      }
      Logger.log('');
      return false;
    }
  } catch (error) {
    Logger.log('❌ ERROR: ' + error.toString());
    Logger.log('');
    Logger.log('💡 This could mean:');
    Logger.log('   1. Network connectivity issue');
    Logger.log('   2. Invalid API endpoint');
    Logger.log('   3. Malformed request');
    Logger.log('');
    return false;
  }

  Logger.log('==================================================\n');
}
