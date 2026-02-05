"use client";

import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import RedirectNotice from "@/components/common/RedirectNotice/RedirectNotice";

export default function UnauthorizedPage() {
  return (
    <>
      <Header />
      <RedirectNotice
        type="unauthorized"
        title="Không có quyền truy cập"
        message="Bạn không có quyền để truy cập trang này."
        seconds={5}
      />
      <Footer />
    </>
  );
}
