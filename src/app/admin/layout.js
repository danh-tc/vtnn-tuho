import ProtectedAdminPage from "@/components/admin/ProtectedAdminPage";
import AdminLayout from "@/components/admin/layout/AdminLayout";

export const metadata = {
  title: "Admin Panel | VTNN TƯ HỒ",
  description: "Quản lý website VTNN TƯ HỒ",
};

export default function AdminRootLayout({ children }) {
  return (
    <ProtectedAdminPage>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedAdminPage>
  );
}
