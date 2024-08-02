"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [form, setForm] = useState({ emailOrPhone: "", password: "" });
  const router = useRouter();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-secret-token": "Too many requests, please try again later.",
      },
      body: JSON.stringify(form),
    });

    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      data = {};
    }

    if (response.ok) {
      console.log("Login successful:", data.token);
      Cookies.set("token", data.token, { expires: 1 });
      Cookies.set("user", JSON.stringify(data.user), { expires: 1 });
      router.push("/");
    } else {
      console.error("Failed to login:", data.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-primary to-secondary">
      <motion.div
        className="p-10 bg-white rounded-lg shadow-lg w-full max-w-md relative overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-30"></div>
        <form onSubmit={handleSubmit} className="relative z-10">
          <h2 className="text-3xl font-bold mb-6 text-accent text-center">
            Login
          </h2>
          <div className="mb-4">
            <input
              type="text"
              name="emailOrPhone"
              placeholder="Email or Phone Number"
              value={form.emailOrPhone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition-colors"
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
