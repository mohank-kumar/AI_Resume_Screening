import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Jobs from "./pages/Jobs/Jobs";
import CreateJob from "./pages/CreateJob/CreateJob";
import UploadResume from "./pages/Upload/UploadResume";
import Candidates from "./pages/Candidates/Candidates";
import CandidateDetails from "./pages/CandidateDetails/CandidateDetails";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/create" element={<CreateJob />} />
          <Route path="/jobs/edit/:jobId" element={<CreateJob />} />
          <Route path="/jobs/:jobId/upload" element={<UploadResume />} />
          <Route path="/jobs/:jobId/candidates" element={<Candidates />} />
          <Route path="/candidate/:resumeId" element={<CandidateDetails />} />
          <Route path="/candidates" element={<Candidates />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;