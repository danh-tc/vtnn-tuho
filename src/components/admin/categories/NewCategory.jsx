"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import { getAllCategories, createCategory } from "@/lib/category";
import "./NewCategory.scss";

export default function NewCategory() {
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
      console.error("Error loading categories:", err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Create category with image URL
      await createCategory({
        ...formData,
        image: formData.image || "",
      });

      router.push("/admin/categories");
    } catch (err) {
      console.error("Error creating category:", err);
      setError(err.message || "Lỗi khi tạo danh mục");
      setIsLoading(false);
    }
  };

  return (
    <div className="new-category">
      <div className="new-category__header">
        <h1 className="new-category__title">Thêm danh mục mới</h1>
      </div>

      {error && (
        <div className="new-category__error">
          {error}
        </div>
      )}

      <CategoryForm
        categories={categories}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
