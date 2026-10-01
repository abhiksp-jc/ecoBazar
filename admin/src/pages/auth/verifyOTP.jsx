import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { verifyResetOtp } from "../../services/authService";

const VerifyOtp = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      await verifyResetOtp(token, otp);

      navigate(`/reset-password/${token}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">
            Ecobazar
          </h1>

          <h2 className="text-2xl font-bold text-gray-800 mt-8">
            Verify OTP
          </h2>

          <p className="text-gray-500 mt-2">
            Enter the 6-digit OTP sent to your email
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            OTP
          </label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
            placeholder="Enter 6-digit OTP"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-xl tracking-[8px] outline-none focus:border-green-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-gray-500 hover:text-green-600"
          >
            ← Back to Login
          </button>
        </div>

      </div>
    </div>
  );
};

export default VerifyOtp;



 