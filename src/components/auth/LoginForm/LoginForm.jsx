"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuMail, LuLock, LuLoader } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { loginWithEmail, loginWithGoogle } from "@/lib/auth";
import "./LoginForm.scss";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = "Vui lòng nhập email hoặc tên đăng nhập";
    } else if (
      formData.identifier.includes("@") &&
      !/^\S+@\S+\.\S+$/.test(formData.identifier)
    ) {
      newErrors.identifier = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    const result = await loginWithEmail(
      formData.identifier,
      formData.password
    );
    setIsLoading(false);

    if (result.success) {
      router.push("/");
    } else {
      setErrors({ submit: result.error });
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const result = await loginWithGoogle();
    setIsLoading(false);

    if (result.success) {
      router.push("/");
    } else {
      setErrors({ submit: result.error });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Đăng Nhập</h1>
          <p className="login-subtitle">Chào mừng bạn quay lại!</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {errors.submit && (
            <div className="alert alert-error">
              <span className="alert-text">{errors.submit}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="identifier">Email hoặc tên đăng nhập *</label>
            <div className="input-wrapper">
              <LuMail className="input-icon" size={18} />
              <input
                type="text"
                id="identifier"
                name="identifier"
                placeholder="Nhập email hoặc tên đăng nhập"
                value={formData.identifier}
                onChange={handleChange}
                className={errors.identifier ? "input-error" : ""}
              />
            </div>
            {errors.identifier && (
              <span className="error-text">{errors.identifier}</span>
            )}
          </div>

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

          <button
            type="submit"
            className="btn btn-primary btn-login"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LuLoader size={18} className="spinner" />
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        <div className="divider">
          <span>hoặc</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="btn btn-google"
          disabled={isLoading}
        >
          <FcGoogle size={20} />
          <span>Đăng nhập bằng Google</span>
        </button>

        <p className="register-link">
          Chưa có tài khoản?{" "}
          <Link href="/auth/register" className="link">
            Đăng ký ngay
          </Link>
        </p>

        <div className="back-home">
          <Link href="/" className="link-home">
            ← Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
