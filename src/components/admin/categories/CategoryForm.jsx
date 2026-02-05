"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LuUpload, LuX } from "react-icons/lu";
import "./CategoryForm.scss";

export default function CategoryForm({ 
  initialData = null, 
  categories = [], 
  onSubmit, 
  isLoading = false 
}) {
  const router = useRouter();
  
  // Initialize state from initialData directly
  const [formData, setFormData] = useState(() => ({
    name: initialData?.name || "",
    description: initialData?.description || "",
    slug: initialData?.slug || "",
    image: initialData?.image || "",
    parentId: initialData?.parentId || "",
    isActive: initialData?.isActive ?? true,
  }));
  
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(initialData?.image || "");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Auto-generate slug from name
    if (name === "name" && !initialData) {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, image: url }));
    setImagePreview(url);
    
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên danh mục";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Vui lòng nhập slug";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    await onSubmit(formData);
  };

  // Filter out current category from parent options (can't be its own parent)
  const parentOptions = categories.filter(cat => 
    initialData ? cat.id !== initialData.id : true
  );

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <div className="category-form__section">
        <h2 className="category-form__section-title">Thông tin cơ bản</h2>

        <div className="category-form__field">
          <label className="category-form__label">
            Tên danh mục <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`category-form__input ${errors.name ? "error" : ""}`}
            placeholder="Nhập tên danh mục"
            disabled={isLoading}
          />
          {errors.name && <span className="category-form__error">{errors.name}</span>}
        </div>

        <div className="category-form__field">
          <label className="category-form__label">
            Slug <span className="required">*</span>
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className={`category-form__input ${errors.slug ? "error" : ""}`}
            placeholder="slug-danh-muc"
            disabled={isLoading}
          />
          {errors.slug && <span className="category-form__error">{errors.slug}</span>}
        </div>

        <div className="category-form__field">
          <label className="category-form__label">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="category-form__textarea"
            placeholder="Mô tả danh mục"
            rows={4}
            disabled={isLoading}
          />
        </div>

        <div className="category-form__field">
          <label className="category-form__label">Danh mục cha</label>
          <select
            name="parentId"
            value={formData.parentId}
            onChange={handleChange}
            className="category-form__select"
            disabled={isLoading}
          >
            <option value="">-- Không có --</option>
            {parentOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="category-form__section">
        <h2 className="category-form__section-title">Hình ảnh</h2>

        <div className="category-form__field">
          <label className="category-form__label">Ảnh danh mục (URL)</label>
          
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleImageChange}
            className="category-form__input"
            placeholder="https://example.com/image.jpg"
            disabled={isLoading}
          />
          {errors.image && <span className="category-form__error">{errors.image}</span>}
          
          {imagePreview && (
            <div className="category-form__image-preview">
              <img src={imagePreview} alt="Preview" />
              <button
                type="button"
                className="category-form__remove-image"
                onClick={removeImage}
                disabled={isLoading}
              >
                <LuX size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="category-form__section">
        <h2 className="category-form__section-title">Cài đặt</h2>

        <div className="category-form__field">
          <label className="category-form__checkbox-label">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="category-form__checkbox"
              disabled={isLoading}
            />
            <span>Kích hoạt danh mục</span>
          </label>
        </div>
      </div>

      <div className="category-form__actions">
        <button
          type="button"
          className="category-form__btn-cancel"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="category-form__btn-submit"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : initialData ? "Cập nhật" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
}
