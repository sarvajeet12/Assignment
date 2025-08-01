import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { PlusCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AgentManagement = () => {
  const [agents, setAgents] = useState([]);
  const [newAgent, setNewAgent] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/agents`);
      setAgents(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch agents.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${backendUrl}/agents`, newAgent);
      toast.success("Agent created successfully!");
      setNewAgent({
        name: "",
        email: "",
        mobileNumber: "",
        password: "",
      });
      fetchAgents(); // Refresh the list
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create agent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Create Agent Form */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Add New Agent
        </h3>
        <form
          onSubmit={handleCreateAgent}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <input
            type="text"
            placeholder="Name"
            value={newAgent.name}
            onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={newAgent.email}
            onChange={(e) =>
              setNewAgent({ ...newAgent, email: e.target.value })
            }
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Mobile Number"
            value={newAgent.mobileNumber}
            onChange={(e) =>
              setNewAgent({ ...newAgent, mobileNumber: e.target.value })
            }
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={newAgent.password}
            onChange={(e) =>
              setNewAgent({ ...newAgent, password: e.target.value })
            }
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="col-span-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 flex items-center justify-center space-x-2 disabled:bg-indigo-400"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <PlusCircle size={20} />
            )}
            <span>{loading ? "Creating..." : "Add Agent"}</span>
          </button>
        </form>
      </div>

      {/* Agents List */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Existing Agents
        </h3>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-indigo-500" size={48} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agents.length > 0 ? (
                  agents.map((agent) => (
                    <tr key={agent._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {agent.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {agent.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {agent.mobileNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/dashboard/lists/${agent._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Lists
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No agents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentManagement;
