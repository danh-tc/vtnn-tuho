"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllProducts, deleteProduct } from "@/lib/product";
import "./ProductsList.scss";

export default function ProductsList() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Lỗi khi tải sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      return;
    }

    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      alert("Lỗi khi xóa sản phẩm: " + (err.message || ""));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="products-list">
        <div className="products-list__loading">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-list">
        <div className="products-list__error">{error}</div>
      </div>
    );
  }

  return (
    <div className="products-list">
      <div className="products-list__header">
        <h1 className="products-list__title">Quản lý sản phẩm</h1>
        <button
          className="products-list__add-btn"
          onClick={() => router.push("/admin/products/new")}
        >
          Thêm sản phẩm mới
        </button>
      </div>

      {products.length === 0 ? (
        <div className="products-list__empty">
          Chưa có sản phẩm nào. Nhấn "Thêm sản phẩm mới" để bắt đầu.
        </div>
      ) : (
        <div className="products-list__table-wrapper">
          <table className="products-list__table">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="products-list__thumbnail">
                      {product.thumbnail ? (
                        <img src={product.thumbnail} alt={product.name} />
                      ) : (
                        <div className="products-list__no-image">No Image</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="products-list__name">{product.name}</div>
                    <div className="products-list__id">ID: {product.id}</div>
                  </td>
                  <td>{formatPrice(product.price)}</td>
                  <td>
                    <span className={`products-list__stock ${product.inStock ? "in-stock" : "out-of-stock"}`}>
                      {product.inStock ? "Còn hàng" : "Hết hàng"}
                    </span>
                  </td>
                  <td>
                    {product.createdAt
                      ? new Date(product.createdAt).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </td>
                  <td>
                    <div className="products-list__actions">
                      <button
                        className="products-list__btn products-list__btn--edit"
                        onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                      >
                        Sửa
                      </button>
                      <button
                        className="products-list__btn products-list__btn--delete"
                        onClick={() => handleDelete(product.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
