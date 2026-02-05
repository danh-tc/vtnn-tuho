import StoreInitializer from "@/components/data/StoreInitializer";
import HeroSlider from "@/components/home/hero-slider/HeroSlider";
import ProductCategory from "@/components/home/product-category/ProductCategory";
import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import { getInitialData } from "@/lib/server-data";

export default async function Home() {
  const { categories, products } = await getInitialData();
  return (
    <>
      <StoreInitializer
        initialCategories={categories}
        initialProducts={products}
      />
      <Header />
      <HeroSlider />
      <ProductCategory />
      <Footer />
    </>
  );
}
