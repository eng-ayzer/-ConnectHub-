import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, clearError } from "../store/Slices/AuthSlices";
import { Loader2 } from "lucide-react";

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least six characters"),
});

const SigninForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, status } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signinSchema),
  });

  const onSignin = async (data) => {
    try {
      dispatch(clearError());
      await dispatch(loginUser(data)).unwrap();
      navigate("/");
    } catch (err) {
      console.log("something went wrong", err);
    }
  };

  return (
    <div className="flex flex-col space-y-5 min-h-screen justify-center items-center bg-gray-100">
      <div className="mb-2">
        <h1 className="bg-blue-600 text-white text-center font-bold w-8 h-8 m-auto shadow-md rounded">c</h1>
        <h1 className=" text-black w-32 py-2 text-center font-bold rounded m-auto">
          ConnectHub
        </h1>
        <p className="mt-2 text-center ">Welcome back! Sign in to continue</p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 text-red-600 p-3 text-center">
          {error}
        </div>
      )}

      <div className="bg-white rounded shadow-md w-96 p-8">
        <form onSubmit={handleSubmit(onSignin)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              {...register("email")}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
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
              placeholder="••••••••"
              {...register("password")}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className={`w-full rounded bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2`}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SigninForm;
