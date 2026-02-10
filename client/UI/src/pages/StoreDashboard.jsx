import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

export default function StoreDashboard() {
  const [storeInfo, setStoreInfo] = useState(null);
  const [raters, setRaters] = useState([]);
  const [sort, setSort] = useState({ key: "createdAt", dir: "desc" });
  const [loading, setLoading] = useState(true);

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/store/my-stats",
          config,
        );
        setStoreInfo(res.data.store);
        setRaters(res.data.raters);
      } catch (err) {
        console.error("Error fetching store stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sorting Logic for the Ratings Table
  const sortedRaters = useMemo(() => {
    return [...raters].sort((a, b) => {
      const valA = sort.key === "name" ? a.user.name : a[sort.key];
      const valB = sort.key === "name" ? b.user.name : b[sort.key];
      if (sort.dir === "asc") return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });
  }, [raters, sort]);

  if (loading)
    return (
      <div className="p-10 text-center font-bold">Loading Store Data...</div>
    );

  if (!storeInfo)
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-gray-800">No Store Assigned</h2>
        <p className="text-gray-500 mt-2">
          Please contact the Admin to link your account to a store.
        </p>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="mt-4 text-blue-600 underline"
        >
          Logout
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              {storeInfo.name}
            </h1>
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mt-1">
              Store Owner Management
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-8 rounded-3xl shadow-sm border text-center">
            <p className="text-gray-400 font-bold text-xs uppercase mb-2">
              Average Rating
            </p>
            <p className="text-6xl font-black text-blue-600">
              ⭐ {storeInfo.rating || 0}
            </p>
          </div>
          <div className="bg-blue-600 p-8 rounded-3xl shadow-sm text-white text-center">
            <p className="opacity-70 font-bold text-xs uppercase mb-2">
              Total Reviews
            </p>
            <p className="text-6xl font-black">{raters.length}</p>
          </div>
        </div>

        {/* Ratings Table */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="font-black text-gray-800 text-xl">
              Customer Feedback
            </h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th
                  className="p-6 cursor-pointer hover:text-blue-600"
                  onClick={() =>
                    setSort({
                      key: "name",
                      dir: sort.dir === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  User Name{" "}
                  {sort.key === "name"
                    ? sort.dir === "asc"
                      ? "🔼"
                      : "🔽"
                    : ""}
                </th>
                <th
                  className="p-6 text-center cursor-pointer hover:text-blue-600"
                  onClick={() =>
                    setSort({
                      key: "rating",
                      dir: sort.dir === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  Rating{" "}
                  {sort.key === "rating"
                    ? sort.dir === "asc"
                      ? "🔼"
                      : "🔽"
                    : ""}
                </th>
                <th className="p-6">Review Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sortedRaters.map((r, i) => (
                <tr key={i} className="hover:bg-blue-50/50 transition">
                  <td className="p-6 font-bold text-gray-700">
                    {r.user?.name || "Anonymous"}
                  </td>
                  <td className="p-6 text-center">
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-black text-sm">
                      ⭐ {r.rating}
                    </span>
                  </td>
                  <td className="p-6 text-gray-400 text-sm italic">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {raters.length === 0 && (
            <p className="p-10 text-center text-gray-400 font-medium italic">
              Your store hasn't received any ratings yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
