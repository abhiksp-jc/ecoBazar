import { useEffect, useState } from "react";
import axios from "axios";

const Terms = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/content-management/public/terms"
        );

        setContent(response.data.content?.content || "");
      } catch (error) {
        console.error("Failed to load terms and conditions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Terms & Conditions
          </h1>
          <p className="mt-2 text-gray-500">
            Please read our terms and conditions carefully.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">
            Loading terms...
          </div>
        ) : (
          <div
            className="rounded-lg bg-white p-8 shadow"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </div>
  );
};

export default Terms;