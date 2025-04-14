import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="h-[100vh] bg-zinc-900 px-12 py-8 flex items-center justify-center">
      <div className="bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-3/6 lg:w-2/6">
        <p className="text-zinc-200 text-xl font-semibold">Log In</p>

        <div className="mt-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="text-zinc-400">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="xyz@example.com"
              name="email"
              required
            />
          </div>

          {/* Password */}
          <div className="mt-4">
            <label htmlFor="password" className="text-zinc-400">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="password"
              name="password"
              required
            />
          </div>

          {/* Login Button */}
          <div className="mt-4">
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
              type="submit"
            >
              Log In
            </button>
          </div>

          {/* Divider */}
          <p className="flex mt-4 items-center justify-center text-zinc-200 font-semibold">
            Or
          </p>

          {/* Sign Up Redirect */}
          <p className="flex mt-4 items-center justify-center text-zinc-500 font-semibold">
            Don't have an account? &nbsp;
            <Link to="/signup" className="hover:text-blue-500">
              <u>Sign Up</u>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
