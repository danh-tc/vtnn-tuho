"use client";

import { useState } from "react";
import Image from "next/image";
import { LuCheck, LuX } from "react-icons/lu";
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

export default function ProductDetails({ product }) {
  const [selectedImage, setSelectedImage] = useState(product.thumbnail || product.images?.[0] || "");
  const [imageKey, setImageKey] = useState(0);

  const allImages = [
    product.thumbnail,
    ...(product.images || [])
  ].filter(Boolean);

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
                key={imageKey}
                src={selectedImage}
                alt={product.name}
              />
            </div>
          </div>

          {allImages.length > 1 && (
            <div className="gallery__thumbnails">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  className={`gallery__thumbnail ${selectedImage === img ? "active" : ""}`}
                  onClick={() => {
                    setSelectedImage(img);
                    setImageKey(prev => prev + 1);
                  }}
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
          <h1 className="info__title">{product.name}</h1>

          <div className="info__price-section">
            <div className="price__main">{formatPrice(product.price)}</div>
            <div className={`stock-badge ${product.inStock ? "in-stock" : "out-of-stock"}`}>
              {product.inStock ? (
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

          {product.shortDescription && (
            <div className="info__description">
              <p>{product.shortDescription}</p>
            </div>
          )}

          {/* Quick Info */}
          <div className="info__quick-specs">
            {product.manufacturer && (
              <div className="spec-item">
                <span className="spec-label">Nhà sản xuất:</span>
                <span className="spec-value">{product.manufacturer}</span>
              </div>
            )}
            {product.origin && (
              <div className="spec-item">
                <span className="spec-label">Xuất xứ:</span>
                <span className="spec-value">{product.origin}</span>
              </div>
            )}
            {product.packaging && (
              <div className="spec-item">
                <span className="spec-label">Quy cách:</span>
                <span className="spec-value">{product.packaging}</span>
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
          {product.activeIngredient && (
            <div className="tab-section">
              <h2 className="tab-section__title">Hoạt chất</h2>
              <div className="tab-section__content">
                <p>{product.activeIngredient}</p>
              </div>
            </div>
          )}

          {product.uses && (
            <div className="tab-section">
              <h2 className="tab-section__title">Công dụng</h2>
              <div className="tab-section__content">
                <p>{product.uses}</p>
              </div>
            </div>
          )}

          {product.dosage && (
            <div className="tab-section">
              <h2 className="tab-section__title">Liều lượng & Cách dùng</h2>
              <div className="tab-section__content">
                <p>{product.dosage}</p>
              </div>
            </div>
          )}

          {product.target && (
            <div className="tab-section">
              <h2 className="tab-section__title">Đối tượng sử dụng</h2>
              <div className="tab-section__content">
                <p>{product.target}</p>
              </div>
            </div>
          )}

          {product.content && (
            <div className="tab-section">
              <h2 className="tab-section__title">Thông tin chi tiết</h2>
              <div 
                className="tab-section__content rich-text"
                dangerouslySetInnerHTML={{ __html: product.content }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
