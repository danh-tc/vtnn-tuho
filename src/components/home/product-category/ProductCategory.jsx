"use client";

import React, { useState } from "react";
import CategoryTabs from "./CategoryTabs";
import ProductCard from "./ProductCard";
import { CATEGORIES, PRODUCTS } from "./mockData";
import "./ProductCategory.scss";

const ProductCategory = () => {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].id);

  const filteredProducts = PRODUCTS.filter(
    (product) => product.categoryId === activeTab,
  );

  return (
    <section className="product-category-section">
      <div className="container">
        <div className="section-header">
          <h2 className="title">DANH MỤC SẢN PHẨM</h2>
        </div>

        <CategoryTabs
          categories={CATEGORIES}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="empty-msg">Đang cập nhật sản phẩm...</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductCategory;
