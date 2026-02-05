"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthChange } from "@/lib/auth";
import "./ProtectedAuthPage.scss";

export default function ProtectedAuthPage({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        router.push("/");
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="protected-auth-page__loader">
        <div className="protected-auth-page__loader-content">
          <div className="protected-auth-page__spinner"></div>
          <p className="protected-auth-page__loader-text">Đang tải...</p>
        </div>
      </div>
    );
  }

  return children;
}
