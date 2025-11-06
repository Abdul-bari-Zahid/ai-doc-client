//  import { Link } from "react-router-dom";
//  function Register() {
// return (
// <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
// <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-xl">
// <h2 className="text-3xl font-bold text-center text-blue-600">MediAI</h2>
// <h3 className="mt-2 text-center text-xl font-semibold text-gray-800">Create account</h3>
// <p className="text-center text-sm text-gray-500 mb-6">
// Already have an account? <a href="#" className="text-blue-600 font-medium"><Link to="/login"> Login Now</Link></a>
// </p>


// <label className="text-sm font-medium">Full Name</label>
// <input type="text" placeholder="Enter your name" className="w-full mt-1 mb-3 p-3 border rounded-lg" />


// <label className="text-sm font-medium">Email address</label>
// <input type="email" placeholder="Enter your email" className="w-full mt-1 mb-3 p-3 border rounded-lg" />


// <label className="text-sm font-medium">Password</label>
// <input type="password" placeholder="Create password" className="w-full mt-1 mb-3 p-3 border rounded-lg" />


// <button className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition">
// Register
// </button>





// </div>
// </div>
// );
// }
// export default Register;

import { useState } from "react";
import toast from "react-hot-toast";
import { API } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("auth/register", form,{withCredentials: true });
      toast.success("Account created! ✅");

      setTimeout(() => navigate("/dashboard"), 800);

    } catch (err) {
      toast.error(err?.response?.data?.message || "Register failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-blue-600">MediAI</h2>
        <h3 className="mt-2 text-center text-xl font-semibold text-gray-800">Create account</h3>
        <p className="text-center text-sm text-gray-500 mb-6">
          Already have an account? <Link to="/login" className="text-blue-600 font-medium">Login</Link>
        </p>

        <form onSubmit={handleSubmit}>
          <label className="text-sm font-medium">Full Name</label>
          <input name="name" value={form.name} onChange={handleChange}
            type="text" placeholder="Enter your name"
            className="w-full mt-1 mb-3 p-3 border rounded-lg" required />

          <label className="text-sm font-medium">Email address</label>
          <input name="email" value={form.email} onChange={handleChange}
            type="email" placeholder="Enter your email"
            className="w-full mt-1 mb-3 p-3 border rounded-lg" required />

          <label className="text-sm font-medium">Password</label>
          <input name="password" value={form.password} onChange={handleChange}
            type="password" placeholder="Create password"
            className="w-full mt-1 mb-3 p-3 border rounded-lg" required />

          <button type="submit"
            className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
