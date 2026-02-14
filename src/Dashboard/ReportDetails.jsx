import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Bot,
  FileText,
  Download,
  Activity,
  ArrowLeft,
  CheckCircle,
  Pill,
  ExternalLink,
  AlertTriangle,
  TrendingUp,
  Target
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

function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const res = await API.get(`/reports/${id}`);
      setReport(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch report ❌");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!report) return;
    const doc = new jsPDF();
    const data = report.structuredData || {};

    // Header
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text("MediAI Diagnostic", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`ID: ${report._id} | Date: ${new Date(report.reportDate).toLocaleDateString()}`, 105, 27, { align: "center" });

    doc.setDrawColor(200);
    doc.line(15, 35, 195, 35);

    // Summary Section
    doc.setFontSize(14);
    doc.setTextColor(30, 64, 175);
    doc.text("Report Summary", 15, 45);
    doc.setFontSize(11);
    doc.setTextColor(0);
    const splitSummary = doc.splitTextToSize(data.summary || report.aiSummary || "-", 180);
    doc.text(splitSummary, 15, 52);

    let nextY = 75;

    // Key Findings Table
    if (data.keyFindings && data.keyFindings.length > 0) {
      autoTable(doc, {
        startY: nextY,
        head: [['Test', 'Value', 'Status']],
        body: data.keyFindings.map(f => [f.test, f.value, f.status]),
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
      });
      nextY = doc.lastAutoTable.finalY + 15;
    }

    // Medicine Suggestions
    if (data.medicineSuggestions && data.medicineSuggestions.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(30, 64, 175);
      doc.text("Suggested Medicines", 15, nextY);

      autoTable(doc, {
        startY: nextY + 5,
        head: [['Medicine', 'Formula', 'Purpose']],
        body: data.medicineSuggestions.map(m => [m.name, m.formula, m.purpose]),
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] },
      });
    }

    doc.save(`MediAI_Report_${report._id}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Activity className="animate-spin text-blue-600 mr-2" />
        <span className="font-bold text-slate-600 uppercase tracking-widest text-xs">Accessing Records...</span>
      </div>
    );
  }

  if (!report) return <p className="text-center mt-20 text-red-500 font-bold">Report Not Found</p>;

  const data = report.structuredData || {};

  // Prepare Chart Data
  const chartData = (data.keyFindings || [])
    .filter(f => f.numericValue && !isNaN(f.numericValue))
    .map(f => ({
      name: f.test.length > 15 ? f.test.substring(0, 15) + '...' : f.test,
      fullName: f.test,
      value: f.numericValue,
      status: f.status
    }));

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Navigation & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors group"
          >
            <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-blue-50">
              <ArrowLeft size={20} />
            </div>
            Back to Dashboard
          </button>

          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-2xl font-bold shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"
          >
            <Download size={20} /> Download PDF
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-slate-100 relative overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="p-4 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-100">
                  <FileText size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-800">{report.reportType}</h1>
                  <p className="text-sm font-bold text-slate-400 capitalize">
                    Reported on {new Date(report.reportDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative z-10">
                <div className="flex items-center gap-2 text-blue-600 font-bold mb-3">
                  <CheckCircle size={18} />
                  AI Clinical Summary
                </div>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {data.summary || report.aiSummary}
                </p>
              </div>

              {/* Decorative Blur */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
            </motion.div>

            {/* AI Visualization / Chart */}
            {chartData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-slate-100"
              >
                <div className="flex items-center gap-2 text-indigo-600 font-bold mb-8">
                  <TrendingUp size={20} />
                  Visual Diagnosis Markers
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                        dy={10}
                      />
                      <YAxis hide domain={[0, 'auto']} />
                      <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{d.fullName}</p>
                                <p className="text-lg font-black text-slate-800">{d.value}</p>
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
                      <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                        {chartData.map((entry, index) => (
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

            {/* Findings Table */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100"
            >
              <div className="p-8 pb-0">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Target size={20} className="text-indigo-600" /> Key Lab Findings
                </h3>
              </div>

              <div className="overflow-x-auto p-8 pt-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-50 text-slate-400">
                      <th className="py-4 text-left font-bold uppercase tracking-wider text-[10px]">Parameter</th>
                      <th className="py-4 text-left font-bold uppercase tracking-wider text-[10px]">Measured Value</th>
                      <th className="py-4 text-right font-bold uppercase tracking-wider text-[10px]">Clinical Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(data.keyFindings || []).length > 0 ? (
                      data.keyFindings.map((finding, idx) => (
                        <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 font-bold text-slate-700">{finding.test}</td>
                          <td className="py-4 text-slate-600 font-medium">{finding.value}</td>
                          <td className="py-4 text-right">
                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase ${finding.status?.toLowerCase().includes('high') ? 'bg-red-50 text-red-600 border border-red-100' :
                              finding.status?.toLowerCase().includes('low') ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                'bg-green-50 text-green-600 border border-green-100'
                              }`}>
                              {finding.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="3" className="py-8 text-center text-slate-400 italic font-medium text-xs">No specific findings parsed for this report.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Side Column: Medicines & Actions */}
          <div className="space-y-8">

            {/* Recommendations Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] shadow-xl p-8 border border-white/10 text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 font-bold mb-4 bg-white/20 w-fit px-4 py-1.5 rounded-full text-xs">
                  <Bot size={16} /> MediAI Insights
                </div>
                <h3 className="text-xl font-black mb-4 leading-tight">Professional Recommendations</h3>

                {data.recommendations && Array.isArray(data.recommendations) ? (
                  <ul className="space-y-3 mb-6">
                    {data.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-indigo-50 leading-relaxed flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5 shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-indigo-100 leading-relaxed mb-6 font-medium">
                    {data.recommendations || "Routine follow-up suggested."}
                  </p>
                )}

                <div className="pt-6 border-t border-white/10 flex items-start gap-3">
                  <AlertTriangle size={18} className="text-orange-300 shrink-0" />
                  <p className="text-[10px] text-white/60 leading-relaxed italic">
                    AI analysis is for informational purposes. Mandatory physician consultation required for diagnosis.
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            </motion.div>

            {/* Medicine Suggestions */}
            {(data.medicineSuggestions || []).length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-slate-100"
              >
                <div className="flex items-center gap-2 text-emerald-600 font-bold mb-6">
                  <div className="p-2 bg-emerald-50 rounded-xl">
                    <Pill size={20} />
                  </div>
                  Regional Medicine
                </div>
                <div className="space-y-4">
                  {data.medicineSuggestions.map((med, idx) => (
                    <div key={idx} className="p-5 bg-emerald-50 rounded-[2rem] border border-emerald-100 group hover:bg-emerald-100/50 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-black text-slate-800 text-sm">{med.name}</h4>
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">{med.formula}</p>
                        </div>
                        {med.link && (
                          <a href={med.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-xl text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{med.purpose}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ReportDetail;
