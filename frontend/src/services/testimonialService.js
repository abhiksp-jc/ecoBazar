const API_URL = import.meta.env?.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/testimonials`
  : "http://localhost:5000/api/testimonials";

/**
 * Safely parse response as JSON to prevent "Unexpected token '<'..." error
 * when backend returns HTML (e.g. 404 / 500 error pages).
 */
const parseResponse = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(
          "The backend server has not loaded the /api/testimonials route yet. Please restart the backend server (run 'npm run dev' or 'node server') so the new routes take effect."
        );
      }
      throw new Error(`Server returned error (${res.status}): Please check backend logs.`);
    }
    throw new Error("Invalid response received from server.");
  }
};

export const testimonialService = {
  /**
   * Fetch approved testimonials to display in the frontend
   */
  async getApprovedTestimonials() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        return [];
      }
      const data = await parseResponse(res);
      return data.testimonials || [];
    } catch (err) {
      console.warn("Testimonial fetch error (using fallback defaults):", err.message);
      return [];
    }
  },

  /**
   * Submit new customer review / feedback
   * @param {FormData|Object} payload
   */
  async submitFeedback(payload) {
    let options = {};
    if (payload instanceof FormData) {
      options = {
        method: "POST",
        body: payload
      };
    } else {
      options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      };
    }

    const res = await fetch(API_URL, options);
    const data = await parseResponse(res);
    if (!res.ok) {
      throw new Error(data?.message || "Failed to submit review");
    }
    return data;
  }
};

export default testimonialService;
