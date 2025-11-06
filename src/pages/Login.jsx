// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Login Data:", form);
    
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
//       <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-200">
//         <h2 className="text-4xl font-bold text-center text-blue-600">MediAI</h2>
//         <p className="text-center mt-1 text-gray-600">
//           Sign in to your account
//         </p>

//         <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
//           <div>
//             <label className="text-sm font-medium">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="you@example.com"
//               required
//               className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               placeholder="Enter password"
//               required
//               className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//           </div>

//           <div className="flex justify-between text-sm">
//             <label className="flex items-center gap-2">
//               <input type="checkbox" className="accent-blue-600" /> Remember me
//             </label>
//             <button className="text-blue-600 hover:underline">
//               Forgot password?
//             </button>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
//           >
//             Login
//           </button>
//         </form>


//         <p className="text-center text-sm mt-6 text-gray-600">
//           Don’t have an account?{" "}
//           <Link className="text-blue-600 font-medium hover:underline" to="/register">
//             Register now
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Login;


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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       const res = await API.post("/auth/login", form,{
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({ email, password }),
// },{withCredentials: true });

//       toast.success("Login successful ✅");

//       setTimeout(() => navigate("/dashboard"), 800);

//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Login failed ❌");
//     }
//   };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Axios format: API.post(url, data, config)
    const res = await API.post("/auth/login", form, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // optional if backend needs cookies
    });

    toast.success("Login successful ✅");

    // Token store karo for protected routes
    localStorage.setItem("token", res.data.token);

    setTimeout(() => navigate("/dashboard"), 800);

  } catch (err) {
    toast.error(err?.response?.data?.message || "Login failed ❌");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-4xl font-bold text-center text-blue-600">MediAI</h2>
        <p className="text-center mt-1 text-gray-600">Sign in to your account</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* <div>
            <label className="text-sm font-medium">Name</label>
            <input name="email" value={form.name} onChange={handleChange}
              type="email" placeholder="you@example.com" required
              className="w-full mt-1 p-3 border rounded-lg" />
          </div> */}
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
