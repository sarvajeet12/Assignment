import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, ArrowLeft } from "lucide-react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const DistributedLists = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await axios.get(`${backendUrl}/lists/agent/${agentId}`);
        setLists(res.data);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to fetch lists.");
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, [agentId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-200"
        >
          <ArrowLeft size={24} />
        </button>
        <h3 className="text-3xl font-bold text-gray-800">
          Lists for Agent: {lists[0]?.assignedTo?.name || "Loading..."}
        </h3>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-indigo-500" size={48} />
        </div>
      ) : lists.length > 0 ? (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lists.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.firstName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center p-10 bg-white rounded-xl shadow-md">
          <p className="text-lg text-gray-500">
            No lists have been assigned to this agent yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default DistributedLists;
