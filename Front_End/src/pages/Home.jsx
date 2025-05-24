import React from 'react';
import { Link } from 'react-router-dom';
import GradientButton from '../components/GradientButton';
import Card from '../components/Card';
import backgroundVideo from '../assets/background.mp4';

const Home = () => {
  const features = [
    {
      title: 'Personalized Teaching',
      description: 'Create engaging educational content with custom avatars that represent your unique teaching style.',
      icon: '👩‍🏫'
    },
    {
      title: 'AI Assistant',
      description: 'Interactive AI avatar that answers student questions during videos, enhancing learning experience.',
      icon: '🤖'
    },
    {
      title: 'Easy Avatar Creation',
      description: 'Create new avatars effortlessly using your voice and video, making content more personal.',
      icon: '🎯'
    },
    {
      title: 'High Quality Videos',
      description: 'Generate professional-grade educational videos that keep students engaged.',
      icon: '🎥'
    },
    {
      title: 'Smart Analytics',
      description: 'Track student engagement and content performance with our comprehensive dashboard.',
      icon: '📊'
    },
    {
      title: 'User Friendly',
      description: 'Intuitive interface that makes creating educational content simple and enjoyable.',
      icon: '✨'
    }
  ];

  return (
    <div className="relative">
      {/* Video Section */}
      <div className="relative h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>

        {/* Hero Content */}
        <div className="relative h-full flex items-center">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl ml-8 sm:ml-12 lg:ml-16">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 text-white">
                Transform Your Learning
              </h1>
              <p className="mt-6 text-xl sm:text-2xl text-white">
                Elevate your educational journey with interactive AI avatars and immersive learning experiences.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <GradientButton
                  as={Link}
                  to="/create"
                  size="lg"
                  className="text-lg"
                >
                  Start Creating
                </GradientButton>
                <GradientButton
                  as={Link}
                  to="/templates"
                  variant="outline"
                  size="lg"
                  className="text-lg"
                >
                  Browse Templates
                </GradientButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with Black Background */}
      <div id="features" className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h2 className="text-3xl sm:text-4xl text-center font-bold mb-16 text-white">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of learners experiencing a new dimension of education with genEd Studio's AI-powered platform.
          </p>
          <GradientButton
            as={Link}
            to="/signup"
            size="lg"
            className="text-lg"
          >
            Start Your Learning Journey
          </GradientButton>
        </div>
      </div>
    </div>
  );
};

export default Home;