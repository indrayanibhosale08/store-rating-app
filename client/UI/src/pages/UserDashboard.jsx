import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

export default function UserDashboard() {
  // --- STATES ---
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  
  // Password Modal States
  const [showPassModal, setShowPassModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  // --- API CALLS ---
  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = () => {
    axios
      .get("http://localhost:5000/api/user/stores", config)
      .then((res) => setStores(res.data))
      .catch((err) => console.error("Error fetching stores", err));
  };

  // REQ: "Submit rating" AND "Modify rating" (Both handled here)
  const handleRate = (storeId, ratingValue) => {
    axios
      .post(
        "http://localhost:5000/api/user/rate",
        { storeId, ratingValue },
        config
      )
      .then(() => {
        fetchStores(); // Refresh to show new Average
      })
      .catch((err) => alert("Error submitting rating"));
  };

  // REQ: "Update Password after logging in"
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
    if (!passwordRegex.test(newPassword)) {
        return alert("Password must be 8-16 chars, include 1 uppercase letter and 1 special character.");
    }
    try {
        await axios.post("http://localhost:5000/api/auth/update-password", { newPassword }, config);
        alert("Password updated successfully!");
        setShowPassModal(false);
        setNewPassword("");
    } catch (err) {
        alert("Failed to update password");
    }
  };

  // REQ: "Search by Name AND Address" & "Sort"
  const processedStores = useMemo(() => {
    return stores
      .filter(
        (s) =>
          (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
          (s.address || "").toLowerCase().includes(search.toLowerCase()) // Checks Address too
      )
      .sort((a, b) => {
        if (sortKey === "name") {
          return sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        if (sortKey === "rating") {
          return sortOrder === "asc"
            ? (a.rating || 0) - (b.rating || 0)
            : (b.rating || 0) - (a.rating || 0);
        }
        return 0;
      });
  }, [stores, search, sortKey, sortOrder]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* REQ: Log out from system */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-800">Store Directory</h1>
            <p className="text-gray-500 text-sm">Find and rate your favorite stores</p>
          </div>
          <div className="flex gap-4">
            <button 
                onClick={() => setShowPassModal(true)}
                className="text-gray-500 font-bold hover:text-blue-600 transition text-sm"
            >
                Change Password
            </button>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-red-600 transition"
            >
                Logout
            </button>
          </div>
        </div>

        {/* REQ: Search & Sorting UI */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <input
                        className="w-full border-none bg-gray-100 p-3 pl-10 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Search by name or address..."
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="absolute left-3 top-3 opacity-30">🔍</span>
                </div>

                <div className="flex gap-4 items-center whitespace-nowrap">
                    <button 
                        onClick={() => { setSortKey('name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                        className={`text-xs font-black uppercase tracking-widest p-2 rounded-lg transition ${sortKey === 'name' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                        Name {sortKey === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </button>
                    <button 
                        onClick={() => { setSortKey('rating'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                        className={`text-xs font-black uppercase tracking-widest p-2 rounded-lg transition ${sortKey === 'rating' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                        Rating {sortKey === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </button>
                </div>
            </div>
        </div>

        {/* REQ: List of all registered stores */}
        <div className="space-y-4">
          {processedStores.length > 0 ? (
            processedStores.map((s) => (
                <div
                  key={s._id}
                  className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="flex-1">
                    {/* REQ: Display Store Name & Address */}
                    <h2 className="text-xl font-black text-gray-800">{s.name}</h2>
                    <p className="text-gray-400 text-sm mt-1">📍 {s.address}</p>
                    
                    <div className="flex items-center gap-2 mt-3">
                        {/* REQ: Display Overall Rating */}
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-black text-sm border border-blue-100">
                            Overall: ⭐ {s.rating || 0}
                        </span>
                        {/* REQ: Display User's Submitted Rating */}
                        {s.myRating > 0 && (
                            <span className="text-xs font-bold text-green-500 italic">
                                You rated this {s.myRating} stars
                            </span>
                        )}
                    </div>
                  </div>
      
                  <div className="flex flex-col items-center md:items-end w-full md:w-auto">
                    <span className="text-[10px] font-black text-gray-300 mb-2 uppercase tracking-widest">
                       {s.myRating > 0 ? "Modify Your Rating" : "Submit a Rating"}
                    </span>
                    {/* REQ: Submit rating (1-5) & Modify Rating */}
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => handleRate(s._id, n)}
                          className={`w-10 h-10 rounded-xl font-black transition-all transform active:scale-90 ${
                            s.myRating === n
                              ? "bg-yellow-400 text-white scale-110 shadow-lg ring-4 ring-yellow-50"
                              : "bg-gray-50 text-gray-300 hover:bg-yellow-50 hover:text-yellow-400"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center p-20 text-gray-400 italic bg-white rounded-3xl border">
                No stores found matching your search.
            </div>
          )}
        </div>

        {/* REQ: Password Update Modal */}
        {showPassModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
                <div className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
                    <h2 className="text-2xl font-black mb-2 text-gray-800">Security</h2>
                    <p className="text-gray-400 text-sm mb-6">Update your account password below.</p>
                    <form onSubmit={handlePasswordUpdate}>
                        <input 
                            type="password" 
                            className="w-full p-4 bg-gray-100 border-none rounded-2xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="Enter New Password"
                            onChange={(e) => setNewPassword(e.target.value)}
                            required 
                        />
                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition">Update</button>
                            <button type="button" onClick={() => setShowPassModal(false)} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}