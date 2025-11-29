// src/components/TopNav.jsx
import React from 'react'

export default function TopNav({ role, onOpenMenu, onLogout }) {
  const isVisitor = role === 'Visitor'

  return (
    <header className="flex items-center justify-between bg-white border-b px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Simple hamburger icon using text */}
        <button
          onClick={onOpenMenu}
          className="text-gray-600 hover:text-black text-xl leading-none"
        >
          ☰
        </button>
        <h1 className="text-lg font-semibold">
          Museo <span className="text-gray-400">Virtual Gallery</span>
        </h1>
      </div>

      {/* Hide these for Visitors */}
      {!isVisitor && (
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <button className="hover:text-black">Exhibitions</button>
          <button className="hover:text-black">Tours</button>
          <button className="hover:text-black">Explore</button>
        </nav>
      )}

      <div className="flex items-center gap-4">
        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
          {role}
        </span>
        <button
          onClick={onLogout}
          className="text-red-500 hover:underline text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
