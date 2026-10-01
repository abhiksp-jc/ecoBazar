import { useEffect, useState } from "react";
import axios from "axios";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  const fetchFAQs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/faqs/active"
      );

      setFaqs(response.data.faqs || []);
    } catch (error) {
      console.error("Failed to load FAQs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-gray-500">
            Find answers to common questions about EcoBazar.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">
            Loading FAQs...
          </div>
        ) : faqs.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow">
            No FAQs available.
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq._id}
                className="overflow-hidden rounded-lg bg-white shadow"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq._id)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-gray-800" >
                    {faq.question}
                  </span>

                  <span className="ml-4 text-xl text-gray-500">
                    {openId === faq._id ? "−" : "+"}
                  </span>
                </button>

                {openId === faq._id && (
                  <div className="border-t px-6 py-5 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;