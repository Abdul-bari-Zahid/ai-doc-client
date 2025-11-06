import { useState } from "react";
import { HeartPulse, Dumbbell, PencilLine } from "lucide-react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

function AddVitals() {
  const [form, setForm] = useState({ bp: "", sugar: "", weight: "", notes: "" });
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.bp || !form.sugar || !form.weight) {
      return toast.error("Please fill all vitals fields");
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/vitals/add", form);
      setAiResult(res.data.vitals.aiResult);
      toast.success("✅ Vitals saved & AI result generated");
    } catch (err) {
      console.error(err);
      toast.error("❌ Error saving vitals");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!aiResult) return;

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

    // Vitals Table
    autoTable(doc, {
      startY: 35,
      head: [['Vital', 'Value']],
      body: [
        ['Blood Pressure', form.bp],
        ['Sugar Level (mg/dL)', form.sugar],
        ['Weight (kg)', form.weight],
        ['Notes', form.notes || '-'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [33, 150, 243], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 11 }
    });

    // AI Summary
    let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 60;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("AI Health Summary", 14, finalY);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const splitText = doc.splitTextToSize(aiResult, 180);
    doc.text(splitText, 14, finalY + 6);

    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    const date = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`MediAI – AI Health Assistant`, 105, pageHeight - 10, null, null, "center");
    doc.text(`Generated on: ${date}`, 105, pageHeight - 5, null, null, "center");

    doc.save("MediAI_Vitals_Report.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center p-6">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-4">Add Vitals</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Blood Pressure */}
          <div>
            <label className="text-gray-600 font-medium flex gap-2 items-center">
              <HeartPulse className="h-4 w-4 text-blue-700" /> Blood Pressure
            </label>
            <input
              className="w-full border p-3 rounded-lg"
              placeholder="120/80"
              value={form.bp}
              onChange={(e) => setForm({ ...form, bp: e.target.value })}
            />
          </div>

          {/* Sugar */}
          <div>
            <label className="text-gray-600 font-medium">Sugar Level (mg/dL)</label>
            <input
              type="number"
              className="w-full border p-3 rounded-lg"
              placeholder="95"
              value={form.sugar}
              onChange={(e) => setForm({ ...form, sugar: e.target.value })}
            />
          </div>

          {/* Weight */}
          <div>
            <label className="text-gray-600 font-medium flex items-center gap-2">
              <Dumbbell className="h-4 w-4" /> Weight (kg)
            </label>
            <input
              type="number"
              className="w-full border p-3 rounded-lg"
              placeholder="70"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-gray-600 font-medium flex gap-2 items-center">
              <PencilLine className="h-4 w-4" /> Notes
            </label>
            <textarea
              className="w-full border p-3 rounded-lg"
              placeholder="Symptoms / Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition`}
            disabled={loading}
          >
            {loading ? "Generating AI Result..." : "Save Vitals & Get AI Advice"}
          </button>
        </form>

        {/* AI Result */}
        {aiResult && (
          <div className="mt-6 p-4 bg-gray-100 border rounded">
            <h3 className="text-lg font-bold mb-2">AI Health Advice (English)</h3>
            <p className="whitespace-pre-line">{aiResult}</p>

            <button
              onClick={downloadPDF}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold"
            >
              Download PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddVitals;
