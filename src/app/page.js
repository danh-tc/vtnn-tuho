import HeroSlider from "@/components/home/hero-slider/HeroSlider";
import ProductCategory from "@/components/home/product-category/ProductCategory";
import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSlider />
      <ProductCategory />
      <Footer />
    </>
  );
}
