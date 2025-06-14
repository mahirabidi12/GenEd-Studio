import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GradientButton from '../components/GradientButton';
import GradientText from '../components/GradientText';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    // video: null,
    // audio: null,
    // videoName: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('password', formData.password);
    // form.append('videoName', formData.videoName);
    // if (formData.video) form.append('video', formData.video);
    // if (formData.audio) form.append('audio', formData.audio);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_END_ENDPOINT}/auth/signup`, {
        method: 'POST',
        body: form,
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) { // Check if response status is 2xx
        navigate('/login'); // Redirect to login page on success
      } else {
        // Handle error case
        alert(result.message || 'Signup failed');
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred during signup');
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0]
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col items-center bg-black">
      <div className="sign_up_card max-w-md w-full space-y-8 p-8 bg-gray-800/30 backdrop-blur-sm rounded-2xl border-1 border-emerald-500 shadow-lg transition-all duration-300 hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] hover:shadow-emerald-500/30">
        <div className="text-center">
          <GradientText as="h2" size="text-3xl" className="mb-2">
            Create Your Account
          </GradientText>
          <p className="text-gray-400">Start your educational journey today</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full rounded-lg bg-gray-900 border border-gray-700 text-white px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                onChange={handleChange}
              />
            </div>

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

            {/*<div>
              <label htmlFor="video" className="block text-sm font-medium text-gray-300">
                Upload Persona Video
              </label>
              <input
                id="video"
                name="video"
                type="file"
                required
                accept="video/*"
                className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-800 file:text-gray-300 hover:file:bg-gray-700"
                onChange={handleFileChange}
              />
            </div>*/}

            {/* <div>
              <label htmlFor="audio" className="block text-sm font-medium text-gray-300">
                Upload Audio
              </label>
              <input
                id="audio"
                name="audio"
                type="file"
                accept="audio/*"
                className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-800 file:text-gray-300 hover:file:bg-gray-700"
                onChange={handleFileChange}
              />
            </div> */}

            {/* <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Persona Name
              </label>
              <input
                id="videoName"
                name="videoName"
                type="text"
                required
                className="mt-1 block w-full rounded-lg bg-gray-900 border border-gray-700 text-white px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                onChange={handleChange}
              />
            </div> */}
          </div> 

          <div>
            <GradientButton
              type="submit"
              className="w-full"
              size="lg"
            >
              Sign Up
            </GradientButton>
          </div>
        </form>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;