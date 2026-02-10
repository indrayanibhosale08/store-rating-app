import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "User",
  });
  const navigate = useNavigate();

  const validate = () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
    if (formData.name.length < 20 || formData.name.length > 60)
      return "Name must be 20-60 characters";
    if (formData.address.length > 400) return "Address max 400 characters";
    if (!passwordRegex.test(formData.password))
      return "Password must be 8-16 chars, 1 uppercase, 1 special char";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
      );
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      // This log is crucial for debugging
      console.error("Error details:", err);

      const errorMsg =
        err.response?.data?.message ||
        "Cannot connect to server. Is the backend running?";
      alert("Registration Failed: " + errorMsg);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center p-6">
      <div className="max-w-md w-full mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-2 border rounded"
            placeholder="Full Name (20-60 chars)"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <input
            className="w-full p-2 border rounded"
            type="email"
            placeholder="Email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <textarea
            className="w-full p-2 border rounded"
            placeholder="Address (Max 400 chars)"
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            required
          />

          <input
            className="w-full p-2 border rounded"
            type="password"
            placeholder="Password (8-16 chars, 1 Upper, 1 Special)"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
