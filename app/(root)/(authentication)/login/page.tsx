"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const LoginPage = () => {
    const [form, setForm] = useState({ emailOrPhone: '', password: '' });
    const router = useRouter();

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-secret-token': 'Too many requests, please try again later.',
            },
            body: JSON.stringify(form),
        });

        let data;
        try {
            data = await response.json();
        } catch (error) {
            console.error('Failed to parse JSON:', error);
            data = {};
        }

        if (response.ok) {
            console.log('Login successful:', data.token);
            Cookies.set('token', data.token, { expires: 1 }); 
            router.push('/');
        } else {
            console.error('Failed to login:', data.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl mb-4">Login</h2>
                <input
                    type="text"
                    name="emailOrPhone"
                    placeholder="Email or Phone Number"
                    value={form.emailOrPhone}
                    onChange={handleChange}
                    className="w-full mb-2 p-2 border rounded"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full mb-2 p-2 border rounded"
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
