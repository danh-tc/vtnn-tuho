import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function getInitialData() {
  try {
    // Get all categories without orderBy to ensure all documents are fetched
    const catSnap = await getDocs(collection(db, "categories"));
    const prodSnap = await getDocs(collection(db, "products"));

    const categories = catSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt ? doc.data().createdAt.toString() : null,
      updatedAt: doc.data().updatedAt ? doc.data().updatedAt.toString() : null,
    }));

    const products = prodSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt ? doc.data().createdAt.toString() : null,
      updatedAt: doc.data().updatedAt ? doc.data().updatedAt.toString() : null,
    }));

    return { categories, products };
  } catch (error) {
    console.error("Server Fetch Error:", error);
    return { categories: [], products: [] };
  }
}
