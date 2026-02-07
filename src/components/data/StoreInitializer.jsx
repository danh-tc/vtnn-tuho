"use client";
import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { getAllCategories } from "@/lib/category";
import { getAllProducts } from "@/lib/product";

export default function StoreInitializer({
  initialCategories,
  initialProducts,
}) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    // Set initial data from build time for fast initial render
    useStore.setState({
      categories: initialCategories,
      products: initialProducts,
      isInitialized: true,
      isLoading: false,
    });

    initialized.current = true;

    // Fetch fresh data from Firebase (client-side)
    const fetchFreshData = async () => {
      try {
        const [freshCategories, freshProducts] = await Promise.all([
          getAllCategories(),
          getAllProducts(),
        ]);

        useStore.setState({
          categories: freshCategories,
          products: freshProducts,
        });
      } catch (error) {
        console.error('Error fetching fresh data:', error);
      }
    };

    fetchFreshData();
  }, [initialCategories, initialProducts]);

  return null;
}
