"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

// Define TypeScript Types for MongoDB
interface Category {
  _id: string; // MongoDB uses _id instead of id
  name: string;
}

interface MenuItem {
  _id: string; // MongoDB uses _id instead of id
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string; // Ensure this matches MongoDB schema
}

export default function AdminMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryId: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Menu Items & Categories on mount
  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch("/api/menu");
      if (!res.ok) throw new Error("Failed to fetch menu items");
      const data: MenuItem[] = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError("Failed to load menu items. Please try again.");
    }
  };

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

  // Handle input changes for the form
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or Update Menu Item
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.categoryId
    ) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/menu/${editingId}` : "/api/menu";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl || "",
          categoryId: formData.categoryId,
        }),
      });

      if (!res.ok) throw new Error("Failed to save menu item");

      fetchMenuItems();
      // Clear the form
      setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        categoryId: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error("Error saving menu item:", err);
      setError("Failed to save menu item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Populate form for editing
  const handleEdit = (item: MenuItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      imageUrl: item.imageUrl,
      categoryId: item.categoryId,
    });
    setEditingId(item._id);
  };

  // Delete a menu item
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete menu item");

      fetchMenuItems();
    } catch (err) {
      console.error("Error deleting menu item:", err);
      setError("Failed to delete menu item. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-center text-green-400 mb-6">
        🍔 Admin Menu Management
      </h1>

      {/* Show Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500 text-white text-center rounded">
          ❌ {error}
        </div>
      )}

      {/* Menu Form */}
      <form
        className="bg-gray-800 p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded bg-gray-700 w-full text-white"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="p-3 rounded bg-gray-700 w-full text-white"
            required
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            className="p-3 rounded bg-gray-700 w-full text-white"
          />
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="p-3 rounded bg-gray-700 w-full text-white"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="p-3 rounded bg-gray-700 w-full mt-4 text-white"
          required
        ></textarea>
        <button
          type="submit"
          className="w-full mt-4 p-3 rounded bg-green-500 hover:bg-green-600 text-gray-900 font-bold transition"
          disabled={loading}
        >
          {loading ? "Saving..." : editingId ? "Update Item" : "Add Item"}
        </button>
      </form>

      {/* Menu List */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-center text-yellow-400 mb-4">
          📜 Menu Items
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="bg-gray-800 p-4 rounded-lg shadow-md"
            >
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={300}
                  height={200}
                  className="w-full h-32 object-cover rounded"
                />
              ) : (
                <div className="w-full h-32 bg-gray-700 flex items-center justify-center text-gray-400 rounded">
                  No Image
                </div>
              )}
              <h3 className="text-xl font-semibold mt-2">{item.name}</h3>
              <p className="text-gray-400">{item.description}</p>
              <p className="text-green-300 font-bold">
                ${item.price.toFixed(2)}
              </p>
              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
