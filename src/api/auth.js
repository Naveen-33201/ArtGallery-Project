// src/api/auth.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export async function signupUser({ name, password, role }) {
  const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
    name,
    password,
    role,
  });
  return res.data; // { id, name, role }
}

export async function loginUser({ name, password, role }) {
  const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
    name,
    password,
    role,
  });
  return res.data; // { id, name, role }
}
