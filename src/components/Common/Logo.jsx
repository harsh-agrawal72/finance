import React from 'react';

const Logo = ({ size = 32, showText = false, textColor = 'white' }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 0 8px rgba(0, 242, 255, 0.3))' }}
      >
        {/* Bar 1 - Cyan */}
        <path 
          d="M15 80 L35 80 L50 25 L30 25 Z" 
          fill="url(#gradient-cyan)" 
        />
        {/* Bar 2 - Blue */}
        <path 
          d="M38 85 L58 85 L73 15 L53 15 Z" 
          fill="url(#gradient-blue)" 
        />
        {/* Bar 3 - Purple */}
        <path 
          d="M61 90 L81 90 L96 5 L76 5 Z" 
          fill="url(#gradient-purple)" 
        />
        
        <defs>
          <linearGradient id="gradient-cyan" x1="15" y1="80" x2="50" y2="25" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00f2ff" />
            <stop offset="1" stopColor="#0ea5e9" />
          </linearGradient>
          <linearGradient id="gradient-blue" x1="38" y1="85" x2="73" y2="15" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" />
            <stop offset="1" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="gradient-purple" x1="61" y1="90" x2="96" y2="5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <h2 style={{ 
          margin: 0, 
          fontWeight: 800, 
          fontSize: size * 0.6, 
          letterSpacing: '-0.5px', 
          color: textColor,
          fontFamily: 'inherit'
        }}>
          Ledzo
        </h2>
      )}
    </div>
  );
};

export default Logo;
