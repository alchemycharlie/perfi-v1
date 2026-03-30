import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminTopBar } from '@/components/admin/top-bar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full">
      <AdminSidebar />

      <div className="flex flex-1 flex-col">
        <AdminTopBar />
        <main className="flex-1 px-4 py-6 lg:px-6">{children}</main>
      </div>
    </div>
  );
}
