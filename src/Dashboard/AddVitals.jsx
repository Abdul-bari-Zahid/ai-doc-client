import { useState, useEffect } from "react";
import {
  HeartPulse,
  Dumbbell,
  PencilLine,
  Activity,
  CheckCircle,
  Download,
  Pill,
  ExternalLink,
  AlertTriangle,
  TrendingUp,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { API } from "../api";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

function AddVitals() {
  const [form, setForm] = useState({ bp: "", sugar: "", weight: "", notes: "" });
  const [vitalsResult, setVitalsResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("/users/dashboard")
      .then(res => setUser(res.data.user))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.bp || !form.sugar || !form.weight) {
      return toast.error("Please fill all vitals fields");
    }

    setLoading(true);
    try {
      const res = await API.post("/vitals/add", form);
      // res.data.vitals contains the new vitals doc with structuredData
      setVitalsResult(res.data.vitals);
      toast.success("Analysis complete! ✅");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error saving vitals ❌");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!vitalsResult) return;

    const doc = new jsPDF();
    const data = vitalsResult.structuredData || {};

    // Header
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text("MediAI Health Vitals", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated for ${user?.name || "Patient"} | Date: ${new Date().toLocaleDateString()}`, 105, 27, { align: "center" });

    doc.setDrawColor(200);
    doc.line(15, 35, 195, 35);

    // Summary Section
    doc.setFontSize(14);
    doc.setTextColor(30, 64, 175);
    doc.text("Vitals Summary", 15, 45);
    doc.setFontSize(11);
    doc.setTextColor(0);
    const splitSummary = doc.splitTextToSize(data.summary || vitalsResult.aiResult || "-", 180);
    doc.text(splitSummary, 15, 52);

    // Vitals Table
    autoTable(doc, {
      startY: 75,
      head: [['Vital Metric', 'Recorded Value']],
      body: [
        ['Blood Pressure', form.bp],
        ['Sugar Level', `${form.sugar} mg/dL`],
        ['Body Weight', `${form.weight} kg`],
        ['Notes', form.notes || '-'],
      ],
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
    });

    let nextY = doc.lastAutoTable.finalY + 15;

    // Medicine Suggestions
    if (data.medicineSuggestions && data.medicineSuggestions.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(30, 64, 175);
      doc.text("Suggested Support", 15, nextY);

      autoTable(doc, {
        startY: nextY + 5,
        head: [['Medicine', 'Formula', 'Purpose']],
        body: data.medicineSuggestions.map(m => [m.name, m.formula, m.purpose]),
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] },
      });
    }

    doc.save(`MediAI_Vitals_${new Date().getTime()}.pdf`);
  };

  const data = vitalsResult?.structuredData || {};

  // Prepare Chart Data
  const chartData = (data.keyFindings || [])
    .filter(f => f.numericValue && !isNaN(f.numericValue))
    .map(f => ({
      name: f.test,
      value: f.numericValue,
      status: f.status,
      unit: f.unit
    }));

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* Left Side: Entry Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-slate-100 h-full"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-100">
                <HeartPulse size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Vital Signs</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Instant Health Entry</p>
              </div>
            </div>

            <p className="text-[10px] font-black text-slate-400 mb-8 bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200 uppercase tracking-widest text-center">
              Settings: <span className="text-blue-600">{user?.language}</span> Analysis • <span className="text-blue-600">{user?.country}</span> Localization
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Blood Pressure</label>
                  <input
                    type="text"
                    placeholder="120/80"
                    value={form.bp}
                    onChange={(e) => setForm({ ...form, bp: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sugar (mg/dL)</label>
                  <input
                    type="number"
                    placeholder="95"
                    value={form.sugar}
                    onChange={(e) => setForm({ ...form, sugar: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Dumbbell size={14} className="text-indigo-500" /> Weight (kg)
                </label>
                <input
                  type="number"
                  placeholder="70"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <PencilLine size={14} className="text-indigo-500" /> Clinical Notes
                </label>
                <textarea
                  placeholder="Stress levels, symptoms, or physical activity details..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 uppercase tracking-widest text-xs"
              >
                {loading ? (
                  <>
                    <Activity className="animate-spin" size={20} />
                    Processing Vitals...
                  </>
                ) : (
                  <>
                    <TrendingUp size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Save & Analyze Vitals
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Right Side: Results Preview */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {!vitalsResult ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-indigo-600 rounded-[2.5rem] p-12 text-white text-center shadow-2xl relative overflow-hidden h-[600px] flex flex-col justify-center border border-white/10"
                >
                  <div className="relative z-10">
                    <Activity size={56} className="mx-auto mb-8 text-blue-200 opacity-80" />
                    <h3 className="text-3xl font-black mb-4">AI Diagnostic Intelligence</h3>
                    <p className="text-blue-100 text-sm leading-relaxed mb-8 font-medium">
                      Enter your vitals to receive immediate medical insights from our AI consultant, tailored to your local region (<strong>{user?.country}</strong>).
                    </p>
                    <div className="flex justify-center gap-4">
                      <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                        <Bot size={28} />
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-50"></div>
                  <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  {/* Summary Card */}
                  <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-slate-100 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-[10px]">
                        <Bot size={18} /> AI Summary
                      </div>
                      <button
                        onClick={downloadPDF}
                        className="p-3 bg-slate-50 hover:bg-blue-50 rounded-2xl transition-all text-slate-500 hover:text-blue-600 border border-slate-100"
                      >
                        <Download size={20} />
                      </button>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium relative z-10">
                      {data.summary || vitalsResult.aiResult}
                    </p>
                  </div>

                  {/* Vitals Chart */}
                  {chartData.length > 0 && (
                    <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-slate-100">
                      <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px] mb-8">
                        <Activity size={18} /> Vitals Visualization
                      </div>
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                              dataKey="name"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            />
                            <YAxis hide domain={[0, 'auto']} />
                            <Tooltip
                              cursor={{ fill: '#f8fafc' }}
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const d = payload[0].payload;
                                  return (
                                    <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-100">
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{d.name}</p>
                                      <p className="text-lg font-black text-slate-800">{d.value} <span className="text-xs text-slate-400 font-normal">{d.unit}</span></p>
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d.status?.toLowerCase().includes('high') ? 'bg-red-50 text-red-600' :
                                          d.status?.toLowerCase().includes('low') ? 'bg-orange-50 text-orange-600' :
                                            'bg-green-50 text-green-600'
                                        }`}>
                                        {d.status}
                                      </span>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                              {chartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    entry.status?.toLowerCase().includes('high') ? '#ef4444' :
                                      entry.status?.toLowerCase().includes('low') || entry.status === 'Elevated' ? '#f97316' :
                                        '#3b82f6'
                                  }
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Localized Medicines */}
                  {data.medicineSuggestions?.length > 0 && (
                    <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-slate-100">
                      <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-[10px] mb-6">
                        <Pill size={18} /> Preferred Support ({user?.country})
                      </div>
                      <div className="grid gap-3">
                        {data.medicineSuggestions.map((med, idx) => (
                          <div key={idx} className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100 group hover:bg-emerald-200/30 transition-all">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-black text-slate-800 text-sm">{med.name}</h4>
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{med.formula}</p>
                              </div>
                              {med.link && (
                                <a href={med.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-xl text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                  <ExternalLink size={16} />
                                </a>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold">{med.purpose}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="bg-slate-900 rounded-[2.5rem] shadow-xl p-9 text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 font-black mb-6 bg-white/10 w-fit px-4 py-2 rounded-full text-[10px] tracking-widest uppercase border border-white/10">
                        <Activity size={16} className="text-blue-400" /> Clinical Recommendations
                      </div>

                      {data.recommendations && Array.isArray(data.recommendations) ? (
                        <ul className="space-y-4 mb-8">
                          {data.recommendations.map((rec, i) => (
                            <li key={i} className="text-xs text-slate-300 leading-relaxed flex items-start gap-3">
                              <CheckCircle size={16} className="text-blue-500 shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm leading-relaxed text-slate-300 mb-8 font-medium">
                          General health maintenance suggested.
                        </p>
                      )}

                      <div className="pt-6 border-t border-white/5 flex items-start gap-3">
                        <AlertTriangle size={18} className="text-orange-400 shrink-0" />
                        <p className="text-[10px] text-slate-500 italic">
                          AI insights for educational purposes. Mandatory consultation with a doctor required for diagnosis.
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddVitals;
