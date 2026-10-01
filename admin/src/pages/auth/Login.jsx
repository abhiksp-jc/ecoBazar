import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { login, getToken, getAdmin } from "../../services/authService";
import groceryImage from "../../assets/grocery.png";
import Logo from "../../assets/Logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If already authenticated as admin, redirect directly to dashboard
    if (getToken() && getAdmin()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(email, password);

      if (!response.token || !response.admin) {
        throw new Error("Invalid response received from server");
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("admin", JSON.stringify(response.admin));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      const errorMsg =
        err.response?.data?.message ||
        (err.code === "ERR_NETWORK"
          ? "Cannot connect to server at http://localhost:5000. Please ensure the backend is running."
          : "Invalid email or password");
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-[1150px] min-h-[600px] lg:h-[700px] flex overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
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
                Welcome Back
              </h2>

              <p className="text-gray-700 text-[17px] sm:text-[19px] lg:text-[22px]">
                Admin Portal Log In
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-5 sm:mb-6">
                <label
                  htmlFor="email"
                  className="block text-[12px] sm:text-[13px] text-gray-600 mb-2 font-medium"
                >
                  Enter Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="admin@ecobazar.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full h-[45px] px-4 pr-12 text-[14px] text-gray-800 bg-green-50 border border-gray-200 rounded-md outline-none focus:border-green-500 focus:ring-1 focus:ring-green-300 transition"
                />
              </div>

              <div className="mb-1">
                <label
                  htmlFor="password"
                  className="block text-[12px] sm:text-[13px] text-gray-600 mb-2 font-medium"
                >
                  Enter Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full h-[45px] px-4 pr-12 text-[14px] text-gray-800 bg-green-50 border border-gray-200 rounded-md outline-none focus:border-green-500 focus:ring-1 focus:ring-green-300 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end mb-6 sm:mb-7">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-[10px] sm:text-[11px] text-gray-700 hover:text-green-600 transition"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[42px] sm:h-[45px] rounded-md bg-gradient-to-r from-green-600 to-green-900 text-white text-[13px] sm:text-[14px] font-semibold hover:from-green-700 hover:to-green-950 active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <span>Log In</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side */}
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

export default Login;
