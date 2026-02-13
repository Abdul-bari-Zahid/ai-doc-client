import { useState, useEffect } from "react";
import {
    Apple,
    Search,
    ChevronRight,
    Activity,
    Zap,
    ShieldCheck,
    Bot,
    Sparkles,
    ArrowRight,
    Filter,
    Clock,
    RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { API } from "../api";
import toast from "react-hot-toast";

function DietPlans() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [aiQuery, setAiQuery] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [suggestedPlan, setSuggestedPlan] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await API.get("/diet");
            setPlans(res.data);
        } catch (err) {
            toast.error("Failed to load diet plans");
        } finally {
            setLoading(false);
        }
    };

    const handleAiSuggest = async (e) => {
        e.preventDefault();
        if (!aiQuery) return;

        setAiLoading(true);
        setSuggestedPlan(null);
        try {
            const res = await API.post("/diet/ai-suggest", { query: aiQuery });
            setSuggestedPlan(res.data);
            toast.success("AI Recommendation ready! ✨");
        } catch (err) {
            toast.error("AI couldn't find a perfect match. Try different keywords.");
        } finally {
            setAiLoading(false);
        }
    };

    const categories = ["All", ...new Set(plans.map(p => p.category))];

    const filteredPlans = plans.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === "All" || p.category === category;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Hero / AI Search Section */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-100">
                                <Apple size={24} />
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Clinical Diet Engine</h1>
                            <button
                                onClick={async () => {
                                    try {
                                        await API.get("/diet/seed");
                                        toast.success("All 30 Diet Plans seeded successfully!");
                                        fetchPlans();
                                    } catch (e) { toast.error("Seeding failed"); }
                                }}
                                className="ml-auto p-3 text-slate-300 hover:text-blue-500 transition-colors"
                                title="Seed 30 Diets (Emergency)"
                            >
                                <RefreshCw size={16} />
                            </button>
                        </div>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8">
                            Discover professionally curated 10-day nutrition journeys optimized for your specific health goals and clinical needs.
                        </p>

                        <form onSubmit={handleAiSuggest} className="relative group">
                            <div className="absolute inset-y-0 left-6 flex items-center text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                <Bot size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Ask AI: 'Suggest a diet for high sugar and weight loss...'"
                                value={aiQuery}
                                onChange={(e) => setAiQuery(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-[2rem] py-5 pl-16 pr-32 shadow-xl shadow-slate-200/50 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700"
                            />
                            <button
                                disabled={aiLoading}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 disabled:opacity-70"
                            >
                                {aiLoading ? "Thinking..." : (
                                    <>
                                        <Sparkles size={16} /> Ask AI
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* AI Suggestion Result */}
                    <AnimatePresence>
                        {suggestedPlan && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/10"
                            >
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 text-blue-400 font-black uppercase tracking-widest text-[10px] mb-4">
                                        <Sparkles size={14} /> Recommended for you
                                    </div>
                                    <h3 className="text-2xl font-black mb-2">{suggestedPlan.suggestion.name}</h3>
                                    <p className="text-slate-400 text-sm italic mb-6">"{suggestedPlan.reason}"</p>

                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {suggestedPlan.suggestion.benefits?.slice(0, 3).map((b, i) => (
                                            <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold border border-white/5">{b}</span>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => navigate(`/diet/${suggestedPlan.suggestion._id}`)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 w-fit"
                                    >
                                        View Plan Details <ArrowRight size={16} />
                                    </button>
                                </div>
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Filter Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                        <div className="p-2 bg-slate-100 rounded-xl text-slate-400 mr-2">
                            <Filter size={18} />
                        </div>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${category === cat
                                    ? "bg-slate-900 text-white shadow-lg"
                                    : "bg-white text-slate-400 border border-slate-100 hover:text-slate-600 shadow-sm"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search plans..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium shadow-sm"
                        />
                    </div>
                </div>

                {/* Plans Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-[2.5rem] h-64 animate-pulse border border-slate-100"></div>
                        ))}
                    </div>
                ) : filteredPlans.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <Apple size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No diet plans found matching your criteria</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPlans.map((plan, idx) => (
                            <motion.div
                                key={plan._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="group"
                            >
                                <div
                                    onClick={() => navigate(`/diet/${plan._id}`)}
                                    className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 h-full flex flex-col justify-between hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                                {plan.category}
                                            </span>
                                            <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
                                                <ChevronRight size={20} />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-800 mb-3 group-hover:text-blue-700 transition-colors">{plan.name}</h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 line-clamp-3">
                                            {plan.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-slate-300" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">10 Days</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <ShieldCheck size={14} className="text-blue-500" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical</span>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400">
                                            10d
                                        </div>
                                    </div>

                                    {/* Hover Decoration */}
                                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default DietPlans;
