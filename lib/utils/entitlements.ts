/**
 * Plan entitlement checking utilities.
 * Phase 2 / Final Master Plan — Pricing and Entitlements.
 *
 * Enforcement: server-side (authoritative) + client-side (UX).
 * Full implementation in Phase E — this is the type foundation.
 */

export type Plan = 'free' | 'pro';

export const PLAN_LIMITS = {
  free: {
    accounts: 3,
    budgets: 5,
    goals: 2,
    workspaces: 1,
    advancedAnalytics: false,
    cashflowForecasting: false,
    csvImport: false,
    csvExportAll: false,
  },
  pro: {
    accounts: Infinity,
    budgets: Infinity,
    goals: Infinity,
    workspaces: 5,
    advancedAnalytics: true,
    cashflowForecasting: true,
    csvImport: true,
    csvExportAll: true,
  },
} as const;

/**
 * Check if a user can perform an action based on their plan.
 * Placeholder — full implementation in Phase E.
 */
export function canCreate(
  plan: Plan,
  resource: 'accounts' | 'budgets' | 'goals',
  currentCount: number,
): boolean {
  const limit = PLAN_LIMITS[plan][resource];
  return currentCount < limit;
}
