import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { setLoading, setUser } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/constant";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "../shared/Navbar";

import loginImage from "@/assets/profile.png";

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "", role: "" });
  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.email || !input.password || !input.role) {
      toast.error("All fields are required!");
      return;
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (err) {
      if (err.response?.data?.notVerified) {
        toast.error(err.response.data.message);
        navigate("/verify-otp", { state: { email: err.response.data.email || input.email } });
        return;
      }
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#e0f2fe] via-[#ede9fe] to-[#f0fdfa] flex items-center justify-center px-4">
        <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl shadow-xl bg-white">
          {/* Left Side */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
            <h2 className="text-center text-2xl font-semibold text-violet-700 mb-6">Login</h2>
            <form onSubmit={submitHandler} className="space-y-5">
              <div>
                <Label className="text-sm font-medium">EMAIL</Label>
                <Input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  placeholder="••••••••"
                />
              </div>

              {/* Role Selection */}
              <div className="flex items-center justify-between pt-2">
                {["student", "recruiter"].map((role) => (
                  <label key={role} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={input.role === role}
                      onChange={changeEventHandler}
                      className="accent-violet-500"
                    />
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </label>
                ))}
              </div>

              {/* Button */}
              <Button
                type="submit"
                className="w-full bg-violet-500 hover:bg-violet-600 text-white"
                disabled={loading}
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Logging in...</> : "Login"}
              </Button>

              {/* Sign up link */}
              <p className="text-center text-sm text-gray-600">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-sky-600 font-medium">
                  SignUp
                </Link>
              </p>
            </form>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-cyan-200 via-violet-300 to-purple-300 p-8">
            <div className="text-center">
              <img src={loginImage} alt="Login Visual" className="rounded-xl shadow-lg mb-4" />
              <p className="text-white text-xl font-semibold leading-snug drop-shadow-md select-none">
                Enter.<br />
                Explore.<br />
                Excel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
