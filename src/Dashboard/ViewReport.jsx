
import { useEffect, useState } from "react";
import { Bot, FileText, Download, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

function ViewReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://ai-doc-ser.vercel.app/api/reports/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch reports ❌");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = (report) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("MediAI", 105, 15, null, null, "center");
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("AI Health Assistant", 105, 22, null, null, "center");
    doc.line(15, 28, 195, 28);

    doc.setFontSize(12);
    doc.text(`Report Type: ${report.reportType}`, 15, 40);
    doc.text(`Report Date: ${new Date(report.reportDate).toLocaleDateString()}`, 15, 48);
    doc.text(`Generated At: ${new Date(report.createdAt).toLocaleString()}`, 15, 56);

    const splitText = doc.splitTextToSize(report.aiSummary || "", 180);
    doc.setFontSize(11);
    doc.text(splitText, 15, 70);

    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("MediAI – AI Health Assistant", 105, pageHeight - 10, null, null, "center");

    doc.save(`MediAI_Report_${report._id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Your Health Reports</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading reports...</p>
        ) : reports.length === 0 ? (
          <p className="text-center text-gray-500">No reports found.</p>
        ) : (
          reports.map((report) => (
            <div key={report._id} className="bg-white p-6 rounded-xl shadow-lg space-y-4">
              <div>
                <h2 className="text-xl font-bold flex gap-2 items-center">
                  <FileText className="text-blue-600"/> {report.reportType} - {new Date(report.reportDate).toLocaleDateString()}
                </h2>
                <div className="border mt-4 rounded-lg aspect-[4/3] flex items-center justify-center bg-gray-50">
                  <p className="text-gray-500">📄 PDF Preview Coming Soon</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold flex gap-2 items-center">
                  <Bot className="text-green-600"/> AI Summary
                </h2>
                <p className="text-gray-700 mt-3 leading-relaxed whitespace-pre-line">
                  {report.aiSummary.substring(0, 150)}...
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mt-3">
                <button
                  onClick={() => downloadPDF(report)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  <Download className="h-4 w-4"/> Download PDF
                </button>
                <button
                  onClick={() => navigate(`/reports/${report._id}`)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  <Eye className="h-4 w-4"/> View Details
                </button>
              </div>
            </div>
          ))
        )}

        <div className="mt-8 text-center">
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ViewReport;
