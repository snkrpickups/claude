# Premium POS UI Design Specification
## ALC Medical Clinic Point of Sale System

**Version:** 1.0
**Purpose:** Complete design specification for building a premium, branded POS interface
**Brand:** ALC Medical Clinic

---

## 🎨 Brand Colors

### Primary Palette

```css
/* MIDNIGHT - Primary Brand Color */
--midnight: #183859;
--midnight-darker: #0f2440;
--midnight-dark: #122e4a;
--midnight-light: #1f4368;
--midnight-lighter: #2a5685;
--midnight-rgb: 24, 56, 89;

/* RIVER ROCK - Secondary Brand Color */
--river-rock: #5D7497;
--river-rock-darker: #4a5d7a;
--river-rock-dark: #516987;
--river-rock-light: #7189a8;
--river-rock-lighter: #8ba3be;
--river-rock-rgb: 93, 116, 151;

/* WHITE - Base Color */
--white: #FFFFFF;
--white-rgb: 255, 255, 255;
```

### Extended Color System

```css
/* Neutrals - Derived from brand colors */
--gray-50: #f8f9fb;   /* Lightest background */
--gray-100: #f0f2f5;  /* Light background */
--gray-200: #e3e7ed;  /* Borders, dividers */
--gray-300: #cbd2dc;  /* Disabled states */
--gray-400: #9ca8bc;  /* Placeholder text */
--gray-500: #6b7a94;  /* Secondary text */
--gray-600: #5D7497;  /* River Rock (body text) */
--gray-700: #4a5d7a;  /* Headings */
--gray-800: #2a3f5f;  /* Dark text */
--gray-900: #183859;  /* Midnight (darkest) */

/* Semantic Colors */
--success: #059669;      /* Green for prices, success states */
--success-light: #d1fae5;
--success-dark: #047857;

--warning: #f59e0b;      /* Amber for warnings, overrides */
--warning-light: #fef3c7;
--warning-dark: #d97706;

--error: #dc2626;        /* Red for errors, delete */
--error-light: #fee2e2;
--error-dark: #b91c1c;

--info: #3b82f6;         /* Blue for info states */
--info-light: #dbeafe;
--info-dark: #2563eb;

/* Overlay & Shadows */
--overlay: rgba(24, 56, 89, 0.5);           /* Midnight with 50% opacity */
--overlay-dark: rgba(24, 56, 89, 0.7);      /* Midnight with 70% opacity */
--shadow-sm: 0 1px 2px 0 rgba(24, 56, 89, 0.05);
--shadow-md: 0 4px 6px -1px rgba(24, 56, 89, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(24, 56, 89, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(24, 56, 89, 0.15);
```

---

## 📝 Typography System

### Font Stack

```css
/* Primary Font - Professional, Medical-Grade Sans-Serif */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
                'Helvetica Neue', Arial, sans-serif;

/* Monospace Font - For SKUs, Invoice Numbers, Amounts */
--font-mono: 'JetBrains Mono', 'SF Mono', 'Roboto Mono',
             'Courier New', monospace;
```

### Type Scale

```css
/* Display - Large headings, Hero text */
--text-xs: 0.75rem;      /* 12px - Labels, meta info */
--text-sm: 0.875rem;     /* 14px - Body text small */
--text-base: 1rem;       /* 16px - Body text */
--text-lg: 1.125rem;     /* 18px - Large body text */
--text-xl: 1.25rem;      /* 20px - Section headings */
--text-2xl: 1.5rem;      /* 24px - Page headings */
--text-3xl: 1.875rem;    /* 30px - Hero headings */
--text-4xl: 2.25rem;     /* 36px - Display text */

/* Line Heights */
--leading-none: 1;
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Typography Usage

```css
/* Headings */
h1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--midnight);
  line-height: var(--leading-tight);
  letter-spacing: -0.025em;
}

h2 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--midnight);
  line-height: var(--leading-tight);
}

h3 {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--gray-800);
  line-height: var(--leading-snug);
}

/* Body Text */
body {
  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  color: var(--gray-700);
  line-height: var(--leading-normal);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Labels */
label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--gray-800);
  line-height: var(--leading-snug);
}

/* Monospace - SKUs, Prices, Invoice Numbers */
.monospace {
  font-family: var(--font-mono);
  font-weight: var(--font-medium);
  letter-spacing: -0.015em;
}
```

---

## 🎯 Spacing System

```css
/* Spacing Scale - 4px base unit */
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

---

## 🔘 Component Library

### Buttons

```css
/* Primary Button - Main CTAs (Process Payment, Add to Cart) */
.btn-primary {
  background: linear-gradient(135deg, var(--midnight) 0%, var(--midnight-light) 100%);
  color: var(--white);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  padding: var(--space-3) var(--space-6);
  border: none;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.01em;
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--midnight-dark) 0%, var(--midnight) 100%);
  box-shadow: var(--shadow-lg);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.btn-primary:disabled {
  background: var(--gray-300);
  color: var(--gray-500);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* Secondary Button - Less important actions */
.btn-secondary {
  background: var(--white);
  color: var(--midnight);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  padding: var(--space-3) var(--space-6);
  border: 2px solid var(--midnight);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--midnight);
  color: var(--white);
  box-shadow: var(--shadow-md);
}

/* Tertiary Button - Subtle actions */
.btn-tertiary {
  background: transparent;
  color: var(--river-rock);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--gray-300);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-tertiary:hover {
  background: var(--gray-50);
  border-color: var(--river-rock);
  color: var(--midnight);
}

/* Success Button - Confirm actions */
.btn-success {
  background: linear-gradient(135deg, var(--success) 0%, var(--success-dark) 100%);
  color: var(--white);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  padding: var(--space-4) var(--space-8);
  border: none;
  border-radius: 0.75rem;
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-success:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-2px);
}

/* Danger Button - Delete, Remove */
.btn-danger {
  background: var(--error);
  color: var(--white);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  padding: var(--space-2) var(--space-3);
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-danger:hover {
  background: var(--error-dark);
}

/* Icon Button - Small actions */
.btn-icon {
  background: transparent;
  color: var(--gray-500);
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: none;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-icon:hover {
  background: var(--gray-100);
  color: var(--midnight);
}
```

### Input Fields

```css
/* Text Input */
.input-text {
  width: 100%;
  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  color: var(--gray-900);
  background: var(--white);
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--gray-300);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  outline: none;
}

.input-text:focus {
  border-color: var(--midnight);
  box-shadow: 0 0 0 3px rgba(24, 56, 89, 0.1);
}

.input-text:disabled {
  background: var(--gray-100);
  color: var(--gray-500);
  cursor: not-allowed;
}

.input-text.error {
  border-color: var(--error);
}

.input-text.error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

/* Select Dropdown */
.input-select {
  width: 100%;
  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--gray-900);
  background: var(--white);
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--gray-300);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235D7497' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 3rem;
}

.input-select:focus {
  border-color: var(--midnight);
  box-shadow: 0 0 0 3px rgba(24, 56, 89, 0.1);
  outline: none;
}

/* Search Input */
.input-search {
  width: 100%;
  font-family: var(--font-primary);
  font-size: var(--text-base);
  color: var(--gray-900);
  background: var(--gray-50);
  padding: var(--space-3) var(--space-4) var(--space-3) var(--space-10);
  border: 2px solid transparent;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%235D7497' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: left 1rem center;
}

.input-search:focus {
  background: var(--white);
  border-color: var(--midnight);
  box-shadow: var(--shadow-md);
  outline: none;
}

/* Label */
.input-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--gray-800);
  margin-bottom: var(--space-2);
  letter-spacing: 0.01em;
}

.input-label.required::after {
  content: " *";
  color: var(--error);
}
```

### Cards

```css
/* Product Card */
.card-product {
  background: var(--white);
  border: 2px solid var(--gray-200);
  border-radius: 0.75rem;
  padding: var(--space-4);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.card-product:hover {
  border-color: var(--midnight);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card-product:active {
  transform: translateY(0);
  box-shadow: var(--shadow-md);
}

.card-product-sku {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--river-rock);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-product-name {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--midnight);
  line-height: var(--leading-snug);
  min-height: 2.5rem;
}

.card-product-duration {
  font-size: var(--text-sm);
  color: var(--gray-600);
}

.card-product-price {
  font-family: var(--font-mono);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--success);
  letter-spacing: -0.02em;
}

/* Section Card */
.card-section {
  background: var(--white);
  border-radius: 1rem;
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
}

.card-section-header {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--midnight);
  margin-bottom: var(--space-5);
  padding-bottom: var(--space-4);
  border-bottom: 2px solid var(--gray-200);
}

/* Info Card */
.card-info {
  background: linear-gradient(135deg, var(--midnight) 0%, var(--midnight-light) 100%);
  color: var(--white);
  border-radius: 0.75rem;
  padding: var(--space-4);
  box-shadow: var(--shadow-lg);
}

.card-info-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: var(--space-1);
}

.card-info-value {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--white);
}
```

### Badges & Tags

```css
/* Badge - Status indicators */
.badge {
  display: inline-flex;
  align-items: center;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  padding: var(--space-1) var(--space-3);
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-success {
  background: var(--success-light);
  color: var(--success-dark);
}

.badge-warning {
  background: var(--warning-light);
  color: var(--warning-dark);
}

.badge-error {
  background: var(--error-light);
  color: var(--error-dark);
}

.badge-info {
  background: var(--info-light);
  color: var(--info-dark);
}

.badge-brand {
  background: rgba(24, 56, 89, 0.1);
  color: var(--midnight);
}

/* Tag - Category filters */
.tag {
  display: inline-flex;
  align-items: center;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  padding: var(--space-2) var(--space-4);
  border: 2px solid var(--gray-300);
  border-radius: 0.5rem;
  background: var(--white);
  color: var(--gray-700);
  cursor: pointer;
  transition: all 0.15s ease;
}

.tag:hover {
  border-color: var(--midnight);
  color: var(--midnight);
}

.tag.active {
  background: var(--midnight);
  border-color: var(--midnight);
  color: var(--white);
  box-shadow: var(--shadow-md);
}
```

### Modal

```css
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Modal Container */
.modal {
  background: var(--white);
  border-radius: 1rem;
  max-width: 32rem;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Modal Header */
.modal-header {
  padding: var(--space-6);
  border-bottom: 2px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--midnight);
}

.modal-close {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background: transparent;
  border: none;
  color: var(--gray-500);
  cursor: pointer;
  transition: all 0.15s ease;
}

.modal-close:hover {
  background: var(--gray-100);
  color: var(--gray-900);
}

/* Modal Body */
.modal-body {
  padding: var(--space-6);
}

/* Modal Footer */
.modal-footer {
  padding: var(--space-6);
  border-top: 2px solid var(--gray-200);
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}
```

---

## 📐 Layout System

### Container

```css
.container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

@media (min-width: 1024px) {
  .container {
    padding: 0 var(--space-8);
  }
}
```

### Grid System

```css
/* Main Layout - Two Column */
.layout-main {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  margin-top: var(--space-6);
}

@media (min-width: 1024px) {
  .layout-main {
    grid-template-columns: 2fr 1fr;
    gap: var(--space-8);
  }
}

/* Product Grid */
.grid-products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-4);
}

@media (min-width: 1440px) {
  .grid-products {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: var(--space-5);
  }
}
```

### Header

```css
.header {
  background: linear-gradient(135deg, var(--midnight) 0%, var(--midnight-light) 100%);
  color: var(--white);
  padding: var(--space-6) 0;
  box-shadow: var(--shadow-lg);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-logo {
  font-size: var(--text-3xl);
  font-weight: var(--font-extrabold);
  color: var(--white);
  letter-spacing: -0.02em;
}

.header-user {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.header-user-info {
  text-align: right;
}

.header-user-name {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--white);
}

.header-user-email {
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.8);
}

.header-user-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--white);
  color: var(--midnight);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  box-shadow: var(--shadow-md);
}
```

---

## 🎭 Complete UI Mockup (HTML + CSS)

### Full Implementation Code

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ALC POS System</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    /* ============================================
       PREMIUM POS UI - ALC MEDICAL CLINIC
       Brand Colors: Midnight #183859, River Rock #5D7497
       ============================================ */

    /* CSS VARIABLES */
    :root {
      /* Brand Colors */
      --midnight: #183859;
      --midnight-darker: #0f2440;
      --midnight-dark: #122e4a;
      --midnight-light: #1f4368;
      --midnight-lighter: #2a5685;

      --river-rock: #5D7497;
      --river-rock-darker: #4a5d7a;
      --river-rock-dark: #516987;
      --river-rock-light: #7189a8;
      --river-rock-lighter: #8ba3be;

      --white: #FFFFFF;

      /* Neutrals */
      --gray-50: #f8f9fb;
      --gray-100: #f0f2f5;
      --gray-200: #e3e7ed;
      --gray-300: #cbd2dc;
      --gray-400: #9ca8bc;
      --gray-500: #6b7a94;
      --gray-600: #5D7497;
      --gray-700: #4a5d7a;
      --gray-800: #2a3f5f;
      --gray-900: #183859;

      /* Semantic */
      --success: #059669;
      --success-light: #d1fae5;
      --success-dark: #047857;
      --warning: #f59e0b;
      --warning-light: #fef3c7;
      --warning-dark: #d97706;
      --error: #dc2626;
      --error-light: #fee2e2;
      --error-dark: #b91c1c;
      --info: #3b82f6;
      --info-light: #dbeafe;
      --info-dark: #2563eb;

      /* Shadows */
      --shadow-sm: 0 1px 2px 0 rgba(24, 56, 89, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(24, 56, 89, 0.1);
      --shadow-lg: 0 10px 15px -3px rgba(24, 56, 89, 0.1);
      --shadow-xl: 0 20px 25px -5px rgba(24, 56, 89, 0.15);

      /* Overlay */
      --overlay: rgba(24, 56, 89, 0.5);
      --overlay-dark: rgba(24, 56, 89, 0.7);

      /* Typography */
      --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      --font-mono: 'SF Mono', 'Roboto Mono', monospace;

      /* Spacing */
      --space-1: 0.25rem;
      --space-2: 0.5rem;
      --space-3: 0.75rem;
      --space-4: 1rem;
      --space-5: 1.25rem;
      --space-6: 1.5rem;
      --space-8: 2rem;
      --space-10: 2.5rem;
      --space-12: 3rem;
    }

    /* RESET & BASE */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-primary);
      font-size: 1rem;
      color: var(--gray-700);
      background: var(--gray-50);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* HEADER */
    .header {
      background: linear-gradient(135deg, var(--midnight) 0%, var(--midnight-light) 100%);
      color: var(--white);
      padding: var(--space-6) 0;
      box-shadow: var(--shadow-lg);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1600px;
      margin: 0 auto;
      padding: 0 var(--space-8);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header-logo {
      font-size: 1.875rem;
      font-weight: 800;
      color: var(--white);
      letter-spacing: -0.02em;
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .header-logo-icon {
      width: 2.5rem;
      height: 2.5rem;
      background: var(--white);
      color: var(--midnight);
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.25rem;
      box-shadow: var(--shadow-md);
    }

    .header-user {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .header-user-info {
      text-align: right;
    }

    .header-user-name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--white);
    }

    .header-user-email {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .header-user-avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: var(--white);
      color: var(--midnight);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.125rem;
      font-weight: 700;
      box-shadow: var(--shadow-md);
    }

    /* CONTAINER */
    .container {
      max-width: 1600px;
      margin: 0 auto;
      padding: var(--space-8);
    }

    /* MAIN LAYOUT */
    .layout-main {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-6);
    }

    @media (min-width: 1024px) {
      .layout-main {
        grid-template-columns: 2fr 1fr;
        gap: var(--space-8);
      }
    }

    /* CARDS */
    .card {
      background: var(--white);
      border-radius: 1rem;
      padding: var(--space-6);
      box-shadow: var(--shadow-md);
    }

    .card-header {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--midnight);
      margin-bottom: var(--space-5);
      padding-bottom: var(--space-4);
      border-bottom: 2px solid var(--gray-200);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .card-count {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--river-rock);
      background: rgba(93, 116, 151, 0.1);
      padding: var(--space-1) var(--space-3);
      border-radius: 9999px;
    }

    /* CATEGORY FILTERS */
    .category-filters {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
      margin-bottom: var(--space-5);
    }

    .tag {
      display: inline-flex;
      align-items: center;
      font-size: 0.875rem;
      font-weight: 500;
      padding: var(--space-2) var(--space-4);
      border: 2px solid var(--gray-300);
      border-radius: 0.5rem;
      background: var(--white);
      color: var(--gray-700);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .tag:hover {
      border-color: var(--midnight);
      color: var(--midnight);
    }

    .tag.active {
      background: var(--midnight);
      border-color: var(--midnight);
      color: var(--white);
      box-shadow: var(--shadow-md);
    }

    /* SEARCH INPUT */
    .input-search {
      width: 100%;
      font-family: var(--font-primary);
      font-size: 1rem;
      color: var(--gray-900);
      background: var(--gray-50);
      padding: var(--space-3) var(--space-4) var(--space-3) 2.75rem;
      border: 2px solid transparent;
      border-radius: 0.75rem;
      transition: all 0.2s ease;
      margin-bottom: var(--space-5);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%235D7497' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: left 1rem center;
    }

    .input-search:focus {
      background: var(--white);
      border-color: var(--midnight);
      box-shadow: var(--shadow-md);
      outline: none;
    }

    /* PRODUCT GRID */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: var(--space-4);
      max-height: 650px;
      overflow-y: auto;
      padding-right: var(--space-2);
    }

    /* Custom Scrollbar */
    .product-grid::-webkit-scrollbar {
      width: 8px;
    }

    .product-grid::-webkit-scrollbar-track {
      background: var(--gray-100);
      border-radius: 4px;
    }

    .product-grid::-webkit-scrollbar-thumb {
      background: var(--river-rock);
      border-radius: 4px;
    }

    .product-grid::-webkit-scrollbar-thumb:hover {
      background: var(--midnight);
    }

    /* PRODUCT CARD */
    .product-card {
      background: var(--white);
      border: 2px solid var(--gray-200);
      border-radius: 0.75rem;
      padding: var(--space-4);
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .product-card:hover {
      border-color: var(--midnight);
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }

    .product-card:active {
      transform: translateY(0);
      box-shadow: var(--shadow-md);
    }

    .product-card-sku {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--river-rock);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .product-card-name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--midnight);
      line-height: 1.375;
      min-height: 2.5rem;
    }

    .product-card-duration {
      font-size: 0.875rem;
      color: var(--gray-600);
    }

    .product-card-price {
      font-family: var(--font-mono);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--success);
      letter-spacing: -0.02em;
    }

    /* CART SECTION */
    .cart-section {
      position: sticky;
      top: 7rem;
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    /* CUSTOMER INFO CARD */
    .customer-card {
      background: linear-gradient(135deg, var(--midnight) 0%, var(--midnight-light) 100%);
      color: var(--white);
      border-radius: 1rem;
      padding: var(--space-5);
      box-shadow: var(--shadow-lg);
    }

    .customer-card-header {
      font-size: 1rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: var(--space-4);
    }

    .input-text {
      width: 100%;
      font-family: var(--font-primary);
      font-size: 1rem;
      color: var(--gray-900);
      background: var(--white);
      padding: var(--space-3) var(--space-4);
      border: 2px solid transparent;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      outline: none;
    }

    .input-text:focus {
      border-color: var(--midnight);
      box-shadow: 0 0 0 3px rgba(24, 56, 89, 0.1);
    }

    .customer-info {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 0.75rem;
      padding: var(--space-4);
      margin-top: var(--space-4);
    }

    .customer-info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-2) 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .customer-info-row:last-child {
      border-bottom: none;
    }

    .customer-info-label {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .customer-info-value {
      font-size: 1rem;
      font-weight: 600;
      color: var(--white);
    }

    /* FORM GROUP */
    .form-group {
      margin-bottom: var(--space-4);
    }

    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: var(--space-2);
    }

    .form-label-dark {
      color: var(--gray-800);
    }

    .input-select {
      width: 100%;
      font-family: var(--font-primary);
      font-size: 1rem;
      font-weight: 500;
      color: var(--gray-900);
      background: var(--white);
      padding: var(--space-3) var(--space-4);
      border: 2px solid transparent;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235D7497' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 1rem center;
    }

    .input-select:focus {
      border-color: var(--midnight);
      box-shadow: 0 0 0 3px rgba(24, 56, 89, 0.1);
      outline: none;
    }

    /* CART ITEMS */
    .cart-items {
      max-height: 300px;
      overflow-y: auto;
      margin-bottom: var(--space-4);
    }

    .cart-items::-webkit-scrollbar {
      width: 6px;
    }

    .cart-items::-webkit-scrollbar-track {
      background: var(--gray-100);
      border-radius: 3px;
    }

    .cart-items::-webkit-scrollbar-thumb {
      background: var(--river-rock);
      border-radius: 3px;
    }

    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: var(--space-3) 0;
      border-bottom: 1px solid var(--gray-200);
    }

    .cart-item:last-child {
      border-bottom: none;
    }

    .cart-item-info {
      flex: 1;
    }

    .cart-item-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--midnight);
      margin-bottom: var(--space-1);
    }

    .cart-item-meta {
      font-size: 0.75rem;
      color: var(--gray-600);
      font-family: var(--font-mono);
    }

    .cart-item-actions {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .cart-item-price {
      font-family: var(--font-mono);
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--success);
      cursor: pointer;
      padding: var(--space-2) var(--space-3);
      border-radius: 0.375rem;
      transition: all 0.15s ease;
    }

    .cart-item-price:hover {
      background: var(--gray-100);
    }

    .cart-item-price.edited {
      background: var(--warning-light);
      color: var(--warning-dark);
    }

    .btn-remove {
      background: var(--error);
      color: var(--white);
      border: none;
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.125rem;
      font-weight: 700;
      transition: all 0.15s ease;
    }

    .btn-remove:hover {
      background: var(--error-dark);
      transform: scale(1.1);
    }

    /* CART TOTALS */
    .cart-totals {
      border-top: 2px solid var(--gray-200);
      padding-top: var(--space-4);
      margin-top: var(--space-4);
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-3);
      font-size: 1rem;
    }

    .total-row-label {
      color: var(--gray-700);
      font-weight: 500;
    }

    .total-row-value {
      font-family: var(--font-mono);
      font-weight: 600;
      color: var(--gray-900);
    }

    .total-row-discount {
      color: var(--error);
    }

    .total-row-grand {
      font-size: 1.5rem;
      font-weight: 700;
      padding-top: var(--space-4);
      border-top: 2px solid var(--midnight);
      margin-top: var(--space-2);
    }

    .total-row-grand .total-row-label {
      color: var(--midnight);
      font-weight: 700;
    }

    .total-row-grand .total-row-value {
      color: var(--midnight);
      font-weight: 800;
      font-size: 1.75rem;
    }

    /* BUTTONS */
    .btn {
      font-family: var(--font-primary);
      font-weight: 600;
      padding: var(--space-3) var(--space-6);
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      text-align: center;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--midnight) 0%, var(--midnight-light) 100%);
      color: var(--white);
      box-shadow: var(--shadow-md);
      width: 100%;
      font-size: 1rem;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, var(--midnight-dark) 0%, var(--midnight) 100%);
      box-shadow: var(--shadow-lg);
      transform: translateY(-1px);
    }

    .btn-primary:active {
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }

    .btn-success {
      background: linear-gradient(135deg, var(--success) 0%, var(--success-dark) 100%);
      color: var(--white);
      box-shadow: var(--shadow-lg);
      width: 100%;
      font-size: 1.125rem;
      padding: var(--space-4) var(--space-8);
      font-weight: 700;
      border-radius: 0.75rem;
    }

    .btn-success:hover {
      box-shadow: var(--shadow-xl);
      transform: translateY(-2px);
    }

    .btn-success:active {
      transform: translateY(0);
    }

    /* EMPTY STATE */
    .empty-state {
      text-align: center;
      padding: var(--space-12) var(--space-4);
      color: var(--gray-500);
    }

    .empty-state-icon {
      font-size: 3rem;
      margin-bottom: var(--space-4);
      opacity: 0.5;
    }

    .empty-state-text {
      font-size: 1.125rem;
      font-weight: 500;
      color: var(--gray-600);
    }

    .empty-state-subtext {
      font-size: 0.875rem;
      color: var(--gray-500);
      margin-top: var(--space-2);
    }

    /* LOADING STATE */
    .loading {
      text-align: center;
      padding: var(--space-8);
      color: var(--river-rock);
    }

    .loading-spinner {
      width: 3rem;
      height: 3rem;
      border: 4px solid var(--gray-200);
      border-top-color: var(--midnight);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto var(--space-4);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* BADGE */
    .badge {
      display: inline-flex;
      align-items: center;
      font-size: 0.75rem;
      font-weight: 600;
      padding: var(--space-1) var(--space-3);
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge-warning {
      background: var(--warning-light);
      color: var(--warning-dark);
    }

    /* RESPONSIVE */
    @media (max-width: 1023px) {
      .header-content {
        padding: 0 var(--space-4);
      }

      .container {
        padding: var(--space-4);
      }

      .cart-section {
        position: static;
      }

      .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: var(--space-3);
      }
    }

    @media (max-width: 640px) {
      .header-logo {
        font-size: 1.5rem;
      }

      .header-user-info {
        display: none;
      }

      .category-filters {
        gap: var(--space-2);
      }

      .tag {
        font-size: 0.75rem;
        padding: var(--space-1) var(--space-3);
      }
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <header class="header">
    <div class="header-content">
      <div class="header-logo">
        <div class="header-logo-icon">A</div>
        <span>ALC POS</span>
      </div>
      <div class="header-user">
        <div class="header-user-info">
          <div class="header-user-name">John Doe</div>
          <div class="header-user-email">john.doe@alc.com</div>
        </div>
        <div class="header-user-avatar">JD</div>
      </div>
    </div>
  </header>

  <!-- MAIN CONTENT -->
  <div class="container">
    <div class="layout-main">

      <!-- PRODUCTS SECTION -->
      <div>
        <div class="card">
          <div class="card-header">
            <span>Products</span>
            <span class="card-count">119 items</span>
          </div>

          <!-- CATEGORY FILTERS -->
          <div class="category-filters">
            <button class="tag active">All</button>
            <button class="tag">Weight Loss</button>
            <button class="tag">HRT Male</button>
            <button class="tag">HRT Female</button>
            <button class="tag">IV Therapy</button>
            <button class="tag">Labs</button>
            <button class="tag">Peptides</button>
            <button class="tag">Procedures</button>
          </div>

          <!-- SEARCH -->
          <input type="text" class="input-search" placeholder="Search products by name or SKU...">

          <!-- PRODUCT GRID -->
          <div class="product-grid">
            <!-- Product Card 1 -->
            <div class="product-card">
              <div class="product-card-sku">SEMA-025</div>
              <div class="product-card-name">Semaglutide 0.25mg</div>
              <div class="product-card-duration">Weekly Injection</div>
              <div class="product-card-price">$250.00</div>
            </div>

            <!-- Product Card 2 -->
            <div class="product-card">
              <div class="product-card-sku">TIRZ-05</div>
              <div class="product-card-name">Tirzepatide 5mg</div>
              <div class="product-card-duration">Weekly Injection</div>
              <div class="product-card-price">$350.00</div>
            </div>

            <!-- Product Card 3 -->
            <div class="product-card">
              <div class="product-card-sku">TEST-CYP</div>
              <div class="product-card-name">Testosterone Cypionate</div>
              <div class="product-card-duration">Monthly Supply</div>
              <div class="product-card-price">$150.00</div>
            </div>

            <!-- Product Card 4 -->
            <div class="product-card">
              <div class="product-card-sku">IV-GLUT</div>
              <div class="product-card-name">Glutathione IV Drip</div>
              <div class="product-card-duration">Single Treatment</div>
              <div class="product-card-price">$200.00</div>
            </div>

            <!-- Product Card 5 -->
            <div class="product-card">
              <div class="product-card-sku">NAD-500</div>
              <div class="product-card-name">NAD+ IV Therapy</div>
              <div class="product-card-duration">500mg Session</div>
              <div class="product-card-price">$450.00</div>
            </div>

            <!-- Product Card 6 -->
            <div class="product-card">
              <div class="product-card-sku">CONSULT-NEW</div>
              <div class="product-card-name">New Patient Consultation</div>
              <div class="product-card-duration">30 minutes</div>
              <div class="product-card-price">$100.00</div>
            </div>

            <!-- More products would be here -->
          </div>
        </div>
      </div>

      <!-- CART SECTION -->
      <div class="cart-section">

        <!-- CUSTOMER INFO -->
        <div class="customer-card">
          <div class="customer-card-header">Customer Information</div>

          <div class="form-group">
            <label class="form-label">Patient ID</label>
            <input type="text" class="input-text" placeholder="e.g., JF123456" value="JF123456">
          </div>

          <div class="customer-info">
            <div class="customer-info-row">
              <span class="customer-info-label">Name:</span>
              <span class="customer-info-value">John Smith</span>
            </div>
            <div class="customer-info-row">
              <span class="customer-info-label">Lifetime Value:</span>
              <span class="customer-info-value">$1,245.00</span>
            </div>
            <div class="customer-info-row">
              <span class="customer-info-label">Total Visits:</span>
              <span class="customer-info-value">5</span>
            </div>
          </div>

          <div class="form-group" style="margin-top: 1rem;">
            <label class="form-label">Provider</label>
            <select class="input-select">
              <option value="">Select Provider...</option>
              <option value="BA">BA - Dr. B. Anderson</option>
              <option value="DR">DR - Dr. D. Rodriguez</option>
              <option value="JN">JN - J. Nguyen, NP</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Collector (You)</label>
            <input type="text" class="input-text" value="GK" readonly style="background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8);">
          </div>
        </div>

        <!-- CART -->
        <div class="card">
          <div class="card-header">
            <span>Cart</span>
            <span class="card-count">3 items</span>
          </div>

          <div class="cart-items">
            <!-- Cart Item 1 -->
            <div class="cart-item">
              <div class="cart-item-info">
                <div class="cart-item-name">Semaglutide 0.25mg</div>
                <div class="cart-item-meta">SEMA-025 × 1</div>
              </div>
              <div class="cart-item-actions">
                <div class="cart-item-price">$250.00</div>
                <button class="btn-remove">×</button>
              </div>
            </div>

            <!-- Cart Item 2 -->
            <div class="cart-item">
              <div class="cart-item-info">
                <div class="cart-item-name">Glutathione IV Drip</div>
                <div class="cart-item-meta">IV-GLUT × 2</div>
              </div>
              <div class="cart-item-actions">
                <div class="cart-item-price">$400.00</div>
                <button class="btn-remove">×</button>
              </div>
            </div>

            <!-- Cart Item 3 - With Price Override -->
            <div class="cart-item">
              <div class="cart-item-info">
                <div class="cart-item-name">NAD+ IV Therapy</div>
                <div class="cart-item-meta">
                  NAD-500 × 1
                  <span class="badge badge-warning" style="margin-left: 0.5rem;">Grandfathered</span>
                </div>
              </div>
              <div class="cart-item-actions">
                <div class="cart-item-price edited">$350.00</div>
                <button class="btn-remove">×</button>
              </div>
            </div>
          </div>

          <!-- TOTALS -->
          <div class="cart-totals">
            <div class="total-row">
              <span class="total-row-label">Subtotal:</span>
              <span class="total-row-value">$1,100.00</span>
            </div>
            <div class="total-row">
              <span class="total-row-label">Discount:</span>
              <span class="total-row-value total-row-discount">-$100.00</span>
            </div>
            <div class="total-row total-row-grand">
              <span class="total-row-label">TOTAL:</span>
              <span class="total-row-value">$1,000.00</span>
            </div>
          </div>

          <button class="btn btn-success" style="margin-top: 1.5rem;">
            💳 Process Payment
          </button>
        </div>

      </div>
    </div>
  </div>

  <script>
    // Add interactivity here
    console.log('ALC POS System - Premium UI Loaded');
  </script>

</body>
</html>
```

---

## 🎨 Design Principles

### 1. **Premium Medical Aesthetic**
- Clean, professional layouts
- Generous white space
- Subtle gradients using brand colors
- Medical-grade clarity and precision

### 2. **Midnight & River Rock Color Strategy**
- **Midnight (#183859):** Primary actions, headers, important text
- **River Rock (#5D7497):** Secondary text, icons, supporting elements
- **White (#FFFFFF):** Backgrounds, contrast, breathing room
- **Gradients:** Midnight → Midnight Light for depth and premium feel

### 3. **Typography Hierarchy**
- **Inter Font:** Professional, highly legible, medical-appropriate
- **Monospace:** For SKUs, prices, invoice numbers (data clarity)
- **Bold weights:** Create visual hierarchy without color
- **Generous spacing:** Improve scannability

### 4. **Micro-interactions**
- Subtle hover states (color shift, shadow growth, translateY)
- Active states (shadow reduction, transform reset)
- Smooth transitions (0.15s-0.2s for responsiveness)
- Loading states and animations

### 5. **Shadows & Depth**
- Midnight-based shadows (not pure black)
- Multiple shadow levels (sm, md, lg, xl)
- Shadows indicate interactivity and elevation
- Cards float above background

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
Base: 0-639px (single column, stacked)
Tablet: 640-1023px (single column, wider)
Desktop: 1024-1439px (two column layout)
Large Desktop: 1440px+ (optimized spacing)
```

---

## ✨ Premium Features to Implement

### Animations
```css
/* Button Press Animation */
@keyframes pressDown {
  0% { transform: scale(1); }
  50% { transform: scale(0.98); }
  100% { transform: scale(1); }
}

/* Success Pulse */
@keyframes successPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(5, 150, 105, 0); }
}

/* Shimmer Loading */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

### Glass Morphism (Optional Modern Touch)
```css
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

### Gradient Backgrounds
```css
.bg-brand-gradient {
  background: linear-gradient(135deg, #183859 0%, #1f4368 50%, #2a5685 100%);
}

.bg-subtle-gradient {
  background: linear-gradient(135deg, #f8f9fb 0%, #ffffff 100%);
}
```

---

## 🎯 Implementation Instructions for Claude AI

**Paste this exact prompt with the HTML code above:**

```
Create a premium, fully-functional Point of Sale web application using the following brand colors:

BRAND COLORS:
- Primary (Midnight): #183859
- Secondary (River Rock): #5D7497
- White: #FFFFFF

REQUIREMENTS:
1. Use the EXACT HTML/CSS code provided above as the foundation
2. Implement all JavaScript functionality for:
   - Product grid (119 SKUs from Google Sheets)
   - Category filtering
   - Search functionality
   - Cart management (add, remove, edit price)
   - Customer lookup (Patient ID validation JF123456 format)
   - Provider selection
   - Checkout process with Authorize.net
   - Price override modal
   - Promo code application
3. Maintain the premium design aesthetic throughout
4. Ensure all colors use the brand palette (no other blues/grays)
5. Keep the Inter font and monospace fonts for data
6. Preserve all shadows, gradients, and animations
7. Make it fully responsive
8. Add smooth transitions and micro-interactions
9. Integrate with Google Apps Script backend (provided separately)

The UI should feel like a premium medical spa POS system - clean, professional, trustworthy, and efficient.
```

---

**This specification is complete and ready to use!** 🎉
