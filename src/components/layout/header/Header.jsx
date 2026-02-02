"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LuSearch,
  LuUser,
  LuShoppingBag,
  LuPhone,
  LuMapPin,
  LuMenu,
  LuX,
  LuChevronDown,
} from "react-icons/lu";
import "./Header.scss";

const MENU_ITEMS = [
  { label: "Trang chủ", link: "/", active: true },
  { label: "Giới thiệu", link: "/gioi-thieu" },
  { label: "Sản phẩm", link: "/san-pham", hasSub: true },
  { label: "Kiến thức", link: "/kien-thuc" },
  { label: "Tuyển dụng", link: "/tuyen-dung" },
  { label: "Liên hệ", link: "/lien-he" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <a href="/chi-duong" className="desktop-only">
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
            <span className="slogan">ĐỒNG HÀNH CÙNG NÔNG GIA</span>
          </Link>

          <div className="header__search">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, thuốc, phân bón..."
              />
              <button>
                <LuSearch size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="header__actions">
            <Link href="/login" className="icon-btn">
              <LuUser size={22} strokeWidth={2.5} />
            </Link>
            <Link href="/cart" className="icon-btn">
              <LuShoppingBag size={22} strokeWidth={2.5} />
              <span className="badge">2</span>
            </Link>
          </div>
        </div>
      </div>

      <nav className="header__nav-bar">
        <div className="container">
          <ul>
            {MENU_ITEMS.map((item, index) => (
              <li key={index}>
                <Link href={item.link} className={item.active ? "active" : ""}>
                  {item.label}
                  {item.hasSub && (
                    <LuChevronDown
                      size={16}
                      strokeWidth={3}
                      style={{ marginBottom: 2 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div
        className={`header__overlay ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
      ></div>

      <div className={`header__mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="menu-header">
          <span>MENU</span>
          <button onClick={() => setMenuOpen(false)}>
            <LuX />
          </button>
        </div>
        <ul>
          {MENU_ITEMS.map((item, index) => (
            <li key={index}>
              <Link href={item.link} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
