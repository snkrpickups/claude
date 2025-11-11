# ALC POS System - UI Preview

## 🖥️ Main Interface Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                             │
│   ALC Point of Sale                                    Logged in as: John Receptionist     │
│   Location: ▼ Main Clinic                                           john@alcclinic.com     │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────┬──────────────────────────────────────────────┐
│                                            │                                              │
│  PRODUCTS (119)                            │  CUSTOMER INFORMATION                       │
│                                            │                                              │
│  [ All ] [Weight Loss] [HRT Male] [HRT Fe-│  Patient ID: [JF______]                     │
│  male] [Pellets] [Sexual Performance]...  │  [Lookup Customer]                          │
│                                            │                                              │
│  [🔍 Search products...]                   │  ─────────────────────────────────────      │
│                                            │  Provider: [▼ Select Provider...]           │
│  ┌────────┐ ┌────────┐ ┌────────┐        │  Collector: [GK] (auto-detected)            │
│  │WL-SEM- │ │WL-SEM- │ │WL-TIRZ-│        │                                              │
│  │I-10WK  │ │O-10WK  │ │O-4WK   │        │  ─────────────────────────────────────      │
│  │Semaglu-│ │Semaglu-│ │Tirzepa-│        │                                              │
│  │tide    │ │tide    │ │tide    │        │  SHOPPING CART (0 items)                    │
│  │Inject- │ │Oral    │ │Oral    │        │                                              │
│  │able    │ │10 weeks│ │4 weeks │        │  Cart is empty                              │
│  │10 weeks│ │        │ │        │        │  Click products to add                      │
│  │$1000.00│ │$850.00 │ │$450.00 │        │                                              │
│  └────────┘ └────────┘ └────────┘        │                                              │
│                                            │  [🏷️ Promo code___] [Apply]                 │
│  ┌────────┐ ┌────────┐ ┌────────┐        │                                              │
│  │HRT-M-  │ │HRT-M-  │ │HRT-M-  │        │  ─────────────────────────────────────      │
│  │TEST-   │ │ENCL-   │ │GONAD-  │        │  Subtotal:              $0.00               │
│  │10WK    │ │10WK    │ │10WK    │        │  ═══════════════════════════════════      │
│  │Testos- │ │Enclomi-│ │Gonado- │        │  Total:                 $0.00               │
│  │terone  │ │phene   │ │relin   │        │                                              │
│  │10 weeks│ │10 weeks│ │10 weeks│        │  ─────────────────────────────────────      │
│  │$420.00 │ │$495.00 │ │$295.00 │        │                                              │
│  └────────┘ └────────┘ └────────┘        │  PAYMENT                                     │
│                                            │  ⚪ Credit Card Only                         │
│  [More products...]                        │  ⚪ Cash + Card Split                        │
│                                            │                                              │
│                                            │  □ Email receipt to patient                 │
│                                            │                                              │
│                                            │  [     PROCESS PAYMENT     ]                │
│                                            │                                              │
│                                            │  [      CLEAR CART      ]                   │
│                                            │                                              │
└────────────────────────────────────────────┴──────────────────────────────────────────────┘
```

---

## 🎨 Detailed Component Views

### 1. Header Bar

```
┌──────────────────────────────────────────────────────────────────────────┐
│  📊 ALC Point of Sale                    👤 John Receptionist            │
│     Location: ▼ Main Clinic                  john@alcclinic.com         │
└──────────────────────────────────────────────────────────────────────────┘
```
- **Clean, professional header**
- White background with subtle shadow
- Logo area on left
- User info on right (name + email)
- Location dropdown (only shows if multiple locations)

---

### 2. Category Filters (Active State)

```
┌────────────────────────────────────────────────────────────────────────┐
│  [  All  ] [ Weight Loss ] [ HRT Male ] [ HRT Female ] [ Pellets ]   │
│  [ Sexual Performance ] [ Peptides ] [ Cosmetic Facial ] [ Labs ]... │
└────────────────────────────────────────────────────────────────────────┘
```

**When "Weight Loss" is selected:**
```
┌────────────────────────────────────────────────────────────────────────┐
│  [  All  ] [Weight Loss] [ HRT Male ] [ HRT Female ] [ Pellets ]     │
│           ^^^^^^^^^^^^^                                                │
│          Blue background                                               │
│          White text                                                    │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Product Card (Detailed)

```
┌─────────────────────────────┐
│ WL-SEM-I-10WK              │  ← SKU (small, gray, monospace)
│                             │
│ Semaglutide Injectable      │  ← Product Name (bold, black)
│ 10 weeks                    │
│                             │
│ 10 weeks                    │  ← Duration (small, gray)
│                             │
│                             │
│ $1,000.00                   │  ← Price (large, green, bold)
│                             │
└─────────────────────────────┘
```

**Hover Effect:**
```
┌─────────────────────────────┐
│ WL-SEM-I-10WK              │  ← Border turns blue
│                             │     Card lifts slightly
│ Semaglutide Injectable      │     Subtle shadow appears
│ 10 weeks                    │     Cursor becomes pointer
│                             │
│ 10 weeks                    │
│                             │
│                             │
│ $1,000.00                   │
│                             │
└─────────────────────────────┘
```

---

### 4. Customer Lookup - Existing Customer

```
┌─────────────────────────────────────────────┐
│ CUSTOMER INFORMATION                        │
├─────────────────────────────────────────────┤
│                                             │
│ Patient ID: [JF123456]                      │
│                                             │
│ [    Lookup Customer    ]                  │
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ ✓ Customer Found                        ││
│ │                                         ││
│ │ Name: John Smith                        ││
│ │ Lifetime Value: $1,800.00               ││
│ │ Total Visits: 12                        ││
│ └─────────────────────────────────────────┘│
│                                             │
│ ─────────────────────────────────────────  │
│                                             │
│ Provider: [▼ BA                        ]   │
│                                             │
│ Collector: [GK]  (auto-detected)           │
│                                             │
└─────────────────────────────────────────────┘
```

---

### 5. Customer Lookup - New Customer

```
┌─────────────────────────────────────────────┐
│ CUSTOMER INFORMATION                        │
├─────────────────────────────────────────────┤
│                                             │
│ Patient ID: [JF789012]                      │
│                                             │
│ [    Lookup Customer    ]                  │
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ ⚠️  New customer - please enter details ││
│ └─────────────────────────────────────────┘│
│                                             │
│ First Name: [____________]                  │
│                                             │
│ Last Name:  [____________]                  │
│                                             │
│ Email (opt): [____________]                 │
│                                             │
│ Phone (opt): [____________]                 │
│                                             │
│ ─────────────────────────────────────────  │
│                                             │
│ Provider: [▼ DR                        ]   │
│                                             │
│ Collector: [GK]  (auto-detected)           │
│                                             │
└─────────────────────────────────────────────┘
```

---

### 6. Shopping Cart - With Items

```
┌─────────────────────────────────────────────┐
│ SHOPPING CART (3 items)                     │
├─────────────────────────────────────────────┤
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ Semaglutide Injectable 10 weeks         ││
│ │ WL-SEM-I-10WK × 1                       ││
│ │                        [$1,000.00]  [×] ││
│ └─────────────────────────────────────────┘│
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ Testosterone 10 weeks                   ││
│ │ HRT-M-TEST-10WK × 1  *Grandfathered*    ││
│ │                        [  $336.00]  [×] ││
│ │                         ↑ Yellow bg     ││
│ │                       (price edited)    ││
│ └─────────────────────────────────────────┘│
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ Initial Consult                         ││
│ │ CONS-INITIAL × 1                        ││
│ │                        [  $150.00]  [×] ││
│ └─────────────────────────────────────────┘│
│                                             │
│ ─────────────────────────────────────────  │
│                                             │
│ [🏷️ WELCOME10_____] [Apply]                 │
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ ✓ WELCOME10: 10% off                   ││
│ │                              [Remove]   ││
│ └─────────────────────────────────────────┘│
│                                             │
│ ─────────────────────────────────────────  │
│                                             │
│ Subtotal:                      $1,486.00   │
│ Discount:                       -$148.60   │
│ ═════════════════════════════════════════  │
│ Total:                         $1,337.40   │
│                                  ↑ Large   │
│                                    Bold    │
│ ─────────────────────────────────────────  │
│                                             │
└─────────────────────────────────────────────┘
```

---

### 7. Price Override Modal

```
┌───────────────────────────────────────────┐
│  ×                                        │
│                                           │
│  Edit Price - Testosterone 10 weeks       │
│                                           │
│  Original: $420.00 (1 × $420.00)          │
│                                           │
│  ─────────────────────────────────────   │
│                                           │
│  [ Grandfathered ]     [  F&F (50%)  ]   │
│   ↑ Click for 80%       ↑ Click for 50%  │
│                                           │
│  ─────────────────────────────────────   │
│                                           │
│  Or enter custom price:                   │
│  [420.00____________]                     │
│                                           │
│  [  Apply Custom Price  ]                │
│                                           │
│  [       Cancel        ]                 │
│                                           │
└───────────────────────────────────────────┘
```

---

### 8. Payment Method Selection

```
┌─────────────────────────────────────────────┐
│ PAYMENT                                     │
├─────────────────────────────────────────────┤
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ ⚫ Credit Card Only                      ││
│ └─────────────────────────────────────────┘│
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ ⚪ Cash + Card Split                     ││
│ └─────────────────────────────────────────┘│
│                                             │
│ ─────────────────────────────────────────  │
│                                             │
│ □ Email receipt to patient                 │
│                                             │
│ ─────────────────────────────────────────  │
│                                             │
│ [      PROCESS PAYMENT      ]              │
│  ↑ Large green button                      │
│                                             │
│ [       CLEAR CART        ]                │
│  ↑ Red button                              │
│                                             │
└─────────────────────────────────────────────┘
```

**When "Cash + Card Split" is selected:**

```
┌─────────────────────────────────────────────┐
│ PAYMENT                                     │
├─────────────────────────────────────────────┤
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ ⚪ Credit Card Only                      ││
│ └─────────────────────────────────────────┘│
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ ⚫ Cash + Card Split                     ││
│ └─────────────────────────────────────────┘│
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │                                         ││
│ │ Cash Amount:                            ││
│ │ [$500.00______]                         ││
│ │                                         ││
│ │ Card Amount: (auto-calculated)          ││
│ │ [$837.40______]  ← Read-only, gray bg   ││
│ │                                         ││
│ └─────────────────────────────────────────┘│
│                                             │
│ ─────────────────────────────────────────  │
│                                             │
│ □ Email receipt to patient                 │
│                                             │
│ [      PROCESS PAYMENT      ]              │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎨 Color Scheme

```
Primary Blue:    #2563eb  ■ Buttons, active states
Primary Hover:   #1d4ed8  ■ Button hover
Success Green:   #10b981  ■ Prices, success messages
Danger Red:      #ef4444  ■ Remove buttons, errors
Warning Yellow:  #fef3c7  ■ Override badges
Text Dark:       #1f2937  ■ Main text
Text Light:      #6b7280  ■ Labels, metadata
Border:          #e5e7eb  ■ Card borders
Background:      #f9fafb  ■ Page background
White:           #ffffff  ■ Card backgrounds
```

---

## 📱 Responsive Behavior

### Desktop (1400px+)
```
┌────────────────────────────────────────────────┐
│  [  Products (2/3 width)  ] [Cart (1/3)]      │
└────────────────────────────────────────────────┘
```

### Tablet (768px - 1200px)
```
┌────────────────────────────────────────────────┐
│         [    Products (full width)    ]        │
│                                                │
│         [     Cart (full width)      ]         │
└────────────────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌─────────────────┐
│   Products      │
│   (stacked)     │
│                 │
│   Cart          │
│   (below)       │
└─────────────────┘
```

---

## ✨ Interactive Elements

### Product Card Click
```
Click → Add to cart → Cart updates → Total recalculates
        ↓
    Smooth animation
```

### Price Double-Click
```
Double-click price → Modal opens → Select override → Price updates → Badge shows
```

### Promo Code Apply
```
Type code → Click Apply → Validates → Shows discount → Total updates
                            ↓
                         If invalid: Shows error message
```

### Checkout Button Click
```
Click → Validates → Generates invoice → Gets Auth.net token → Redirects
         ↓
      If errors: Shows alert with list of issues
```

---

## 🖼️ Visual Style

- **Modern & Clean**: Rounded corners (8-12px), subtle shadows
- **Professional**: Medical-grade aesthetic, not flashy
- **Readable**: Large text for prices, clear labels
- **Touch-Friendly**: Big buttons (minimum 44px height)
- **Color-Coded**: Green for money, blue for actions, red for remove
- **Feedback**: Hover effects, loading states, success messages

---

## 💡 User Experience Highlights

1. **Fast Product Selection**: Click any product card to add instantly
2. **Visual Feedback**: Hover effects, active states, loading indicators
3. **Error Prevention**: Validation before checkout, clear error messages
4. **Undo Friendly**: Easy to remove items, clear cart, cancel actions
5. **Mobile Ready**: Works on tablets for bedside checkout
6. **Professional**: Looks like enterprise software, not a DIY project

---

This UI provides a **modern, efficient checkout experience** that your receptionists will love!

Want to see it live? Follow DEPLOYMENT.md and you'll have it running in 2 hours! 🚀
