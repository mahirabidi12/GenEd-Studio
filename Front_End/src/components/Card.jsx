import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ title, description, icon, className = '' }) => {
  return (
    <div 
      className={`group relative overflow-hidden rounded-xl bg-black/30 backdrop-blur-sm border border-gray-800 p-6 transition-all duration-500 hover:scale-[1.02] hover:border-emerald-500/50 ${className}`}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-blue-600/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      {/* Glow effect */}
      <div className="absolute -inset-px bg-gradient-to-br from-emerald-500/50 to-blue-500/50 opacity-0 blur transition-all duration-500 group-hover:opacity-30" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{icon}</span>
          <h3 className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-emerald-400">
            {title}
          </h3>
        </div>
        <p className="text-gray-300 transition-colors duration-300 group-hover:text-gray-200">
          {description}
        </p>
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default Card;