import { Link } from "react-router-dom";
import React from "react";
import toast from "react-hot-toast";
import { useEffect } from "react";
function Navbar() {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [loggedIn, setLoggedIn] = React.useState(false);

    useEffect(()=>{
        const token = localStorage.getItem("token");
        setLoggedIn(!!token);
    }, []);
    const logout = () => {
        localStorage.removeItem("token");
        setLoggedIn(false);
        window.location.href = "/"; 
        toast.success("Logged out successfully ✅");
    }
    
return (
<header className="w-full sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur border-b dark:border-gray-800">
<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold">M</div>
<div>
  <Link to="/" className="flex flex-col">
<div className="text-lg font-semibold">MediAI</div>
<div className="text-xs text-gray-500 dark:text-gray-400">AI Health Assistant</div>
</Link>
</div>
</div>


<nav className="hidden md:flex items-center gap-6 text-sm">
<a href="#features" className="hover:text-sky-600">Features</a>
<a href="#how" className="hover:text-sky-600">How it works</a>
<a href="#testimonials" className="hover:text-sky-600">Testimonials</a>
{!loggedIn ? (
          <Link
            to="/login"
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium"
          >
            Login
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium"
            >
             <Link to='/dashboard'> Dashboard </Link><span className="text-1xl ml-1.5"> ▼</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-lg p-2 w-48">
                <Link className="block px-3 py-2 hover:bg-blue-100 rounded" to="/uploadreport">
                  Upload Report
                </Link>
                <Link className="block px-3 py-2 hover:bg-blue-100 rounded" to="/timeline">
                  Timeline
                </Link>
                <Link className="block px-3 py-2 hover:bg-blue-100 rounded" to="/viewReport">
                  View Report
                </Link>
                <Link className="block px-3 py-2 hover:bg-blue-100 rounded" to="/advitals">
                  Add Vitals
                </Link>

                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded mt-2"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
</nav>


<div className="md:hidden">
</div>
</div>
</header>
);
}export default Navbar;