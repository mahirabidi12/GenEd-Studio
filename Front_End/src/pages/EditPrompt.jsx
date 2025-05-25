import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GradientButton from '../components/GradientButton';

const defaultPersonas = [
  {
    id: 1,
    name: "Harsh Sir",
    description: "Professional and engaging teaching style",
    imageUrl: "https://pbs.twimg.com/profile_images/1353005208230477826/kBS-C4wP_400x400.jpg"
  },
  {
    id: 2,
    name: "NV Sir", 
    description: "Friendly and casual teaching approach",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJT4EmqnIorEqoDkecoiT5APPheamDS9wFXQ&s"
  }
];

const EditPrompt = () => {
  const location = useLocation();
  // console.log('Location state:', location.state); // Log entire state
  const [promptText, setPromptText] = useState(location.state?.response || '');
  const formData = location.state?.fData; 
  
  // More detailed logging
  if (!location.state) {
    console.warn('No state received in location');
  } else if (!formData) {
    console.warn('No formData found in location state');
  } else {
    // console.log('Form Data received:', formData);
  }
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTextChange = (e) => {
    setPromptText(e.target.value);
  };

  const handlePersonaSelect = (persona) => { 
    setSelectedPersona(persona.id);
  };

  const handleGenerate = async () => {
    if (!selectedPersona) {
      alert('Please select a persona first');
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_END_ENDPOINT}/trans/genFinalPrompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: promptText,
          personaId: selectedPersona,
        }),
        credentials: 'include' 
      });
      if (!response.ok) {
        throw new Error('Generation failed');
      }
      const data = await response.json();
      console.log(data);
    } catch (error) { 
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  }; 

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-black/30 backdrop-blur-lg p-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Edit Prompt</h1>
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-6 text-center">Select a Persona</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-2">
            {defaultPersonas.map(persona => (
              <button
                key={persona.id}
                className={`group relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer text-center bg-black/30 border-gray-800 hover:scale-[1.02] hover:border-emerald-500/50 ${selectedPersona === persona.id ? 'border-emerald-500 bg-gradient-to-br from-emerald-600/20 to-blue-600/20 shadow-lg' : ''}`}
                onClick={() => handlePersonaSelect(persona)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePersonaSelect(persona);
                  }
                }}
                style={{backdropFilter: 'blur(6px)'}}
                tabIndex={0}
                aria-pressed={selectedPersona === persona.id}
              >
                {/* Animated gradient overlay on hover/selected */}
                <div className={`absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-blue-600/20 transition-opacity duration-500 ${selectedPersona === persona.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                {/* Glow effect on hover/selected */}
                <div className={`absolute -inset-px bg-gradient-to-br from-emerald-500/50 to-blue-500/50 blur transition-all duration-500 ${selectedPersona === persona.id ? 'opacity-30' : 'opacity-0 group-hover:opacity-30'}`} />
                <div className="relative z-10 flex flex-col items-center">
                  <img
                    src={persona.imageUrl}
                    alt={persona.name}
                    className={`w-36 h-36 object-cover rounded-full mb-4 border-4 transition-all duration-300 ${selectedPersona === persona.id ? 'border-emerald-400' : 'border-transparent'} group-hover:border-emerald-400`}
                  />
                  <h3 className="font-bold text-lg mb-2" style={{fontFamily: 'var(--font-primary)'}}>{persona.name}</h3>
                  <p className="text-gray-300 text-base transition-colors duration-300 group-hover:text-gray-200">{persona.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="mb-8">
          <textarea
            value={promptText}
            onChange={handleTextChange}
            placeholder="Edit your prompt here..."
            className="w-full min-h-[200px] md:min-h-[300px] p-4 bg-black/30 border border-gray-800 rounded-lg text-white text-base font-primary resize-vertical focus:outline-none focus:border-emerald-500 focus:shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-300 mb-2"
            style={{fontFamily: 'var(--font-primary)'}}
          />
        </div>
        <GradientButton
          onClick={handleGenerate}
          disabled={isGenerating || !selectedPersona}
          size="lg"
          className="w-full text-lg font-medium mt-2"
        >
          {isGenerating ? 'Generating...' : 'Generate Video'}
        </GradientButton>
      </div>
    </div>
  );
};

export default EditPrompt; 