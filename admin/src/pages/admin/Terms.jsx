import { useEffect, useState } from "react";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";

const Terms = () => {
 

  const [content, setContent] = useState("");
  const [editContent, setEditContent] = useState("");
  const [mode, setMode] = useState("view");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  const fetchTerms = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/terms",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const terms = response.data.terms;

      setContent(terms?.content || "");
      setEditContent(terms?.content || "");
    } catch (error) {
      console.error("Failed to load terms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const handleEdit = () => {
    setEditContent(content);
    setMode("edit");
  };

  const handleCancel = () => {
    setEditContent(content);
    setMode("view");
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await axios.put(
        "http://localhost:5000/api/terms",
        {
          content: editContent
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setContent(response.data.terms.content);
      setEditContent(response.data.terms.content);
      setMode("view");
    } catch (error) {
      console.error("Failed to update terms:", error);
      alert(
        error.response?.data?.message ||
          "Failed to update terms and conditions"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500">
          Loading Terms & Conditions...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Terms & Conditions
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your website terms and conditions
            </p>
          </div>

          {mode === "view" ? (
            <button
              onClick={handleEdit}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          {mode === "view" ? (
            <div
              className="p-6 prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: content
              }}
            />
          ) : (
            <div>
              <ReactQuill
                theme="snow"
                value={editContent}
                onChange={setEditContent}
                className="bg-white"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link"],
                    ["clean"]
                  ]
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Terms;