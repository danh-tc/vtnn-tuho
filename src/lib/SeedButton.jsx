"use client";
import { useState } from "react";
import { db } from "@/lib/firebase"; // Make sure this path matches your file
import { doc, writeBatch, collection } from "firebase/firestore";

// --- 1. YOUR RAW DATA ---
const CATEGORIES = [
  { id: "bvtv", label: "Thuốc bảo vệ thực vật" },
  { id: "phan-bon", label: "Phân bón" },
  { id: "hat-giong", label: "Hạt giống" },
  { id: "dung-cu", label: "Dụng cụ làm vườn" },
];

const PRODUCTS = [
  { id: 1, name: "Oshin 20WP 30gr", price: 41000, categoryId: "bvtv" },
  {
    id: 2,
    name: "Bayer Velum Prime 400SC 100ml",
    price: 285000,
    categoryId: "bvtv",
  },
  { id: 3, name: "PSC Starwiner 2WP 25gr", price: 29000, categoryId: "bvtv" },
  { id: 4, name: "Corteva Indar 250ml", price: 220000, categoryId: "bvtv" },
  { id: 5, name: "Hải Imida Gold 100gr", price: 16000, categoryId: "bvtv" },
  {
    id: 6,
    name: "FMC Prevathon 200SC 100ml",
    price: 183000,
    categoryId: "bvtv",
  },
  { id: 7, name: "Gonik 1.8SL 100ml", price: 66000, categoryId: "phan-bon" },
  {
    id: 8,
    name: "Vinco Pyrolax 250EC 250ml",
    price: 203000,
    categoryId: "phan-bon",
  },
  {
    id: 9,
    name: "Phân bón lá Đầu Trâu 501",
    price: 35000,
    categoryId: "phan-bon",
  },
  {
    id: 10,
    name: "Phân Trùn Quế SFARM 2kg",
    price: 45000,
    categoryId: "phan-bon",
  },
  {
    id: 11,
    name: "NPK 20-20-15 Cò Pháp 1kg",
    price: 28000,
    categoryId: "phan-bon",
  },
  {
    id: 12,
    name: "Hạt giống Rau Muống Cao Sản",
    price: 15000,
    categoryId: "hat-giong",
  },
  {
    id: 13,
    name: "Hạt giống Ớt Chỉ Thiên F1",
    price: 25000,
    categoryId: "hat-giong",
  },
  {
    id: 14,
    name: "Hạt giống Dưa Leo Chịu Nhiệt",
    price: 22000,
    categoryId: "hat-giong",
  },
  {
    id: 15,
    name: "Hạt giống Cải Ngọt Gốc Tím",
    price: 18000,
    categoryId: "hat-giong",
  },
];

// --- 2. HELPER: Vietnamese Keyword Generator ---
const generateKeywords = (str) => {
  // 1. Remove accents (dấu)
  const removeAccents = (s) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const nameLower = str.toLowerCase();
  const nameNoAccents = removeAccents(str);

  // 2. Split into words
  const words = nameLower.split(" ");
  const wordsNoAccent = nameNoAccents.split(" ");

  // 3. Create combinations
  const keywords = [
    ...words,
    ...wordsNoAccent,
    nameNoAccents, // "oshin 20wp"
    str, // "Oshin 20WP"
  ];

  // Remove duplicates and empty strings
  return [...new Set(keywords)].filter((k) => k && k.length > 1);
};

// --- 3. THE COMPONENT ---
export default function SeedButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSeed = async () => {
    setLoading(true);
    setMsg("Starting...");

    try {
      const batch = writeBatch(db);

      // A. Process Categories
      CATEGORIES.forEach((cat) => {
        const docRef = doc(db, "categories", cat.id); // Use ID as Key
        batch.set(docRef, {
          id: cat.id,
          name: cat.label,
          slug: cat.id,
          parentId: null, // Root category
          isActive: true,
          order: 1, // You can manually edit this later
        });
      });

      // B. Process Products
      PRODUCTS.forEach((prod) => {
        // Create a Slug ID (e.g., "oshin-20wp-30gr")
        // Simple slugify: lowercase, remove special chars, replace space with -
        const slug = prod.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "") // remove weird chars
          .replace(/\s+/g, "-");

        const docRef = doc(db, "products", slug);

        batch.set(docRef, {
          id: slug,
          name: prod.name,
          search_name: prod.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""),
          price: prod.price,
          // Use a placeholder image for now
          thumbnail: `https://picsum.photos/seed/${prod.id}/200/200`,

          // ⚡ The Important Stuff ⚡
          categoryId: prod.categoryId,
          categoryIds: [prod.categoryId], // Array for multi-category support
          keywords: generateKeywords(prod.name),

          inStock: true,
          createdAt: new Date().toISOString(),
        });
      });

      await batch.commit();
      setMsg("✅ Success! Check Firebase Console.");
    } catch (e) {
      console.error(e);
      setMsg("❌ Error: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border border-gray-300 rounded m-4 bg-gray-50">
      <h3 className="font-bold mb-2">Admin Tools</h3>
      <button
        onClick={handleSeed}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Seed Database"}
      </button>
      {msg && <p className="mt-2 text-sm font-semibold">{msg}</p>}
    </div>
  );
}
