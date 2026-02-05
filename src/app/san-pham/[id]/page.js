import StoreInitializer from "@/components/data/StoreInitializer";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import ProductDetails from "@/components/product/ProductDetails";
import { getProductById } from "@/lib/product";
import { getAllProducts } from "@/lib/product";
import { getAllCategories } from "@/lib/category";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  try {
    const product = await getProductById(id);
    return {
      title: `${product.name} | VTNN Tư Hồ`,
      description: product.shortDescription || product.name,
    };
  } catch (error) {
    return {
      title: "Sản phẩm không tồn tại | VTNN Tư Hồ",
    };
  }
}

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

export default async function ProductPage({ params }) {
  const { id } = await params;

  let product;
  try {
    product = await getProductById(id);
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  // Load categories for store initializer
  const categories = await getAllCategories();

  // Serialize data to plain objects for Client Components
  const serializedProduct = structuredClone(product);
  const serializedCategories = structuredClone(categories);

  return (
    <>
      <StoreInitializer
        initialCategories={serializedCategories}
        initialProducts={[]}
      />
      <Header />
      <ProductDetails product={serializedProduct} />
      <Footer />
    </>
  );
}
