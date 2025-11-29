// src/pages/AdminPanel.jsx
import React from "react";
import { homeArtworks, museumArtworks } from "../data/mock";

export default function AdminPanel() {
  // demo stats (static for now)
  const totalArtworks = homeArtworks.length + museumArtworks.length;
  const totalArtists = 8;
  const totalUsers = 120;
  const totalSales = 42;
  const totalRevenue = 275000; // ₹

  const recentSales = [
    { id: "s1", artwork: "Golden Hour", buyer: "Rahul Mehta", amount: 8500, status: "Paid" },
    { id: "s2", artwork: "Marrow of the Sky", buyer: "Ananya Rao", amount: 12600, status: "Paid" },
    { id: "s3", artwork: "Quiet Geometry", buyer: "Studio Nine", amount: 9900, status: "Refunded" },
  ];

  const pendingArtists = [
    { id: "a1", name: "Ishita Verma", portfolio: "ishita.artfolio.com" },
    { id: "a2", name: "Karan Patel", portfolio: "karan-pixelspace.com" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-serif">Admin Panel</h1>
        <p className="text-sm text-gray-500">
          Overview of activity across Museo Virtual Gallery.
        </p>
      </header>

      {/* STATS CARDS */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={totalUsers} />
        <StatCard label="Artists" value={totalArtists} />
        <StatCard label="Artworks" value={totalArtworks} />
        <StatCard label="Total Sales" value={totalSales} />
      </section>

      {/* REVENUE & QUICK ACTIONS */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:col-span-2">
          <h2 className="font-semibold mb-2">Revenue (demo)</h2>
          <p className="text-3xl font-semibold">
            ₹ {totalRevenue.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            This is just static demo data. Later you can connect it to your backend / database.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold mb-3">Quick Actions</h2>
          <div className="space-y-2 text-sm">
            <button className="w-full px-3 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800">
              Review new artworks
            </button>
            <button className="w-full px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50">
              View all users
            </button>
            <button className="w-full px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50">
              Check payouts
            </button>
          </div>
        </div>
      </section>

      {/* RECENT SALES + PENDING ARTISTS */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Recent sales table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold mb-3">Recent Sales (demo)</h2>
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-500 border-b">
              <tr>
                <th className="py-2 text-left">Artwork</th>
                <th className="py-2 text-left">Buyer</th>
                <th className="py-2 text-right">Amount</th>
                <th className="py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale) => (
                <tr key={sale.id} className="border-b last:border-0">
                  <td className="py-2">{sale.artwork}</td>
                  <td className="py-2 text-gray-600">{sale.buyer}</td>
                  <td className="py-2 text-right">
                    ₹ {sale.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-2 text-right text-xs">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full ${
                        sale.status === "Paid"
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pending artist approvals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold mb-3">Pending Artist Approvals</h2>
          <p className="text-xs text-gray-500 mb-3">
            In a real app, these would come from your backend.
          </p>
          <div className="space-y-3 text-sm">
            {pendingArtists.map((artist) => (
              <div
                key={artist.id}
                className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2"
              >
                <div>
                  <p className="font-medium">{artist.name}</p>
                  <p className="text-xs text-gray-500">{artist.portfolio}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-xs rounded-md bg-gray-900 text-white hover:bg-gray-800">
                    Approve
                  </button>
                  <button className="px-3 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
        {label}
      </p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}