# ALC POS System - Implementation Roadmap

## Quick Start Guide

### Prerequisites
1. Google Account with Google Apps Script access
2. Authorize.net Sandbox Account ([Sign up here](https://developer.authorize.net/hello_world/sandbox/))
3. Basic understanding of your product catalog (SKUs)

### Setup Checklist
- [ ] Create new Google Sheet named "ALC_POS_System"
- [ ] Set up 7 tabs (Products, Transactions, Customers, InvoiceTracking, PromoCodes, Locations, Config)
- [ ] Get Authorize.net sandbox credentials (API Login ID, Transaction Key, Signature Key)
- [ ] Invite team members to Google Sheet

---

## Phase 1: Foundation (Week 1)

### Day 1-2: Database Setup

**Task 1.1: Create Google Sheet Structure**
```
1. Create new Google Sheet: "ALC_POS_System"
2. Rename Sheet1 to "Products"
3. Create 6 additional tabs:
   - Transactions
   - Customers
   - InvoiceTracking
   - PromoCodes
   - Locations
   - Config
```

**Task 1.2: Set Up Products Sheet**
```
Headers (Row 1):
SKU | Category | ProductName | BasePrice | Active | ProviderInitials | Notes

Sample Data (Row 2+):
RX-001 | Rx | HRT Monthly | 150 | TRUE | BA | Hormone Replacement Therapy
RX-002 | Rx | Testosterone Cypionate | 200 | TRUE | BA | Testosterone treatment
RX-003 | Rx | Estradiol | 180 | TRUE | BA | Estrogen therapy
LAB-001 | Labs | Comprehensive Blood Panel | 75 | TRUE | BA | Full blood work
LAB-002 | Labs | Hormone Level Test | 100 | TRUE | BA | Testosterone/Estrogen
CON-001 | Consult | Initial Consultation | 150 | TRUE | DR | New patient consult
CON-002 | Consult | Follow-up Consultation | 75 | TRUE | DR | Existing patient
```

**Task 1.3: Set Up Other Sheets**

*Transactions Sheet:*
```
Headers:
TransactionID | Timestamp | InvoiceNumber | CustomerID | CustomerName | Items | Subtotal | PromoCode | Discount | Total | PaymentStatus | AuthNetTransID | LocationID | CollectorInitials | Description
```

*Customers Sheet:*
```
Headers:
CustomerID | PatientID | FirstName | LastName | Email | Phone | FirstVisit | LastVisit | TotalTransactions | LifetimeValue | Notes
```

*InvoiceTracking Sheet:*
```
Headers + Data:
InvoiceType | LastNumber | Prefix | Format
Rx | 0 | SP-Rx- | SP-Rx-XXXXX
Labs | 0 | SP-Labs- | SP-Labs-XXXXX
Consult | 0 | SP-Consult- | SP-Consult-XXXXX
Mixed | 0 | SP-Mixed- | SP-Mixed-XXXXX
```

*PromoCodes Sheet:*
```
Headers:
PromoCode | DiscountType | DiscountValue | Active | StartDate | EndDate | UsageLimit | TimesUsed | ApplicableCategories

Sample Data:
WELCOME10 | Percentage | 10 | TRUE | 2025-01-01 | 2025-12-31 | 1000 | 0 | All
```

*Locations Sheet:*
```
Headers + Data:
LocationID | LocationName | Address | City | State | Zip | Active | AuthNetAPILogin | AuthNetTransKey
LOC-001 | Main Clinic | 123 Main St | Your City | CA | 12345 | TRUE | |
```

*Config Sheet:*
```
Headers + Data:
ConfigKey | ConfigValue | Description
AUTHNET_API_LOGIN_ID | [PASTE_FROM_SANDBOX] | Authorize.net API Login ID
AUTHNET_TRANSACTION_KEY | [PASTE_FROM_SANDBOX] | Authorize.net Transaction Key
AUTHNET_SIGNATURE_KEY | [PASTE_FROM_SANDBOX] | Authorize.net Signature Key
AUTHNET_ENVIRONMENT | SANDBOX | SANDBOX or PRODUCTION
DEFAULT_LOCATION | LOC-001 | Default location ID
ENABLE_PRICE_OVERRIDE | TRUE | Allow price editing
TAX_RATE | 0 | Tax rate decimal (e.g., 0.0875 for 8.75%)
CURRENCY | USD | Currency code
COMPANY_NAME | ALC | Company name for receipts
COLLECTOR_INITIALS_REQUIRED | TRUE | Require staff initials
```

### Day 3-4: Basic Apps Script Setup

**Task 1.4: Create Apps Script Project**
```
1. In Google Sheet, click Extensions > Apps Script
2. Delete default code in Code.gs
3. Create file structure
```

**Task 1.5: Build Config Loader**

Create `/utils/Config.gs`:
```javascript
/**
 * Configuration management
 */
function getConfig(key) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName('Config');
  const data = configSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      return data[i][1];
    }
  }
  return null;
}

function getAllConfig() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName('Config');
  const data = configSheet.getDataRange().getValues();

  const config = {};
  for (let i = 1; i < data.length; i++) {
    config[data[i][0]] = data[i][1];
  }
  return config;
}
```

**Task 1.6: Build Product Service**

Create `/ProductService.gs`:
```javascript
/**
 * Product management service
 */
function getAllProducts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const productSheet = ss.getSheetByName('Products');
  const data = productSheet.getDataRange().getValues();

  const products = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][4] === true || data[i][4] === 'TRUE') { // Active column
      products.push({
        sku: data[i][0],
        category: data[i][1],
        productName: data[i][2],
        basePrice: parseFloat(data[i][3]),
        active: data[i][4],
        providerInitials: data[i][5],
        notes: data[i][6]
      });
    }
  }
  return products;
}

function getProductBySKU(sku) {
  const products = getAllProducts();
  return products.find(p => p.sku === sku);
}

function getProductsByCategory(category) {
  const products = getAllProducts();
  return products.filter(p => p.category === category);
}
```

### Day 5: Basic Web App UI

**Task 1.7: Create Main HTML File**

Create `/frontend/index.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <title>ALC POS System</title>
  <?!= include('styles'); ?>
</head>
<body>
  <div class="container">
    <header>
      <h1>ALC Point of Sale</h1>
      <div id="user-info"></div>
    </header>

    <div class="main-layout">
      <!-- Left: Product Catalog -->
      <div class="product-section">
        <h2>Products</h2>
        <div class="category-filters">
          <button onclick="filterCategory('All')" class="active">All</button>
          <button onclick="filterCategory('Rx')">Rx</button>
          <button onclick="filterCategory('Labs')">Labs</button>
          <button onclick="filterCategory('Consult')">Consult</button>
        </div>
        <input type="text" id="product-search" placeholder="Search products...">
        <div id="product-grid"></div>
      </div>

      <!-- Right: Cart & Checkout -->
      <div class="cart-section">
        <?!= include('customer'); ?>
        <?!= include('cart'); ?>
      </div>
    </div>
  </div>

  <?!= include('scripts'); ?>
</body>
</html>
```

**Task 1.8: Create Styles**

Create `/frontend/styles.html`:
```html
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

header {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  color: #333;
  font-size: 24px;
}

.main-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.product-section, .cart-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.category-filters {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.category-filters button {
  padding: 8px 16px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.category-filters button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

#product-search {
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 14px;
}

#product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  max-height: 600px;
  overflow-y: auto;
}

.product-card {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.product-card:hover {
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.product-sku {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.product-name {
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.product-price {
  color: #28a745;
  font-size: 18px;
  font-weight: bold;
}

.cart-section {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.customer-form {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.customer-info {
  background: #e7f3ff;
  padding: 12px;
  border-radius: 4px;
  margin-top: 10px;
}

.cart-items {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 15px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.cart-item-price {
  font-weight: bold;
  color: #28a745;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.cart-item-price:hover {
  background: #fff3cd;
}

.cart-item-price.edited {
  background: #fff3cd;
  position: relative;
}

.cart-item-price.edited::after {
  content: '*';
  color: #ff6b6b;
  margin-left: 3px;
}

.cart-totals {
  border-top: 2px solid #ddd;
  padding-top: 15px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.total-row.grand-total {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 2px solid #333;
}

.promo-section {
  margin: 15px 0;
  display: flex;
  gap: 8px;
}

.promo-section input {
  flex: 1;
  padding: 8px;
  border: 2px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-success {
  background: #28a745;
  color: white;
  width: 100%;
  font-size: 16px;
  padding: 15px;
  margin-top: 15px;
}

.btn-success:hover {
  background: #218838;
}

.btn-danger {
  background: #dc3545;
  color: white;
  padding: 4px 8px;
  font-size: 12px;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.empty-cart {
  text-align: center;
  padding: 40px;
  color: #999;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.success {
  background: #d4edda;
  color: #155724;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
}
</style>
```

**Task 1.9: Create Code.gs Entry Point**

Create `/Code.gs`:
```javascript
/**
 * Main entry point for web app
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile('frontend/index')
    .evaluate()
    .setTitle('ALC POS System')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Include helper for HTML templates
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile('frontend/' + filename)
    .getContent();
}

/**
 * Test function to verify setup
 */
function testSetup() {
  Logger.log('Testing product service...');
  const products = getAllProducts();
  Logger.log('Found ' + products.length + ' active products');

  Logger.log('Testing config...');
  const config = getAllConfig();
  Logger.log('Config loaded: ' + JSON.stringify(config));

  return {
    success: true,
    productCount: products.length,
    config: config
  };
}
```

---

## Phase 2: Core POS Features (Week 2)

### Day 6-7: Customer Management

**Task 2.1: Create Customer Service**

Create `/CustomerService.gs`:
```javascript
/**
 * Customer management service
 */
function findCustomer(patientId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const customerSheet = ss.getSheetByName('Customers');
  const data = customerSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === patientId) { // PatientID column
      return {
        customerID: data[i][0],
        patientID: data[i][1],
        firstName: data[i][2],
        lastName: data[i][3],
        email: data[i][4],
        phone: data[i][5],
        firstVisit: data[i][6],
        lastVisit: data[i][7],
        totalTransactions: data[i][8],
        lifetimeValue: data[i][9],
        notes: data[i][10],
        rowIndex: i + 1
      };
    }
  }
  return null;
}

function createCustomer(patientId, firstName, lastName, email, phone) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const customerSheet = ss.getSheetByName('Customers');

  const customerID = patientId; // Use PatientID as CustomerID
  const now = new Date();

  customerSheet.appendRow([
    customerID,
    patientId,
    firstName,
    lastName,
    email || '',
    phone || '',
    now,
    now,
    0,
    0,
    ''
  ]);

  return findCustomer(patientId);
}

function updateCustomerLTV(patientId, transactionAmount) {
  const customer = findCustomer(patientId);
  if (!customer) return false;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const customerSheet = ss.getSheetByName('Customers');

  const newTotal = (customer.totalTransactions || 0) + 1;
  const newLTV = (customer.lifetimeValue || 0) + transactionAmount;
  const now = new Date();

  customerSheet.getRange(customer.rowIndex, 8).setValue(now); // LastVisit
  customerSheet.getRange(customer.rowIndex, 9).setValue(newTotal); // TotalTransactions
  customerSheet.getRange(customer.rowIndex, 10).setValue(newLTV); // LifetimeValue

  return true;
}
```

**Task 2.2: Create Customer UI Component**

Create `/frontend/customer.html`:
```html
<div class="customer-form">
  <h3>Customer Information</h3>
  <div class="form-group">
    <label>Patient ID</label>
    <input type="text" id="patient-id" placeholder="Enter Patient ID">
    <button class="btn-secondary" onclick="lookupCustomer()" style="margin-top: 5px; width: 100%;">
      Lookup Customer
    </button>
  </div>

  <div id="customer-details" style="display: none;">
    <div class="customer-info">
      <div><strong>Name:</strong> <span id="customer-name"></span></div>
      <div><strong>Lifetime Value:</strong> $<span id="customer-ltv">0.00</span></div>
      <div><strong>Total Visits:</strong> <span id="customer-visits">0</span></div>
    </div>
  </div>

  <div id="new-customer-form" style="display: none; margin-top: 15px;">
    <p style="color: #856404; background: #fff3cd; padding: 8px; border-radius: 4px; margin-bottom: 10px;">
      New customer - please enter details
    </p>
    <div class="form-group">
      <label>First Name *</label>
      <input type="text" id="first-name" required>
    </div>
    <div class="form-group">
      <label>Last Name *</label>
      <input type="text" id="last-name" required>
    </div>
    <div class="form-group">
      <label>Email (optional)</label>
      <input type="email" id="email">
    </div>
    <div class="form-group">
      <label>Phone (optional)</label>
      <input type="tel" id="phone">
    </div>
  </div>

  <div class="form-group" style="margin-top: 15px;">
    <label>Collector Initials *</label>
    <input type="text" id="collector-initials" placeholder="Your initials" maxlength="4" style="text-transform: uppercase;">
  </div>
</div>
```

### Day 8-9: Shopping Cart with Price Override

**Task 2.3: Create Cart UI**

Create `/frontend/cart.html`:
```html
<div class="cart-container">
  <h3>Shopping Cart</h3>

  <div id="cart-items" class="cart-items">
    <div class="empty-cart">
      Cart is empty - click products to add
    </div>
  </div>

  <div class="promo-section">
    <input type="text" id="promo-code" placeholder="Promo code">
    <button class="btn-secondary" onclick="applyPromo()">Apply</button>
  </div>

  <div id="promo-applied" style="display: none; background: #d4edda; padding: 8px; border-radius: 4px; margin-bottom: 10px;">
    <span id="promo-text"></span>
    <button class="btn-danger" onclick="removePromo()" style="float: right;">Remove</button>
  </div>

  <div class="cart-totals">
    <div class="total-row">
      <span>Subtotal:</span>
      <span id="subtotal">$0.00</span>
    </div>
    <div class="total-row" id="discount-row" style="display: none; color: #28a745;">
      <span>Discount:</span>
      <span id="discount">-$0.00</span>
    </div>
    <div class="total-row grand-total">
      <span>Total:</span>
      <span id="total">$0.00</span>
    </div>
  </div>

  <button class="btn-success" onclick="checkout()">
    Checkout
  </button>

  <button class="btn-danger" onclick="clearCart()" style="width: 100%; margin-top: 10px;">
    Clear Cart
  </button>
</div>
```

**Task 2.4: Create JavaScript Logic**

Create `/frontend/scripts.html`:
```html
<script>
// Global state
let products = [];
let cart = [];
let currentCustomer = null;
let appliedPromo = null;
let currentFilter = 'All';

// Load products on page load
window.onload = function() {
  loadProducts();
};

// Load products from backend
function loadProducts() {
  document.getElementById('product-grid').innerHTML = '<div class="loading">Loading products...</div>';

  google.script.run
    .withSuccessHandler(function(data) {
      products = data;
      renderProducts();
    })
    .withFailureHandler(function(error) {
      showError('Failed to load products: ' + error.message);
    })
    .getAllProducts();
}

// Render product grid
function renderProducts() {
  const grid = document.getElementById('product-grid');
  const searchTerm = document.getElementById('product-search').value.toLowerCase();

  const filtered = products.filter(p => {
    const matchesCategory = currentFilter === 'All' || p.category === currentFilter;
    const matchesSearch = p.productName.toLowerCase().includes(searchTerm) ||
                          p.sku.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-cart">No products found</div>';
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" onclick='addToCart(${JSON.stringify(p)})'>
      <div class="product-sku">${p.sku}</div>
      <div class="product-name">${p.productName}</div>
      <div class="product-price">$${p.basePrice.toFixed(2)}</div>
    </div>
  `).join('');
}

// Filter by category
function filterCategory(category) {
  currentFilter = category;
  document.querySelectorAll('.category-filters button').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  renderProducts();
}

// Search products
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', renderProducts);
  }
});

// Add product to cart
function addToCart(product) {
  const existingItem = cart.find(item => item.sku === product.sku);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1,
      currentPrice: product.basePrice,
      priceEdited: false
    });
  }

  renderCart();
}

// Render cart
function renderCart() {
  const container = document.getElementById('cart-items');

  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-cart">Cart is empty</div>';
    updateTotals();
    return;
  }

  container.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div>
        <div style="font-weight: 500;">${item.productName}</div>
        <div style="font-size: 12px; color: #666;">
          ${item.sku} x ${item.quantity}
          ${item.priceEdited ? '<span style="color: #ff6b6b;">*Custom Price*</span>' : ''}
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <div class="cart-item-price ${item.priceEdited ? 'edited' : ''}"
             ondblclick="editPrice(${index})"
             title="Double-click to edit">
          $<span id="price-${index}">${(item.currentPrice * item.quantity).toFixed(2)}</span>
        </div>
        <button class="btn-danger" onclick="removeFromCart(${index})">×</button>
      </div>
    </div>
  `).join('');

  updateTotals();
}

// Edit price (double-click)
function editPrice(index) {
  const priceElement = document.getElementById(`price-${index}`);
  const currentTotal = cart[index].currentPrice * cart[index].quantity;

  const input = document.createElement('input');
  input.type = 'number';
  input.step = '0.01';
  input.value = currentTotal.toFixed(2);
  input.style.width = '80px';
  input.style.padding = '4px';
  input.style.border = '2px solid #007bff';
  input.style.borderRadius = '4px';

  const parent = priceElement.parentElement;
  parent.replaceChild(input, priceElement);
  input.focus();
  input.select();

  function savePrice() {
    const newTotal = parseFloat(input.value);
    if (!isNaN(newTotal) && newTotal >= 0) {
      cart[index].currentPrice = newTotal / cart[index].quantity;
      cart[index].priceEdited = true;
    }
    renderCart();
  }

  input.addEventListener('blur', savePrice);
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') savePrice();
  });
}

// Remove from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// Clear cart
function clearCart() {
  if (confirm('Clear entire cart?')) {
    cart = [];
    appliedPromo = null;
    renderCart();
  }
}

// Update totals
function updateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0);

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'Percentage') {
      discount = subtotal * (appliedPromo.discountValue / 100);
    } else {
      discount = appliedPromo.discountValue;
    }
  }

  const total = subtotal - discount;

  document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
  document.getElementById('discount').textContent = '-$' + discount.toFixed(2);
  document.getElementById('total').textContent = '$' + total.toFixed(2);

  if (discount > 0) {
    document.getElementById('discount-row').style.display = 'flex';
  } else {
    document.getElementById('discount-row').style.display = 'none';
  }
}

// Customer lookup
function lookupCustomer() {
  const patientId = document.getElementById('patient-id').value.trim();

  if (!patientId) {
    alert('Please enter a Patient ID');
    return;
  }

  google.script.run
    .withSuccessHandler(function(customer) {
      if (customer) {
        currentCustomer = customer;
        document.getElementById('customer-name').textContent =
          customer.firstName + ' ' + customer.lastName;
        document.getElementById('customer-ltv').textContent =
          customer.lifetimeValue.toFixed(2);
        document.getElementById('customer-visits').textContent =
          customer.totalTransactions;
        document.getElementById('customer-details').style.display = 'block';
        document.getElementById('new-customer-form').style.display = 'none';
      } else {
        currentCustomer = null;
        document.getElementById('customer-details').style.display = 'none';
        document.getElementById('new-customer-form').style.display = 'block';
      }
    })
    .withFailureHandler(showError)
    .findCustomer(patientId);
}

// Apply promo code
function applyPromo() {
  const code = document.getElementById('promo-code').value.trim().toUpperCase();

  if (!code) return;

  google.script.run
    .withSuccessHandler(function(promo) {
      if (promo) {
        appliedPromo = promo;
        document.getElementById('promo-applied').style.display = 'block';
        document.getElementById('promo-text').textContent =
          `${promo.promoCode}: ${promo.discountType === 'Percentage' ? promo.discountValue + '%' : '$' + promo.discountValue} off`;
        updateTotals();
      } else {
        alert('Invalid promo code');
      }
    })
    .withFailureHandler(showError)
    .validatePromoCode(code);
}

// Remove promo
function removePromo() {
  appliedPromo = null;
  document.getElementById('promo-applied').style.display = 'none';
  document.getElementById('promo-code').value = '';
  updateTotals();
}

// Checkout
function checkout() {
  // Validation
  const patientId = document.getElementById('patient-id').value.trim();
  const collectorInitials = document.getElementById('collector-initials').value.trim().toUpperCase();

  if (!patientId) {
    alert('Please enter Patient ID');
    return;
  }

  if (!collectorInitials) {
    alert('Please enter your initials');
    return;
  }

  if (cart.length === 0) {
    alert('Cart is empty');
    return;
  }

  // Check if new customer needs details
  if (!currentCustomer) {
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();

    if (!firstName || !lastName) {
      alert('Please enter customer first and last name');
      return;
    }
  }

  // Prepare checkout data
  const checkoutData = {
    patientId: patientId,
    collectorInitials: collectorInitials,
    cart: cart,
    promoCode: appliedPromo ? appliedPromo.promoCode : null,
    newCustomer: !currentCustomer ? {
      firstName: document.getElementById('first-name').value.trim(),
      lastName: document.getElementById('last-name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim()
    } : null
  };

  // Show loading
  const btn = event.target;
  btn.disabled = true;
  btn.textContent = 'Processing...';

  // Call backend to initiate checkout
  google.script.run
    .withSuccessHandler(function(result) {
      // Will implement Authorize.net redirect in Phase 3
      alert('Checkout successful! (Authorize.net integration coming in Phase 3)');

      // Reset
      cart = [];
      currentCustomer = null;
      appliedPromo = null;
      document.getElementById('patient-id').value = '';
      document.getElementById('collector-initials').value = '';
      document.getElementById('customer-details').style.display = 'none';
      document.getElementById('new-customer-form').style.display = 'none';
      renderCart();

      btn.disabled = false;
      btn.textContent = 'Checkout';
    })
    .withFailureHandler(function(error) {
      showError(error.message);
      btn.disabled = false;
      btn.textContent = 'Checkout';
    })
    .processCheckout(checkoutData);
}

// Utility functions
function showError(message) {
  alert('Error: ' + message);
}
</script>
```

---

## Phase 3: Authorize.net Integration (Week 3)

### Task 3.1: Set Up Authorize.net Sandbox

1. Go to https://developer.authorize.net/hello_world/sandbox/
2. Create free sandbox account
3. Get credentials:
   - API Login ID
   - Transaction Key
   - Signature Key (for Accept Hosted)
4. Paste into Config sheet

### Task 3.2: Create Authorize.net Service

Create `/AuthNetService.gs`:
```javascript
/**
 * Authorize.net Accept Hosted integration
 */
function getAcceptHostedToken(transactionData) {
  const config = getAllConfig();
  const apiLoginId = config.AUTHNET_API_LOGIN_ID;
  const transactionKey = config.AUTHNET_TRANSACTION_KEY;
  const environment = config.AUTHNET_ENVIRONMENT;

  const endpoint = environment === 'PRODUCTION'
    ? 'https://api.authorize.net/xml/v1/request.api'
    : 'https://apitest.authorize.net/xml/v1/request.api';

  // Build request
  const request = {
    "getHostedPaymentPageRequest": {
      "merchantAuthentication": {
        "name": apiLoginId,
        "transactionKey": transactionKey
      },
      "transactionRequest": {
        "transactionType": "authCaptureTransaction",
        "amount": transactionData.amount.toFixed(2),
        "order": {
          "invoiceNumber": transactionData.invoiceNumber,
          "description": transactionData.description
        },
        "customer": {
          "id": transactionData.customerId,
          "email": transactionData.customerEmail || ""
        },
        "billTo": {
          "firstName": transactionData.firstName,
          "lastName": transactionData.lastName
        }
      },
      "hostedPaymentSettings": {
        "setting": [
          {
            "settingName": "hostedPaymentReturnOptions",
            "settingValue": JSON.stringify({
              "showReceipt": true,
              "url": transactionData.returnUrl,
              "urlText": "Continue",
              "cancelUrl": transactionData.cancelUrl,
              "cancelUrlText": "Cancel"
            })
          },
          {
            "settingName": "hostedPaymentButtonOptions",
            "settingValue": JSON.stringify({
              "text": "Pay"
            })
          },
          {
            "settingName": "hostedPaymentPaymentOptions",
            "settingValue": JSON.stringify({
              "cardCodeRequired": true,
              "showCreditCard": true,
              "showBankAccount": false
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

  const response = UrlFetchApp.fetch(endpoint, options);
  const result = JSON.parse(response.getContentText());

  if (result.messages.resultCode === 'Ok') {
    return {
      success: true,
      token: result.token
    };
  } else {
    throw new Error(result.messages.message[0].text);
  }
}
```

### Task 3.3: Complete Checkout Flow

Continue in `/TransactionService.gs`...

---

## Implementation Checklist

Use this to track your progress:

### Foundation
- [ ] Google Sheet created with 7 tabs
- [ ] Sample product data added
- [ ] Config sheet populated with Authorize.net sandbox credentials
- [ ] Apps Script project created
- [ ] Config.gs implemented
- [ ] ProductService.gs implemented
- [ ] Web app deployed and accessible

### POS Features
- [ ] Product grid displays correctly
- [ ] Category filtering works
- [ ] Search functionality works
- [ ] Can add items to cart
- [ ] Cart displays correctly
- [ ] Can remove items from cart
- [ ] Price double-click edit works
- [ ] Customer lookup works
- [ ] New customer form appears for unknown Patient IDs
- [ ] Promo code validation works
- [ ] Promo code applies discount
- [ ] Totals calculate correctly

### Authorize.net
- [ ] Sandbox credentials configured
- [ ] Accept Hosted token generation works
- [ ] Hosted form opens in new tab/iframe
- [ ] Payment processes successfully in sandbox
- [ ] Response handler logs transaction
- [ ] Customer LTV updates after payment
- [ ] Receipt displays

### Analytics (Phase 4)
- [ ] Transaction log is complete
- [ ] Customer LTV is accurate
- [ ] Basic dashboard shows product performance
- [ ] Category breakdown report works

---

## Quick Deploy Instructions

1. In Apps Script, click Deploy > New Deployment
2. Select type: Web app
3. Description: "ALC POS v1.0"
4. Execute as: Me
5. Who has access: Anyone in your organization (or specific users)
6. Click Deploy
7. Copy web app URL
8. Share URL with receptionists
9. Bookmark for easy access

---

## Troubleshooting

**Products not loading:**
- Check sheet name is exactly "Products"
- Verify Active column contains TRUE (boolean)
- Check Apps Script logs (View > Logs)

**Customer lookup failing:**
- Check sheet name is exactly "Customers"
- Verify PatientID column format

**Authorize.net errors:**
- Verify credentials in Config sheet
- Check environment is set to SANDBOX
- Test credentials at https://developer.authorize.net

---

## Next Steps After Roadmap

Once all phases complete:
1. User acceptance testing with receptionists
2. Gather feedback and iterate
3. Switch to Authorize.net production
4. Monitor for 2 weeks
5. Build analytics dashboard
6. Prepare for multi-location rollout

**You now have a complete roadmap to build your POS system!**

Let me know when you're ready to start Phase 1, and I'll guide you through each step.
