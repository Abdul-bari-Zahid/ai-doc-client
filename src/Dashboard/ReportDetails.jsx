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
    const getVal = (val) => val || "-";

    // 1. Header
    doc.setFontSize(20);
    doc.setTextColor(30, 64, 175);
    doc.text(getVal(data.report_type) || "Medical Report Analysis", 105, 20, null, null, "center");

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated for ${report.userId?.name || "Patient"} | ${new Date(report.reportDate).toLocaleDateString()}`, 105, 28, null, null, "center");

    doc.setDrawColor(200);
    doc.line(15, 35, 195, 35);

    let finalY = 45;

    // 2. Patient & Report Details
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Patient Details", 15, finalY);
    doc.text("Report Details", 110, finalY);

    doc.setFontSize(9);
    doc.setTextColor(80);

    const pInfo = data.patient_information || {};
    doc.text(`Name: ${getVal(pInfo.name)}`, 15, finalY + 6);
    doc.text(`Age/Sex: ${getVal(pInfo.age)} / ${getVal(pInfo.sex)}`, 15, finalY + 11);
    doc.text(`Ref By: ${getVal(pInfo.referred_by)}`, 15, finalY + 16);

    const rInfo = data.report_details || {};
    doc.text(`Lab: ${getVal(rInfo.lab_name)}`, 110, finalY + 6);
    doc.text(`Collected: ${getVal(rInfo.collected_on)}`, 110, finalY + 11);
    doc.text(`Reported: ${getVal(rInfo.reported_on)}`, 110, finalY + 16);

    finalY += 25;

    // 3. Test Results Table
    if (data.test_results && data.test_results.length > 0) {
      doc.setFontSize(12);
      doc.setTextColor(30, 64, 175);
      doc.text("Test Results", 15, finalY);

      autoTable(doc, {
        startY: finalY + 5,
        head: [['Test Name', 'Value', 'Unit', 'Ref. Range', 'Status']],
        body: data.test_results.map(t => [t.test_name, t.value, t.unit, t.reference_range, t.status]),
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
        styles: { fontSize: 8 }
      });
      finalY = doc.lastAutoTable.finalY + 15;
    }

    // 4. Interpretation Summary
    if (data.interpretation_summary) {
      if (finalY > 250) { doc.addPage(); finalY = 20; }

      doc.setFontSize(12);
      doc.setTextColor(30, 64, 175);
      doc.text("Interpretation & Analysis", 15, finalY);
      finalY += 8;

      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text(`Overall Status: ${getVal(data.interpretation_summary.overall_status)}`, 15, finalY);
      finalY += 8;

      const abnormalities = data.interpretation_summary.abnormal_findings || [];
      if (abnormalities.length > 0) {
        doc.setFontSize(9);
        doc.setTextColor(220, 38, 38);
        doc.text("Abnormal Findings:", 15, finalY);
        finalY += 5;

        abnormalities.forEach(ab => {
          const line = `• ${ab.parameter}: ${ab.clinical_significance}`;
          const splitLine = doc.splitTextToSize(line, 180);
          doc.text(splitLine, 20, finalY);
          finalY += (splitLine.length * 5);
        });
        finalY += 5;
      }
    }

    // 5. Pathologist Analysis
    const analysis = data.diagnostic_pathologist_analysis;
    if (analysis) {
      if (finalY > 240) { doc.addPage(); finalY = 20; }
      doc.setFontSize(12);
      doc.setTextColor(30, 64, 175);
      doc.text("Pathologist Analysis", 15, finalY);
      finalY += 8;
      doc.setFontSize(9);
      doc.setTextColor(0);

      const addSection = (title, items) => {
        if (items && items.length > 0) {
          doc.setFont(undefined, 'bold');
          doc.text(title, 15, finalY);
          doc.setFont(undefined, 'normal');
          finalY += 5;
          items.forEach(item => {
            const splitItem = doc.splitTextToSize(`• ${item}`, 175);
            doc.text(splitItem, 20, finalY);
            finalY += (splitItem.length * 4) + 2;
          });
          finalY += 3;
        }
      };

      addSection("Key Findings:", analysis.key_findings);
      addSection("Recommendations:", analysis.recommendations);
    }

    // 6. Medicine Suggestions
    if (data.medicineSuggestions && data.medicineSuggestions.length > 0) {
      if (finalY > 240) { doc.addPage(); finalY = 20; }
      doc.setFontSize(12);
      doc.setTextColor(30, 64, 175);
      doc.text("Suggested Medicines", 15, finalY);
      autoTable(doc, {
        startY: finalY + 5,
        head: [['Medicine', 'Formula', 'Purpose']],
        body: data.medicineSuggestions.map(m => [m.name, m.formula, m.purpose]),
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] },
        styles: { fontSize: 8 }
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

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

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

        <div className="space-y-6">
          {/* 1. Header Card with Patient & Report Info */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-800 mb-1">
                  {data.report_type || report.reportType}
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Reported on {new Date(report.reportDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <CheckCircle size={14} /> Patient Details
                </div>
                <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-sm">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-bold text-slate-800 text-right">{data.patient_information?.name || "-"}</span>

                  <span className="text-slate-500">Age / Sex:</span>
                  <span className="font-bold text-slate-800 text-right">
                    {data.patient_information?.age || "-"} / {data.patient_information?.sex || "-"}
                  </span>

                  <span className="text-slate-500">Ref. By:</span>
                  <span className="font-bold text-slate-800 text-right">{data.patient_information?.referred_by || "-"}</span>
                </div>
              </div>
              <div className="space-y-2 md:border-l md:border-slate-200 md:pl-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <BriefcaseMedical size={14} /> Report Details
                </div>
                <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-sm">
                  <span className="text-slate-500">Lab Name:</span>
                  <span className="font-bold text-slate-800 text-right truncate">{data.report_details?.lab_name || "-"}</span>

                  <span className="text-slate-500">Collected:</span>
                  <span className="font-bold text-slate-800 text-right">{data.report_details?.collected_on || "-"}</span>

                  <span className="text-slate-500">Reported:</span>
                  <span className="font-bold text-slate-800 text-right">{data.report_details?.reported_on || "-"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Visual Graphs */}
          {(data.test_results || [])
            .filter(r => r.numeric_value !== null && r.numeric_value !== undefined).length > 0 && (
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
                <div className="flex items-center gap-2 text-indigo-600 font-bold mb-6">
                  <TrendingUp size={18} /> Visual Trends
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.test_results.filter(r => r.numeric_value !== null)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="test_name"
                        tick={{ fontSize: 9, fill: '#64748b' }}
                        interval={0}
                        tickFormatter={(val) => val.length > 10 ? val.substring(0, 8) + '...' : val}
                      />
                      <YAxis hide />
                      <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="numeric_value" radius={[4, 4, 0, 0]}>
                        {data.test_results.filter(r => r.numeric_value !== null).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={
                            entry.status?.toLowerCase().includes('high') ? '#ef4444' :
                              entry.status?.toLowerCase().includes('low') ? '#f97316' : '#3b82f6'
                          } />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

          {/* 3. Detailed Test Results Table */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="p-6 pb-4 border-b border-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText size={18} className="text-blue-500" /> Test Results
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Test Name</th>
                    <th className="px-6 py-3">Value</th>
                    <th className="px-6 py-3">Reference Range</th>
                    <th className="px-6 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(data.test_results || []).map((test, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700">{test.test_name}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800">{test.value}</span>
                        <span className="text-xs text-slate-400 ml-1">{test.unit}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">{test.reference_range}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                                    ${test.status?.toLowerCase().includes('high') ? 'bg-red-50 text-red-600' :
                            test.status?.toLowerCase().includes('low') ? 'bg-orange-50 text-orange-600' :
                              'bg-green-50 text-green-600'}`}>
                          {test.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Professional Insight / Pathologist Analysis */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Interpretation Summary */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Bot size={18} className="text-purple-500" /> Interpretation
              </h3>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                  <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Overall Status</p>
                  <p className="font-bold text-purple-900 text-lg">
                    {data.interpretation_summary?.overall_status || "Pending Review"}
                  </p>
                </div>

                {(data.interpretation_summary?.abnormal_findings || []).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Abnormal Findings</p>
                    {data.interpretation_summary.abnormal_findings.map((item, i) => (
                      <div key={i} className="flex gap-3 items-start p-3 bg-red-50 rounded-xl border border-red-100">
                        <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-bold text-red-700 text-xs">{item.parameter} ({item.value})</p>
                          <p className="text-red-600/80 text-xs leading-snug">{item.clinical_significance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pathologist Notes */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-lg p-6 text-white">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <BriefcaseMedical size={18} className="text-blue-400" /> Pathologist Analysis
              </h3>

              <div className="space-y-4 text-sm text-slate-300">
                <div>
                  <p className="font-bold text-slate-400 text-xs uppercase mb-2">Key Findings</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {(data.diagnostic_pathologist_analysis?.key_findings || []).map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                {(data.diagnostic_pathologist_analysis?.recommendations || []).length > 0 && (
                  <div className="pt-4 border-t border-slate-700">
                    <p className="font-bold text-slate-400 text-xs uppercase mb-2">Recommendations</p>
                    <ul className="list-disc pl-4 space-y-1 text-blue-200">
                      {data.diagnostic_pathologist_analysis.recommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 5. Medicine Suggestions */}
          {(data.medicineSuggestions || []).length > 0 && (
            <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
              <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <Pill size={18} /> Regional Medicine Suggestions
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {data.medicineSuggestions.map((med, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100/50">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-800">{med.name}</h4>
                      {med.link && <a href={med.link} target="_blank" className="text-emerald-500 hover:text-emerald-700"><ExternalLink size={14} /></a>}
                    </div>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">{med.formula}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{med.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-[10px] text-center text-slate-400 italic">
            Disclaimer: This analysis is generated by AI and is not a substitute for professional medical advice.
            Always consult with a qualified healthcare provider.
          </p>

        </div>
      </div>
    </div>
  );
}

export default ReportDetail;
