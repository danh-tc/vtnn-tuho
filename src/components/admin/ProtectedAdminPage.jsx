"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthChange } from "@/lib/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import "./ProtectedAdminPage.scss";

export default function ProtectedAdminPage({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (!user) {
        // Not logged in, redirect to login
        router.push("/auth/login");
        return;
      }

      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          const userData = querySnapshot.docs[0].data();
          if (userData.role === "admin") {
            setIsAdmin(true);
            setIsLoading(false);
          } else {
            // User is logged in but not admin, redirect to unauthorized
            router.push("/unauthorized");
          }
        } else {
          // User not found in database
          router.push("/unauthorized");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push("/unauthorized");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="protected-admin-page__loader">
        <div className="protected-admin-page__loader-content">
          <div className="protected-admin-page__spinner"></div>
          <p className="protected-admin-page__loader-text">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return children;
}
