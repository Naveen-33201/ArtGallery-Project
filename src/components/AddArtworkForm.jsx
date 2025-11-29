import React, { useState } from "react";
import { createArtwork } from "../api/artworks";

export default function AddArtworkForm({ onAdded }) {
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
      alert("Artwork added!");
      setForm({ title: "", artist: "", price: "", image: "" });
      if (onAdded) onAdded();
    } catch (err) {
      console.error("Error adding artwork:", err);
      alert("Failed to add artwork");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          className="border rounded px-3 py-2"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          className="border rounded px-3 py-2"
          name="artist"
          placeholder="Artist"
          value={form.artist}
          onChange={handleChange}
          required
        />
        <input
          className="border rounded px-3 py-2"
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          className="border rounded px-3 py-2 col-span-1 sm:col-span-2"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          required
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 rounded bg-black text-white text-sm"
      >
        {saving ? "Saving..." : "Save Artwork"}
      </button>
    </form>
  );
}
