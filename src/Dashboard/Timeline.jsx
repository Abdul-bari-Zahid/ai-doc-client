import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Timeline() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Fetch Vitals
      const vitalsRes = await axios.get("https://ai-doc-ser.vercel.app/api/vitals", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch Reports
      const reportsRes = await axios.get("https://ai-doc-ser.vercel.app/api/reports/user", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Combine data
      const vitalsTimeline = vitalsRes.data.map(v => ({
        date: new Date(v.createdAt).toLocaleDateString(),
        title: "Vitals Update",
        text: `BP ${v.bp} | Sugar ${v.sugar} | Weight ${v.weight}kg`,
      }));

      const reportsTimeline = reportsRes.data.map(r => ({
        date: new Date(r.reportDate).toLocaleDateString(),
        title: r.reportType,
        text: r.aiSummary.substring(0, 100) + "...",
      }));

      // Merge & sort by date descending
      const combined = [...vitalsTimeline, ...reportsTimeline].sort((a, b) => new Date(b.date) - new Date(a.date));

      setTimeline(combined);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch timeline ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-10">
      <h2 className="text-3xl font-bold text-center mb-10 text-blue-700">Health Timeline</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading timeline...</p>
      ) : timeline.length === 0 ? (
        <p className="text-center text-gray-500">No timeline data available.</p>
      ) : (
        <div className="relative max-w-2xl mx-auto before:absolute before:left-5 before:top-0 before:h-full before:w-1 before:bg-blue-200">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative flex items-start mb-8">
              <div className="flex flex-col items-center">
                <div className="bg-blue-600 w-4 h-4 rounded-full mt-1"></div>
                {idx !== timeline.length - 1 && <div className="flex-1 w-px bg-blue-200"></div>}
              </div>
              <div className="ml-6 bg-white p-5 rounded-xl shadow w-full">
                <p className="text-sm text-gray-500">{item.date}</p>
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                <p className="text-gray-700 mt-1 whitespace-pre-line">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <Link
          to="/dashboard"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
export default Timeline