import { useEffect, useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState("terms");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchContent = async (type) => {
    try {
      setLoading(true);
      setMessage("");
      setEditing(false);

      const response = await axios.get(
        `http://localhost:5000/api/content-management/${type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setContent(response.data.content?.content || "");
    } catch (error) {
      console.error("Failed to load content", error);
      setContent("");
      setMessage(
        error.response?.data?.message || "Failed to load content"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent(activeTab);
  }, [activeTab]);

  const handleEdit = () => {
    setEditing(true);
    setMessage("");
  };

  const handleView = () => {
    setEditing(false);
    setMessage("");
  };

  const handleCancel = () => {
    setEditing(false);
    fetchContent(activeTab);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      const response = await axios.put(
        `http://localhost:5000/api/content-management/${activeTab}`,
        {
          content
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setContent(response.data.content?.content || content);
      setEditing(false);

      setMessage(
        activeTab === "terms"
          ? "Terms & Conditions updated successfully"
          : activeTab === "privacy"
          ? "Privacy Policy updated successfully"
          : "About Us content updated successfully"
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Failed to update content", error);

      setMessage(
        error.response?.data?.message || "Failed to update content"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Content Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your Terms & Conditions, Privacy Policy and About Us content.
        </p>
      </div>

      <div className="mb-6 flex gap-8 border-b border-gray-300">
        <button
          type="button"
          onClick={() => setActiveTab("terms")}
          className={`border-b-2 px-4 py-3 font-medium ${
            activeTab === "terms"
              ? "border-green-600 text-green-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Terms & Conditions
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("privacy")}
          className={`border-b-2 px-4 py-3 font-medium ${
            activeTab === "privacy"
              ? "border-green-600 text-green-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Privacy Policy
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("about")}
          className={`border-b-2 px-4 py-3 font-medium ${
            activeTab === "about"
              ? "border-green-600 text-green-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          About Us
        </button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        {loading ? (
          <div className="py-10 text-center text-gray-500">
            Loading...
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {activeTab === "terms"
                  ? "Terms & Conditions"
                  : activeTab === "privacy"
                  ? "Privacy Policy"
                  : "About Us"}
              </h2>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleView}
                  className={`rounded-lg border px-5 py-2.5 font-medium ${
                    !editing
                      ? "border-green-600 bg-green-50 text-green-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  View
                </button>

                <button
                  type="button"
                  onClick={handleEdit}
                  disabled={editing}
                  className={`rounded-lg px-5 py-2.5 font-medium ${
                    editing
                      ? "cursor-not-allowed bg-gray-300 text-gray-500"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  Edit
                </button>
              </div>
            </div>

            {editing ? (
              <>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link"],
                      ["clean"]
                    ]
                  }}
                  className="mb-16"
                />

                <div className="flex items-center justify-between">
                  {message ? (
                    <p
                      className={`text-sm ${
                        message.includes("successfully")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {message}
                    </p>
                  ) : (
                    <div />
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
               
                <div
                className="prose prose-sm sm:prose-base max-w-none w-full overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-6 text-gray-700"
                dangerouslySetInnerHTML={{ __html: content || "" }}
              />

                {message && (
                  <p className="mt-4 text-sm text-green-600">
                    {message}
                  </p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ContentManagement;