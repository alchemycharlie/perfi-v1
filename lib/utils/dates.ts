/**
 * Recurring date calculation utilities.
 * Phase 5 Section 3: getNextOccurrences(anchorDate, frequency, count)
 *
 * Used by the cashflow calendar to project income and bill events.
 */

export type Frequency = 'weekly' | 'fortnightly' | 'four_weekly' | 'monthly' | 'annually';

/**
 * Calculate the next N occurrences of a recurring date from an anchor.
 * Returns dates in chronological order starting from or after `fromDate`.
 */
export function getNextOccurrences(
  anchorDate: Date,
  frequency: Frequency,
  count: number,
  fromDate: Date = new Date(),
): Date[] {
  const results: Date[] = [];
  let current = new Date(anchorDate);

  // Walk forward from anchor until we're at or past fromDate
  while (current < fromDate && results.length === 0) {
    current = advanceDate(current, frequency);
  }

  // If anchor is in the future, start from there
  if (anchorDate >= fromDate) {
    current = new Date(anchorDate);
  }

  // Collect N occurrences
  for (let i = 0; i < count; i++) {
    results.push(new Date(current));
    current = advanceDate(current, frequency);
  }

  return results;
}

/**
 * Get all occurrences of a recurring event within a date range.
 * Used to populate the cashflow calendar for a given month.
 */
export function getOccurrencesInRange(
  anchorDate: Date,
  frequency: Frequency,
  rangeStart: Date,
  rangeEnd: Date,
): Date[] {
  const results: Date[] = [];
  let current = new Date(anchorDate);

  // Walk forward to rangeStart
  while (current < rangeStart) {
    current = advanceDate(current, frequency);
  }

  // Collect all within range
  while (current <= rangeEnd) {
    results.push(new Date(current));
    current = advanceDate(current, frequency);
  }

  return results;
}

function advanceDate(date: Date, frequency: Frequency): Date {
  const next = new Date(date);
  switch (frequency) {
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'fortnightly':
      next.setDate(next.getDate() + 14);
      break;
    case 'four_weekly':
      next.setDate(next.getDate() + 28);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'annually':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}

/**
 * Get the first and last day of a month.
 */
export function getMonthRange(year: number, month: number): { start: Date; end: Date } {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0); // Last day of month
  return { start, end };
}

/**
 * Format a date as YYYY-MM-DD (ISO date string).
 */
export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}
