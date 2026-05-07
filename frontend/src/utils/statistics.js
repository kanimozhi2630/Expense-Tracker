/**
 * Data Science Utility for Expense Tracker
 * Implements statistical models for forecasting and anomaly detection.
 */

/**
 * Calculates Simple Linear Regression (y = mx + b)
 * Used for forecasting future spending based on time.
 * @param {Array} data - Array of objects { x: timestamp/index, y: amount }
 * @returns {Object} { slope, intercept, predict(x) }
 */
export const calculateLinearRegression = (data) => {
  const n = data.length;
  if (n < 2) return null;

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (const point of data) {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumXX += point.x * point.x;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return {
    slope,
    intercept,
    predict: (x) => slope * x + intercept
  };
};

/**
 * Detects anomalies in expenses using the Z-Score method.
 * Flags expenses that are > 2 standard deviations from the mean in their category.
 * @param {Array} expenses - All expenses
 * @returns {Array} List of anomalous expenses
 */
export const findAnomalies = (expenses) => {
  if (expenses.length < 5) return []; // Need enough data points

  const categories = [...new Set(expenses.map(e => e.category))];
  const anomalies = [];

  categories.forEach(cat => {
    const catExpenses = expenses.filter(e => e.category === cat);
    if (catExpenses.length < 3) return;

    const amounts = catExpenses.map(e => e.amount);
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const stdDev = Math.sqrt(amounts.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / amounts.length);

    catExpenses.forEach(exp => {
      const zScore = stdDev === 0 ? 0 : (exp.amount - mean) / stdDev;
      if (zScore > 2) {
        anomalies.push({ ...exp, zScore, severity: 'High' });
      } else if (zScore > 1.5) {
        anomalies.push({ ...exp, zScore, severity: 'Medium' });
      }
    });
  });

  return anomalies;
};

/**
 * Provides prescriptive budget recommendations based on historical spending distribution.
 * @param {Array} expenses 
 * @returns {Array} Tips
 */
export const getBudgetRecommendations = (expenses) => {
  if (expenses.length === 0) return [];
  
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const tips = [];
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  if (sortedCategories.length > 0) {
    const [topCat, topAmount] = sortedCategories[0];
    const percentage = (topAmount / total) * 100;
    
    if (percentage > 50) {
      tips.push(`Your spending is heavily skewed towards "${topCat}" (${percentage.toFixed(1)}%). Consider setting a strict budget here.`);
    }
  }

  // Suggest a 50/30/20 rule application if data allows (simplified)
  tips.push("Recommendation: Aim for the 50/30/20 rule (50% Needs, 30% Wants, 20% Savings).");

  return tips;
};

/**
 * Simple Natural Language Query Engine
 * Parses user questions and returns answers based on expense data.
 * @param {string} query - User question
 * @param {Array} expenses - List of expenses
 * @param {Object} stats - Pre-calculated statistics (forecast, anomalies, etc.)
 */
export const askAI = (query, expenses, stats) => {
  const q = query.toLowerCase();
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (q.includes('predict') || q.includes('forecast') || q.includes('future')) {
    if (stats.regression && stats.timeSeriesData.length > 0) {
      const lastDay = stats.timeSeriesData[stats.timeSeriesData.length - 1].day;
      const nextDayPred = stats.regression.predict(lastDay + 1);
      return `Based on your recent trends, I predict you will spend approximately ₹${nextDayPred.toFixed(2)} tomorrow. By the end of the week, your total spending might increase by ₹${(nextDayPred * 7).toFixed(2)}.`;
    }
    return "I don't have enough data yet to make an accurate prediction. Add more expenses!";
  }

  if (q.includes('anomaly') || q.includes('unusual') || q.includes('strange')) {
    const anomalies = findAnomalies(expenses);
    if (anomalies.length > 0) {
      return `I found ${anomalies.length} unusual transactions. The most significant one is "${anomalies[0].description}" for ₹${anomalies[0].amount} in the ${anomalies[0].category} category.`;
    }
    return "Everything looks normal! I haven't detected any unusual spending patterns.";
  }

  if (q.includes('total') || q.includes('spent') || q.includes('how much')) {
    // Check for categories
    const categories = [...new Set(expenses.map(e => e.category.toLowerCase()))];
    const mentionedCategory = categories.find(cat => q.includes(cat));

    if (mentionedCategory) {
      const catTotal = expenses
        .filter(e => e.category.toLowerCase() === mentionedCategory)
        .reduce((sum, e) => sum + e.amount, 0);
      return `You have spent a total of ₹${catTotal.toFixed(2)} on ${mentionedCategory}.`;
    }

    return `Your total spending across all categories is ₹${total.toFixed(2)}.`;
  }

  if (q.includes('save') || q.includes('budget') || q.includes('tip')) {
    const recommendations = getBudgetRecommendations(expenses);
    return recommendations[0] || "Try to keep your daily spending consistent to build a predictable budget.";
  }

  return "I'm not sure I understand that. Try asking about 'predictions', 'unusual spending', or 'how much I spent on [category]'.";
};
