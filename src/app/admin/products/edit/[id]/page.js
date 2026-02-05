import { EditProduct } from "@/components/admin/products";
import { getAllProducts } from "@/lib/product";

export const metadata = {
  title: "Sửa sản phẩm - Admin",
};

export async function generateStaticParams() {
  try {
    const products = await getAllProducts();
    return products.map((product) => ({
      id: product.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function EditProductPage({ params }) {
  const { id } = await params;
  return <EditProduct productId={id} />;
}
