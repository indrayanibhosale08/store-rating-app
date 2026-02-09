import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', data);
            alert("Success!");
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Sign Up</h2>
            <input {...register("name", { required: true, minLength: 20, maxLength: 60 })} placeholder="Full Name" />
            {errors.name && <p>Name must be 20-60 characters</p>}

            <input {...register("email", { required: true, pattern: /^\S+@\S+$/i })} placeholder="Email" />
            
            <textarea {...register("address", { required: true, maxLength: 400 })} placeholder="Address" />
            
            <input type="password" {...register("password", { required: true })} placeholder="Password" />
            
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;