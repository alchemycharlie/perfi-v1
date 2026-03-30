/**
 * Recurring date calculation utilities.
 * Phase 5 Section 3: getNextOccurrences(anchorDate, frequency, count)
 *
 * Used by cashflow calendar to project income and bill events.
 * Full implementation in Phase D — this is the type foundation.
 */

export type Frequency = 'weekly' | 'fortnightly' | 'four_weekly' | 'monthly' | 'annually';

/**
 * Calculate the next N occurrences of a recurring date.
 * Placeholder — full implementation in Phase D.
 */
export function getNextOccurrences(
  _anchorDate: Date,
  _frequency: Frequency,
  _count: number,
): Date[] {
  // Implementation coming in Phase D (cashflow calendar)
  return [];
}
