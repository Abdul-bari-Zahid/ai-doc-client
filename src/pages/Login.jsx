

import { useState } from "react";
import toast from "react-hot-toast";
import { API } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post("/auth/login", form, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,  
    });

    toast.success("Login successful ✅");
 
    localStorage.setItem("token", res.data.token);

    setTimeout(() => navigate("/dashboard"), 800);

  } catch (err) {
    toast.error(err?.response?.data?.message || "Login failed ❌");
  }
};

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-4xl font-bold text-center text-blue-600">MediAI</h2>
        <p className="text-center mt-1 text-gray-600">Sign in to your account</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input name="email" value={form.email} onChange={handleChange}
              type="email" placeholder="you@example.com" required
              className="w-full mt-1 p-3 border rounded-lg" />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input name="password" value={form.password} onChange={handleChange}
              type="password" placeholder="Enter password" required
              className="w-full mt-1 p-3 border rounded-lg" />
          </div>

          <button type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          Don’t have an account? <Link className="text-blue-600 font-medium" to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
