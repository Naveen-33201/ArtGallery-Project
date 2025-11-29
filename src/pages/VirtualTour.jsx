// src/pages/VirtualTour.jsx
import React, { useState, useEffect } from "react";
import { fetchArtworks } from "../api/artworks";

export default function VirtualTour({ onOpenArtwork }) {
  const [artworks, setArtworks] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchArtworks();
        setArtworks(data || []);
        setIndex(0);
      } catch (err) {
        console.error("Error loading tour artworks:", err);
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-gray-600">Loading virtual tour...</p>
      </div>
    );
  }

  if (!artworks || artworks.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-gray-600">
          No artworks available for the virtual tour.
        </p>
      </div>
    );
  }

  const total = artworks.length;
  const current = artworks[index];

  const next = () => setIndex((prev) => (prev + 1) % total);
  const prev = () => setIndex((prev) => (prev - 1 + total) % total);

  // Just to feel like museum rooms
  const rooms = [
    "Entrance Hall",
    "Main Gallery",
    "Sculpture Room",
    "East Wing",
    "Heritage Gallery",
  ];
  const currentRoom = rooms[index % rooms.length];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-900/90 p-4 md:p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-b bg-slate-50">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl">Virtual Museum Tour</h2>
            <p className="text-xs md:text-sm text-slate-500">
              Artwork {index + 1} of {total} • {currentRoom}
            </p>
          </div>
          <span className="mt-2 md:mt-0 inline-flex items-center text-xs px-3 py-1 rounded-full bg-slate-900 text-white">
            Guided Story Experience
          </span>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-6 px-6 py-6 md:py-8">
          {/* Artwork image */}
          <div className="relative bg-slate-100 rounded-xl overflow-hidden border">
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-72 md:h-96 object-cover"
            />
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
              Step {index + 1}/{total}
            </div>
          </div>

          {/* Text details */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                You are now in
              </p>
              <p className="text-sm font-semibold text-slate-800 mb-2">
                {currentRoom}
              </p>

              <h3 className="font-serif text-xl md:text-2xl">
                {current.title}
              </h3>

              <p className="text-sm text-slate-600 mt-1">
                by{" "}
                <span className="font-medium text-slate-900">
                  {current.artist}
                </span>
                {current.year && (
                  <span className="text-slate-400"> • {current.year}</span>
                )}
              </p>

              {current.price && (
                <p className="text-lg font-semibold text-slate-900 mt-2">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(current.price)}
                </p>
              )}
            </div>

            {/* Story section */}
            <div className="mt-2">
              <h4 className="text-sm font-semibold text-slate-800 mb-1">
                Story behind this artwork
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {current.story ||
                  "This artwork is part of the curated museum tour. It represents the emotions and ideas chosen by the curator for this digital gallery experience."}
              </p>
            </div>

            {onOpenArtwork && (
              <div className="pt-2">
                <button
                  onClick={() => onOpenArtwork(current)}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-800 hover:bg-slate-50"
                >
                  View technical details
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 pb-5 flex items-center justify-between border-t bg-slate-50">
          <button
            onClick={prev}
            className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-white"
          >
            ← Previous artwork
          </button>

          <div className="flex gap-2">
            {artworks.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full ${
                  i === index ? "bg-slate-900" : "bg-slate-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="px-4 py-2 rounded-lg border border-slate-900 bg-slate-900 text-white text-sm font-medium hover:bg-black"
          >
            Next artwork →
          </button>
        </div>
      </div>
    </div>
  );
}
