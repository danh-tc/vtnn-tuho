"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { LuCheck, LuX } from "react-icons/lu";
import { useStore } from "@/lib/store";
import { getProductById } from "@/lib/product";
import "./ProductDetails.scss";

const ProductImage = ({ src, alt, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <div className={`image-placeholder ${isLoaded ? "loading-finished" : ""}`}>
      <div className="rethink-hero__art-placeholder">
        <span>VTNN Tư Hồ</span>
      </div>
      <Image
        src={src || "https://via.placeholder.com/600"}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: "cover" }}
        className={`product-img ${isLoaded ? "loaded" : ""}`}
        priority
        onLoad={handleLoad}
      />
    </div>
  );
};

export default function ProductDetails({ product, productId }) {
  const [productData, setProductData] = useState(product);
  const [userSelectedImage, setUserSelectedImage] = useState(null);
  
  // Get products from Zustand store
  const storeProducts = useStore((state) => state.products);

  useEffect(() => {
    let isMounted = true;

    // First, try to get product from store (already fetched by StoreInitializer)
    const productFromStore = storeProducts.find(p => p.id === productId);
    
    if (productFromStore) {
      // Product found in store - use it, no Firebase call needed!
      if (isMounted) {
        setProductData(productFromStore);
      }
      return;
    }

    // Product not in store yet - fetch individually (fallback for direct URL access)
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        const freshProduct = await getProductById(productId);
        if (isMounted && freshProduct) {
          setProductData(freshProduct);
        }
      } catch (error) {
        console.warn("Không thể tải dữ liệu sản phẩm mới:", error?.message);
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [productId, storeProducts]);

  if (!productData) {
    return null;
  }

  const allImages = [productData.thumbnail, ...(productData.images || [])].filter(Boolean);

  const selectedImage = useMemo(() => {
    if (!allImages.length) return "";
    if (userSelectedImage && allImages.includes(userSelectedImage)) {
      return userSelectedImage;
    }
    return allImages[0];
  }, [allImages, userSelectedImage]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="product-details">
      <div className="product-details__container">
        {/* Image Gallery */}
        <div className="product-details__gallery">
          <div className="gallery__main">
            <div className="gallery__main-image">
              <ProductImage
                key={`${productData.id}-${selectedImage}`}
                src={selectedImage}
                alt={productData.name}
              />
            </div>
          </div>

          {allImages.length > 1 && (
            <div className="gallery__thumbnails">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  className={`gallery__thumbnail ${selectedImage === img ? "active" : ""}`}
                  onClick={() => setUserSelectedImage(img)}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    sizes="100px"
                    style={{ objectFit: "cover" }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-details__info">
          <h1 className="info__title">{productData.name}</h1>

          <div className="info__price-section">
            <div className="price__main">{formatPrice(productData.price)}</div>
            <div
              className={`stock-badge ${productData.inStock ? "in-stock" : "out-of-stock"}`}
            >
              {productData.inStock ? (
                <>
                  <LuCheck size={18} />
                  <span>Còn hàng</span>
                </>
              ) : (
                <>
                  <LuX size={18} />
                  <span>Hết hàng</span>
                </>
              )}
            </div>
          </div>

          {productData.shortDescription && (
            <div 
              className="info__description"
              dangerouslySetInnerHTML={{ __html: productData.shortDescription }}
            />
          )}

          {/* Quick Info */}
          <div className="info__quick-specs">
            {productData.manufacturer && (
              <div className="spec-item">
                <span className="spec-label">Nhà sản xuất:</span>
                <span className="spec-value">{productData.manufacturer}</span>
              </div>
            )}
            {productData.origin && (
              <div className="spec-item">
                <span className="spec-label">Xuất xứ:</span>
                <span className="spec-value">{productData.origin}</span>
              </div>
            )}
            {productData.packaging && (
              <div className="spec-item">
                <span className="spec-label">Quy cách:</span>
                <span 
                  className="spec-value"
                  dangerouslySetInnerHTML={{ __html: productData.packaging }}
                />
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <div className="info__actions">
            <a href="tel:0989977884" className="btn-contact btn-contact--primary">
              Gọi ngay: 0989 977 884
            </a>
            <a href="https://zalo.me/0989977884" target="_blank" rel="noopener noreferrer" className="btn-contact btn-contact--zalo">
              Liên hệ Zalo
            </a>
          </div>
        </div>
      </div>

      {/* Detailed Information Tabs */}
      <div className="product-details__tabs">
        <div className="tabs__container">
          {productData.activeIngredient && (
            <div className="tab-section">
              <h2 className="tab-section__title">Hoạt chất</h2>
              <div 
                className="tab-section__content rich-text"
                dangerouslySetInnerHTML={{ __html: productData.activeIngredient }}
              />
            </div>
          )}

          {productData.uses && (
            <div className="tab-section">
              <h2 className="tab-section__title">Công dụng</h2>
              <div 
                className="tab-section__content rich-text"
                dangerouslySetInnerHTML={{ __html: productData.uses }}
              />
            </div>
          )}

          {productData.dosage && (
            <div className="tab-section">
              <h2 className="tab-section__title">Liều lượng & Cách dùng</h2>
              <div 
                className="tab-section__content rich-text"
                dangerouslySetInnerHTML={{ __html: productData.dosage }}
              />
            </div>
          )}

          {productData.target && (
            <div className="tab-section">
              <h2 className="tab-section__title">Đối tượng sử dụng</h2>
              <div 
                className="tab-section__content rich-text"
                dangerouslySetInnerHTML={{ __html: productData.target }}
              />
            </div>
          )}

          {productData.content && (
            <div className="tab-section">
              <h2 className="tab-section__title">Thông tin chi tiết</h2>
              <div 
                className="tab-section__content rich-text"
                dangerouslySetInnerHTML={{ __html: productData.content }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
