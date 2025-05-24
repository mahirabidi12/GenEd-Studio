import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GradientButton from '../components/GradientButton';

const defaultPersonas = [
  {
    id: 1,
    name: "Harsh Sir",
    description: "Professional and engaging teaching style",
    imageUrl: "https://via.placeholder.com/80"
  },
  {
    id: 2,
    name: "NV Sir",
    description: "Friendly and casual teaching approach",
    imageUrl: "https://via.placeholder.com/80"
  }
];

const EditPrompt = () => {
  const location = useLocation();
  const [promptText, setPromptText] = useState(location.state?.response || '');
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTextChange = (e) => {
    setPromptText(e.target.value);
  };

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona.id);
  };

  const handleAddPersona = () => {
    console.log('Add persona clicked');
  };

  const handleGenerate = async () => {
    if (!selectedPersona) {
      alert('Please select a persona first');
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:3000/user/generateResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptText,
          personaId: selectedPersona
        }),
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
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Prompt</h1>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select a Persona</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {defaultPersonas.map(persona => (
              <div
                key={persona.id}
                className={`p-4 rounded-lg border ${selectedPersona === persona.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-700'} cursor-pointer transition-all duration-200 hover:border-emerald-500`}
                onClick={() => handlePersonaSelect(persona)}
              >
                <img src={persona.imageUrl} alt={persona.name} className="w-20 h-20 rounded-full mb-2" />
                <h3 className="text-lg font-bold">{persona.name}</h3>
                <p className="text-gray-300">{persona.description}</p>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddPersona}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            + Add Custom Persona
          </button>
        </div>
        <div className="mb-6">
          <textarea
            value={promptText}
            onChange={handleTextChange}
            placeholder="Edit your prompt here..."
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            rows="6"
          />
        </div>
        <GradientButton
          onClick={handleGenerate}
          disabled={isGenerating || !selectedPersona}
          size="lg"
        >
          {isGenerating ? 'Generating...' : 'Generate Video'}
        </GradientButton>
      </div>
    </div>
  );
};

export default EditPrompt; 