// src/pages/UploadArtwork.jsx
import React, { useState } from "react";
import { createArtwork } from "../api/artworks";

export default function UploadArtwork({ onDone }) {
  const [form, setForm] = useState({
    title: "",
    artist: "",
    price: "",
    image: "",
  });
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await createArtwork({
        ...form,
        price: Number(form.price),
      });
      alert("Artwork uploaded to gallery!");
      setForm({ title: "", artist: "", price: "", image: "" });

      // go back to gallery after upload
      if (onDone) onDone();
    } catch (err) {
      console.error("Error uploading artwork:", err);
      alert("Failed to upload artwork");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-2xl font-serif mb-4">Upload Artwork</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border rounded px-3 py-2"
          name="artist"
          placeholder="Artist name"
          value={form.artist}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border rounded px-3 py-2"
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border rounded px-3 py-2"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded bg-black text-white text-sm"
        >
          {saving ? "Uploading..." : "Upload Artwork"}
        </button>
      </form>
    </div>
  );
}
