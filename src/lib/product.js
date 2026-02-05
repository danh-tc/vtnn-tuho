import { db } from "./firebase";
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, Timestamp, query, orderBy } from "firebase/firestore";

function generateSlug(name = "") {
  return name
    .toLowerCase()
    .trim()
    .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
    .replace(/ì|í|ị|ỉ|ĩ/g, "i")
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createProduct(productData) {
  try {
    const productId = productData.id?.trim() || generateSlug(productData.name);
    if (!productId) {
      throw new Error("Vui lòng nhập mã sản phẩm");
    }

    const productRef = doc(db, "products", productId);
    const existing = await getDoc(productRef);
    if (existing.exists()) {
      throw new Error("Mã sản phẩm đã tồn tại");
    }

    const payload = {
      name: productData.name?.trim() || "",
      price: Number(productData.price) || 0,
      thumbnail: productData.thumbnail || "",
      images: productData.images || [],
      inStock: productData.inStock ?? true,
      primaryCategoryId: productData.primaryCategoryId || "",
      categoryIds: productData.categoryIds || [],
      shortDescription: productData.shortDescription?.trim() || "",
      activeIngredient: productData.activeIngredient?.trim() || "",
      uses: productData.uses?.trim() || "",
      dosage: productData.dosage?.trim() || "",
      target: productData.target?.trim() || "",
      packaging: productData.packaging?.trim() || "",
      manufacturer: productData.manufacturer?.trim() || "",
      origin: productData.origin?.trim() || "",
      content: productData.content || "",
      search_name: (productData.name || "").toLowerCase().trim(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(productRef, payload);
    return { id: productId, ...payload };
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function getAllProducts() {
  try {
    if (!db) {
      console.warn('Firebase not initialized, returning empty products');
      return [];
    }
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt?.toString() || "",
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt?.toString() || "",
      };
    });
  } catch (error) {
    console.error("Error getting products:", error);
    throw error;
  }
}

export async function getProductById(productId) {
  try {
    if (!db) {
      console.warn('Firebase not initialized');
      return null;
    }
    const productRef = doc(db, "products", productId);
    const productDoc = await getDoc(productRef);
    
    if (!productDoc.exists()) {
      throw new Error("Sản phẩm không tồn tại");
    }
    
    const data = productDoc.data();
    return {
      id: productDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt?.toString() || "",
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt?.toString() || "",
    };
  } catch (error) {
    console.error("Error getting product:", error);
    throw error;
  }
}

export async function updateProduct(productId, productData) {
  try {
    const productRef = doc(db, "products", productId);
    const existing = await getDoc(productRef);
    
    if (!existing.exists()) {
      throw new Error("Sản phẩm không tồn tại");
    }

    const payload = {
      name: productData.name?.trim() || "",
      price: Number(productData.price) || 0,
      thumbnail: productData.thumbnail || "",
      images: productData.images || [],
      inStock: productData.inStock ?? true,
      primaryCategoryId: productData.primaryCategoryId || "",
      categoryIds: productData.categoryIds || [],
      shortDescription: productData.shortDescription?.trim() || "",
      activeIngredient: productData.activeIngredient?.trim() || "",
      uses: productData.uses?.trim() || "",
      dosage: productData.dosage?.trim() || "",
      target: productData.target?.trim() || "",
      packaging: productData.packaging?.trim() || "",
      manufacturer: productData.manufacturer?.trim() || "",
      origin: productData.origin?.trim() || "",
      content: productData.content || "",
      search_name: (productData.name || "").toLowerCase().trim(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(productRef, payload, { merge: true });
    return { id: productId, ...payload };
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

export async function deleteProduct(productId) {
  try {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}