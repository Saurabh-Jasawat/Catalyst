import React from 'react';

const Logo = ({ size = 32, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="bulbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      
      {/* Rays */}
      <line x1="60" y1="18" x2="60" y2="6" stroke="#f59e0b" strokeWidth="5.5" strokeLinecap="round" />
      <line x1="30" y1="30" x2="21" y2="21" stroke="#f59e0b" strokeWidth="5.5" strokeLinecap="round" />
      <line x1="90" y1="30" x2="99" y2="21" stroke="#f59e0b" strokeWidth="5.5" strokeLinecap="round" />
      <line x1="18" y1="60" x2="6" y2="60" stroke="#f59e0b" strokeWidth="5.5" strokeLinecap="round" />
      <line x1="102" y1="60" x2="114" y2="60" stroke="#f59e0b" strokeWidth="5.5" strokeLinecap="round" />
      
      {/* Bulb Outline */}
      <path 
        d="M38 78 C26 66 26 42 44 30 C56 22 68 22 80 30 C98 42 98 66 86 78 C83 82 78 89 78 91 L46 91 C46 89 41 82 38 78 Z" 
        fill="none" 
        stroke="url(#bulbGrad)" 
        strokeWidth="7" 
        strokeLinecap="round"
        strokeLinejoin="round" 
      />
      
      {/* Bulb Base */}
      <path d="M48 97 C48 95 76 95 76 97 L74 103 C74 105 50 105 50 103 Z" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" />
      <path d="M55 106 C55 105 69 105 69 106 L66 111 C66 112 58 112 58 111 Z" fill="#d97706" />

      {/* Book / Checklist Document Sign Inside Bulb */}
      <g transform="translate(10, 0)">
        {/* Document Sheet */}
        <path 
          d="M38 42 H54 C56 42 58 44 58 46 V66 C58 68 56 70 54 70 H38 C36 70 34 68 34 66 V46 C34 44 36 42 38 42 Z" 
          fill="none" 
          stroke="url(#bulbGrad)" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        {/* Sheet Lines */}
        <line x1="40" y1="49" x2="52" y2="49" stroke="url(#bulbGrad)" strokeWidth="3" strokeLinecap="round" />
        <line x1="40" y1="56" x2="52" y2="56" stroke="url(#bulbGrad)" strokeWidth="3" strokeLinecap="round" />
        
        {/* Checkmark overlapping the document */}
        <path 
          d="M48 64 L54 70 L66 52" 
          fill="none" 
          stroke="#10b981" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </g>
    </svg>
  );
};

export default Logo;
