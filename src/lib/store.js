import { create } from "zustand";

export const useStore = create((set, get) => ({
  products: [],
  categories: [],
  isLoading: false,
  isInitialized: false,
  currentUser: null,
  isAdmin: false,

  getFilteredProducts: (keyword, categoryId = null) => {
    const { products } = get();
    let result = products;

    if (categoryId) {
      result = result.filter((p) => p.categoryIds?.includes(categoryId));
    }

    if (keyword && keyword.trim() !== "") {
      const lowerKeyword = keyword.toLowerCase().trim();

      result = result.filter((p) => {
        return (
          p.search_name?.includes(lowerKeyword) ||
          p.name.toLowerCase().includes(lowerKeyword)
        );
      });
    }

    return result;
  },

  setCurrentUser: (user, role = "user") => {
    set({ currentUser: user, isAdmin: role === "admin" });
  },

  clearCurrentUser: () => {
    set({ currentUser: null, isAdmin: false });
  },
}));
