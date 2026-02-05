import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import LoginForm from "@/components/auth/LoginForm/LoginForm";

export const metadata = {
  title: "Đăng nhập | VTNN TƯ HỒ",
  description: "Đăng nhập để tiếp tục mua sắm tại VTNN TƯ HỒ",
};

export default function LoginPage() {
  return (
    <>
      <Header />
      <LoginForm />
      <Footer />
    </>
  );
}
