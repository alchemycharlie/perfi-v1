/**
 * Plan entitlement checking utilities.
 * Phase 2 / Final Master Plan — Pricing and Entitlements.
 *
 * Enforcement: server-side (authoritative) + client-side (UX).
 * Server-side checks are in Server Actions. Client-side uses UpgradeBanner.
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
 * Upgrade trigger messages per Phase 2.
 */
export const UPGRADE_MESSAGES: Record<string, string> = {
  accounts: 'Free plans support up to 3 accounts. Upgrade to Pro for unlimited.',
  budgets: 'Free plans support up to 5 budget categories. Upgrade to Pro for unlimited.',
  goals: 'Free plans support up to 2 goals. Upgrade to Pro for unlimited.',
  workspaces: 'Multiple workspaces are a Pro feature.',
  advancedAnalytics: 'Advanced analytics, trends, and net worth tracking are Pro features.',
  cashflowForecasting: 'Cashflow forecasting is a Pro feature.',
  csvImport: 'CSV import is a Pro feature.',
};

/**
 * Check if a user can create a new resource.
 * Used in Server Actions for authoritative enforcement.
 */
export function canCreate(
  plan: Plan,
  resource: 'accounts' | 'budgets' | 'goals' | 'workspaces',
  currentCount: number,
): boolean {
  const limit = PLAN_LIMITS[plan][resource];
  return currentCount < limit;
}

/**
 * Check if a user can access a Pro-only feature.
 */
export function canAccessFeature(
  plan: Plan,
  feature: 'advancedAnalytics' | 'cashflowForecasting' | 'csvImport' | 'csvExportAll',
): boolean {
  return PLAN_LIMITS[plan][feature];
}

/**
 * Get the user's plan from their subscription.
 * Returns 'free' if no subscription found.
 */
export async function getUserPlan(
  supabase: {
    from: (table: string) => {
      select: (columns: string) => {
        eq: (
          col: string,
          val: string,
        ) => { single: () => Promise<{ data: { plan: string } | null }> };
      };
    };
  },
  userId: string,
): Promise<Plan> {
  const { data } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .single();

  return (data?.plan as Plan) || 'free';
}
