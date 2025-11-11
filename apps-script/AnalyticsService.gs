/**
 * Analytics and Reporting Service
 *
 * Generates all business intelligence reports
 */

/**
 * Get daily sales summary
 */
function getDailySalesSummary(date) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const transactionSheet = ss.getSheetByName('Transactions');
  const data = transactionSheet.getDataRange().getValues();

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const nextDate = new Date(targetDate);
  nextDate.setDate(nextDate.getDate() + 1);

  let totalRevenue = 0;
  let totalTransactions = 0;
  let cashTotal = 0;
  let cardTotal = 0;
  const transactionsByProvider = {};
  const transactionsByCollector = {};

  for (let i = 1; i < data.length; i++) {
    const txnDate = new Date(data[i][1]);

    if (txnDate >= targetDate && txnDate < nextDate) {
      totalTransactions++;
      totalRevenue += parseFloat(data[i][14]); // Total
      cashTotal += parseFloat(data[i][12]); // CashAmount
      cardTotal += parseFloat(data[i][13]); // CardAmount

      const provider = data[i][5];
      const collector = data[i][6];

      if (!transactionsByProvider[provider]) transactionsByProvider[provider] = 0;
      transactionsByProvider[provider]++;

      if (!transactionsByCollector[collector]) transactionsByCollector[collector] = 0;
      transactionsByCollector[collector]++;
    }
  }

  return {
    date: targetDate,
    totalRevenue: totalRevenue,
    totalTransactions: totalTransactions,
    averageTransaction: totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
    cashTotal: cashTotal,
    cardTotal: cardTotal,
    byProvider: transactionsByProvider,
    byCollector: transactionsByCollector
  };
}

/**
 * Get product performance report
 */
function getProductPerformance(startDate, endDate) {
  const transactions = getTransactionsByDateRange(startDate, endDate);
  const productStats = {};

  transactions.forEach(txn => {
    txn.items.forEach(item => {
      if (!productStats[item.sku]) {
        productStats[item.sku] = {
          sku: item.sku,
          itemName: item.itemName || item.sku,
          category: item.category,
          unitsSold: 0,
          revenue: 0,
          averagePrice: 0
        };
      }

      productStats[item.sku].unitsSold += item.quantity;
      productStats[item.sku].revenue += item.currentPrice * item.quantity;
    });
  });

  // Calculate average price
  Object.keys(productStats).forEach(sku => {
    const stats = productStats[sku];
    stats.averagePrice = stats.revenue / stats.unitsSold;
  });

  // Convert to array and sort by revenue
  const productArray = Object.values(productStats);
  productArray.sort((a, b) => b.revenue - a.revenue);

  return productArray;
}

/**
 * Get category performance report
 */
function getCategoryPerformance(startDate, endDate) {
  const transactions = getTransactionsByDateRange(startDate, endDate);
  const categoryStats = {};

  transactions.forEach(txn => {
    txn.items.forEach(item => {
      const category = item.category;

      if (!categoryStats[category]) {
        categoryStats[category] = {
          category: category,
          unitsSold: 0,
          revenue: 0,
          transactionCount: 0
        };
      }

      categoryStats[category].unitsSold += item.quantity;
      categoryStats[category].revenue += item.currentPrice * item.quantity;
    });

    // Count unique transactions per category
    const categoriesInTxn = [...new Set(txn.items.map(item => item.category))];
    categoriesInTxn.forEach(cat => {
      if (categoryStats[cat]) {
        categoryStats[cat].transactionCount++;
      }
    });
  });

  // Convert to array and sort by revenue
  const categoryArray = Object.values(categoryStats);
  categoryArray.sort((a, b) => b.revenue - a.revenue);

  // Calculate percentages
  const totalRevenue = categoryArray.reduce((sum, cat) => sum + cat.revenue, 0);
  categoryArray.forEach(cat => {
    cat.percentage = totalRevenue > 0 ? (cat.revenue / totalRevenue) * 100 : 0;
  });

  return categoryArray;
}

/**
 * Get receptionist performance report
 */
function getReceptionistPerformance(startDate, endDate) {
  const transactions = getTransactionsByDateRange(startDate, endDate);
  const collectorStats = {};

  transactions.forEach(txn => {
    const collector = txn.collectorName;

    if (!collectorStats[collector]) {
      collectorStats[collector] = {
        collector: collector,
        transactionCount: 0,
        totalRevenue: 0,
        averageTransaction: 0
      };
    }

    collectorStats[collector].transactionCount++;
    collectorStats[collector].totalRevenue += txn.total;
  });

  // Calculate averages
  Object.keys(collectorStats).forEach(collector => {
    const stats = collectorStats[collector];
    stats.averageTransaction = stats.totalRevenue / stats.transactionCount;
  });

  // Convert to array and sort by transaction count
  const collectorArray = Object.values(collectorStats);
  collectorArray.sort((a, b) => b.transactionCount - a.transactionCount);

  return collectorArray;
}

/**
 * Get promo code usage report
 */
function getPromoCodeUsage(startDate, endDate) {
  const transactions = getTransactionsByDateRange(startDate, endDate);
  const promoStats = {};

  transactions.forEach(txn => {
    if (txn.promoCode) {
      if (!promoStats[txn.promoCode]) {
        promoStats[txn.promoCode] = {
          promoCode: txn.promoCode,
          usageCount: 0,
          totalDiscount: 0,
          totalRevenue: 0
        };
      }

      promoStats[txn.promoCode].usageCount++;
      promoStats[txn.promoCode].totalDiscount += txn.discount;
      promoStats[txn.promoCode].totalRevenue += txn.total;
    }
  });

  // Convert to array and sort by usage count
  const promoArray = Object.values(promoStats);
  promoArray.sort((a, b) => b.usageCount - a.usageCount);

  return promoArray;
}

/**
 * Get price override frequency report
 */
function getPriceOverrideReport(startDate, endDate) {
  const transactions = getTransactionsByDateRange(startDate, endDate);
  let totalTransactions = transactions.length;
  let transactionsWithOverrides = 0;
  const reasonCounts = {};

  transactions.forEach(txn => {
    if (txn.priceOverrides && txn.priceOverrides.length > 0) {
      transactionsWithOverrides++;

      txn.priceOverrides.forEach(override => {
        const reason = override.reason || 'Custom';
        if (!reasonCounts[reason]) reasonCounts[reason] = 0;
        reasonCounts[reason]++;
      });
    }
  });

  return {
    totalTransactions: totalTransactions,
    transactionsWithOverrides: transactionsWithOverrides,
    overridePercentage: totalTransactions > 0 ? (transactionsWithOverrides / totalTransactions) * 100 : 0,
    reasonBreakdown: reasonCounts
  };
}

/**
 * Get payment method breakdown
 */
function getPaymentMethodBreakdown(startDate, endDate) {
  const transactions = getTransactionsByDateRange(startDate, endDate);

  let cardOnly = 0;
  let splitPayment = 0;
  let totalCashCollected = 0;
  let totalCardProcessed = 0;

  transactions.forEach(txn => {
    if (txn.cashAmount > 0 && txn.cardAmount > 0) {
      splitPayment++;
      totalCashCollected += txn.cashAmount;
      totalCardProcessed += txn.cardAmount;
    } else if (txn.cardAmount > 0) {
      cardOnly++;
      totalCardProcessed += txn.cardAmount;
    }
  });

  return {
    cardOnly: cardOnly,
    splitPayment: splitPayment,
    totalCashCollected: totalCashCollected,
    totalCardProcessed: totalCardProcessed,
    total: cardOnly + splitPayment
  };
}

/**
 * Get revenue trends (weekly comparison)
 */
function getRevenueTrends(weeks = 4) {
  const trends = [];
  const today = new Date();

  for (let i = weeks - 1; i >= 0; i--) {
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() - (i * 7));

    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekEnd.getDate() - 6);

    const transactions = getTransactionsByDateRange(weekStart, weekEnd);
    const revenue = transactions.reduce((sum, txn) => sum + txn.total, 0);

    trends.push({
      weekLabel: `Week ${weeks - i}`,
      startDate: weekStart,
      endDate: weekEnd,
      revenue: revenue,
      transactionCount: transactions.length
    });
  }

  return trends;
}

/**
 * Generate comprehensive dashboard data
 */
function getDashboardData() {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  return {
    dailySummary: getDailySalesSummary(today),
    topProducts: getProductPerformance(thirtyDaysAgo, today).slice(0, 10),
    categoryBreakdown: getCategoryPerformance(thirtyDaysAgo, today),
    topCustomers: getTopCustomersByLTV(10),
    receptionistPerformance: getReceptionistPerformance(thirtyDaysAgo, today),
    promoUsage: getPromoCodeUsage(thirtyDaysAgo, today),
    paymentMethods: getPaymentMethodBreakdown(thirtyDaysAgo, today),
    revenueTrends: getRevenueTrends(4)
  };
}
