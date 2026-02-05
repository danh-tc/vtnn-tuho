"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LuPlus, LuPencil, LuTrash2 } from "react-icons/lu";
import { getAllCategories, deleteCategory } from "@/lib/category";
import "./CategoriesList.scss";

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message || "Lỗi khi tải danh mục");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter((cat) => cat.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message || "Lỗi khi xóa danh mục");
    }
  };

  if (isLoading) {
    return (
      <div className="categories-list">
        <div className="categories-list__loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="categories-list">
      <div className="categories-list__header">
        <h1 className="categories-list__title">Quản lý danh mục</h1>
        <Link href="/admin/categories/new" className="categories-list__btn-add">
          <LuPlus size={20} />
          <span>Thêm danh mục</span>
        </Link>
      </div>

      {error && <div className="categories-list__error">{error}</div>}

      {categories.length === 0 ? (
        <div className="categories-list__empty">
          Chưa có danh mục nào. <Link href="/admin/categories/new">Tạo danh mục mới</Link>
        </div>
      ) : (
        <div className="categories-list__table-wrapper">
          <table className="categories-list__table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Slug</th>
                <th>Danh mục cha</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="categories-list__row">
                  <td>
                    <div className="categories-list__name">
                      {category.image && (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="categories-list__image"
                        />
                      )}
                      <span>{category.name}</span>
                    </div>
                  </td>
                  <td className="categories-list__slug">{category.slug}</td>
                  <td>
                    {category.parentId
                      ? categories.find((c) => c.id === category.parentId)?.name || "N/A"
                      : "-"}
                  </td>
                  <td>
                    <span
                      className={`categories-list__badge ${
                        category.isActive ? "active" : "inactive"
                      }`}
                    >
                      {category.isActive ? "Hoạt động" : "Tắt"}
                    </span>
                  </td>
                  <td className="categories-list__actions">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="categories-list__btn-action edit"
                      title="Chỉnh sửa"
                    >
                      <LuPencil size={18} />
                    </Link>
                    <button
                      className="categories-list__btn-action delete"
                      onClick={() => setDeleteConfirm(category.id)}
                      title="Xóa"
                    >
                      <LuTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteConfirm && (
        <div className="categories-list__modal">
          <div className="categories-list__modal-content">
            <h3>Xác nhận xóa</h3>
            <p>Bạn chắc chắn muốn xóa danh mục này?</p>
            <div className="categories-list__modal-actions">
              <button
                className="categories-list__btn-cancel"
                onClick={() => setDeleteConfirm(null)}
              >
                Hủy
              </button>
              <button
                className="categories-list__btn-confirm"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
