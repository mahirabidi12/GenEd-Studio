import React from 'react';
import PropTypes from 'prop-types';

const GradientText = ({ children, size = 'text-xl', className = '', as: Component = 'span' }) => {
  return (
    <Component 
      className={`bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent font-bold leading-tight ${size} ${className}`}
    >
      {children}
    </Component>
  );
};

GradientText.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.string,
  className: PropTypes.string,
  as: PropTypes.elementType
};

export default GradientText;