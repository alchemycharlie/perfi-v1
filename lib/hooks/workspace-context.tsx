'use client';

import { createContext, useCallback, useContext, useState } from 'react';

/**
 * Workspace context provider.
 *
 * Phase 3 Section 9 / Phase 4 Section 6:
 * - Active workspace ID stored client-side (React context + localStorage)
 * - Sent with every Server Action as workspace_id
 * - Workspace switcher in top bar sets the active workspace
 *
 * In v1, most users have exactly 1 workspace. Pro users can have up to 5.
 * The context defaults to the first workspace returned by the server.
 */

interface WorkspaceContextValue {
  activeWorkspaceId: string | null;
  setActiveWorkspaceId: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue>({
  activeWorkspaceId: null,
  setActiveWorkspaceId: () => {},
});

const STORAGE_KEY = 'perfi_active_workspace';

function getStoredWorkspaceId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [activeWorkspaceId, setActiveWorkspaceIdState] = useState<string | null>(
    getStoredWorkspaceId,
  );

  const setActiveWorkspaceId = useCallback((id: string) => {
    setActiveWorkspaceIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  }, []);

  return (
    <WorkspaceContext.Provider value={{ activeWorkspaceId, setActiveWorkspaceId }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
