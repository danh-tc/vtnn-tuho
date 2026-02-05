"use client";

import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import RedirectNotice from "@/components/common/RedirectNotice/RedirectNotice";

export default function NotFoundPage() {
  return (
    <>
      <Header />
      <RedirectNotice
        type="notFound"
        title="Không tìm thấy trang"
        message="Đường dẫn bạn truy cập không tồn tại hoặc đã bị thay đổi."
        seconds={5}
      />
      <Footer />
    </>
  );
}
