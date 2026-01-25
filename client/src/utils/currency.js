/**
 * Format price in Indian Rupees (INR)
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export const formatINR = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0.00';
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format price without currency symbol
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0.00';
  }
  
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Parse INR formatted string to number
 * @param {string} formatted - The formatted string
 * @returns {number} - Parsed number
 */
export const parseINR = (formatted) => {
  if (typeof formatted === 'number') return formatted;
  if (!formatted) return 0;
  
  // Remove currency symbol, commas, and spaces
  const cleaned = formatted.replace(/[₹,\s]/g, '');
  return parseFloat(cleaned) || 0;
};
