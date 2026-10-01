import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import Logo from "../../assets/Logo.png";
import groceryImage from "../../assets/grocery.png";

import { resetPassword } from "../../services/authService";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword(
        token,
        password
      );

      alert(response.message);

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-[1150px] h-[700px] flex overflow-hidden rounded-2xl bg-white">

        <div className="w-1/2 flex items-center justify-center px-16">
          <div className="w-full max-w-[400px]">

            <div className="flex justify-center mb-10">
              <img
                src={Logo}
                alt="Ecobazar"
                className="w-[200px]"
              />
            </div>

            <div className="text-center mb-10">
              <h2 className="text-green-600 text-[25px] font-semibold mb-2">
                Reset Password
              </h2>

              <p className="text-gray-700 text-[18px]">
                Enter your new password
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md px-4 py-3 text-[12px] text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-[13px] text-gray-600 mb-2"
                >
                  New Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter new password"
                    required
                    className="w-full h-[45px] px-4 pr-12 text-[14px] text-gray-800 bg-green-50 border border-transparent rounded-md outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200 transition"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-7">
                <label
                  htmlFor="confirmPassword"
                  className="block text-[13px] text-gray-600 mb-2"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Confirm new password"
                    required
                    className="w-full h-[45px] px-4 pr-12 text-[14px] text-gray-800 bg-green-50 border border-transparent rounded-md outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200 transition"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[45px] rounded-md bg-gradient-to-r from-green-600 to-green-900 text-white text-[14px] font-semibold hover:from-green-700 hover:to-green-950 disabled:opacity-50 transition"
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>

            </form>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full mt-6 text-[12px] text-gray-600 hover:text-green-600 transition"
            >
              ← Back to Login
            </button>

          </div>
        </div>

        <div className="w-1/2 p-1">
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

export default ResetPassword;