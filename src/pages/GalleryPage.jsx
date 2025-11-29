// src/pages/GalleryPage.jsx
import React, { useEffect, useState } from "react";
import ArtworkCard from "../components/ArtworkCard";
import { fetchArtworks } from "../api/artworks";

export default function GalleryPage({ onOpen, role }) {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadArtworks() {
    try {
      const data = await fetchArtworks();
      setArtworks(data || []);
    } catch (err) {
      console.error("Error loading artworks:", err);
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArtworks();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h3 className="font-serif text-2xl mb-4">Gallery</h3>
        <p>Loading artworks...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-2xl">Gallery</h3>
        <div className="text-sm text-gray-500">Grid view • Sort • Filters</div>
      </div>

      {artworks.length === 0 ? (
        <p>No artworks yet. Ask an artist to upload one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((a) => (
            <ArtworkCard key={a._id} art={a} onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  );
}
