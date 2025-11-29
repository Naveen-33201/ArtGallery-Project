// src/api/artworks.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export async function fetchArtworks() {
  const res = await axios.get(`${API_BASE_URL}/api/artworks`);
  return res.data;
}

export async function createArtwork(artwork) {
  const res = await axios.post(`${API_BASE_URL}/api/artworks`, artwork);
  return res.data;
}
