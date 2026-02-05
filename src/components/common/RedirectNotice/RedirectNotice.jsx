"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuArrowUp, LuShieldAlert, LuTriangleAlert } from "react-icons/lu";
import "./RedirectNotice.scss";

const ICONS = {
  notFound: LuTriangleAlert,
  unauthorized: LuShieldAlert,
};

export default function RedirectNotice({
  type = "notFound",
  title,
  message,
  seconds = 5,
}) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(seconds);

  const Icon = useMemo(() => ICONS[type] || LuTriangleAlert, [type]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    const redirect = setTimeout(() => {
      router.push("/");
    }, seconds * 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [router, seconds]);

  return (
    <div className="redirect-notice">
      <div className="notice-card">
        <div className={`notice-icon ${type}`}>
          <Icon size={40} />
        </div>
        <h1 className="notice-title">{title}</h1>
        <p className="notice-message">{message}</p>
        <p className="notice-countdown">
          Tự động về trang chủ sau <strong>{countdown}</strong>s
        </p>
        <Link href="/" className="notice-home-link">
          <LuArrowUp size={18} />
          <span>Về trang chủ ngay</span>
        </Link>
      </div>
    </div>
  );
}
