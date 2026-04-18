import AdminHeader from "@/components/shared/admin/header";

export default function AdminBlogLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Blog Management" />
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
