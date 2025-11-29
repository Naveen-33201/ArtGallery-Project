// src/pages/ManageUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 1. FETCH USERS FROM BACKEND ON LOAD
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // change URL if your backend is on a different port/path
        const res = await axios.get("http://localhost:5000/api/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        alert("Failed to load users from server");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ✅ 2. HANDLE ACTIONS (PROMOTE / BLOCK / DELETE) WITH REAL API CALLS
  const handleAction = async (action, user) => {
    try {
      if (action === "Promote") {
        // Example: promote to Admin (adjust as needed)
        const res = await axios.patch(
          `http://localhost:5000/api/users/${user._id || user.id}/role`,
          { role: "Admin" }
        );
        // update in local state
        setUsers((prev) =>
          prev.map((u) =>
            (u._id || u.id) === (user._id || user.id) ? res.data : u
          )
        );
        alert(`${user.name} promoted to Admin`);
      }

      if (action === "Block") {
        const res = await axios.patch(
          `http://localhost:5000/api/users/${user._id || user.id}/status`,
          { status: "Blocked" }
        );
        setUsers((prev) =>
          prev.map((u) =>
            (u._id || u.id) === (user._id || user.id) ? res.data : u
          )
        );
        alert(`${user.name} has been blocked`);
      }

      if (action === "Delete") {
        const ok = window.confirm(
          `Are you sure you want to delete ${user.name}?`
        );
        if (!ok) return;

        await axios.delete(
          `http://localhost:5000/api/users/${user._id || user.id}`
        );
        setUsers((prev) =>
          prev.filter(
            (u) => (u._id || u.id) !== (user._id || user.id)
          )
        );
        alert(`${user.name} deleted`);
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action.toLowerCase()} user`);
    }
  };

  // ---------- UI ----------

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-serif mb-2">Manage Users</h1>
        <p className="text-sm text-gray-500 mb-4">Loading users...</p>
      </div>
    );
  }

  // if no users, show a friendly message
  if (!users || users.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-serif mb-2">Manage Users</h1>
        <p className="text-sm text-gray-500 mb-4">
          No registered users yet. As people sign up, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-serif">Manage Users</h1>
        <p className="text-sm text-gray-500">
          View and control accounts across the platform. This list is built from real sign-ups.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-500 border-b">
            <tr>
              <th className="py-2 text-left">Name</th>
              <th className="py-2 text-left">Email</th>
              <th className="py-2 text-left">Role</th>
              <th className="py-2 text-left">Status</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id || user.id} className="border-b last:border-0">
                <td className="py-2">{user.name}</td>
                <td className="py-2 text-gray-600">{user.email}</td>
                <td className="py-2">{user.role}</td>
                <td className="py-2">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs ${
                      (user.status || "Active") === "Active"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {user.status || "Active"}
                  </span>
                </td>
                <td className="py-2 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      className="px-2 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50"
                      onClick={() => handleAction("Promote", user)}
                    >
                      Promote
                    </button>
                    <button
                      className="px-2 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50"
                      onClick={() => handleAction("Block", user)}
                    >
                      Block
                    </button>
                    <button
                      className="px-2 py-1 text-xs rounded-md bg-red-50 text-red-700 hover:bg-red-100"
                      onClick={() => handleAction("Delete", user)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
