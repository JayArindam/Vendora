import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authActions } from "../store/auth";
import { useDispatch } from "react-redux";
const Login = () => {
  const [Values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };
  const submit = async () => {
    try {
      if (Values.email === "" || Values.password === "") {
        alert("All fields are required");
      } else {
        const response = await axios.post("http://localhost:3001/api/v1/sign-in", Values);
        dispatch(authActions.login());
        dispatch(authActions.changeRole(response.data.role));
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        navigate("/profile");
      }
    }
    catch (error) {
      alert(error.response.data.message)
    };
  }
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
              value={Values.email}
              onChange={change}
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
              value={Values.password}
              onChange={change}
            />
          </div>

          {/* Login Button */}
          <div className="mt-4">
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition-all duration-300"
              onClick={submit}
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
