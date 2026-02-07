"use client";

import React, { useState } from "react";
import CategoryTabs from "./CategoryTabs";
import ProductCard from "./ProductCard";
import LoadingText from "@/components/ui/LoadingText/LoadingText";
import { useStore } from "@/lib/store";
import "./ProductCategory.scss";

const ProductCategory = () => {
  const { categories, products, isLoading } = useStore();

  const [selectedTab, setSelectedTab] = useState(null);

  // Filter to show only parent categories
  const parentCategories = categories.filter((cat) => !cat.parentId);

  const activeTab =
    selectedTab || (parentCategories.length > 0 ? parentCategories[0].id : null);

  const filteredProducts = products.filter((product) => {
    if (!activeTab) return false;

    if (product.categoryIds && Array.isArray(product.categoryIds)) {
      return product.categoryIds.includes(activeTab);
    }
    
    return product.categoryId === activeTab;
  });

  if (isLoading) {
    return (
      <div className="container">
        <LoadingText />
      </div>
    );
  }

  if (parentCategories.length === 0) {
    return null;
  }

  return (
    <section className="product-category-section">
      <div className="container">
        <div className="section-header">
          <h2 className="title">DANH MỤC SẢN PHẨM</h2>
        </div>

        <CategoryTabs
          categories={parentCategories}
          activeTab={activeTab}
          onTabChange={setSelectedTab}
        />

        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="empty-msg">Chưa có sản phẩm trong danh mục này.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductCategory;
