import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
// import Login from "./pages/Login.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";
import Register from "./pages/Register.jsx";
import UploadReport from "./Dashboard/UploadReport.jsx";
import AddVitals from "./Dashboard/AddVitals.jsx";
// import ReportDetail from "./Dashboard/ReportDetail.jsx";
import ReportDetail from "./Dashboard/ReportDetails.jsx";
import Timeline from "./Dashboard/Timeline.jsx";
// import UploadReport from "./Dashboard/UploadReport.jsx";
import ViewReport from "./Dashboard/ViewReport.jsx";
// import Protect from "./protected/Protect.jsx";
import Protect from "./protected/protect.jsx";
export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
           <Protect>
              <Dashboard />
           </Protect>
          } />
        <Route path="/uploadreport" element={
          <Protect>
          <UploadReport />
        </Protect> } 
        />
        <Route path="/advitals" element={<Protect><AddVitals /></Protect>} />
        <Route path="/viewReport" element={<Protect><ViewReport /></Protect>} />
        <Route path="/reports/:id" element={<Protect><ReportDetail /></Protect>} />
        <Route path="/timeline" element={<Protect><Timeline /></Protect>} />





        


      </Routes>

      <Footer />
    </>
  );
}
