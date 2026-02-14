import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ChevronLeft,
    CheckCircle,
    AlertCircle,
    Zap,
    Clock,
    Calendar,
    ArrowRight,
    ShieldCheck,
    Flame,
    Utensils,
    Apple
} from "lucide-react";
import { motion } from "framer-motion";
import { API } from "../api";
import toast from "react-hot-toast";

function DietDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);

    useEffect(() => {
        fetchPlan();
    }, [id]);

    const fetchPlan = async () => {
        try {
            const res = await API.get(`/diet/${id}`);
            setPlan(res.data);
        } catch (err) {
            toast.error("Failed to load plan details");
        } finally {
            setLoading(false);
        }
    };

    const handleStartDiet = async () => {
        setStarting(true);
        try {
            await API.post("/diet/start", { planId: id });
            toast.success("10-Day Journey Started! 🥗🚀");
            navigate("/dashboard");
        } catch (err) {
            toast.error("Failed to start diet plan");
        } finally {
            setStarting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-black uppercase tracking-widest text-xs pt-20">Loading Diet Protocol...</div>;
    if (!plan) return <div className="min-h-screen flex items-center justify-center pt-20">Plan not found.</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-28 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Back Button */}
                <Link to="/diet-plans" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-black uppercase tracking-widest text-[10px] mb-10">
                    <ChevronLeft size={16} /> Back to Discovery
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left Column: Plan Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 mb-6 inline-block">
                                    {plan.category} Protocol
                                </span>
                                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{plan.name}</h1>
                                <p className="text-slate-500 font-medium leading-relaxed text-lg mb-10">
                                    {plan.description}
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                        <Clock size={20} className="text-blue-500 mb-2" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Duration</p>
                                        <p className="text-lg font-black text-slate-800">10 Days</p>
                                    </div>
                                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                        <Flame size={20} className="text-orange-500 mb-2" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Metabolism</p>
                                        <p className="text-lg font-black text-slate-800">High Impact</p>
                                    </div>
                                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 col-span-2 md:col-span-1">
                                        <ShieldCheck size={20} className="text-blue-500 mb-2" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Verification</p>
                                        <p className="text-lg font-black text-slate-800">Clinical</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <CheckCircle size={18} className="text-blue-500" /> Pros & Benefits
                                        </h3>
                                        <ul className="space-y-4">
                                            {plan.pros?.map((pro, i) => (
                                                <li key={i} className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-50">
                                                    <Zap size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                                    <span className="text-sm font-semibold text-slate-700">{pro}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <AlertCircle size={18} className="text-rose-500" /> Potential Cons
                                        </h3>
                                        <ul className="space-y-4">
                                            {plan.cons?.map((con, i) => (
                                                <li key={i} className="flex items-start gap-3 bg-rose-50/50 p-4 rounded-2xl border border-rose-50">
                                                    <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                                                    <span className="text-sm font-semibold text-slate-700">{con}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
                        </motion.div>

                        {/* Daily Schedule */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black text-slate-900 ml-4 flex items-center gap-3">
                                <Calendar size={28} className="text-blue-600" /> 10-Day Meal Protocol
                            </h2>
                            <div className="grid gap-4">
                                {plan.days?.map((day) => (
                                    <motion.div
                                        key={day.day}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-lg transition-all"
                                    >
                                        <div className="flex flex-col md:flex-row gap-8">
                                            <div className="md:w-32">
                                                <div className="bg-slate-900 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center">
                                                    <span className="text-[10px] font-black uppercase leading-none opacity-60">Day</span>
                                                    <span className="text-2xl font-black">{day.day}</span>
                                                </div>
                                            </div>
                                            <div className="flex-1 grid md:grid-cols-3 gap-6">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                        <Utensils size={10} /> Breakfast
                                                    </p>
                                                    <p className="text-sm font-bold text-slate-700">{day.breakfast}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                        <Utensils size={10} /> Lunch
                                                    </p>
                                                    <p className="text-sm font-bold text-slate-700">{day.lunch}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                        <Utensils size={10} /> Dinner
                                                    </p>
                                                    <p className="text-sm font-bold text-slate-700">{day.dinner}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-slate-50 flex items-start gap-3">
                                            <ShieldCheck size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                            <p className="text-xs text-slate-500 font-medium italic"><span className="font-black text-slate-700 uppercase mr-2 tracking-tighter">Clinical Rule:</span> {day.instruction}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: CTA / Dashboard Sync */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-8">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-200 relative overflow-hidden"
                            >
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black mb-4">Start Your Journey</h3>
                                    <p className="text-blue-50 text-sm font-medium mb-8 leading-relaxed">
                                        Activating this diet plans will sync it to your dashboard and help you track your clinical nutrition progress for the next 10 days.
                                    </p>
                                    <button
                                        onClick={handleStartDiet}
                                        disabled={starting}
                                        className="w-full bg-white text-blue-600 hover:bg-blue-50 px-8 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 transition-all disabled:opacity-70"
                                    >
                                        {starting ? "Activating Protocol..." : (
                                            <>
                                                Begin This Diet <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>
                                    <p className="text-center text-[10px] font-bold text-blue-200 uppercase tracking-widest mt-6">
                                        Cancels any current active diet
                                    </p>
                                </div>
                                <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                                <div className="absolute top-0 right-0 p-8 opacity-20">
                                    <Apple size={64} />
                                </div>
                            </motion.div>

                            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <ShieldCheck size={18} className="text-slate-400" /> Patient Safety
                                </h4>
                                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold italic">
                                    While these diets are clinically structured, always consult with your primary care physician before starting any intensive nutritional program, especially if you have chronic conditions.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default DietDetail;
