"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "./ProductForm";
import { getAllCategories } from "@/lib/category";
import { createProduct } from "@/lib/product";
import "./NewProduct.scss";

export default function NewProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message || "Lỗi khi tải danh mục");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);

      await createProduct(formData);
      router.push("/admin/products");
    } catch (err) {
      setError(err.message || "Lỗi khi tạo sản phẩm");
      setIsLoading(false);
    }
  };

  return (
    <div className="new-product">
      <div className="new-product__header">
        <h1 className="new-product__title">Thêm sản phẩm mới</h1>
      </div>

      {error && <div className="new-product__error">{error}</div>}

      <ProductForm
        categories={categories}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}