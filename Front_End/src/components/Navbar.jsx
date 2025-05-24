import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GradientButton from './GradientButton';
import { useUser } from '../context/UserContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useUser();
  const navigate = useNavigate();

  const scrollToFeatures = (e) => {
    e.preventDefault();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false); // Close mobile menu if open
  };

  const handlelogout = async () => {
    logout();
    navigate('/');
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#features', onClick: scrollToFeatures },
  ];

  return (
    <nav className="fixed w-full top-0 left-0 z-50 bg-black/10 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" aria-label="GenEd Studio Home">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              genEd Studio
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              link.onClick ? (
                <button
                  key={link.path}
                  onClick={link.onClick}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  {link.name}
                </Link>
              )
            ))}
            {!isAuthenticated() ? (
              <>
                <GradientButton
                  onClick={() => navigate('/signup')}
                  size="sm"
                  className="ml-4"
                >
                  Sign Up
                </GradientButton>
                <GradientButton
                  onClick={() => navigate('/login')}
                  size="sm"
                  className="ml-2"
                >
                  Login
                </GradientButton>
              </>
            ) : (
              <>
                <GradientButton
                  onClick={() => navigate('/create')}
                  size="sm"
                  className="ml-4"
                >
                  Create
                </GradientButton>
                <GradientButton
                  onClick={handlelogout}
                  size="sm"
                  className="ml-4"
                >
                  Logout
                </GradientButton>

              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {/* Menu icon */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                link.onClick ? (
                  <button
                    key={link.path}
                    onClick={link.onClick}
                    className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              ))}
              {!isAuthenticated() ? (
                <>
                  <button
                    onClick={() => {
                      navigate('/signup');
                      setIsOpen(false);
                    }}
                    className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsOpen(false);
                    }}
                    className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  >
                    Login
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    navigate('/create');
                    setIsOpen(false);
                  }}
                  className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  Create
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;