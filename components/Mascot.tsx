import React from 'react';

interface MascotProps {
  mood: 'idle' | 'happy' | 'sad' | 'dancing';
  message?: string;
  className?: string;
}

export const Mascot: React.FC<MascotProps> = ({ mood, message, className = "" }) => {
    return (
        <div className={`relative flex flex-col items-center ${className}`}>
            {/* Speech Bubble */}
            {message && (
                <div className={`mb-4 relative bg-white text-black font-black uppercase text-sm py-2 px-4 rounded-xl shadow-lg animate-pop-in
                    ${mood === 'sad' ? 'border-2 border-brand-red text-brand-red' : ''}
                    ${mood === 'happy' || mood === 'dancing' ? 'border-2 border-brand-green text-brand-green' : ''}
                `}>
                    {message}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-b-2 border-r-2 border-inherit"></div>
                </div>
            )}

            {/* Bobo Character */}
            <div className={`w-24 h-24 transition-transform duration-300 ${mood === 'dancing' ? 'animate-dance' : ''}`}>
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
                    {/* Body */}
                    <path 
                        d="M20 70 Q10 50 20 30 Q30 5 50 5 Q70 5 80 30 Q90 50 80 70 Q70 95 50 95 Q30 95 20 70 Z" 
                        fill={mood === 'sad' ? '#FF4B4B' : (mood === 'happy' || mood === 'dancing') ? '#58CC02' : '#9333ea'}
                        className="transition-colors duration-500"
                    />
                    
                    {/* Eyes */}
                    {mood === 'sad' ? (
                        <>
                            <path d="M30 40 L40 45" stroke="white" strokeWidth="4" strokeLinecap="round" />
                            <path d="M40 40 L30 45" stroke="white" strokeWidth="4" strokeLinecap="round" />
                            <path d="M60 40 L70 45" stroke="white" strokeWidth="4" strokeLinecap="round" />
                            <path d="M70 40 L60 45" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        </>
                    ) : (
                        <>
                            <circle cx="35" cy="40" r="6" fill="white" />
                            <circle cx="65" cy="40" r="6" fill="white" />
                            <circle cx="37" cy="38" r="2" fill="black" />
                            <circle cx="67" cy="38" r="2" fill="black" />
                        </>
                    )}

                    {/* Mouth */}
                    {mood === 'happy' || mood === 'dancing' ? (
                        <path d="M35 60 Q50 75 65 60" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" />
                    ) : mood === 'sad' ? (
                         <path d="M35 70 Q50 60 65 70" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" />
                    ) : (
                        <path d="M40 65 L60 65" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" />
                    )}

                    {/* Arms (Simple animation via CSS classes usually, but static SVG here with conditional rendering) */}
                    {mood === 'dancing' && (
                        <>
                           <path d="M15 50 Q5 30 15 20" fill="none" stroke="#58CC02" strokeWidth="6" strokeLinecap="round" />
                           <path d="M85 50 Q95 30 85 20" fill="none" stroke="#58CC02" strokeWidth="6" strokeLinecap="round" />
                        </>
                    )}
                </svg>
            </div>
            
            <div className="mt-2 font-black text-xs text-brand-muted uppercase tracking-widest opacity-50">Bobo</div>
        </div>
    );
};