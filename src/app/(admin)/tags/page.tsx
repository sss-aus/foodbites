"use client";
import { useEffect, useState } from "react";

// Define TypeScript Types
interface Tag {
  id: string;
  name: string;
}

export default function AdminTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagName, setTagName] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  // Fetch Tags from API
  const fetchTags = async () => {
    try {
      const res = await fetch("/api/tags");
      if (!res.ok) throw new Error("Failed to fetch tags");
      const data: Tag[] = await res.json();
      setTags(data);
    } catch (err) {
      console.error("Error fetching tags:", err);
      setError("Failed to load tags. Please try again.");
    }
  };

  // Add or Update Tag
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!tagName.trim()) {
      setError("Tag name is required.");
      setLoading(false);
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/tags/${editingId}` : "/api/tags";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tagName.trim() }),
      });

      if (!res.ok) throw new Error("Failed to save tag");

      fetchTags();
      setTagName("");
      setEditingId(null);
    } catch (err) {
      console.error("Error saving tag:", err);
      setError("Failed to save tag. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Edit Tag
  const handleEdit = (tag: Tag) => {
    setTagName(tag.name);
    setEditingId(tag.id);
  };

  // Delete Tag
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    try {
      const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete tag");

      fetchTags();
    } catch (err) {
      console.error("Error deleting tag:", err);
      setError("Failed to delete tag. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-center text-green-400 mb-6">
        🏷️ Admin Tag Management
      </h1>

      {/* Show Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500 text-white text-center rounded">
          ❌ {error}
        </div>
      )}

      {/* Tag Form */}
      <form
        className="bg-gray-800 p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="name"
          placeholder="Tag Name"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          className="p-3 rounded bg-gray-700 w-full text-white"
          required
        />
        <button
          type="submit"
          className="w-full mt-4 p-3 rounded bg-green-500 hover:bg-green-600 text-gray-900 font-bold transition"
          disabled={loading}
        >
          {loading ? "Saving..." : editingId ? "Update Tag" : "Add Tag"}
        </button>
      </form>

      {/* Tag List */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-center text-yellow-400 mb-4">
          🏷️ Tags
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <div
                key={tag.id}
                className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <h3 className="text-xl font-semibold">{tag.name}</h3>
                <div>
                  <button
                    onClick={() => handleEdit(tag)}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-white mr-2"
                  >
                    ✏ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-white"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No tags found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
