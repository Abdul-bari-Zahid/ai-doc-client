
import React, { useEffect, useState } from "react";
import {
  UploadCloud, Activity, Brain, FileText, PlusCircle,
  TrendingUp, MessageSquare, ChevronRight, Info, HeartPulse,
  Thermometer, Weight, Droplets, Send, X, Bot, Globe, MapPin, Settings, Apple, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../api.js";
import toast from "react-hot-toast";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area, Legend
} from 'recharts';

const LANGUAGES = [
  "English", "Urdu", "Hindi", "Arabic", "Spanish", "French", "German", "Chinese", "Japanese", "Russian",
  "Portuguese", "Italian", "Bengali", "Punjabi", "Turkish", "Korean", "Vietnamese", "Telugu", "Marathi", "Tamil",
  "Gujarati", "Kannada", "Malayalam", "Odia", "Sanskrit", "Sindhi", "Pashto", "Balochi", "Persian", "Indonesian",
  "Thai", "Polish", "Ukrainian", "Romanian", "Dutch", "Greek", "Czech", "Hungarian", "Swedish", "Azerbaijani",
  "Kazakh", "Uzbek", "Malay", "Amharic", "Oromo", "Igbo", "Yoruba", "Somali", "Zulu", "Xhosa", "Sinhala",
  "Burmese", "Khmer", "Lao", "Hebrew", "Finnish", "Norwegian", "Danish", "Slovak", "Bulgarian", "Nepali",
  "Albanian", "Basque", "Catalan", "Corsican", "Croatian", "Estonian", "Galician", "Georgian", "Haitian Creole",
  "Hausa", "Hawaiian", "Hmong", "Icelandic", "Irish", "Javanese", "Kinyarwanda", "Kurdish", "Kyrgyz",
  "Latin", "Latvian", "Lithuanian", "Luxembourgish", "Macedonian", "Malagasy", "Maltese", "Maori", "Mongolian",
  "Nyanja", "Samoan", "Scots Gaelic", "Sesotho", "Shona", "Slovenian", "Sundanese", "Swahili",
  "Tajik", "Tatar", "Turkmen", "Welsh", "Yiddish"
].sort();

const COUNTRIES = [
  "Pakistan", "India", "USA", "UK", "UAE", "Saudi Arabia", "Canada", "Australia", "Germany", "France",
  "China", "Japan", "Russia", "Brazil", "South Africa", "Nigeria", "Bangladesh", "Indonesia", "Turkey",
  "Mexico", "Italy", "Spain", "South Korea", "Vietnam", "Thailand", "Malaysia", "Egypt", "Iran", "Iraq", "Afghanistan"
].sort();

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [availableTests, setAvailableTests] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "ai", content: "Hello! I'm your MediAI assistant. How can I help you today?" }
  ]);
  const [activeDiet, setActiveDiet] = useState(null);
  const [updatingSettings, setUpdatingSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const userRes = await API.get("/users/dashboard");
      setUser(userRes.data.user);

      const reportsRes = await API.get("/reports/user");
      setReports(reportsRes.data);
      processChartData(reportsRes.data);

      const vitalsRes = await API.get("/vitals");
      setVitals(vitalsRes.data);

      const dietRes = await API.get("/diet/me/active");
      setActiveDiet(dietRes.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const processChartData = (reportList) => {
    // Collect all unique numeric tests
    const allNumericTests = new Set();
    reportList.forEach(r => {
      r.structuredData?.keyFindings?.forEach(f => {
        if (f.numericValue) allNumericTests.add(f.test);
      });
    });

    const testsArray = Array.from(allNumericTests);
    setAvailableTests(testsArray);

    // Pick top tests to show (e.g., Hemoglobin, Glucose, or just first few)
    const priorityTests = ["Hemoglobin", "Glucose", "Blood Sugar", "Platelets", "WBC"];
    const testsToShow = testsArray.filter(t => priorityTests.some(p => t.toLowerCase().includes(p.toLowerCase()))).slice(0, 3);

    // If no priority tests, just pick first 2
    if (testsToShow.length === 0) testsToShow.push(...testsArray.slice(0, 2));

    const data = reportList
      .filter(r => r.structuredData?.keyFindings)
      .reverse()
      .map(r => {
        const entry = {
          date: new Date(r.reportDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        };
        testsToShow.forEach(testName => {
          const finding = r.structuredData.keyFindings.find(f => f.test === testName);
          entry[testName] = finding?.numericValue || null;
        });
        return entry;
      })
      .filter(d => testsToShow.some(t => d[t] !== null));

    setChartData(data);
  };

  const handleUpdateSettings = async (field, value) => {
    setUpdatingSettings(true);
    try {
      const updatedData = { ...user, [field]: value };
      const res = await API.post("/users/settings", {
        language: field === 'language' ? value : (user?.language || "English"),
        country: field === 'country' ? value : (user?.country || "Pakistan")
      });
      setUser(res.data.user);
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated! ✅`);
    } catch (err) {
      console.error("Settings update error:", err);
      toast.error(err.response?.data?.error || "Failed to update settings");
    } finally {
      setUpdatingSettings(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const newHistory = [...chatHistory, { role: "user", content: chatMessage }];
    setChatHistory(newHistory);
    setChatMessage("");

    try {
      const res = await API.post("/ai/chat", { message: chatMessage, history: newHistory });
      setChatHistory([...newHistory, { role: "ai", content: res.data.response }]);
    } catch (err) {
      console.error(err);
      toast.error("AI response failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-poppins pt-24 pb-12 px-6 md:px-10">
      {/* Settings Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-8 flex flex-wrap items-center gap-6"
      >
        <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
          <Settings size={18} /> Global Settings:
        </div>

        <div className="flex items-center gap-3">
          <Globe size={18} className="text-blue-500" />
          <select
            value={user?.language || "English"}
            onChange={(e) => handleUpdateSettings('language', e.target.value)}
            disabled={updatingSettings}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {Array.from(new Set(LANGUAGES)).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <MapPin size={18} className="text-rose-500" />
          <select
            value={user?.country || "Pakistan"}
            onChange={(e) => handleUpdateSettings('country', e.target.value)}
            disabled={updatingSettings}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-rose-500 outline-none"
          >
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {updatingSettings && <Activity size={16} className="text-blue-500 animate-spin" />}
      </motion.div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard <span className="text-blue-600">Overview</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium italic">
            Health monitoring in {user?.country}, analysis in {user?.language}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/uploadReport"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all font-semibold text-sm"
          >
            <PlusCircle size={18} /> New Analysis
          </Link>
          <Link
            to="/advitals"
            className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-2xl shadow-sm hover:bg-slate-50 transition-all font-semibold text-sm"
          >
            <Activity size={18} /> Log Vitals
          </Link>
          <Link
            to="/diet-plans"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all font-semibold text-sm"
          >
            <Apple size={18} /> Diet Plans
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { icon: FileText, label: "Total Reports", value: reports.length, color: "blue" },
          { icon: HeartPulse, label: "Vitals Tracked", value: vitals.length, color: "rose" },
          { icon: Brain, label: "AI Insights", value: reports.filter(r => r.structuredData).length, color: "indigo" },
          { icon: Activity, label: "Health Score", value: reports.length > 0 ? "Analyzed" : "Pending", color: "emerald" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4"
          >
            <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-10">
        {/* Main Graph Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Health Trends</h3>
                <p className="text-slate-400 text-sm">Visualizing key metrics from your medical history</p>
              </div>
            </div>

            <div className="h-72 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend iconType="circle" />
                    {Object.keys(chartData[0] || {}).filter(k => k !== 'date').map((test, idx) => (
                      <Area
                        key={test}
                        type="monotone"
                        dataKey={test}
                        stroke={idx === 0 ? "#2563eb" : idx === 1 ? "#10b981" : "#8b5cf6"}
                        strokeWidth={3}
                        fillOpacity={0.1}
                        fill={idx === 0 ? "#2563eb" : idx === 1 ? "#10b981" : "#8b5cf6"}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                  <TrendingUp size={48} className="mb-2 opacity-20" />
                  <p className="text-sm font-medium">No trend data available yet.</p>
                  <p className="text-xs">Upload reports with numeric values like Hemoglobin or Glucose.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Reports Table */}
          <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Recent Reports</h3>
              <Link to="/viewReport" className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-50">
                    <th className="py-4 font-bold text-xs uppercase tracking-wider">Report Details</th>
                    <th className="py-4 font-bold text-xs uppercase tracking-wider text-center">Severity</th>
                    <th className="py-4 font-bold text-xs uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {reports.slice(0, 4).map(r => (
                    <tr key={r._id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <FileText size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-700">{r.reportType}</p>
                            <p className="text-xs text-slate-400">{new Date(r.reportDate).toLocaleDateString()} • {r.language}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${r.structuredData?.severity?.toLowerCase() === 'high' ? 'bg-red-50 text-red-600' :
                          r.structuredData?.severity?.toLowerCase() === 'medium' ? 'bg-orange-50 text-orange-600' :
                            'bg-emerald-50 text-emerald-600'
                          }`}>
                          {r.structuredData?.severity || "Normal"}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => navigate(`/reports/${r._id}`)}
                          className="bg-slate-100 hover:bg-blue-600 hover:text-white p-2 rounded-xl transition-all"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Info Section */}
        <div className="space-y-8">
          {/* Active Diet Widget */}
          {activeDiet && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Apple size={20} className="text-blue-200" />
                    <h3 className="text-lg font-bold">Active Diet</h3>
                  </div>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">Day {activeDiet.progress}/10</span>
                </div>
                <h4 className="text-xl font-black mb-2 leading-tight">{activeDiet.planId?.name}</h4>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-300" />
                    <p className="text-xs font-medium text-blue-50">Current Goal: {activeDiet.planId?.category}</p>
                  </div>
                  <div className="w-full bg-blue-900/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-300 h-full transition-all duration-500" style={{ width: `${(activeDiet.progress / 10) * 100}%` }} />
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/diet/${activeDiet.planId?._id}`)}
                  className="w-full bg-white text-blue-600 hover:bg-blue-50 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  View Meal Plan <ChevronRight size={16} />
                </button>
              </div>
              <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10">
                <Sparkles size={120} />
              </div>
            </motion.div>
          )}

          {/* AI Advice Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-indigo-600 p-8 rounded-4xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="text-indigo-200" size={24} />
                <h3 className="text-lg font-bold">Health Suggestion</h3>
              </div>
              <p className="text-sm leading-relaxed text-indigo-50 italic mb-6">
                {(Array.isArray(reports[0]?.structuredData?.recommendations)
                  ? reports[0].structuredData.recommendations.join(" ")
                  : reports[0]?.structuredData?.recommendations)?.substring(0, 180) ||
                  "Start by uploading your first medical report to receive personalized health AI insights tailored for you."}...
              </p>
              <button
                onClick={() => reports[0] && navigate(`/reports/${reports[0]._id}`)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Read Full Insight
              </button>
            </div>
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          </motion.div>

          {/* Location Based Medicine Advice Info */}
          <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Info size={20} className="text-blue-500" /> Regional Care
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              MediAI is currently set to <strong>{user?.country}</strong>. All medicine suggestions and pharmacy links will be prioritized for this region.
            </p>
          </div>

          {/* Quick Stats / Recent Vitals */}
          <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Thermometer size={20} className="text-rose-500" /> Recent Vitals
            </h3>
            <div className="space-y-4">
              {vitals.slice(0, 3).map((v, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Weight size={16} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weight</p>
                      <p className="text-sm font-bold text-slate-700">{v.weight}kg</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BP</p>
                    <p className="text-sm font-bold text-slate-700">{v.bp}</p>
                  </div>
                </div>
              ))}
              <Link to="/advitals" className="block text-center text-xs font-bold text-slate-400 hover:text-blue-600 pt-2 transition-colors">
                Update Vitals
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Widget */}
      <div className="fixed bottom-8 right-8 z-100">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-white rounded-4xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
            >
              <div className="bg-blue-600 p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Health Assistant</h4>
                    <span className="text-[10px] font-medium text-blue-100 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> AI Online ({user?.language})
                    </span>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm whitespace-pre-wrap ${msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-700 rounded-bl-none border border-slate-200'
                      }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-100 bg-white">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 pl-4">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about your health..."
                    className="flex-1 bg-transparent border-none text-sm focus:ring-0 outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`p-5 rounded-3xl shadow-2xl flex items-center justify-center transition-all ${isChatOpen ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white'}`}
        >
          {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </motion.button>
      </div>
    </div>
  );
};

export default Dashboard;
