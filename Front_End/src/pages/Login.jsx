import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import GradientButton from '../components/GradientButton';
import GradientText from '../components/GradientText';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_END_ENDPOINT}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include' // Important for cookies
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Logged in user:', result.user);
        login(result.user);
        navigate('/'); 
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-black">
      <div className="login_card max-w-md w-full space-y-8 p-8 bg-gray-800/30 backdrop-blur-sm rounded-2xl border-1 border-emerald-500 shadow-lg transition-all duration-300 hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] hover:shadow-emerald-500/30">
        <div className="text-center">
          <GradientText as="h2" size="text-3xl" className="mb-2">
            Welcome Back
          </GradientText>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-lg bg-gray-900 border border-gray-700 text-white px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-lg bg-gray-900 border border-gray-700 text-white px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <GradientButton
              type="submit"
              className="w-full"
              size="lg"
            >
              Sign In
            </GradientButton>
          </div>
        </form>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-emerald-400 hover:text-emerald-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;