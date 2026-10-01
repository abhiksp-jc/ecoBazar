import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../../assets/Logo.png";
import groceryImage from "../../assets/grocery.png";

import { forgotPassword } from "../../services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await forgotPassword(email);

      setMessage("Reset link and OTP have been sent to your email.");
    } catch (error) {
      setError(error.response?.data?.message || "Unable to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-[1150px] min-h-[600px] lg:h-[700px] flex overflow-hidden rounded-2xl bg-white">
        {/* Left Side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-5 sm:px-10 md:px-14 lg:px-16 py-10">
          <div className="w-full max-w-[400px]">
            <div className="flex justify-center mb-7 sm:mb-10">
              <img
                src={Logo}
                alt="Ecobazar"
                className="w-[150px] sm:w-[180px] lg:w-[200px]"
              />
            </div>

            <div className="text-center mb-7 sm:mb-10">
              <h2 className="bg-gradient-to-r from-[#009f3f] to-[#00491b] bg-clip-text text-transparent text-[25px] font-semibold mb-2">
                {" "}
                Forgot Password
              </h2>

              <p className="text-gray-700 text-[16px] sm:text-[18px]">
                Reset your password
              </p>
            </div>

            {message && (
              <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-3 rounded-md text-[11px] sm:text-[12px]">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-3 rounded-md text-[11px] sm:text-[12px]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6 sm:mb-7">
                <label
                  htmlFor="email"
                  className="block text-[12px] sm:text-[13px] text-gray-600 mb-2"
                >
                  Enter Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full h-[42px] sm:h-[45px] px-3 sm:px-4 text-[13px] sm:text-[14px] bg-green-50 border border-green-400 rounded-md outline-none focus:border-green-500 focus:ring-1 focus:ring-green-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[42px] sm:h-[45px] rounded-md bg-gradient-to-r from-green-600 to-green-900 text-white text-[13px] sm:text-[14px] font-semibold hover:from-green-700 hover:to-green-950 disabled:opacity-50 transition"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full mt-5 sm:mt-6 text-[11px] sm:text-[12px] text-gray-600 hover:text-green-600 transition"
            >
              ← Back to Login
            </button>
          </div>
        </div>

        <div className="hidden lg:block w-1/2 p-1">
          <div className="relative w-full h-full overflow-hidden rounded-xl">
            <img
              src={groceryImage}
              alt="Fresh vegetables and groceries"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

