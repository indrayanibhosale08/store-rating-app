import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

export default function AdminDashboard() {
  // 1. All State Variables
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [dataList, setDataList] = useState([]);
  const [view, setView] = useState("users"); // 'users' or 'stores'
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState({ key: "name", dir: "asc" });

  // States for the Add Store form
  const [showForm, setShowForm] = useState(false);
  const [storeData, setStoreData] = useState({
    name: "",
    email: "",
    address: "",
  });

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  // 2. Fetch Logic
  const fetchStats = () => {
    axios
      .get("http://localhost:5000/api/admin/stats", config)
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error fetching stats", err));
  };

  const fetchListData = () => {
    axios
      .get(`http://localhost:5000/api/admin/${view}`, config)
      .then((res) => setDataList(res.data))
      .catch((err) => console.error("Error fetching list", err));
  };

  
  const [showUserForm, setShowUserForm] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "User",
  });

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/admin/add-user",
        userData,
        config,
      );
      alert("User Created!");
      setShowUserForm(false);
      fetchStats();
      fetchListData();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };
  useEffect(() => {
    fetchStats();
    fetchListData();
  }, [view]);

  // 3. Action Handlers
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role: newRole },
        config,
      );
      alert("Role updated successfully!");
      fetchListData();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/add-store",
        storeData,
        config,
      );
      alert(res.data.message);
      setStoreData({ name: "", email: "", address: "" }); // Reset form
      setShowForm(false); // Hide form
      fetchListData();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add store");
    }
  };

  // 4. Sorting and Filtering Logic
  const processedData = useMemo(() => {
    return [...dataList]
      .filter(
        (i) =>
          (i.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (i.email || "").toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => {
        const valA = a[sort.key] || "";
        const valB = b[sort.key] || "";
        if (sort.dir === "asc") {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
  }, [dataList, searchTerm, sort]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">
            System Administrator
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 rounded-xl transition shadow-md"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
          <div className="bg-white p-6 shadow-sm rounded-2xl border-b-4 border-blue-500">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Total Users
            </p>
            <p className="text-3xl font-black text-gray-800">
              {stats.totalUsers}
            </p>
          </div>
          <div className="bg-white p-6 shadow-sm rounded-2xl border-b-4 border-green-500">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Total Stores
            </p>
            <p className="text-3xl font-black text-gray-800">
              {stats.totalStores}
            </p>
          </div>
          <div className="bg-white p-6 shadow-sm rounded-2xl border-b-4 border-purple-500">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Total Ratings
            </p>
            <p className="text-3xl font-black text-gray-800">
              {stats.totalRatings}
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border">
            <button
              onClick={() => setView("users")}
              className={`px-6 py-2 rounded-lg font-bold transition ${
                view === "users"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setView("stores")}
              className={`px-6 py-2 rounded-lg font-bold transition ${
                view === "stores"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Stores
            </button>
          </div>

          <div className="relative flex-1 w-full">
            <input
              className="w-full border-none shadow-sm p-3 pl-10 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={`Search ${view} by name or email...`}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-3 top-3 opacity-30">🔍</span>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-green-700 transition w-full md:w-auto"
          >
            {showForm ? "Cancel" : "+ Add New Store"}
          </button>
          <button
            onClick={() => setShowUserForm(!showUserForm)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition w-full md:w-auto"
          >
            {showUserForm ? "Cancel" : "+ Add New User"}
          </button>
        </div>

        {/* Add Store Form (Conditional) */}
        {showForm && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 mb-8 transition-all">
            <h3 className="text-lg font-black mb-4 text-green-700">
              Register a New Store
            </h3>
            <form
              onSubmit={handleAddStore}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Store Name (20-60 chars)
                </label>
                <input
                  className="w-full p-3 bg-gray-50 border rounded-xl mt-1 outline-none focus:ring-2 focus:ring-green-400"
                  value={storeData.name}
                  onChange={(e) =>
                    setStoreData({ ...storeData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Store Email
                </label>
                <input
                  type="email"
                  className="w-full p-3 bg-gray-50 border rounded-xl mt-1 outline-none focus:ring-2 focus:ring-green-400"
                  value={storeData.email}
                  onChange={(e) =>
                    setStoreData({ ...storeData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Store Address (Max 400)
                </label>
                <input
                  className="w-full p-3 bg-gray-50 border rounded-xl mt-1 outline-none focus:ring-2 focus:ring-green-400"
                  value={storeData.address}
                  onChange={(e) =>
                    setStoreData({ ...storeData, address: e.target.value })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="md:col-span-3 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition mt-2"
              >
                Confirm and Add Store
              </button>
            </form>
          </div>
        )}
        {showUserForm && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 mb-8">
            <h3 className="text-lg font-black mb-4 text-blue-700">
              Create New User Account
            </h3>
            <form
              onSubmit={handleAddUser}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <input
                className="p-3 border rounded-xl"
                placeholder="Full Name (20-60)"
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                required
              />
              <input
                className="p-3 border rounded-xl"
                type="email"
                placeholder="Email"
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                required
              />
              <input
                className="p-3 border rounded-xl"
                type="password"
                placeholder="Password (8-16, 1 Up, 1 Spec)"
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                required
              />
              <input
                className="p-3 border rounded-xl"
                placeholder="Address"
                onChange={(e) =>
                  setUserData({ ...userData, address: e.target.value })
                }
                required
              />
              <select
                className="p-3 border rounded-xl"
                onChange={(e) =>
                  setUserData({ ...userData, role: e.target.value })
                }
              >
                <option value="User">User</option>
                <option value="StoreOwner">StoreOwner</option>
                <option value="Admin">Admin</option>
              </select>
              <button className="bg-blue-900 text-white font-bold py-3 rounded-xl">
                Create Account
              </button>
            </form>
          </div>
        )}
        {/* Data Table */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th
                  className="p-5 cursor-pointer hover:bg-gray-800 transition text-xs font-bold uppercase tracking-widest"
                  onClick={() =>
                    setSort({
                      key: "name",
                      dir: sort.dir === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  Name{" "}
                  {sort.key === "name"
                    ? sort.dir === "asc"
                      ? "🔼"
                      : "🔽"
                    : "↕️"}
                </th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest">
                  Email
                </th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest text-center">
                  {view === "users" ? "Role Authority" : "Overall Rating"}
                </th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest">
                  Address
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {processedData.length > 0 ? (
                processedData.map((item, i) => (
                  <tr key={item._id} className="hover:bg-blue-50/50 transition">
                    <td className="p-5 font-bold text-gray-800">{item.name}</td>
                    <td className="p-5 text-gray-600">{item.email}</td>
                    <td className="p-5 text-center">
                      {view === "users" ? (
                        <select
                          value={item.role}
                          onChange={(e) =>
                            handleRoleChange(item._id, e.target.value)
                          }
                          className="bg-blue-50 text-blue-700 p-2 rounded-lg font-black text-xs outline-none border border-blue-100 focus:ring-2 focus:ring-blue-400 cursor-pointer"
                        >
                          <option value="User">User</option>
                          <option value="Admin">Admin</option>
                          <option value="StoreOwner">StoreOwner</option>
                        </select>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-black text-sm">
                          ⭐ {item.rating || 0}
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-sm text-gray-400 italic">
                      {item.address}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-10 text-center text-gray-400 italic"
                  >
                    No data found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
