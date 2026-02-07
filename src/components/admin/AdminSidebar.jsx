"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOutUser } from "@/lib/auth";
import { LuLayoutDashboard, LuFolderOpen, LuBox, LuUsers, LuLogOut, LuX } from "react-icons/lu";
import "./AdminSidebar.scss";

export default function AdminSidebar({ isOpen, onClose }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOutUser();
    router.push("/");
  };

  return (
    <>
      {isOpen && (
        <div className="admin-sidebar__overlay" onClick={onClose}></div>
      )}
      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo">
            <span className="brand-name">VTNN TƯ HỒ</span>
            <span className="slogan">ĐỒNG HÀNH CÙNG NÔNG GIA</span>
          </div>
          <button
            className="admin-sidebar__close-btn"
            onClick={onClose}
          >
            <LuX size={24} />
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          <Link href="/admin" className="admin-sidebar__nav-item">
            <LuLayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/categories" className="admin-sidebar__nav-item">
            <LuFolderOpen size={20} />
            <span>Danh mục</span>
          </Link>
          <Link href="/admin/products" className="admin-sidebar__nav-item">
            <LuBox size={20} />
            <span>Sản phẩm</span>
          </Link>
          <Link href="/admin/users" className="admin-sidebar__nav-item">
            <LuUsers size={20} />
            <span>Người dùng</span>
          </Link>
        </nav>

        <button
          className="admin-sidebar__logout-btn"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LuLogOut size={20} />
          <span>{isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>
        </button>
      </aside>
    </>
  );
}
