import React, { useState } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AgentManagement from "../components/AgentManagement";
import UploadCSV from "../components/UploadCSV";
import DistributedLists from "../components/DistributedLists";
import { LayoutDashboard, Users, FileUp, LogOut } from "lucide-react";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("agents");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white p-6 shadow-2xl flex flex-col justify-between">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight">
              Admin Panel
            </h1>
          </div>
          <nav className="space-y-2">
            <Link
              to={"/dashboard/agents"}
              onClick={() => setActiveTab("agents")}
              className={`flex items-center space-x-3 p-3 rounded-lg font-medium transition duration-200 ${
                activeTab === "agents" ? "bg-indigo-800" : "hover:bg-indigo-600"
              }`}
            >
              <Users size={20} />
              <span>Agents</span>
            </Link>
            <Link
              to={"/dashboard/upload"}
              onClick={() => setActiveTab("upload")}
              className={`flex items-center space-x-3 p-3 rounded-lg font-medium transition duration-200 ${
                activeTab === "upload" ? "bg-indigo-800" : "hover:bg-indigo-600"
              }`}
            >
              <FileUp size={20} />
              <span>Upload & Distribute</span>
            </Link>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 p-3 mt-auto rounded-lg font-medium text-left transition duration-200 bg-red-600 hover:bg-red-700"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800">Dashboard</h2>
        </header>
        <Routes>
          <Route path="agents" element={<AgentManagement />} />
          <Route path="upload" element={<UploadCSV />} />
          <Route path="lists/:agentId" element={<DistributedLists />} />
          <Route path="/" element={<AgentManagement />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
