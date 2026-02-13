import { Link } from "react-router-dom";
import React from "react";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { Menu, X, ChevronDown, LayoutDashboard, Apple, FileUp, Clock, FileText, Activity, LogOut } from "lucide-react";


function Navbar() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    window.location.href = "/";
    toast.success("Logged out successfully ✅");
  }

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it works", href: "#how" },
    { name: "Testimonials", href: "#testimonials" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass py-3" : "bg-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 p-0.5 transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden">
                <img src="/ai-doctor-assistant.png" alt="MediAI Logo" className="w-8 h-8 object-contain" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">MediAI</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">AI Assistant</span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              {link.name}
            </a>
          ))}

          {!loggedIn ? (
            <Link to="/login" className="btn-primary py-2 px-5 text-sm">
              Sign In
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 btn-secondary py-2 px-4 text-sm group"
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-56 glass rounded-2xl p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-xl text-slate-700 transition-colors">
                      <LayoutDashboard size={18} className="text-blue-500" />
                      <span className="text-sm font-medium">Dashboard Overview</span>
                    </Link>
                    <div className="h-px bg-slate-100 my-1 mx-2"></div>
                    <Link to="/uploadreport" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-xl text-slate-700 transition-colors">
                      <FileUp size={18} className="text-blue-500" />
                      <span className="text-sm font-medium">Upload Report</span>
                    </Link>
                    <div className="h-px bg-slate-100 my-1 mx-2"></div>
                    <Link to="/diet-plans" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-xl text-slate-700 transition-colors">
                      <Apple size={18} className="text-blue-500" />
                      <span className="text-sm font-medium">Diet Journeys</span>
                    </Link>
                    <Link to="/timeline" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-xl text-slate-700 transition-colors">
                      <Clock size={18} className="text-blue-500" />
                      <span className="text-sm font-medium">Timeline</span>
                    </Link>
                    <Link to="/viewReport" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-xl text-slate-700 transition-colors">
                      <FileText size={18} className="text-blue-500" />
                      <span className="text-sm font-medium">View Report</span>
                    </Link>
                    <Link to="/advitals" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-xl text-slate-700 transition-colors">
                      <Activity size={18} className="text-blue-500" />
                      <span className="text-sm font-medium">Add Vitals</span>
                    </Link>
                    <div className="h-px bg-slate-100 my-2 mx-2"></div>
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-red-50 text-red-600 rounded-xl transition-colors"
                    >
                      <LogOut size={18} />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-slate-100 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="h-px bg-slate-100 my-2"></div>
            {!loggedIn ? (
              <Link to="/login" className="btn-primary text-center">Sign In</Link>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/dashboard" className="btn-secondary flex items-center justify-center gap-2">
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center justify-center gap-2 p-3 text-red-600 font-medium"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
