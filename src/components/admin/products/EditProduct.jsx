"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "./ProductForm";
import { getProductById, updateProduct } from "@/lib/product";
import { getAllCategories } from "@/lib/category";
import "./EditProduct.scss";

export default function EditProduct({ productId }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [productId]);

  const loadData = async () => {
    try {
      setIsFetching(true);
      const [productData, categoriesData] = await Promise.all([
        getProductById(productId),
        getAllCategories(),
      ]);

      if (!productData) {
        router.push("/admin/products");
        return;
      }

      setProduct(productData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Lỗi khi tải dữ liệu");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);

      await updateProduct(productId, formData);
      router.push("/admin/products");
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err.message || "Lỗi khi cập nhật sản phẩm");
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="edit-product">
        <div className="edit-product__loading">Đang tải...</div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="edit-product">
      <div className="edit-product__header">
        <h1 className="edit-product__title">Chỉnh sửa sản phẩm</h1>
      </div>

      {error && (
        <div className="edit-product__error">
          {error}
        </div>
      )}

      <ProductForm
        initialData={product}
        categories={categories}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
