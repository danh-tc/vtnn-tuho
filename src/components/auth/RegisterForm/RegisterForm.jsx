"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LuMail, LuLock, LuUser, LuPhone, LuMapPin, LuLoader } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { registerWithEmail, registerWithGoogle } from "@/lib/auth";
import "./RegisterForm.scss";

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [autoRedirectCount, setAutoRedirectCount] = useState(5);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  // Auto-redirect countdown
  useEffect(() => {
    if (!showSuccessModal) return;

    const interval = setInterval(() => {
      setAutoRedirectCount((prev) => {
        if (prev <= 1) {
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showSuccessModal, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Vui lòng nhập tên";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Vui lòng nhập họ";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    }
    if (formData.username.trim().length < 6) {
      newErrors.username = "Tên đăng nhập phải ít nhất 6 ký tự";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải ít nhất 6 ký tự";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không trùng khớp";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const result = await registerWithEmail(formData.email, formData.password, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      phone: formData.phone,
      address: formData.address,
    });

    setIsLoading(false);

    if (result.success) {
      setSuccessMessage(result.message);
      setShowSuccessModal(true);
    } else {
      setErrors({ submit: result.error });
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    const result = await registerWithGoogle();
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage(result.message);
      setShowSuccessModal(true);
    } else {
      setErrors({ submit: result.error });
    }
  };

  return (
    <>
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1 className="register-title">Tạo Tài Khoản</h1>
            <p className="register-subtitle">
              Đăng ký để tận hưởng dịch vụ của chúng tôi
            </p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {/* Error Alert */}
            {errors.submit && (
              <div className="alert alert-error">
                <span className="alert-text">{errors.submit}</span>
              </div>
            )}

            {/* Name Row */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Tên *</label>
                <div className="input-wrapper">
                  <LuUser className="input-icon" size={18} />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Nhập tên"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? "input-error" : ""}
                  />
                </div>
                {errors.firstName && (
                  <span className="error-text">{errors.firstName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Họ *</label>
                <div className="input-wrapper">
                  <LuUser className="input-icon" size={18} />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Nhập họ"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? "input-error" : ""}
                  />
                </div>
                {errors.lastName && (
                  <span className="error-text">{errors.lastName}</span>
                )}
              </div>
            </div>

            {/* Username */}
            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập *</label>
              <div className="input-wrapper">
                <LuUser className="input-icon" size={18} />
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Nhập tên đăng nhập (ít nhất 6 ký tự)"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? "input-error" : ""}
                />
              </div>
              {errors.username && (
                <span className="error-text">{errors.username}</span>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <div className="input-wrapper">
                <LuMail className="input-icon" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Nhập email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "input-error" : ""}
                />
              </div>
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            {/* Password Row */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Mật khẩu *</label>
                <div className="input-wrapper">
                  <LuLock className="input-icon" size={18} />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Ít nhất 6 ký tự"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "input-error" : ""}
                  />
                </div>
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu *</label>
                <div className="input-wrapper">
                  <LuLock className="input-icon" size={18} />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? "input-error" : ""}
                  />
                </div>
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại *</label>
              <div className="input-wrapper">
                <LuPhone className="input-icon" size={18} />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "input-error" : ""}
                />
              </div>
              {errors.phone && (
                <span className="error-text">{errors.phone}</span>
              )}
            </div>

            {/* Address */}
            <div className="form-group">
              <label htmlFor="address">Địa chỉ *</label>
              <div className="input-wrapper">
                <LuMapPin className="input-icon" size={18} />
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Nhập địa chỉ"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? "input-error" : ""}
                />
              </div>
              {errors.address && (
                <span className="error-text">{errors.address}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-register"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LuLoader size={18} className="spinner" />
                  Đang đăng ký...
                </>
              ) : (
                "Tạo Tài Khoản"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>hoặc</span>
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="btn btn-google"
            disabled={isLoading}
          >
            <FcGoogle size={20} />
            <span>Đăng ký bằng Google</span>
          </button>

          {/* Login Link */}
          <p className="login-link">
            Đã có tài khoản?{" "}
            <Link href="/auth/login" className="link">
              Đăng nhập tại đây
            </Link>
          </p>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">
              <svg
                className="checkmark"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                <circle className="checkmark-circle" cx="26" cy="26" r="25" />
                <path className="checkmark-check" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <h2 className="modal-title">Đăng ký thành công!</h2>
            <p className="modal-message">{successMessage}</p>
            <p className="modal-redirect">
              Sẽ chuyển hướng về trang chủ trong <strong>{autoRedirectCount}</strong>s
            </p>
            <div className="modal-actions">
              <button
                onClick={() => router.push("/auth/login")}
                className="btn btn-secondary"
              >
                Đăng nhập ngay
              </button>
              <button
                onClick={() => router.push("/")}
                className="btn btn-primary"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
