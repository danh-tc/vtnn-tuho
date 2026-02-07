"use client";
import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { getAllCategories } from "@/lib/category";
import { getAllProducts } from "@/lib/product";

// Global flag to prevent duplicate fetches across page navigations
let globalFetchCompleted = false;

export default function StoreInitializer({
  initialCategories = [],
  initialProducts = [],
}) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const currentState = useStore.getState();

    // If store already has data from a previous fetch, skip initialization
    if (globalFetchCompleted && currentState.products.length > 0) {
      return;
    }

    // Set initial data from build time for fast initial render
    // Merge with existing data (don't overwrite if we already have more)
    const mergedCategories = currentState.categories.length > initialCategories.length 
      ? currentState.categories 
      : initialCategories;
    const mergedProducts = currentState.products.length > initialProducts.length 
      ? currentState.products 
      : initialProducts;

    useStore.setState({
      categories: mergedCategories,
      products: mergedProducts,
      isInitialized: true,
      isLoading: false,
    });

    // Skip fresh fetch if we already fetched in this session
    if (globalFetchCompleted) {
      return;
    }

    // Fetch fresh data from Firebase (client-side) - ONCE per session
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

        globalFetchCompleted = true;
      } catch (error) {
        console.error('Error fetching fresh data:', error);
      }
    };

    fetchFreshData();
  }, [initialCategories, initialProducts]);

  return null;
}
