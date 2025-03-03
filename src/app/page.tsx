"use client";
import Image from "next/image";

export default function Hero() {
  return (
    <div>
      <section className="relative h-screen flex justify-center items-center text-white text-center px-8">
        {/* Background Image */}
        <Image
          src="/s.jpg" // Ensure this file exists in your public folder
          alt="Burger Background"
          fill
          priority
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Main Content */}
        <div className="relative z-10 max-w-3xl p-1">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg p-2">
            Burger Bites
          </h1>
          <p className="text-xl mt-4 font-medium drop-shadow-md">
            Indulge in the ultimate burger experience – fresh, juicy, and
            irresistible!
          </p>
          <a
            href="/menu"
            className="inline-block mt-6 px-6 py-3 rounded-full text-lg font-semibold bg-gradient-to-r from-green-400 to-green-600 text-gray-900 shadow-lg transition-all duration-300 hover:shadow-xl hover:from-green-300 hover:to-green-500"
          >
            🍽 View Menu
          </a>
        </div>
      </section>
    </div>
  );
}
