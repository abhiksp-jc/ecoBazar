import { useNavigate } from "react-router-dom";
import NotFoundImage from "../assets/NotFound.png";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-2xl text-center">
        <img
          src={NotFoundImage}
          alt="Page not found"
          className="mx-auto w-[500px] max-w-full"
        />

        <h1 className="mt-4 text-3xl font-bold text-gray-800">
          Oops! page not found
        </h1>

        <p className="mt-4 text-gray-500">
          Ut consequat ac tortor eu vehicula. Aenean accumsan purus eros.
          Maecenas sagittis tortor at metus mollis.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 rounded-full bg-green-600 px-8 py-3 text-sm font-semibold text-white hover:bg-green-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;