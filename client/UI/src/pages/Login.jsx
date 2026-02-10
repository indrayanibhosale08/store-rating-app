import React, { useState } from 'react'; // Add 'React' here
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);

            if (res.data.user.role === 'Admin') navigate('/admin');
            else if (res.data.user.role === 'StoreOwner') navigate('/store');
            else navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Login</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Password</label>
                        <input 
                            type="password" 
                            className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder="Enter password"
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md">
                        Login
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    New here? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;