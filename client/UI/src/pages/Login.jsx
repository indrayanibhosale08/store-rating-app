import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            
            // Save Token and Role to LocalStorage
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);

            // Redirect based on role
            if (res.data.user.role === 'Admin') navigate('/admin');
            else if (res.data.user.role === 'StoreOwner') navigate('/store');
            else navigate('/dashboard');
            
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required /><br/><br/>
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required /><br/><br/>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;