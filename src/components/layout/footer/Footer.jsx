"use client";

import React from "react";
import Link from "next/link";
import {
  LuMapPin,
  LuPhone,
  LuMail,
  LuFacebook,
  LuArrowUp,
  LuShieldCheck,
} from "react-icons/lu";
import "./Footer.scss";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__col">
              <Link href="/" className="footer__logo">
                <span className="brand-name">VTNN TƯ HỒ</span>
                <span className="slogan">ĐỒNG HÀNH CÙNG NÔNG GIA</span>
              </Link>

              <div className="footer__contact">
                <div className="contact-item">
                  <LuMapPin className="icon" size={18} />
                  <span>98 ấp Thạnh lập, xã Thạnh Phước, tỉnh Tây Ninh</span>
                </div>
                <div className="contact-item">
                  <LuPhone className="icon" size={18} />
                  <a href="tel:0989977884">0989.977.884</a>
                </div>
                <div className="contact-item">
                  <LuMail className="icon" size={18} />
                  <a href="mailto:vtnntuho@gmail.com">vtnntuho@gmail.com</a>
                </div>
                <div className="contact-item">
                  <LuShieldCheck className="icon" size={18} />
                  <span>MST: MST - Cấp ngày dd/mm/yy</span>
                </div>
              </div>
            </div>

            <div className="footer__col">
              <h4 className="footer__heading">DANH MỤC SẢN PHẨM</h4>
              <ul className="footer__links">
                <li>
                  <Link href="/danh-muc/thuoc-bvtv">Thuốc bảo vệ thực vật</Link>
                </li>
                <li>
                  <Link href="/danh-muc/phan-bon">Phân bón</Link>
                </li>
                <li>
                  <Link href="/danh-muc/hat-giong">Hạt giống</Link>
                </li>
                <li>
                  <Link href="/danh-muc/dung-cu">Dụng cụ làm vườn</Link>
                </li>
                <li>
                  <Link href="/khuyen-mai">Sản phẩm khuyến mãi</Link>
                </li>
              </ul>
            </div>

            {/* Cột 3: Chính sách */}
            <div className="footer__col">
              <h4 className="footer__heading">CHÍNH SÁCH & HỖ TRỢ</h4>
              <ul className="footer__links">
                <li>
                  <Link href="/chinh-sach-van-chuyen">
                    Chính sách vận chuyển
                  </Link>
                </li>
                <li>
                  <Link href="/chinh-sach-thanh-toan">
                    Chính sách thanh toán
                  </Link>
                </li>
                <li>
                  <Link href="/chinh-sach-doi-tra">Chính sách hoàn trả</Link>
                </li>
                <li>
                  <Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
                </li>
                <li>
                  <Link href="/kiem-hang">Chính sách kiểm hàng</Link>
                </li>
              </ul>
            </div>

            {/* Cột 4: Fanpage & Mạng xã hội */}
            <div className="footer__col">
              <h4 className="footer__heading">KẾT NỐI VỚI TƯ HỒ</h4>
              <p className="footer__desc">
                Theo dõi chúng tôi để cập nhật những kiến thức nông nghiệp mới
                nhất.
              </p>

              <div className="footer__socials">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-btn fb"
                >
                  <LuFacebook size={20} /> Fanpage Tư Hồ
                </a>
              </div>

              <div className="footer__bct">
                <div className="bct-badge">
                  <LuShieldCheck size={24} /> Đã thông báo BCT
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© 2010 VTNN Tư Hồ - All rights reserved.</p>
          <p className="design-by">Designed by Danh Tran Cong</p>
        </div>
      </div>

      <button
        className="scroll-top-btn"
        onClick={scrollToTop}
        aria-label="Lên đầu trang"
      >
        <LuArrowUp size={20} strokeWidth={3} />
      </button>
    </footer>
  );
};

export default Footer;
