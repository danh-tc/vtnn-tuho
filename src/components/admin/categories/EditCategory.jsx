"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import { getAllCategories, getCategoryById, updateCategory } from "@/lib/category";
import "./EditCategory.scss";

export default function EditCategory() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id;

  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [categoryId]);

  const loadData = async () => {
    try {
      setIsFetching(true);
      const [categoryData, allCategories] = await Promise.all([
        getCategoryById(categoryId),
        getAllCategories(),
      ]);

      if (!categoryData) {
        router.push("/admin/categories");
        return;
      }

      setCategory(categoryData);
      setCategories(allCategories);
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

      // Update category with image URL
      await updateCategory(categoryId, {
        ...formData,
        image: formData.image || "",
      });

      router.push("/admin/categories");
    } catch (err) {
      console.error("Error updating category:", err);
      setError(err.message || "Lỗi khi cập nhật danh mục");
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="edit-category">
        <div className="edit-category__loading">Đang tải...</div>
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <div className="edit-category">
      <div className="edit-category__header">
        <h1 className="edit-category__title">Chỉnh sửa danh mục</h1>
      </div>

      {error && (
        <div className="edit-category__error">
          {error}
        </div>
      )}

      <CategoryForm
        initialData={category}
        categories={categories}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
