import React, { useEffect, useState } from "react";
import { UploadCloud, Activity, Brain, FileText, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../api";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [vitals, setVitals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user info
    API.get("/users/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data.user))
      .catch(err => {
        console.error("Error fetching user data:", err);
        navigate("/login");
      });

    // Fetch recent reports
    API.get("/reports/user", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setReports(res.data.slice(0, 5))) // show last 5 reports
      .catch(err => console.error(err));

    // Fetch recent vitals
    API.get("/vitals", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setVitals(res.data.slice(0, 5))) // last 5 vitals
      .catch(err => console.error(err));
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 font-poppins pt-24 px-6 md:px-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-3">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Welcome Back, {user?.email} 👋</h1>
          <p className="text-gray-600 mt-1">
            Manage your medical reports, vitals, and AI health insights all in one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/uploadReport"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <PlusCircle size={20} /> Upload New Report
          </Link>
          <Link
            to="/timeline"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <PlusCircle size={20} /> Timeline
          </Link>
          <Link
            to="/viewReport"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <PlusCircle size={20} /> View Report
          </Link>
          <Link
            to="/advitals"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <PlusCircle size={20} /> Add Vitals
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <motion.div className="p-6 rounded-2xl shadow-sm bg-blue-100 text-blue-700">
          <FileText className="w-8 h-8 mb-2" />
          <h3 className="text-lg font-semibold">Total Reports</h3>
          <p className="text-2xl font-bold">{reports.length}</p>
        </motion.div>
        <motion.div className="p-6 rounded-2xl shadow-sm bg-teal-100 text-teal-700">
          <Activity className="w-8 h-8 mb-2" />
          <h3 className="text-lg font-semibold">Vitals Tracked</h3>
          <p className="text-2xl font-bold">{vitals.length}</p>
        </motion.div>
        <motion.div className="p-6 rounded-2xl shadow-sm bg-purple-100 text-purple-700">
          <Brain className="w-8 h-8 mb-2" />
          <h3 className="text-lg font-semibold">AI Insights</h3>
          <p className="text-2xl font-bold">{reports.filter(r => r.aiSummary).length}</p>
        </motion.div>
        <motion.div className="p-6 rounded-2xl shadow-sm bg-orange-100 text-orange-700">
          <UploadCloud className="w-8 h-8 mb-2" />
          <h3 className="text-lg font-semibold">Last Upload</h3>
          <p className="text-2xl font-bold">{reports[0] ? new Date(reports[0].reportDate).toLocaleDateString() : "-"}</p>
        </motion.div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-10">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Recent Reports</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 text-blue-800">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Report Type</th>
                <th className="py-3 px-4">AI Summary</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{new Date(r.reportDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{r.reportType}</td>
                  <td className="py-3 px-4">{r.aiSummary.substring(0, 50)}...</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => navigate(`/reports/${r._id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Recent Vitals</h2>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {vitals.map((v, i) => (
            <div key={i} className="p-5 border border-gray-200 rounded-xl hover:shadow-md transition text-center">
              <h3 className="font-semibold text-gray-700">{v.notes || "Vitals"}</h3>
              <p className="text-2xl font-bold text-blue-700">
                BP {v.bp} | Sugar {v.sugar} | Weight {v.weight}kg
              </p>
              <p className="text-sm text-gray-500">Recorded: {new Date(v.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
