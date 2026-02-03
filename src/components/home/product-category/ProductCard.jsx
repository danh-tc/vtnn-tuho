"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const ProductImage = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`image-placeholder ${isLoaded ? "loading-finished" : ""}`}>
      <div className="rethink-hero__art-placeholder">
        <span>VTNN Tư Hồ</span>
      </div>

      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        style={{
          objectFit: "cover",
        }}
        className={`product-img ${isLoaded ? "loaded" : ""}`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

const ProductCard = ({ product }) => {
  return (
    <Link href={`/san-pham/${product.id}`} className="product-card">
      <div className="card-image-wrapper">
        <ProductImage src={product.image} alt={product.name} />
      </div>

      <div className="card-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(product.price)}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
