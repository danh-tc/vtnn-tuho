import StoreInitializer from "@/components/data/StoreInitializer";
import HeroSlider from "@/components/home/hero-slider/HeroSlider";
import ProductCategory from "@/components/home/product-category/ProductCategory";
import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import { getInitialData } from "@/lib/server-data";

// Enable static generation for GitHub Pages
export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const { categories, products } = await getInitialData();
  
  // Serialize data to plain objects for Client Components
  const serializedCategories = structuredClone(categories);
  const serializedProducts = structuredClone(products);
  
  return (
    <>
      <StoreInitializer
        initialCategories={serializedCategories}
        initialProducts={serializedProducts}
      />
      <Header />
      <HeroSlider />
      <ProductCategory />
      <Footer />
    </>
  );
}
