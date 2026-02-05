import EditCategory from "@/components/admin/categories/EditCategory";
import { getAllCategories } from "@/lib/category";

export const metadata = {
  title: "Chỉnh sửa danh mục | Admin",
};

export async function generateStaticParams() {
  try {
    const categories = await getAllCategories();
    return categories.map((category) => ({
      id: category.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function EditCategoryPage() {
  return <EditCategory />;
}
