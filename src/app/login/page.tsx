"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Define TypeScript Type for form data
interface FormData {
  username: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to login");

      const data = await res.json();

      if (data.status === 200) {
        router.push("/admin"); // Redirect to Admin Dashboard
      } else {
        setError(data.msg || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-green-400 text-center">
          Admin Login
        </h1>

        {error && <p className="text-red-400 text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded bg-gray-700 mb-3 text-white"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-gray-700 mb-3 text-white"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-green-500 hover:bg-green-600 rounded font-bold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
