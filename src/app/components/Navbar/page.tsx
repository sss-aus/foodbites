"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

const MenuNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Navbar */}
      <div className=" bg-[#202020] shadow p-4 flex items-center justify-between ">
        <div className="text-2xl font-bold">Burger Singh</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="bg-[#303030] shadow p-4">
          <nav className="flex flex-col space-y-2">
            <Link href="/dashboard">
              <span className="block px-4 py-2 hover:bg-[#abc8a2] hover:text-black rounded">
                Dashboard
              </span>
            </Link>
            <Link href="/profile">
              <span className="block px-4 py-2 hover:bg-[#abc8a2] hover:text-black rounded">
                Profile
              </span>
            </Link>
            <Link href="/products">
              <span className="block px-4 py-2 hover:bg-[#abc8a2] hover:text-black rounded">
                Products
              </span>
            </Link>

            <Link href="/logout">
              <span className="block px-4 py-2 hover:bg-[#abc8a2] rounded">
                Logout
              </span>
            </Link>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar Navbar */}
      {/* <aside className="hidden md:flex md:flex-col md:w-64 md:h-screen md:fixed md:left-0 md:top-0  shadow p-6 bg-white ">
        <div className="mb-8 text-2xl font-bold">Sentree</div>
        <nav className="flex flex-col space-y-4">
          <Link
            href="/dashboard"
            className="block px-4 py-2 hover:bg-[#abc8a2] hover:text-black rounded"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/profile"
            className="block px-4 py-2 hover:bg-[#abc8a2] hover:text-black rounded"
          >
            Profile
          </Link>
          <Link
            href="/dashboard/settings"
            className="block px-4 py-2 hover:bg-[#abc8a2] hover:text-black rounded"
          >
            Settings
          </Link>
          <Link
            href="/dashboard/reports"
            className="block px-4 py-2 hover:bg-[#abc8a2] hover:text-black rounded"
          >
            Reports
          </Link>
          <Link
            href="/logout"
            className="block px-4 py-2 hover:bg-[#abc8a2s] hover:text-black rounded"
          >
            Logout
          </Link>
        </nav>
      </aside> */}
    </>
  );
};

export default MenuNavbar;
