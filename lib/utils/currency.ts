/**
 * GBP currency formatting utilities.
 * Phase 4 Section 4: UK-first, GBP only.
 */

const GBP_FORMATTER = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format a number as GBP currency string.
 * Example: 1234.5 → "£1,234.50"
 */
export function formatCurrency(amount: number): string {
  return GBP_FORMATTER.format(amount);
}

/**
 * Format a number as GBP without the currency symbol.
 * Example: 1234.5 → "1,234.50"
 */
export function formatAmount(amount: number): string {
  return GBP_FORMATTER.format(amount).replace('£', '');
}
