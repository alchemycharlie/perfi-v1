'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteAccount } from '@/lib/actions/accounts';
import { Button } from '@/components/ui/button';

export function DeleteAccountButton({
  accountId,
  accountName,
}: {
  accountId: string;
  accountName: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const result = await deleteAccount(accountId);
    if (result.success) {
      router.push('/app/accounts');
    }
    setLoading(false);
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
      <span className="text-sm text-text-secondary">Delete {accountName}?</span>
      <Button variant="danger" size="sm" onClick={handleDelete} disabled={loading}>
        {loading ? 'Deleting...' : 'Confirm'}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
        Cancel
      </Button>
    </div>
  );
}
