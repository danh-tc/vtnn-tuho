"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
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

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
    thumbnail: "",
    images: [],
    shortDescription: "",
    activeIngredient: "",
    uses: "",
    dosage: "",
    target: "",
    packaging: "",
    manufacturer: "",
    origin: "",
    content: "",
    inStock: true,
  });

  const [parentCategoryId, setParentCategoryId] = useState("");
  const [childCategoryId, setChildCategoryId] = useState("");
  const [errors, setErrors] = useState({});

  // Initialize form with existing data for edit mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || "",
        name: initialData.name || "",
        price: initialData.price || "",
        thumbnail: initialData.thumbnail || "",
        images: initialData.images || [],
        shortDescription: initialData.shortDescription || "",
        activeIngredient: initialData.activeIngredient || "",
        uses: initialData.uses || "",
        dosage: initialData.dosage || "",
        target: initialData.target || "",
        packaging: initialData.packaging || "",
        manufacturer: initialData.manufacturer || "",
        origin: initialData.origin || "",
        content: initialData.content || "",
        inStock: initialData.inStock ?? true,
      });

      // Set category selections
      const categoryIds = initialData.categoryIds || [];
      if (categoryIds.length > 0) {
        const firstCat = categories.find(c => c.id === categoryIds[0]);
        if (firstCat) {
          if (firstCat.parentId) {
            // First is child, set parent and child
            setParentCategoryId(firstCat.parentId);
            setChildCategoryId(firstCat.id);
          } else {
            // First is parent
            setParentCategoryId(firstCat.id);
            if (categoryIds.length > 1) {
              setChildCategoryId(categoryIds[1]);
            }
          }
        }
      }
    }
  }, [initialData, categories]);

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

  const handleImagesChange = (e) => {
    const value = e.target.value;
    const images = value
      .split(";")
      .map((line) => line.trim())
      .filter(Boolean);

    setFormData((prev) => ({ ...prev, images }));
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

  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.content || "",
    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
    },
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  // Update editor content when initialData changes
  useEffect(() => {
    if (editor && initialData && initialData.content) {
      editor.commands.setContent(initialData.content);
    }
  }, [editor, initialData]);

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

  return (
    <form className="product-form" onSubmit={handleSubmit}>
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
          <label className="product-form__label">Ảnh đại diện (URL)</label>
          <input
            type="text"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            className="product-form__input"
            placeholder="https://..."
            disabled={isLoading}
          />
        </div>

        <div className="product-form__field">
          <label className="product-form__label">Thư viện ảnh (phân cách bằng dấu ;)</label>
          <textarea
            className="product-form__textarea"
            rows={4}
            placeholder="https://...; https://..."
            value={formData.images.join("; ")}
            onChange={handleImagesChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="product-form__section">
        <h2 className="product-form__section-title">Mô tả nhanh</h2>
        <div className="product-form__field">
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            className="product-form__textarea"
            rows={3}
            placeholder="Mô tả ngắn về sản phẩm"
            disabled={isLoading}
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
          <div className="product-form__field">
            <label className="product-form__label">Công dụng</label>
            <input
              type="text"
              name="uses"
              value={formData.uses}
              onChange={handleChange}
              className="product-form__input"
              disabled={isLoading}
            />
          </div>
          <div className="product-form__field">
            <label className="product-form__label">Liều lượng</label>
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              className="product-form__input"
              disabled={isLoading}
            />
          </div>
          <div className="product-form__field">
            <label className="product-form__label">Đối tượng</label>
            <input
              type="text"
              name="target"
              value={formData.target}
              onChange={handleChange}
              className="product-form__input"
              disabled={isLoading}
            />
          </div>
          <div className="product-form__field">
            <label className="product-form__label">Quy cách</label>
            <input
              type="text"
              name="packaging"
              value={formData.packaging}
              onChange={handleChange}
              className="product-form__input"
              disabled={isLoading}
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
        <h2 className="product-form__section-title">Nội dung chi tiết (Rich Text)</h2>

        <div className="product-form__field">
          <div className="tiptap-toolbar">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={editor?.isActive("bold") ? "is-active" : ""}
              disabled={isLoading}
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={editor?.isActive("italic") ? "is-active" : ""}
              disabled={isLoading}
            >
              <em>I</em>
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor?.isActive("heading", { level: 2 }) ? "is-active" : ""}
              disabled={isLoading}
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              className={editor?.isActive("heading", { level: 3 }) ? "is-active" : ""}
              disabled={isLoading}
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={editor?.isActive("bulletList") ? "is-active" : ""}
              disabled={isLoading}
            >
              • List
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={editor?.isActive("orderedList") ? "is-active" : ""}
              disabled={isLoading}
            >
              1. List
            </button>
          </div>
          <EditorContent editor={editor} />
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
