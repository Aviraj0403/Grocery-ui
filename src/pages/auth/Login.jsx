import React, { useState } from 'react';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, phoneLogin } = useAuth();

  const [data, setData] = useState({ email: "", password: "", phoneNumber: "" });
  const [loginMethod, setLoginMethod] = useState("phone"); // "email" or "phone"
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let user;
      if (loginMethod === "email") {
        user = await login({ email: data.email, password: data.password });
      } else {
        user = await phoneLogin({ phoneNumber: data.phoneNumber });
      }

      toast.success("Logged in successfully!");

      if (user.roleType === "admin") {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  const valid = loginMethod === "email"
    ? (data.email && data.password)
    : data.phoneNumber;

  return (
    <section className='w-full container mx-auto px-4'>
      <div className='bg-green-50 my-4 w-full max-w-lg mx-auto rounded p-6 shadow-sm'>
        <div className='flex justify-between items-center mb-4'>
          <p className='text-xl font-semibold text-green-700'>Login</p>
          <div className='flex bg-gray-200 rounded p-1'>
            <button
              onClick={() => setLoginMethod("email")}
              className={`px-3 py-1 text-sm rounded ${loginMethod === "email" ? "bg-white shadow text-green-700 font-bold" : "text-gray-600"}`}
            >
              Email
            </button>
            <button
              onClick={() => setLoginMethod("phone")}
              className={`px-3 py-1 text-sm rounded ${loginMethod === "phone" ? "bg-white shadow text-green-700 font-bold" : "text-gray-600"}`}
            >
              Phone
            </button>
          </div>
        </div>

        <form className='grid gap-3 py-2' onSubmit={handleLogin}>
          {loginMethod === "email" ? (
            <>
              <div className='grid gap-1'>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  className='bg-blue-50 p-2 border rounded outline-none focus:border-green-700'
                  placeholder='Enter your email address'
                  required
                />
              </div>

              <div className='grid gap-1'>
                <label htmlFor="password">Password:</label>
                <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-green-700'>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    className='w-full outline-none bg-blue-50'
                    placeholder='Enter your password'
                    required
                  />
                  <div onClick={() => setShowPassword(prev => !prev)} className='cursor-pointer text-gray-500'>
                    {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                  </div>
                </div>
                <Link to="/forgot-password" university-block ml-auto text-sm text-green-600 hover:underline>Forgot password?</Link>
              </div>
            </>
          ) : (
            <div className='grid gap-1'>
              <label htmlFor="phoneNumber">Phone Number:</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={data.phoneNumber}
                onChange={handleChange}
                className='bg-blue-50 p-2 border rounded outline-none focus:border-green-700'
                placeholder='Enter your phone number'
                required
              />
              <p className='text-xs text-gray-500 mt-1'>No password or OTP required. Just enter your number to login/register.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!valid || loading}
            className={`${valid ? "bg-green-600 hover:bg-green-700" : "bg-gray-500"} text-white py-2 mt-2 rounded font-semibold tracking-wide transition-all`}
          >
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>

        <p className='text-sm mt-4 text-center'>
          Don't have an account?{" "}
          <Link to="/register" className='font-semibold text-green-600 hover:text-green-700'>
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;