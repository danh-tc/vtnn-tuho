import "./globals.scss";
import { Roboto } from "next/font/google";

export const metadata = {
  title: "Cửa hàng VTNN TƯ HỒ",
  description:
    "Cửa hàng vật tư nông nghiệp Tư Hồ - Chuyên cung cấp phân bón, thuốc bảo vệ thực vật, hạt giống chất lượng cao. Giá tốt, giao hàng nhanh tại Việt Nam.",
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
