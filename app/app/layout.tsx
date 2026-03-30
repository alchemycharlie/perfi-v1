import { AppSidebar } from '@/components/app/sidebar';
import { AppTopBar } from '@/components/app/top-bar';
import { WorkspaceProvider } from '@/lib/hooks/workspace-context';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProvider>
      <div className="flex min-h-full">
        <AppSidebar />

        <div className="flex flex-1 flex-col">
          <AppTopBar />
          <main className="flex-1 px-4 py-6 lg:px-6">{children}</main>
        </div>
      </div>
    </WorkspaceProvider>
  );
}
