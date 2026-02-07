import StoreInitializer from "@/components/data/StoreInitializer";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import ProductDetails from "@/components/product/ProductDetails";
import { getProductById, getAllProducts } from "@/lib/product";
import { getAllCategories } from "@/lib/category";
import { notFound } from "next/navigation";

// Helper function to strip HTML tags for plain text
const stripHtml = (html) => {
  if (!html) return '';
  return html.replaceAll(/<[^>]*>/g, '').trim();
};

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  try {
    const product = await getProductById(id);
    return {
      title: `${product.name} | VTNN Tư Hồ`,
      description: stripHtml(product.shortDescription) || product.name,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
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
  let products = [];
  let categories = [];
  
  try {
    // Fetch all data in parallel for build time
    [product, products, categories] = await Promise.all([
      getProductById(id),
      getAllProducts(),
      getAllCategories(),
    ]);
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  // Serialize data to plain objects for Client Components
  const serializedProduct = structuredClone(product);
  const serializedProducts = structuredClone(products);
  const serializedCategories = structuredClone(categories);

  return (
    <>
      <StoreInitializer
        initialCategories={serializedCategories}
        initialProducts={serializedProducts}
      />
      <Header />
      <ProductDetails product={serializedProduct} productId={id} />
      <Footer />
    </>
  );
}
