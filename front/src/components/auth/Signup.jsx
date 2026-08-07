import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';
import signupImage from '@/assets/profile.png'; // Your image here

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: null
  });

  const { loading, user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) formData.append("file", input.file);

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { 'Content-Type': "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/verify-otp", { state: { email: input.email } });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, []);

  return (
    <>
      <Navbar />
      <section
        className="
          relative isolate flex min-h-[calc(100vh-80px)] w-full items-center justify-center overflow-hidden
          bg-[radial-gradient(circle_at_20%_20%,rgba(186,230,253,0.4),transparent_40%),
              radial-gradient(circle_at_80%_0%,rgba(186,230,253,0.3),transparent_30%),
              radial-gradient(circle_at_90%_80%,rgba(221,214,254,0.35),transparent_40%),
              radial-gradient(circle_at_0%_100%,rgba(204,251,241,0.3),transparent_40%)]
          py-10
        "
      >
        {/* Background mesh */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('/images/mesh.svg')] bg-cover opacity-20" />

        <div className="mx-4 flex w-full max-w-6xl overflow-hidden rounded-3xl shadow-xl bg-white/70 backdrop-blur-md">
          {/* Left Side Form */}
          <div className="w-full p-8 md:w-1/2">
            <h2 className="mb-6 text-center text-2xl font-semibold text-violet-800">Sign Up</h2>

            <form onSubmit={submitHandler} className="space-y-5">
              <div>
                <Label>Full Name</Label>
                <Input
                  type="text"
                  name="fullname"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label>Phone Number</Label>
                <Input
                  type="text"
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  placeholder="9800000000"
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  placeholder="********"
                />
              </div>

              <div className="flex items-center gap-10">
                {["student", "recruiter"].map((role) => (
                  <label
                    key={role}
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <Input
                      type="radio"
                      name="role"
                      value={role}
                      checked={input.role === role}
                      onChange={changeEventHandler}
                      className="h-4 w-4"
                    />
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </label>
                ))}
              </div>

              <div>
                <Label>Profile Picture</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={changeFileHandler}
                  className="cursor-pointer"
                />
              </div>

              {loading ? (
                <Button
                  type="button"
                  disabled
                  className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-sky-300/70 to-violet-300/70 text-gray-700"
                >
                  <Loader2 className="h-4 w-4 animate-spin" /> Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600"
                >
                  Sign Up
                </Button>
              )}

              <p className="text-center text-sm text-gray-700">
                Already have an account?{" "}
                <Link to="/login" className="text-sky-600 font-medium">
                  LOGIN
                </Link>
              </p>
            </form>
          </div>

          {/* Right Side Image */}
          <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-cyan-200 via-violet-200 to-violet-300 p-8">
            <div className="text-center">
              <img
                src={signupImage}
                alt="Signup"
                className="rounded-xl shadow-lg mb-4"
              />
              <p className="text-white text-xl font-semibold leading-snug drop-shadow-md select-none">
                Enter.<br />
                Explore.<br />
                Excel.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
