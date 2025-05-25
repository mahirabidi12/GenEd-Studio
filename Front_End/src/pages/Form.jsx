import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GradientButton from '../components/GradientButton';
import GradientText from '../components/GradientText';

const Form = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 10, 
    targetAudience: '',
    ageGroup: ''
  });

  const handleChange = (e) => { 
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission here
    const response = await fetch(`${import.meta.env.VITE_BACK_END_ENDPOINT}/trans/genTranscript` , {
     method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include' 
    })
    const firstPrompt = await response.json();
    
    // Navigate to EditPrompt with both response and form data
    navigate('/edit-prompt', {
      state: {
        response: firstPrompt,
        fData: formData 
      }
    });
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
    }
    return `${seconds}s`;
  };

  const inputStyles = "mt-1 block w-full rounded-lg bg-black border-2 border-gray-700 text-white shadow-sm text-base px-3 py-2 transition-all duration-300 focus:border-emerald-500 focus:ring-0 focus:outline-none";

  return (
    <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-800">
          <GradientText as="h2" size="text-2xl" className="mb-6 text-center">
            Create Your Educational Content
          </GradientText>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className={inputStyles}
                placeholder="Enter a title for your content"
                required
              />
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={inputStyles}
                placeholder="Describe your educational content"
                required
              />
            </div>

            {/* Duration Slider */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">
                Duration: {formatDuration(formData.duration)}
              </label>
              <input
                type="range"
                name="duration"
                id="duration"
                min="10"
                max="1200"
                step="10"
                value={formData.duration}
                onChange={handleChange}
                className="mt-1 block w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>10s</span>
                <span>20m 00s</span>
              </div>
            </div>

            {/* Target Audience Input */}
            <div>
              <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-300 mb-1">
                Target Audience
              </label>
              <input
                type="text"
                name="targetAudience"
                id="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                className={inputStyles}
                placeholder="Who is this content for?"
                required
              />
            </div>

            {/* Age Group Select */}
            <div>
              <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-300 mb-1">
                Age Group
              </label>
              <select
                name="ageGroup"
                id="ageGroup"
                value={formData.ageGroup}
                onChange={handleChange}
                className={inputStyles}
                required
              >
                <option value="">Select an age group</option>
                <option value="3-5">3-5 years</option>
                <option value="6-8">6-8 years</option>
                <option value="9-12">9-12 years</option>
                <option value="13-15">13-15 years</option>
                <option value="16-18">16-18 years</option>
                <option value="18+">18+ years</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <GradientButton
                type="submit"
                size="lg"
                className="w-full text-base py-3"
              >
                Create Content
              </GradientButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;