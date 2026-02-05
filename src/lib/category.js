import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

/**
 * Get all categories
 */
export async function getAllCategories() {
  try {
    if (!db) {
      console.warn('Firebase not initialized, returning empty categories');
      return [];
    }
    const categoriesRef = collection(db, "categories");
    const querySnapshot = await getDocs(categoriesRef);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

/**
 * Get single category by ID
 */
export async function getCategoryById(categoryId) {
  try {
    if (!db) {
      console.warn('Firebase not initialized');
      return null;
    }
    const categoryRef = doc(db, "categories", categoryId);
    const docSnapshot = await getDoc(categoryRef);
    if (docSnapshot.exists()) {
      return {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
}

/**
 * Create new category
 */
export async function createCategory(categoryData) {
  try {
    // Check if slug already exists
    if (categoryData.slug) {
      const q = query(
        collection(db, "categories"),
        where("slug", "==", categoryData.slug)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        throw new Error("Slug đã được sử dụng");
      }
    }

    const categoriesRef = collection(db, "categories");
    const newCategory = {
      name: categoryData.name.trim(),
      description: categoryData.description?.trim() || "",
      slug: categoryData.slug?.trim() || generateSlug(categoryData.name),
      image: categoryData.image || "",
      parentId: categoryData.parentId || null,
      isActive: categoryData.isActive ?? true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(categoriesRef, newCategory);
    return {
      id: docRef.id,
      ...newCategory,
    };
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

/**
 * Update category
 */
export async function updateCategory(categoryId, categoryData) {
  try {
    // If slug is being changed, check for duplicates
    if (categoryData.slug) {
      const q = query(
        collection(db, "categories"),
        where("slug", "==", categoryData.slug)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty && querySnapshot.docs[0].id !== categoryId) {
        throw new Error("Slug đã được sử dụng");
      }
    }

    const categoryRef = doc(db, "categories", categoryId);
    const updateData = {
      name: categoryData.name.trim(),
      description: categoryData.description?.trim() || "",
      slug: categoryData.slug?.trim() || generateSlug(categoryData.name),
      image: categoryData.image || "",
      parentId: categoryData.parentId || null,
      isActive: categoryData.isActive ?? true,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(categoryRef, updateData);
    return {
      id: categoryId,
      ...updateData,
    };
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

/**
 * Delete category
 */
export async function deleteCategory(categoryId) {
  try {
    // Check if category has children
    const q = query(
      collection(db, "categories"),
      where("parentId", "==", categoryId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("Không thể xóa danh mục có danh mục con");
    }

    const categoryRef = doc(db, "categories", categoryId);
    await deleteDoc(categoryRef);
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

/**
 * Generate slug from name
 * Removes Vietnamese diacritics and special characters
 * Replaces spaces with hyphens
 */
function generateSlug(name) {
  if (!name) return "";
  
  let str = name.toLowerCase().trim();
  
  // Vietnamese to ASCII mapping
  const vietnameseMap = {
    'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
    'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
    'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
    'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
    'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
    'đ': 'd'
  };
  
  // Replace each Vietnamese character
  str = str.split('').map(char => vietnameseMap[char] || char).join('');
  
  // Remove all non-alphanumeric characters except spaces and hyphens
  str = str.replace(/[^a-z0-9\s-]/g, '');
  
  // Replace spaces and underscores with hyphens
  str = str.replace(/[\s_]+/g, '-');
  
  // Replace multiple consecutive hyphens with single hyphen
  str = str.replace(/-+/g, '-');
  
  // Remove leading/trailing hyphens
  str = str.replace(/^-+|-+$/g, '');
  
  return str;
}
