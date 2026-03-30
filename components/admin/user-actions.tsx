'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdminUserActionsProps {
  userId: string;
  isDisabled: boolean;
}

export function AdminUserActions({ userId, isDisabled }: AdminUserActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);

  async function handleToggleDisabled() {
    setLoading(true);
    await fetch('/api/admin/users/toggle-disabled', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, disabled: !isDisabled }),
    });
    router.refresh();
    setLoading(false);
  }

  async function handleAddNote(formData: FormData) {
    setLoading(true);
    await fetch('/api/admin/users/add-note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, content: formData.get('content') }),
    });
    setShowNoteForm(false);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          variant={isDisabled ? 'primary' : 'danger'}
          size="sm"
          onClick={handleToggleDisabled}
          disabled={loading}
        >
          {isDisabled ? 'Enable User' : 'Disable User'}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowNoteForm(!showNoteForm)}>
          {showNoteForm ? 'Cancel' : 'Add Note'}
        </Button>
      </div>

      {showNoteForm && (
        <form action={handleAddNote} className="flex gap-2">
          <Input name="content" required placeholder="Admin note..." className="flex-1" />
          <Button type="submit" size="sm" disabled={loading}>
            Save
          </Button>
        </form>
      )}
    </div>
  );
}
