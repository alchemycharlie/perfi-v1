'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FeatureFlagToggleProps {
  flagId: string;
  flagKey: string;
  value: boolean;
  updatedAt: string;
}

export function FeatureFlagToggle({ flagId, flagKey, value, updatedAt }: FeatureFlagToggleProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    await fetch('/api/admin/feature-flags/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flagId, value: !value }),
    });
    router.refresh();
    setLoading(false);
  }

  const isMaintenance = flagKey === 'maintenance_mode';

  return (
    <div className="flex items-center justify-between">
      <div>
        <p
          className={`text-sm font-medium ${isMaintenance && value ? 'text-danger' : 'text-text-primary'}`}
        >
          {flagKey}
        </p>
        <p className="text-xs text-text-muted">
          Last updated: {new Date(updatedAt).toLocaleDateString('en-GB')}
        </p>
      </div>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          value ? 'bg-accent' : 'bg-bg-tertiary'
        } ${loading ? 'opacity-50' : ''}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            value ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}
