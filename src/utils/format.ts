/**
 * Formats a numerical value into Bangladeshi Taka (৳) with proper locale comma separators.
 */
export function formatTaka(amount: number | string, includeDecimals: boolean = false): string {
  const num = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
  
  if (includeDecimals) {
    return `৳${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  
  return `৳${Math.round(num).toLocaleString('en-IN')}`;
}

export const CURRENCY_SYMBOL = '৳';
export const CURRENCY_CODE = 'BDT';
