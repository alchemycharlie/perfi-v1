'use client';

import { useState } from 'react';
import { clearDemoData } from '@/lib/actions/onboarding';
import { useWorkspace } from '@/lib/hooks/workspace-context';

/**
 * Persistent demo data banner.
 * Phase 2 Section 9: "Demo data is clearly labelled: persistent banner
 * 'Exploring demo data' with a 'Clear demo data' action."
 */
export function DemoBanner() {
  const { activeWorkspaceId } = useWorkspace();
  const [clearing, setClearing] = useState(false);

  async function handleClear() {
    if (!activeWorkspaceId) return;
    setClearing(true);
    await clearDemoData(activeWorkspaceId);
    setClearing(false);
  }

  return (
    <div className="border-b border-accent/20 bg-accent/5 px-4 py-2 lg:px-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-accent">
          You&apos;re exploring demo data. You can clear it anytime from here or Settings.
        </p>
        <button
          onClick={handleClear}
          disabled={clearing}
          className="shrink-0 text-sm font-medium text-accent hover:text-accent-hover transition-colors disabled:opacity-50"
        >
          {clearing ? 'Clearing...' : 'Clear demo data'}
        </button>
      </div>
    </div>
  );
}
