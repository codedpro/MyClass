"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
    const [form, setForm] = useState({
        name: '',
        familyName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        student_number: ''
    });

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-secret-token': 'Too many requests, please try again later.'
            },
            body: JSON.stringify({
                name: form.name,
                familyName: form.familyName,
                email: form.email,
                phoneNumber: form.phoneNumber,
                password: form.password,
                student_number: form.student_number,
            }),
        });

        let data;
        try {
            data = await response.json();
        } catch (error) {
            console.error('Error parsing JSON:', error);
            console.error('Response:', response);
            data = { message: 'Unexpected error' };
        }

        if (response.ok) {
            router.push("/login")
        } else {
            console.error('Failed to register user:', data.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl mb-4">Register</h2>
                <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full mb-2 p-2 border rounded"/>
                <input type="text" name="familyName" placeholder="Family Name" value={form.familyName} onChange={handleChange} className="w-full mb-2 p-2 border rounded"/>
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full mb-2 p-2 border rounded"/>
                <input type="text" name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} className="w-full mb-2 p-2 border rounded"/>
                <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full mb-2 p-2 border rounded"/>
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className="w-full mb-2 p-2 border rounded"/>
                <input type="text" name="student_number" placeholder="Student Number" value={form.student_number} onChange={handleChange} className="w-full mb-2 p-2 border rounded"/>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
