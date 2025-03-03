"use client";
import { useEffect, useState } from "react";

// Define TypeScript Types
interface Category {
  _id: number;
  name: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Categories on Component Mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch Categories from API
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data: Category[] = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again.");
    }
  };

  // Add or Update Category
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/categories/${editingId}` : "/api/categories";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!res.ok) throw new Error("Failed to save category");

      fetchCategories();
      setCategoryName("");
      setEditingId(null);
    } catch (err) {
      console.error("Error saving category:", err);
      setError("Failed to save category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Edit Category
  const handleEdit = (category: Category) => {
    setCategoryName(category.name);
    setEditingId(category._id);
  };

  // Delete Category
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");

      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-center text-green-400 mb-6">
        📂 Admin Category Management
      </h1>

      {/* Show Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500 text-white text-center rounded">
          ❌ {error}
        </div>
      )}

      {/* Category Form */}
      <form
        className="bg-gray-800 p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="p-3 rounded bg-gray-700 w-full text-white"
          required
        />
        <button
          type="submit"
          className="w-full mt-4 p-3 rounded bg-green-500 hover:bg-green-600 text-gray-900 font-bold transition"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : editingId
            ? "Update Category"
            : "Add Category"}
        </button>
      </form>

      {/* Category List */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-center text-yellow-400 mb-4">
          📜 Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category._id}
                className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <h3 className="text-xl font-semibold">{category.name}</h3>
                <div>
                  <button
                    onClick={() => handleEdit(category)}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-white mr-2"
                  >
                    ✏ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-white"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No categories found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
