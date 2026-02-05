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

    console.log('StoreInitializer - Categories received:', initialCategories);
    console.log('Categories with children:', initialCategories.filter(c => c.parentId));

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
