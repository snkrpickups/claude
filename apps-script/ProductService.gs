/**
 * Product Management Service
 *
 * Handles all product catalog operations
 */

/**
 * Get all active products
 */
function getAllProducts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const productSheet = ss.getSheetByName('Products');

  if (!productSheet) {
    throw new Error('Products sheet not found');
  }

  const data = productSheet.getDataRange().getValues();
  const products = [];

  // Skip header row (index 0)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    // Only include active products
    if (row[5] === true || row[5] === 'TRUE' || row[5] === true) {
      products.push({
        sku: row[0],
        category: row[1],
        itemName: row[2],
        duration: row[3],
        basePrice: parseFloat(row[4]) || 0,
        active: row[5],
        notes: row[6] || ''
      });
    }
  }

  Logger.log('Loaded ' + products.length + ' active products');
  return products;
}

/**
 * Get product by SKU
 */
function getProductBySKU(sku) {
  const products = getAllProducts();
  return products.find(p => p.sku === sku);
}

/**
 * Get products by category
 */
function getProductsByCategory(category) {
  const products = getAllProducts();
  return products.filter(p => p.category === category);
}

/**
 * Get all unique categories
 */
function getAllCategories() {
  const products = getAllProducts();
  const categories = [...new Set(products.map(p => p.category))];
  return categories.sort();
}

/**
 * Search products by name or SKU
 */
function searchProducts(query) {
  const products = getAllProducts();
  const lowerQuery = query.toLowerCase();

  return products.filter(p => {
    return p.sku.toLowerCase().includes(lowerQuery) ||
           p.itemName.toLowerCase().includes(lowerQuery);
  });
}

/**
 * Get product count by category
 */
function getProductCountByCategory() {
  const products = getAllProducts();
  const counts = {};

  products.forEach(p => {
    if (!counts[p.category]) {
      counts[p.category] = 0;
    }
    counts[p.category]++;
  });

  return counts;
}

/**
 * Add new product (admin function)
 */
function addProduct(productData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const productSheet = ss.getSheetByName('Products');

  // Check if SKU already exists
  const existing = getProductBySKU(productData.sku);
  if (existing) {
    throw new Error('Product with SKU ' + productData.sku + ' already exists');
  }

  productSheet.appendRow([
    productData.sku,
    productData.category,
    productData.itemName,
    productData.duration,
    productData.basePrice,
    true, // active
    productData.notes || ''
  ]);

  Logger.log('Added new product: ' + productData.sku);
  return true;
}

/**
 * Update product (admin function)
 */
function updateProduct(sku, updates) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const productSheet = ss.getSheetByName('Products');
  const data = productSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === sku) {
      const row = i + 1;

      if (updates.category !== undefined) productSheet.getRange(row, 2).setValue(updates.category);
      if (updates.itemName !== undefined) productSheet.getRange(row, 3).setValue(updates.itemName);
      if (updates.duration !== undefined) productSheet.getRange(row, 4).setValue(updates.duration);
      if (updates.basePrice !== undefined) productSheet.getRange(row, 5).setValue(updates.basePrice);
      if (updates.active !== undefined) productSheet.getRange(row, 6).setValue(updates.active);
      if (updates.notes !== undefined) productSheet.getRange(row, 7).setValue(updates.notes);

      Logger.log('Updated product: ' + sku);
      return true;
    }
  }

  throw new Error('Product not found: ' + sku);
}

/**
 * Deactivate product (soft delete)
 */
function deactivateProduct(sku) {
  return updateProduct(sku, { active: false });
}
