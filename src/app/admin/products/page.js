import { ProductsList } from "@/components/admin/products";

export const metadata = {
  title: "Quản lý sản phẩm | Admin",
  description: "Quản lý sản phẩm",
};

export default function AdminProductsPage() {
  return <ProductsList />;
}
