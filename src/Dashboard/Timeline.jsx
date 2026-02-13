import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  FileText,
  Calendar,
  ChevronRight,
  Clock,
  ChevronLeft,
  Search,
  ArrowUpRight,
  TrendingUp,
  History
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { API } from "../api";

function Timeline() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      // Fetch Vitals and Reports in parallel
      const [vitalsRes, reportsRes] = await Promise.all([
        API.get("/vitals"),
        API.get("/reports/user")
      ]);

      // Process Vitals
      const vitalsTimeline = vitalsRes.data.map(v => ({
        id: v._id,
        date: new Date(v.createdAt),
        type: "Vitals",
        title: "Vitals Checkpoint",
        text: `Blood Pressure: ${v.bp} • Sugar: ${v.sugar} mg/dL • Weight: ${v.weight}kg`,
        severity: v.structuredData?.severity || "Normal",
        vitals: v
      }));

      // Process Reports
      const reportsTimeline = reportsRes.data.map(r => ({
        id: r._id,
        date: new Date(r.reportDate),
        type: "Report",
        title: r.reportType || "Lab Analysis",
        text: r.aiSummary ? (r.aiSummary.substring(0, 120) + "...") : "Diagnostic report processed.",
        severity: r.structuredData?.severity || "Normal",
        report: r
      }));

      // Merge & sort by date descending
      const combined = [...vitalsTimeline, ...reportsTimeline].sort((a, b) => b.date - a.date);

      setTimeline(combined);
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync clinical history ❌");
    } finally {
      setLoading(false);
    }
  };

  const filteredTimeline = timeline.filter(item =>
    filter === "All" || item.type === filter
  );

  const getTypeStyles = (type) => {
    switch (type) {
      case "Vitals": return "bg-blue-50 text-blue-600 border-blue-100 p-3 rounded-2xl";
      case "Report": return "bg-emerald-50 text-emerald-600 border-emerald-100 p-3 rounded-2xl";
      default: return "bg-slate-50 text-slate-600 border-slate-100 p-3 rounded-2xl";
    }
  };

  const getSeverityBadge = (severity) => {
    const s = severity?.toLowerCase();
    if (s === "high") return "bg-red-500/10 text-red-600 border border-red-200 px-3 py-1 rounded-full text-[10px] font-black uppercase";
    if (s === "medium" || s === "elevated") return "bg-orange-500/10 text-orange-600 border border-orange-200 px-3 py-1 rounded-full text-[10px] font-black uppercase";
    return "bg-blue-500/10 text-blue-600 border border-blue-200 px-3 py-1 rounded-full text-[10px] font-black uppercase";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-28 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-100 flex items-center justify-center">
                <History size={20} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Health Journey</h1>
            </div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] ml-1">Comprehensive Clinical Timeline</p>
          </motion.div>

          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
            {["All", "Report", "Vitals"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-2.5 rounded-[1rem] text-xs font-black transition-all uppercase tracking-widest ${filter === tab
                    ? "bg-slate-900 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                {tab === "All" ? "Full History" : tab === "Report" ? "Lab Reports" : "Vitals Trace"}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Content */}
        <div className="relative">
          {/* Main vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-slate-200 to-transparent transform md:-translate-x-1/2 -z-0"></div>

          {loading ? (
            <div className="space-y-8 relative z-10">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex items-center gap-12">
                  <div className="hidden md:block flex-1"></div>
                  <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                  <div className="flex-1 bg-white h-32 rounded-[2rem]"></div>
                </div>
              ))}
            </div>
          ) : filteredTimeline.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <History size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No records found for the selection</p>
            </div>
          ) : (
            <div className="space-y-12 relative z-10">
              {filteredTimeline.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 ${idx % 2 !== 0 ? "md:flex-row-reverse" : ""
                    }`}
                >
                  {/* Left Side (Date for desktop) */}
                  <div className={`hidden md:flex flex-1 ${idx % 2 === 0 ? "justify-end text-right" : "justify-start text-left"}`}>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Record Date</p>
                      <p className="text-sm font-black text-slate-800">
                        {item.date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <div className={`flex items-center gap-2 ${idx % 2 === 0 ? "justify-end" : "justify-start"}`}>
                        <Clock size={12} className="text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400">{item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="relative flex items-center justify-center">
                    <div className={`w-12 h-12 rounded-full border-4 border-[#F8FAFC] shadow-lg flex items-center justify-center z-10 ${item.type === "Report" ? "bg-emerald-600" : "bg-blue-600"
                      }`}>
                      {item.type === "Report" ? (
                        <FileText size={20} className="text-white" />
                      ) : (
                        <Activity size={20} className="text-white" />
                      )}
                    </div>
                    {/* Mobile Only Date Bubble */}
                    <div className="md:hidden absolute left-16 whitespace-nowrap bg-white px-3 py-1 rounded-full border shadow-sm border-slate-100">
                      <span className="text-[10px] font-black text-slate-700">{item.date.toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Right Side (Card) */}
                  <div className="flex-1 w-full pl-14 md:pl-0">
                    <Link
                      to={item.type === "Report" ? `/report/${item.id}` : "/add-vitals"}
                      className="block group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.02, x: idx % 2 === 0 ? 5 : -5 }}
                        className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 transition-all group-hover:border-blue-200 relative overflow-hidden h-full flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between mb-4 relative z-10">
                          <div>
                            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${item.type === "Report" ? "text-emerald-600" : "text-blue-600"
                              }`}>
                              {item.type === "Report" ? "Lab Analysis" : "Vital Signs Record"}
                            </p>
                            <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{item.title}</h3>
                          </div>
                          {getSeverityBadge(item.severity)}
                        </div>

                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 line-clamp-3 relative z-10">
                          {item.text}
                        </p>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-50 relative z-10">
                          <span className="text-[10px] font-black text-slate-400 group-hover:text-blue-500 transition-colors uppercase tracking-widest flex items-center gap-2">
                            View Full Insight
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                          <div className="flex -space-x-2">
                            {[1, 2].map(i => (
                              <div key={i} className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-400">AI</div>
                            ))}
                          </div>
                        </div>

                        {/* Background subtle decoration */}
                        <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity ${item.type === "Report" ? "bg-emerald-500" : "bg-blue-500"
                          }`}></div>
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 flex justify-center"
        >
          <Link
            to="/dashboard"
            className="flex items-center gap-3 bg-white hover:bg-slate-900 border border-slate-200 px-8 py-4 rounded-2xl text-slate-600 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-sm"
          >
            <ChevronLeft size={16} />
            Return to Dashboard
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

export default Timeline;