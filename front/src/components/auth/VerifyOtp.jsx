import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { setUser } from '@/redux/authSlice';
import { USER_API_END_POINT } from '@/utils/constant';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Navbar from '../shared/Navbar';

const RESEND_COOLDOWN = 30;

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("Please enter the OTP sent to your email.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/verify-otp`, { email, otp }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendHandler = async () => {
    if (cooldown > 0) return;
    try {
      setResending(true);
      const res = await axios.post(`${USER_API_END_POINT}/resend-otp`, { email }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setCooldown(RESEND_COOLDOWN);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#e0f2fe] via-[#ede9fe] to-[#f0fdfa] flex items-center justify-center px-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl shadow-xl bg-white p-10">
          <h2 className="text-center text-2xl font-semibold text-violet-700 mb-2">Verify your email</h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            We sent a 6-digit code to <span className="font-medium">{email}</span>
          </p>

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <Label className="text-sm font-medium">OTP Code</Label>
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="tracking-[0.5em] text-center text-lg"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-violet-500 hover:bg-violet-600 text-white"
              disabled={loading}
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Verifying...</> : "Verify Email"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Didn't get the code?{" "}
              <button
                type="button"
                onClick={resendHandler}
                disabled={cooldown > 0 || resending}
                className="text-sky-600 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {resending ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
              </button>
            </p>

            <p className="text-center text-sm text-gray-600">
              <Link to="/login" className="text-sky-600 font-medium">Back to Login</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default VerifyOtp;
