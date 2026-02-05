"use client";
import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";

export default function StoreInitializer({
  initialCategories,
  initialProducts,
}) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    useStore.setState({
      categories: initialCategories,
      products: initialProducts,
      isInitialized: true,
      isLoading: false,
    });

    initialized.current = true;
  }, [initialCategories, initialProducts]);

  return null;
}
