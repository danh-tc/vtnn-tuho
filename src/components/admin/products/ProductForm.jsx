"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/common/RichTextEditor";
import "./ProductForm.scss";

const buildCategoryTree = (categories) => {
  const roots = categories.filter((c) => !c.parentId);
  return roots.map((parent) => {
    const children = categories.filter((c) => c.parentId === parent.id);
    return { ...parent, children };
  });
};

export default function ProductForm({ 
  categories = [], 
  onSubmit, 
  isLoading,
  initialData = null 
}) {
  const router = useRouter();
  const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);

  const [formData, setFormData] = useState(() => ({
    id: initialData?.id || "",
    name: initialData?.name || "",
    price: initialData?.price || "",
    thumbnail: initialData?.thumbnail || "",
    images: initialData?.images || [],
    shortDescription: initialData?.shortDescription || "",
    activeIngredient: initialData?.activeIngredient || "",
    uses: initialData?.uses || "",
    dosage: initialData?.dosage || "",
    target: initialData?.target || "",
    packaging: initialData?.packaging || "",
    manufacturer: initialData?.manufacturer || "",
    origin: initialData?.origin || "",
    content: initialData?.content || "",
    inStock: initialData?.inStock ?? true,
  }));

  const [parentCategoryId, setParentCategoryId] = useState(() => {
    if (initialData?.categoryIds?.length > 0) {
      const firstCat = categories.find(c => c.id === initialData.categoryIds[0]);
      if (firstCat) {
        return firstCat.parentId || firstCat.id;
      }
    }
    return "";
  });
  
  const [childCategoryId, setChildCategoryId] = useState(() => {
    if (initialData?.categoryIds?.length > 0) {
      const firstCat = categories.find(c => c.id === initialData.categoryIds[0]);
      if (firstCat?.parentId) {
        return firstCat.id;
      } else if (initialData.categoryIds.length > 1) {
        return initialData.categoryIds[1];
      }
    }
    return "";
  });
  const [errors, setErrors] = useState({});
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [imagesPreviews, setImagesPreviews] = useState(() => 
    initialData?.images ? new Array(initialData.images.length).fill(null) : []
  );

  const validateImageUrl = (url, callback) => {
    if (!url?.trim()) {
      callback(null);
      return;
    }
    
    const img = new Image();
    img.onload = () => callback(url);
    img.onerror = () => callback(null);
    img.src = url;
  };

  // Initialize image previews when initialData is loaded
  useEffect(() => {
    if (initialData) {
      // Validate and set thumbnail preview
      if (initialData.thumbnail) {
        validateImageUrl(initialData.thumbnail, (validUrl) => {
          setThumbnailPreview(validUrl);
        });
      }

      // Validate and set gallery images previews
      if (initialData.images && initialData.images.length > 0) {
        // Validate each image and update state individually
        initialData.images.forEach((imageUrl, index) => {
          validateImageUrl(imageUrl, (validUrl) => {
            setImagesPreviews(prev => {
              const updated = [...prev];
              updated[index] = validUrl;
              return updated;
            });
          });
        });
      }
    }
  }, [initialData]);

  const childOptions = useMemo(() => {
    return categories.filter((cat) => cat.parentId === parentCategoryId);
  }, [categories, parentCategoryId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleThumbnailBlur = () => {
    validateImageUrl(formData.thumbnail, (validUrl) => {
      setThumbnailPreview(validUrl);
    });
  };

  const handleImageBlur = (index) => {
    validateImageUrl(formData.images[index], (validUrl) => {
      const newPreviews = [...imagesPreviews];
      newPreviews[index] = validUrl;
      setImagesPreviews(newPreviews);
    });
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagesPreviews.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
    setImagesPreviews(newPreviews);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên sản phẩm";
    if (!parentCategoryId) newErrors.parentCategoryId = "Vui lòng chọn danh mục";
    if (formData.price === "" || Number(formData.price) <= 0) {
      newErrors.price = "Vui lòng nhập giá hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContentChange = (html) => {
    setFormData((prev) => ({ ...prev, content: html }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const categoryIds = [parentCategoryId];
    if (childCategoryId) categoryIds.push(childCategoryId);

    onSubmit({
      ...formData,
      price: Number(formData.price),
      categoryIds,
      primaryCategoryId: childCategoryId || parentCategoryId,
    });
  };

  const handleFormKeyDown = (e) => {
    // Prevent form submission when Enter is pressed in a textarea
    if (e.key === "Enter" && e.target.tagName === "TEXTAREA") {
      e.stopPropagation();
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
      <div className="product-form__section">
        <h2 className="product-form__section-title">Thông tin cơ bản</h2>

        <div className="product-form__field">
          <label className="product-form__label">Mã sản phẩm</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className="product-form__input"
            placeholder="bayer-velum-prime-400sc-100ml"
            disabled={isLoading || !!initialData}
          />
          <span className="product-form__hint">
            {initialData 
              ? "Mã sản phẩm không thể thay đổi khi sửa." 
              : "Nếu để trống sẽ tự tạo từ tên sản phẩm."}
          </span>
        </div>

        <div className="product-form__field">
          <label className="product-form__label">
            Tên sản phẩm <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="product-form__input"
            placeholder="Bayer Velum Prime 400SC 100ml"
            disabled={isLoading}
          />
          {errors.name && <span className="product-form__error">{errors.name}</span>}
        </div>

        <div className="product-form__grid">
          <div className="product-form__field">
            <label className="product-form__label">
              Giá <span className="required">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="product-form__input"
              placeholder="285000"
              disabled={isLoading}
            />
            {errors.price && (
              <span className="product-form__error">{errors.price}</span>
            )}
          </div>

          <div className="product-form__field">
            <label className="product-form__label">Tồn kho</label>
            <label className="product-form__checkbox-label">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="product-form__checkbox"
                disabled={isLoading}
              />
              <span>Còn hàng</span>
            </label>
          </div>
        </div>
      </div>

      <div className="product-form__section">
        <h2 className="product-form__section-title">Danh mục</h2>

        <div className="product-form__grid">
          <div className="product-form__field">
            <label className="product-form__label">
              Danh mục cha <span className="required">*</span>
            </label>
            <select
              value={parentCategoryId}
              onChange={(e) => {
                setParentCategoryId(e.target.value);
                setChildCategoryId("");
                if (errors.parentCategoryId) {
                  setErrors((prev) => ({ ...prev, parentCategoryId: "" }));
                }
              }}
              className="product-form__select"
              disabled={isLoading}
            >
              <option value="">-- Chọn danh mục --</option>
              {categoryTree.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.name}
                </option>
              ))}
            </select>
            {errors.parentCategoryId && (
              <span className="product-form__error">{errors.parentCategoryId}</span>
            )}
          </div>

          <div className="product-form__field">
            <label className="product-form__label">Danh mục con (tuỳ chọn)</label>
            <select
              value={childCategoryId}
              onChange={(e) => setChildCategoryId(e.target.value)}
              className="product-form__select"
              disabled={isLoading || childOptions.length === 0}
            >
              <option value="">-- Không có --</option>
              {childOptions.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="product-form__section">
        <h2 className="product-form__section-title">Hình ảnh</h2>

        <div className="product-form__field">
          <label className="product-form__label">Ảnh chính</label>
          <input
            type="text"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            onBlur={handleThumbnailBlur}
            className="product-form__input"
            placeholder="https://..."
            disabled={isLoading}
          />
          {thumbnailPreview && (
            <div style={{ marginTop: '8px' }}>
              <img 
                src={thumbnailPreview} 
                alt="Preview" 
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '200px', 
                  objectFit: 'contain',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '4px'
                }} 
              />
            </div>
          )}
        </div>

        <div className="product-form__field">
          <label className="product-form__label">Thư viện ảnh</label>
          {formData.images.map((image, index) => (
            <div key={index} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  onBlur={() => handleImageBlur(index)}
                  className="product-form__input"
                  placeholder="https://..."
                  disabled={isLoading}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="product-form__btn-cancel"
                  disabled={isLoading}
                  style={{ padding: '0 16px', minWidth: 'auto' }}
                >
                  Xóa
                </button>
              </div>
              {imagesPreviews[index] && (
                <div style={{ marginLeft: '0' }}>
                  <img 
                    src={imagesPreviews[index]} 
                    alt={`Preview ${index + 1}`}
                    style={{ 
                      maxWidth: '120px', 
                      maxHeight: '120px', 
                      objectFit: 'contain',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '4px'
                    }} 
                  />
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="product-form__btn-submit"
            disabled={isLoading}
            style={{ marginTop: '8px', padding: '8px 16px', fontSize: '14px' }}
          >
            + Thêm ảnh
          </button>
        </div>
      </div>

      <div className="product-form__section">
        <h2 className="product-form__section-title">Mô tả nhanh</h2>
        <div className="product-form__field">
          <RichTextEditor
            value={formData.shortDescription}
            onChange={(html) => setFormData((prev) => ({ ...prev, shortDescription: html }))}
            placeholder="Mô tả ngắn về sản phẩm..."
            editable={!isLoading}
            className="product-form__richtext--small"
          />
        </div>
      </div>

      <div className="product-form__section">
        <h2 className="product-form__section-title">Thông tin chi tiết</h2>

        <div className="product-form__grid">
          <div className="product-form__field">
            <label className="product-form__label">Hoạt chất</label>
            <input
              type="text"
              name="activeIngredient"
              value={formData.activeIngredient}
              onChange={handleChange}
              className="product-form__input"
              disabled={isLoading}
            />
          </div>
          <div className="product-form__field product-form__field--full">
            <label className="product-form__label">Công dụng</label>
            <RichTextEditor
              value={formData.uses}
              onChange={(html) => setFormData((prev) => ({ ...prev, uses: html }))}
              placeholder="Nhập công dụng sản phẩm..."
              editable={!isLoading}
              className="product-form__richtext--small"
            />
          </div>
          <div className="product-form__field product-form__field--full">
            <label className="product-form__label">Liều lượng</label>
            <RichTextEditor
              value={formData.dosage}
              onChange={(html) => setFormData((prev) => ({ ...prev, dosage: html }))}
              placeholder="Nhập liều lượng..."
              editable={!isLoading}
              className="product-form__richtext--small"
            />
          </div>
          <div className="product-form__field product-form__field--full">
            <label className="product-form__label">Đối tượng</label>
            <RichTextEditor
              value={formData.target}
              onChange={(html) => setFormData((prev) => ({ ...prev, target: html }))}
              placeholder="Nhập đối tượng áp dụng..."
              editable={!isLoading}
              className="product-form__richtext--small"
            />
          </div>
          <div className="product-form__field product-form__field--full">
            <label className="product-form__label">Quy cách</label>
            <RichTextEditor
              value={formData.packaging}
              onChange={(html) => setFormData((prev) => ({ ...prev, packaging: html }))}
              placeholder="Nhập quy cách đóng gói..."
              editable={!isLoading}
              className="product-form__richtext--small"
            />
          </div>
          <div className="product-form__field">
            <label className="product-form__label">Nhà sản xuất</label>
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              className="product-form__input"
              disabled={isLoading}
            />
          </div>
          <div className="product-form__field">
            <label className="product-form__label">Xuất xứ</label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              className="product-form__input"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div className="product-form__section">
        <h2 className="product-form__section-title">Thông tin bổ sung</h2>

        <div className="product-form__field">
          <RichTextEditor
            value={formData.content}
            onChange={handleContentChange}
            placeholder="Nhập nội dung chi tiết sản phẩm..."
            editable={!isLoading}
          />
        </div>
      </div>

      <div className="product-form__actions">
        <button
          type="button"
          className="product-form__btn-cancel"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="product-form__btn-submit"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : initialData ? "Cập nhật" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
}
