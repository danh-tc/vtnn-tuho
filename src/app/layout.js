import "./globals.scss";
import { Roboto } from "next/font/google";

export const metadata = {
  title: "VTNN TƯ HỒ",
  description: "Website của VTNN TƯ HỒ",
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
