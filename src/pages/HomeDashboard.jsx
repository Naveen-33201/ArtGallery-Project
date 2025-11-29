import React, { useEffect, useState } from "react";
import ArtworkCard from "../components/ArtworkCard";
import { fetchArtworks } from "../api/artworks";

export default function HomeDashboard({ onOpenArtwork, role, onStartTour }) {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  // Only Artist and Admin can see Quick Actions
  const canSeeQuickActions = role === "Artist" || role === "Admin";

  useEffect(() => {
    async function load() {
      try {
        const all = await fetchArtworks();
        // take first 3 artworks as "featured"
        setFeatured(all.slice(0, 3));
      } catch (err) {
        console.error("Error loading featured artworks:", err);
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="font-serif text-3xl mb-2">Featured Exhibition</h2>
        <p>Loading artworks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-gradient-to-tr from-white via-gray-50 to-beige rounded-xl p-6 shadow-sm border border-gray-50">
          <h2 className="font-serif text-3xl mb-2">Featured Exhibition</h2>
          <p className="text-gray-600">
            A curated glimpse of our current highlights. Take the virtual tour
            or explore pieces below.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featured.map((a) => (
              <div
                key={a._id}
                className="p-4 rounded-md bg-white border cursor-pointer"
                onClick={() => onOpenArtwork(a)}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={a.image}
                    className="w-24 h-16 object-cover rounded"
                    alt={a.title}
                  />
                  <div>
                    <div className="font-semibold">{a.title}</div>
                    <div className="text-xs text-gray-500">{a.artist}</div>
                    <div className="mt-2 text-sm">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(a.price)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {featured.length === 0 && (
              <p className="text-sm text-gray-500">
                No artworks yet. Ask an artist to upload some!
              </p>
            )}
          </div>
        </div>

        {canSeeQuickActions && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-50">
            <h3 className="font-serif text-lg">Quick Actions</h3>
            <div className="mt-4 grid gap-3">
              <button
                className="text-left p-3 rounded-md hover:bg-gray-50"
                onClick={onStartTour}
              >
                Start Virtual Tour
              </button>
              <button className="text-left p-3 rounded-md hover:bg-gray-50">
                Organize Exhibition
              </button>
              <button
                className="text-left p-3 rounded-md hover:bg-gray-50"
                onClick={() => console.log("Navigate to upload from here")}
              >
                Upload Artwork
              </button>
            </div>
          </div>
        )}
      </section>

      <section>
        <h3 className="font-serif text-xl mb-4">Ongoing Exhibitions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((a) => (
            <ArtworkCard key={a._id} art={a} onOpen={onOpenArtwork} />
          ))}
          {featured.length === 0 && (
            <p className="text-sm text-gray-500">
              No exhibitions yet. Upload artworks to populate this section.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
