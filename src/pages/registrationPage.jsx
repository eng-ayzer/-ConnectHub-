import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, clearError } from "../store/Slices/AuthSlices";
import { useForm } from "react-hook-form";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least six characters"),
});

const RegistrationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, status } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onRegister = async (data) => {
    dispatch(clearError());
    try {
      await dispatch(registerUser(data)).unwrap();
      navigate("/signin"); 
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Account</h1>
        <p className="text-center text-gray-500 mb-6">
          Sign up to continue to ConnectHub
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 text-red-600 px-4 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="name"
              {...register("name")}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="your@email.com"
              {...register("email")}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="......"
              {...register("password")}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-blue-600 text-white w-full rounded-sm shadow-md px-4 py-2 hover:bg-blue-700 disabled:bg-gray-400"
          >
            {status === "loading" ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;
