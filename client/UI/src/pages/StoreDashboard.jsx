
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

export default function StoreDashboard() {
  const [storeInfo, setStoreInfo] = useState(null);
  const [raters, setRaters] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Sorting State for the list of users
  const [sort, setSort] = useState({ key: "createdAt", dir: "desc" });

  // Password Update States
  const [showPassModal, setShowPassModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/store/my-stats", config);
      setStoreInfo(res.data.store);
      setRaters(res.data.raters);
    } catch (err) {
      console.error("Error fetching store data", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
    if (!passwordRegex.test(newPassword)) {
      return alert("Password requirements: 8-16 chars, 1 uppercase, 1 special character.");
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

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // REQ: All tables should support sorting
  const sortedRaters = useMemo(() => {
    return [...raters].sort((a, b) => {
      let valA = sort.key === "name" ? a.user.name : a[sort.key];
      let valB = sort.key === "name" ? b.user.name : b[sort.key];
      
      if (sort.dir === "asc") return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });
  }, [raters, sort]);

  if (loading) return <div className="p-20 text-center font-bold">Loading Store Data...</div>;

  if (!storeInfo) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold">No Store Assigned</h2>
      <p className="text-gray-500">Contact Admin to link your account to a store.</p>
      <button onClick={handleLogout} className="mt-4 text-blue-600 underline">Logout</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header: REQ - Can log out and update password */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">{storeInfo.name}</h1>
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Store Performance Dashboard</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setShowPassModal(true)} className="text-sm font-bold text-gray-400 hover:text-blue-600">Change Password</button>
            <button onClick={handleLogout} className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-red-600 transition">Logout</button>
          </div>
        </header>

        {/* REQ: See the average rating of their store */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-10 rounded-3xl shadow-sm border text-center">
            <p className="text-gray-400 font-bold text-xs uppercase mb-2">Overall Average Rating</p>
            <p className="text-7xl font-black text-blue-600">⭐ {storeInfo.rating || 0}</p>
          </div>
          <div className="bg-blue-600 p-10 rounded-3xl shadow-sm text-white text-center flex flex-col justify-center">
            <p className="opacity-70 font-bold text-xs uppercase mb-2">Total Customer Ratings</p>
            <p className="text-7xl font-black">{raters.length}</p>
          </div>
        </div>

        {/* REQ: View a list of users who have submitted ratings */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-white">
            <h3 className="font-black text-gray-800 text-xl">Customer Feedback List</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="p-6 cursor-pointer hover:bg-gray-800" onClick={() => setSort({key: 'name', dir: sort.dir === 'asc' ? 'desc' : 'asc'})}>
                    User Name {sort.key === 'name' ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}
                </th>
                <th className="p-6 text-center cursor-pointer hover:bg-gray-800" onClick={() => setSort({key: 'rating', dir: sort.dir === 'asc' ? 'desc' : 'asc'})}>
                    Rating Given {sort.key === 'rating' ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}
                </th>
                <th className="p-6">Date Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sortedRaters.map((r, i) => (
                <tr key={i} className="hover:bg-blue-50/50 transition">
                  <td className="p-6">
                    <p className="font-bold text-gray-800">{r.user?.name || "Anonymous User"}</p>
                    <p className="text-xs text-gray-400">{r.user?.email}</p>
                  </td>
                  <td className="p-6 text-center">
                    <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full font-black text-sm">⭐ {r.rating}</span>
                  </td>
                  <td className="p-6 text-gray-400 text-sm italic">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {raters.length === 0 && <p className="p-20 text-center text-gray-400 italic">No ratings found for your store.</p>}
        </div>

        {/* REQ: Update password modal */}
        {showPassModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
                <div className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-2xl animate-in zoom-in">
                    <h2 className="text-2xl font-black mb-2 text-gray-800">New Password</h2>
                    <p className="text-gray-400 text-sm mb-6">Enter your new secure password below.</p>
                    <form onSubmit={handlePasswordUpdate}>
                        <input 
                            type="password" 
                            className="w-full p-4 bg-gray-100 border-none rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder="Min 8 chars, 1 Up, 1 Special"
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