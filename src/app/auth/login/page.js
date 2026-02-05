import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import LoginForm from "@/components/auth/LoginForm/LoginForm";
import ProtectedAuthPage from "@/components/auth/ProtectedAuthPage";

export const metadata = {
  title: "Đăng nhập | VTNN TƯ HỒ",
  description: "Đăng nhập để tiếp tục mua sắm tại VTNN TƯ HỒ",
};

export default function LoginPage() {
  return (
    <ProtectedAuthPage>
      <>
        <Header />
        <LoginForm />
        <Footer />
      </>
    </ProtectedAuthPage>
  );
}
