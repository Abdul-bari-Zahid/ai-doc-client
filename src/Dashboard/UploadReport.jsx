
import { useState } from "react";
import { API } from "../api";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function UploadReport() {
  const [file, setFile] = useState(null);
  const [reportDate, setReportDate] = useState("");
  const [reportType, setReportType] = useState("");
  const [reportResult, setReportResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return toast.error("Please select a file");
    if (!reportDate) return toast.error("Select report date");
    if (!reportType) return toast.error("Select report type");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("reportDate", reportDate);
    formData.append("reportType", reportType);

    const token = localStorage.getItem("token");

    setLoading(true);
    try {
      const res = await API.post("/reports/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Report uploaded ✅");
      setReportResult(res.data.report);
    } catch (err) {
      toast.error(err.response?.data?.error || "Upload failed ❌");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!reportResult) return;

    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("MediAI", 105, 15, null, null, "center");
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("AI Health Assistant", 105, 22, null, null, "center");

    doc.setLineWidth(0.5);
    doc.line(15, 28, 195, 28);

    // Report Info
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Report Information", 14, 35);

    autoTable(doc, {
      startY: 38,
      head: [['Field', 'Value']],
      body: [
        ['Report Type', reportType],
        ['Report Date', reportDate],
        ['Uploaded File', file?.name || '-'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [33, 150, 243], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 11 }
    });

    // AI Summary
    let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 60;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("AI Report Summary", 14, finalY);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const splitText = doc.splitTextToSize(reportResult.aiSummary || "-", 180);
    doc.text(splitText, 14, finalY + 6);

    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    const date = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`MediAI – AI Health Assistant`, 105, pageHeight - 10, null, null, "center");
    doc.text(`Generated on: ${date}`, 105, pageHeight - 5, null, null, "center");

    doc.save("MediAI_Report.pdf");
  };

  return (
    <div className="p-6 max-w-[90%] md:max-w-2xl mx-auto bg-white shadow-lg rounded-lg mt-5">
      <h2 className="text-2xl font-bold mb-4">Upload Medical Report</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full border p-2 rounded"
        />

        <label className="block text-sm font-medium">Report Date</label>
        <input
          type="date"
          value={reportDate}
          onChange={(e) => setReportDate(e.target.value)}
          className="block w-full border p-2 rounded"
        />

        <label className="block text-sm font-medium">Report Type</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="block w-full border p-2 rounded"
        >
          <option value="">Select Type</option>
          <option>Blood Test</option>
          <option>Urine Test</option>
          <option>X-Ray</option>
          <option>MRI</option>
          <option>CT Scan</option>
          <option>Other</option>
        </select>

        <button
          type="submit"
          className={`bg-blue-600 hover:bg-blue-700 text-white py-2 rounded w-full font-semibold`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload & Analyze"}
        </button>
      </form>

      {reportResult && (
        <div className="mt-6 p-4 bg-gray-100 border rounded">
          <h3 className="text-lg font-bold mb-2">AI Report Summary</h3>

          <img
            src={reportResult.fileUrl}
            alt="Report Preview"
            className="mb-2 max-h-60 border rounded"
          />

          <div className="prose whitespace-pre-line text-sm bg-white p-3 rounded border">
            {reportResult.aiSummary}
          </div>

          <button
            onClick={handleDownload}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default UploadReport;
