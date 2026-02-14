import { useEffect, useState } from "react";
import {
  Bot,
  FileText,
  Download,
  Eye,
  Calendar,
  ArrowLeft,
  Search,
  Activity
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import { API } from "../api";

function ViewReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await API.get("/reports/user");
      setReports(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch records ❌");
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(r =>
    r.reportType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.aiSummary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadPDF = (report) => {
    if (!report) return;
    const doc = new jsPDF();
    const data = report.structuredData || {};

    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text("MediAI Diagnostic", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`ID: ${report._id} | Date: ${new Date(report.reportDate).toLocaleDateString()}`, 105, 27, { align: "center" });

    doc.setDrawColor(200);
    doc.line(15, 35, 195, 35);

    doc.setFontSize(14);
    doc.setTextColor(30, 64, 175);
    doc.text("Report Summary", 15, 45);
    doc.setFontSize(11);
    doc.setTextColor(0);
    const splitSummary = doc.splitTextToSize(data.summary || report.aiSummary || "-", 180);
    doc.text(splitSummary, 15, 52);

    if (data.keyFindings && data.keyFindings.length > 0) {
      autoTable(doc, {
        startY: 75,
        head: [['Test', 'Value', 'Status']],
        body: data.keyFindings.map(f => [f.test, f.value, f.status]),
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
      });
    }

    doc.save(`MediAI_Report_${report._id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Medical Vault</h1>
            <p className="text-slate-500 font-bold flex items-center gap-2">
              <Activity size={18} className="text-blue-500" />
              Chronological history of your AI-analyzed health records
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 shadow-sm transition-all"
              />
            </div>
            <Link
              to="/dashboard"
              className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-500 hover:text-blue-600 transition-all"
            >
              <ArrowLeft size={20} />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <Activity className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Decrypting Vault...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <FileText className="text-slate-200 mx-auto mb-4" size={64} />
            <p className="text-slate-400 font-bold">No medical records found matches your search.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredReports.map((report, idx) => (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 hover:border-blue-200 transition-all group flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <FileText size={24} />
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                      <Calendar size={12} />
                      {new Date(report.reportDate).toLocaleDateString()}
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-slate-800 mb-3 line-clamp-1">{report.reportType}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-8 flex-1 line-clamp-3">
                    {report.aiSummary || "Summary processing..."}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-auto pt-6 border-t border-slate-50">
                    <button
                      onClick={() => navigate(`/reports/${report._id}`)}
                      className="flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all"
                    >
                      <Eye size={14} /> Full View
                    </button>
                    <button
                      onClick={() => downloadPDF(report)}
                      className="flex items-center justify-center gap-2 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                      <Download size={14} /> PDF
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewReport;
