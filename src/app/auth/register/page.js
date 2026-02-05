import RegisterForm from "@/components/auth/RegisterForm/RegisterForm";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";

export const metadata = {
  title: "Đăng ký | VTNN TƯ HỒ",
  description: "Tạo tài khoản để tận hưởng dịch vụ của VTNN TƯ HỒ",
};

export default function RegisterPage() {
  return (
    <>
      <Header />
      <RegisterForm />
      <Footer />
    </>
  );
}
