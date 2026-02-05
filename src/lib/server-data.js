import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export async function getInitialData() {
  try {
    const catQuery = query(
      collection(db, "categories"),
      orderBy("order", "asc"),
    );
    const catSnap = await getDocs(catQuery);

    const prodSnap = await getDocs(collection(db, "products"));

    const categories = catSnap.docs.map((doc) => ({
      ...doc.data(),
      createdAt: doc.data().createdAt ? doc.data().createdAt.toString() : null,
    }));

    const products = prodSnap.docs.map((doc) => ({
      ...doc.data(),
      createdAt: doc.data().createdAt ? doc.data().createdAt.toString() : null,
    }));

    return { categories, products };
  } catch (error) {
    console.error("Server Fetch Error:", error);
    return { categories: [], products: [] };
  }
}
