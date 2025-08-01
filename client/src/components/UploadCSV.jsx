import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FileUp, Loader2 } from "lucide-react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (selectedFile && !validTypes.includes(selectedFile.type)) {
      toast.error("Invalid file type. Only CSV, XLS, and XLSX are allowed.");
      setFile(null);
      e.target.value = null; // Reset the file input
    } else {
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("listFile", file);

    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/lists/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message);
      setFile(null); // Clear file input
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4 max-w-lg mx-auto">
      <h3 className="text-2xl font-semibold text-gray-800">
        Upload & Distribute Lists
      </h3>
      <p className="text-sm text-gray-500">
        Accepted formats: CSV, XLSX, XLS. The file must contain columns named
        'FirstName', 'Phone', and 'Notes'.
      </p>
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="file-upload"
          >
            Choose File
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <FileUp className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                {file ? file.name : "CSV, XLSX, XLS up to 10MB"}
              </p>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={!file || loading}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 flex items-center justify-center space-x-2 disabled:bg-indigo-400"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <FileUp size={20} />
          )}
          <span>{loading ? "Uploading..." : "Upload & Distribute"}</span>
        </button>
      </form>
    </div>
  );
};

export default UploadCSV;
