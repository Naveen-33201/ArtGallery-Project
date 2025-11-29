// src/api/orders.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export async function createOrder(order) {
  const res = await axios.post(`${API_BASE_URL}/api/orders`, order);
  return res.data;
}

export async function fetchOrders() {
  const res = await axios.get(`${API_BASE_URL}/api/orders`);
  return res.data;
}
