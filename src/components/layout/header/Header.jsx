"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LuSearch,
  LuUser,
  LuShoppingBag,
  LuPhone,
  LuMapPin,
  LuMenu,
  LuX,
  LuChevronDown,
  LuChevronRight,
  LuPlus,
  LuMinus,
  LuLock,
} from "react-icons/lu";
import { useStore } from "@/lib/store";
import { onAuthChange, signOutUser } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./Header.scss";

const buildCategoryTree = (categories) => {
  const roots = categories.filter((c) => !c.parentId);
  return roots.map((parent) => {
    const children = categories.filter((c) => c.parentId === parent.id);
    return { ...parent, children };
  });
};

const Header = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [accountExpanded, setAccountExpanded] = useState(false);
  const [productsExpanded, setProductsExpanded] = useState(false);
  const [othersExpanded, setOthersExpanded] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const { categories, setCurrentUser, clearCurrentUser } = useStore();
  const categoryTree = buildCategoryTree(categories);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setAuthUser(user || null);

      if (!user) {
        setDisplayName("");
        setUserRole(null);
        clearCurrentUser();
        return;
      }

      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          const data = querySnapshot.docs[0].data();
          setDisplayName(
            data.firstName || data.username || user.displayName || user.email,
          );
          setUserRole(data.role || "user");
          setCurrentUser(user, data.role || "user");
        } else {
          setDisplayName(user.displayName || user.email || "");
          setUserRole("user");
          setCurrentUser(user, "user");
        }
      } catch (error) {
        // Fallback if Firestore is blocked (ad blocker, network issues, etc.)
        console.warn(
          "Không thể tải thông tin user từ Firestore:",
          error.message,
        );
        setDisplayName(user.displayName || user.email || "Người dùng");
        setUserRole("user");
        setCurrentUser(user, "user");
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleExpand = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleLogout = async () => {
    await signOutUser();
    setShowDropdown(false);
    router.push("/");
  };

  return (
    <header className="header">
      <div className="header__top-bar">
        <div className="container">
          <div className="info-group">
            <a href="tel:0989977884">
              <LuPhone size={14} /> 0989.977.884
            </a>
            <span className="desktop-only">|</span>
            <span className="desktop-only">Mở cửa: 06:00 - 19:30</span>
          </div>
          <a
            href="https://www.google.com/maps?q=C%E1%BB%ADa+H%C3%A0ng+VTNN+T%C6%B0+H%E1%BB%93,+%E1%BA%A4p+Th%E1%BA%A1nh+L%E1%BA%ADp,+Th%E1%BA%A1nh+H%C3%B3a,+Long+An&ftid=0x310ae912b2601e35:0xa7c2e30a427ba5a4&entry=gps&shh=CAE&lucs=,94297699,94275415,94284484,94231188,94280568,47071704,94266210,94218641,94282134,94286869&g_ep=CAISEjI2LjA0LjEuODU4MjY5MDE5MBgAIIgnKlosOTQyOTc2OTksOTQyNzU0MTUsOTQyODQ0ODQsOTQyMzExODgsOTQyODA1NjgsNDcwNzE3MDQsOTQyNjYyMTAsOTQyMTg2NDEsOTQyODIxMzQsOTQyODY4NjlCAlZO&skid=9208ebe4-272f-4158-989e-9b3d5ba1fa25&g_st=ic"
            className="desktop-only"
            target="blank"
          >
            <LuMapPin size={14} /> Chỉ đường đến Tư Hồ
          </a>
        </div>
      </div>

      <div className="header__main">
        <div className="container">
          <button
            className="header__hamburger"
            onClick={() => setMenuOpen(true)}
            aria-label="Menu"
          >
            <LuMenu size={28} strokeWidth={2.5} />
          </button>

          <Link href="/" className="header__logo">
            <span className="brand-name">VTNN TƯ HỒ</span>
            <span className="slogan">ĐỒNG HÀNH CÙNG NHÀ NÔNG</span>
          </Link>

          <div className="header__search">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, thuốc, phân bón..."
              />
              <button aria-label="Tìm kiếm">
                <LuSearch size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="header__actions">
            {authUser ? (
              <div
                className="auth-greeting-wrapper"
                tabIndex={0}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setShowDropdown(!showDropdown);
                  }
                }}
                aria-label="Menu tài khoản"
              >
                <div className="auth-greeting">
                  <LuUser size={20} strokeWidth={2.5} />
                  <span>Xin chào, {displayName}</span>
                  <LuChevronDown size={16} />
                </div>
                {showDropdown && (
                  <div className="auth-dropdown">
                    <Link href="/auth/profile" className="dropdown-item">
                      <LuUser size={16} />
                      <span>Thông tin cá nhân</span>
                    </Link>
                    <Link
                      href="/auth/change-password"
                      className="dropdown-item"
                    >
                      <LuLock size={16} />
                      <span>Đổi mật khẩu</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout-btn"
                    >
                      <LuX size={16} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-links">
                <Link href="/auth/login" className="auth-link">
                  Đăng nhập
                </Link>
                <span className="auth-divider">/</span>
                <Link href="/auth/register" className="auth-link">
                  Đăng ký
                </Link>
              </div>
            )}
            {userRole === "admin" && (
              <Link
                href="/admin"
                className="icon-btn admin-btn"
                title="Quản lý"
              >
                <span>Quản lý</span>
              </Link>
            )}
            {/* Cart hidden - TODO: implement cart feature
            <Link href="/cart" className="icon-btn">
              <LuShoppingBag size={22} strokeWidth={2.5} />
              <span className="badge">2</span>
            </Link>
            */}
          </div>
        </div>
      </div>

      <nav className="header__nav-bar">
        <div className="container">
          <ul className="nav-list">
            <li>
              <Link href="/">Trang chủ</Link>
            </li>
            <li>
              <Link href="/gioi-thieu">Giới thiệu</Link>
            </li>

            <li className="has-dropdown">
              <Link href="/san-pham">
                Sản phẩm <LuChevronDown size={14} style={{ marginBottom: 2 }} />
              </Link>

              <ul className="dropdown-menu">
                {categoryTree.map((parent) => (
                  <li key={parent.id} className="dropdown-item">
                    <Link href={`/danh-muc/${parent.slug || parent.id}`}>
                      {parent.name || parent.label}
                      {parent.children?.length > 0 && (
                        <LuChevronRight size={14} />
                      )}
                    </Link>

                    {parent.children?.length > 0 && (
                      <ul className="sub-menu">
                        {parent.children.map((child) => (
                          <li key={child.id}>
                            <Link href={`/danh-muc/${child.slug || child.id}`}>
                              {child.name || child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </li>

            <li>
              <Link href="/kien-thuc">Kiến thức</Link>
            </li>
            <li>
              <Link href="/tuyen-dung">Tuyển dụng</Link>
            </li>
            <li>
              <Link href="/lien-he">Liên hệ</Link>
            </li>
          </ul>
        </div>
      </nav>

      <div
        className={`header__overlay ${menuOpen ? "open" : ""}`}
        tabIndex={menuOpen ? 0 : -1}
        onClick={() => setMenuOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
            e.preventDefault();
            setMenuOpen(false);
          }
        }}
        aria-label="Đóng menu"
      ></div>

      <div className={`header__mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="menu-header">
          <span>MENU</span>
          <button onClick={() => setMenuOpen(false)} aria-label="Đóng menu">
            <LuX />
          </button>
        </div>
        <ul className="mobile-list">
          <li className="mobile-section-title collapsible">
            <span>TÀI KHOẢN</span>
            <button
              className="section-toggle-btn"
              onClick={() => setAccountExpanded(!accountExpanded)}
              aria-label={
                accountExpanded ? "Thu gọn tài khoản" : "Mở rộng tài khoản"
              }
              aria-expanded={accountExpanded}
            >
              {accountExpanded ? <LuMinus size={16} /> : <LuPlus size={16} />}
            </button>
          </li>
          {accountExpanded && authUser ? (
            <>
              <li className="mobile-auth-card">
                <div className="user-avatar">
                  <LuUser size={24} />
                </div>
                <div className="user-info">
                  <div className="user-greeting">Xin chào,</div>
                  <div className="user-name">{displayName}</div>
                </div>
              </li>
              <li>
                <Link
                  href="/auth/profile"
                  onClick={() => setMenuOpen(false)}
                  className="mobile-menu-item"
                >
                  <LuUser size={18} />
                  <span>Thông tin cá nhân</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/change-password"
                  onClick={() => setMenuOpen(false)}
                  className="mobile-menu-item"
                >
                  <LuLock size={18} />
                  <span>Đổi mật khẩu</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="mobile-menu-item logout-item"
                >
                  <LuX size={18} />
                  <span>Đăng xuất</span>
                </button>
              </li>
            </>
          ) : null}
          {accountExpanded && !authUser ? (
            <>
              <li>
                <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                  ĐĂNG NHẬP
                </Link>
              </li>
              <li>
                <Link href="/auth/register" onClick={() => setMenuOpen(false)}>
                  ĐĂNG KÝ
                </Link>
              </li>
            </>
          ) : null}

          <li>
            <Link href="/" onClick={() => setMenuOpen(false)}>
              TRANG CHỦ
            </Link>
          </li>
          <li>
            <Link href="/gioi-thieu" onClick={() => setMenuOpen(false)}>
              GIỚI THIỆU
            </Link>
          </li>

          <li className="mobile-section-title collapsible">
            <span>SẢN PHẨM</span>
            <button
              className="section-toggle-btn"
              onClick={() => setProductsExpanded(!productsExpanded)}
              aria-label={
                productsExpanded ? "Thu gọn sản phẩm" : "Mở rộng sản phẩm"
              }
              aria-expanded={productsExpanded}
            >
              {productsExpanded ? <LuMinus size={16} /> : <LuPlus size={16} />}
            </button>
          </li>

          {productsExpanded &&
            categoryTree.map((parent) => {
              const isExpanded = expandedIds.includes(parent.id);
              const hasChildren = parent.children && parent.children.length > 0;

              return (
                <li
                  key={parent.id}
                  className={`mobile-item-group ${isExpanded ? "expanded" : ""}`}
                >
                  <div className="mobile-item-row">
                    <Link
                      href={`/danh-muc/${parent.slug || parent.id}`}
                      className="parent-link"
                      onClick={() => setMenuOpen(false)}
                    >
                      {parent.name || parent.label}
                    </Link>

                    {hasChildren && (
                      <button
                        className="expand-btn"
                        onClick={(e) => toggleExpand(parent.id, e)}
                        aria-label={
                          isExpanded
                            ? `Thu gọn ${parent.name}`
                            : `Mở rộng ${parent.name}`
                        }
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? (
                          <LuMinus size={18} />
                        ) : (
                          <LuPlus size={18} />
                        )}
                      </button>
                    )}
                  </div>

                  {hasChildren && (
                    <ul
                      className={`mobile-sub-menu ${isExpanded ? "open" : ""}`}
                    >
                      {parent.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={`/danh-muc/${child.slug || child.id}`}
                            className="child-link"
                            onClick={() => setMenuOpen(false)}
                          >
                            {child.name || child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}

          <li className="mobile-section-title collapsible">
            <span>KHÁC</span>
            <button
              className="section-toggle-btn"
              onClick={() => setOthersExpanded(!othersExpanded)}
              aria-label={othersExpanded ? "Thu gọn khác" : "Mở rộng khác"}
              aria-expanded={othersExpanded}
            >
              {othersExpanded ? <LuMinus size={16} /> : <LuPlus size={16} />}
            </button>
          </li>
          {othersExpanded && (
            <>
              <li>
                <Link href="/kien-thuc" onClick={() => setMenuOpen(false)}>
                  KIẾN THỨC
                </Link>
              </li>
              <li>
                <Link href="/lien-he" onClick={() => setMenuOpen(false)}>
                  LIÊN HỆ
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
