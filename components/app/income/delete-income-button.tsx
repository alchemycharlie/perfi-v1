'use client';

import { useState } from 'react';
import { deleteIncomeSource } from '@/lib/actions/income';
import { Button } from '@/components/ui/button';

export function DeleteIncomeButton({
  sourceId,
  sourceName,
}: {
  sourceId: string;
  sourceName: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await deleteIncomeSource(sourceId);
  }

  if (!confirming) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setConfirming(true)}>
        Delete
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-text-muted">Delete {sourceName}?</span>
      <Button variant="danger" size="sm" onClick={handleDelete} disabled={loading}>
        {loading ? '...' : 'Yes'}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
        No
      </Button>
    </div>
  );
}
