import type { Metadata } from "next";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import AdminNavbar from "../components/Adminnav/page";

// Metadata for SEO
export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Online Menu Admin Panel",
};

// Define TypeScript Props
interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Await cookies() before using .get()
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth_token")?.value;

  if (!authCookie) {
    redirect("/login");
  }

  try {
    const decoded = jwt.verify(
      authCookie,
      process.env.JWT_SECRET as string
    ) as { role: string };

    if (decoded.role !== "admin") {
      redirect("/login");
    }
  } catch {
    redirect("/login");
  }

  return (
    <div>
      <AdminNavbar />
      <main>{children}</main>
    </div>
  );
}
