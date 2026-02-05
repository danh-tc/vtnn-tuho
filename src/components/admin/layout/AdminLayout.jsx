"use client";

import React, { useState } from "react";
import AdminSidebar from "../AdminSidebar";
import "./AdminLayout.scss";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-layout__content">
        <div className="admin-layout__header">
          <button
            className="admin-layout__toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1 className="admin-layout__title">Admin Panel</h1>
        </div>
        <main className="admin-layout__main">{children}</main>
      </div>
    </div>
  );
}
