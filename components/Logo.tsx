import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative w-10 h-10">
        {/* Abstract Isometric Shape */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="#9333ea" />
            <path d="M50 5 L90 25 L50 45 L10 25 Z" fill="#a855f7" />
            <path d="M50 45 L90 25 L90 75 L50 95 Z" fill="#7e22ce" />
            <path d="M10 25 L50 45 L50 95 L10 75 Z" fill="#6b21a8" />
            <text x="50" y="68" fontSize="40" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="monospace">JS</text>
        </svg>
      </div>
      <div className="flex flex-col justify-center h-10">
        <span className="text-xl font-extrabold tracking-tight leading-none text-brand-text">
            Learn<span className="text-brand-purple">.skript</span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 leading-none mt-1">
            Interactive Academy
        </span>
      </div>
    </div>
  );
};