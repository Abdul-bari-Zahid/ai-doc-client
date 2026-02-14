
import { useState, useEffect } from "react";
import { API } from "../api";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Globe, CheckCircle, Download, AlertTriangle, Activity, BriefcaseMedical, ExternalLink, Pill, Bot } from "lucide-react";
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

function UploadReport() {
  const [file, setFile] = useState(null);
  const [reportDate, setReportDate] = useState("");
  const [reportType, setReportType] = useState("");
  const [user, setUser] = useState(null);
  const [reportResult, setReportResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get("/users/dashboard").then(res => setUser(res.data.user)).catch(console.error);
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return toast.error("Please select a file");
    if (!reportDate) return toast.error("Select report date");
    if (!reportType) return toast.error("Select report type");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("reportDate", reportDate);
    formData.append("reportType", reportType);

    try {
      const res = await API.post("/reports/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Analysis complete! ✅");
      setReportResult(res.data.report);
    } catch (err) {
      toast.error(err.response?.data?.error || "Analysis failed ❌");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!reportResult) return;

    const doc = new jsPDF();
    const data = reportResult.structuredData || {};

    doc.setFontSize(22);
    doc.setTextColor(30, 64, 175);
    doc.text("MediAI Health Analysis", 105, 20, null, null, "center");

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated for ${user?.name} in ${user?.country}`, 105, 28, null, null, "center");

    doc.setDrawColor(200);
    doc.line(15, 35, 195, 35);

    // Summary Section
    doc.setFontSize(14);
    doc.setTextColor(30, 64, 175);
    doc.text("Report Summary", 15, 45);
    doc.setFontSize(11);
    doc.setTextColor(0);
    const splitSummary = doc.splitTextToSize(data.summary || reportResult.aiSummary || "-", 180);
    doc.text(splitSummary, 15, 52);

    // Key Findings Table
    if (data.keyFindings && data.keyFindings.length > 0) {
      autoTable(doc, {
        startY: 70,
        head: [['Test', 'Value', 'Status']],
        body: data.keyFindings.map(f => [f.test, f.value, f.status]),
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
      });
    }

    // Medicine Suggestions
    if (data.medicineSuggestions && data.medicineSuggestions.length > 0) {
      let currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 120;
      doc.setFontSize(14);
      doc.setTextColor(30, 64, 175);
      doc.text("Suggested Medicines", 15, currentY);

      autoTable(doc, {
        startY: currentY + 5,
        head: [['Medicine', 'Formula', 'Purpose']],
        body: data.medicineSuggestions.map(m => [m.name, m.formula, m.purpose]),
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] },
      });
    }

    doc.save(`MediAI_Analysis_${reportResult._id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* Left Side: Upload Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                <Upload size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">New Analysis</h2>
            </div>

            <p className="text-xs text-slate-400 mb-6 bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
              Settings: <strong>{user?.language}</strong> language analysis for <strong>{user?.country}</strong>.
              Change these on the Dashboard if needed.
            </p>

            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Medical Report File</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center group-hover:border-blue-400 transition-colors bg-slate-50">
                    <Upload className="mx-auto text-slate-400 mb-2" size={32} />
                    <p className="text-sm text-slate-500 font-medium">
                      {file ? file.name : "Click to browse or drag and drop report"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 ml-1">Report Date</label>
                  <input
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 ml-1">Report Category</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                  >
                    <option value="">Select Type</option>
                    <option>Blood Test</option>
                    <option>Urine Test</option>
                    <option>X-Ray</option>
                    <option>MRI / CT Scan</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Activity className="animate-spin" size={20} />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <BriefcaseMedical size={20} className="group-hover:rotate-12 transition-transform" />
                    Start AI Analysis
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Right Side: Results Preview */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {!reportResult ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-blue-600 rounded-3xl p-10 text-white text-center shadow-2xl relative overflow-hidden h-full flex flex-col justify-center"
                >
                  <div className="relative z-10">
                    <Activity size={48} className="mx-auto mb-6 opacity-80" />
                    <h3 className="text-2xl font-bold mb-3">AI Diagnostic Engine</h3>
                    <p className="text-blue-100 text-sm leading-relaxed mb-6">
                      Our system will detect anomalies and suggest medicines specific to <strong>{user?.country}</strong>.
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  {/* Analysis Summary Card */}
                  <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-blue-600 font-bold">
                        <CheckCircle size={20} />
                        AI Summary ({reportResult.language})
                      </div>
                      <button
                        onClick={handleDownload}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                      >
                        <Download size={20} />
                      </button>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {reportResult.structuredData?.summary || reportResult.aiSummary}
                    </p>
                  </div>

                  {/* AI Visualization / Chart */}
                  {(reportResult.structuredData?.keyFindings || []).filter(f => f.numericValue && !isNaN(f.numericValue)).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100"
                    >
                      <div className="flex items-center gap-2 text-indigo-600 font-bold mb-6">
                        <Activity size={18} />
                        Visual Analysis
                      </div>
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={reportResult.structuredData.keyFindings.filter(f => f.numericValue && !isNaN(f.numericValue)).map(f => ({
                            name: f.test.length > 10 ? f.test.substring(0, 10) + '...' : f.test,
                            fullName: f.test,
                            value: f.numericValue,
                            status: f.status
                          }))}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                              dataKey="name"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }}
                            />
                            <YAxis hide domain={[0, 'auto']} />
                            <Tooltip
                              cursor={{ fill: '#f8fafc' }}
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const d = payload[0].payload;
                                  return (
                                    <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100">
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{d.fullName}</p>
                                      <p className="text-md font-black text-slate-800">{d.value}</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={30}>
                              {reportResult.structuredData.keyFindings.filter(f => f.numericValue && !isNaN(f.numericValue)).map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    entry.status?.toLowerCase().includes('high') ? '#ef4444' :
                                      entry.status?.toLowerCase().includes('low') ? '#f97316' :
                                        '#3b82f6'
                                  }
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                  )}

                  {/* Key Findings Table */}
                  <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="p-6 pb-0 flex items-center gap-2 text-indigo-600 font-bold mb-4">
                      <BriefcaseMedical size={20} />
                      Test Results
                    </div>
                    <div className="overflow-x-auto px-6 pb-6">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-50 text-slate-400">
                            <th className="py-3 text-left font-semibold text-[10px] uppercase tracking-wider">Test Name</th>
                            <th className="py-3 text-left font-semibold text-[10px] uppercase tracking-wider">Value</th>
                            <th className="py-3 text-right font-semibold text-[10px] uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {(reportResult.structuredData?.keyFindings || []).map((finding, idx) => (
                            <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                              <td className="py-4 font-bold text-slate-700">{finding.test}</td>
                              <td className="py-4 text-slate-600 font-medium">{finding.value}</td>
                              <td className="py-4 text-right">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${finding.status?.toLowerCase().includes('high') ? 'bg-red-50 text-red-600' :
                                  finding.status?.toLowerCase().includes('low') ? 'bg-orange-50 text-orange-600' :
                                    'bg-green-50 text-green-600'
                                  }`}>
                                  {finding.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Medicine Suggestions */}
                  {reportResult.structuredData?.medicineSuggestions?.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
                      <div className="flex items-center gap-2 text-emerald-600 font-bold mb-6">
                        <div className="p-2 bg-emerald-50 rounded-xl">
                          <Pill size={18} />
                        </div>
                        Localized Medicine ({user?.country})
                      </div>
                      <div className="grid gap-3">
                        {reportResult.structuredData.medicineSuggestions.map((med, idx) => (
                          <div key={idx} className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 group hover:bg-emerald-100/50 transition-all">
                            <div className="flex justify-between items-start mb-1">
                              <div>
                                <h4 className="font-black text-slate-800 text-xs">{med.name}</h4>
                                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{med.formula}</p>
                              </div>
                              {med.link && (
                                <a href={med.link} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white rounded-lg text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                  <ExternalLink size={12} />
                                </a>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{med.purpose}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations Card */}
                  <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl shadow-xl p-7 text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 font-bold mb-4 bg-white/20 w-fit px-3 py-1 rounded-full text-[10px] tracking-widest uppercase">
                        <Bot size={14} /> Professional Insight
                      </div>

                      {reportResult.structuredData?.recommendations && Array.isArray(reportResult.structuredData.recommendations) ? (
                        <ul className="space-y-2 mb-6">
                          {reportResult.structuredData.recommendations.map((rec, i) => (
                            <li key={i} className="text-xs text-blue-50 leading-relaxed flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-blue-300 mt-1.5 shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm leading-relaxed text-blue-50 mb-6">
                          {reportResult.structuredData?.recommendations || reportResult.aiSummary}
                        </p>
                      )}

                      <div className="pt-4 border-t border-white/10 flex items-start gap-2">
                        <AlertTriangle size={14} className="text-orange-300 shrink-0" />
                        <p className="text-[9px] text-white/50 leading-relaxed italic">
                          AI analysis for informational use only. Mandatory doctor consultation required.
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
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

export default UploadReport;
