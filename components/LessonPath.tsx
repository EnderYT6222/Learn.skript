import React from 'react';
import { Unit, Lesson } from '../types';
import { Check, Star, Lock, Trophy, Code } from 'lucide-react';

interface LessonPathProps {
  units: Unit[];
  completedLessonIds: string[];
  onStartLesson: (lesson: Lesson) => void;
}

const COLOR_MAP: Record<string, string> = {
    'brand-green': '#58CC02',
    'brand-blue': '#1CB0F6',
    'brand-yellow': '#FFC800',
    'brand-red': '#FF4B4B',
    'brand-purple': '#9333ea',
};

const DARKEN_COLOR_MAP: Record<string, string> = {
    'brand-green': '#46A302',
    'brand-blue': '#1899D6',
    'brand-yellow': '#E5B400',
    'brand-red': '#EA2B2B',
    'brand-purple': '#7e22ce',
};

export const LessonPath: React.FC<LessonPathProps> = ({ units, completedLessonIds, onStartLesson }) => {
  return (
    <div className="flex flex-col items-center py-12 gap-12 w-full max-w-[600px] mx-auto select-none">
      {units.map((unit, unitIndex) => {
        const totalLessons = unit.lessons.length;
        const completedInUnit = unit.lessons.filter(l => completedLessonIds.includes(l.id)).length;
        const percentComplete = Math.round((completedInUnit / totalLessons) * 100);
        const isUnitCompleted = completedInUnit === totalLessons;
        const isUnitLocked = unitIndex > 0 && !isUnitStartUnlocked(units, unit.id, completedLessonIds);
        
        const mainColor = COLOR_MAP[unit.color] || '#58CC02';
        const darkColor = DARKEN_COLOR_MAP[unit.color] || '#46A302';

        // Calculate positions
        // We use a predefined sine-like curve: Center -> Left -> Center -> Right -> Center
        // Offsets: 0, -50, 0, 50, ...
        const nodePositions = unit.lessons.map((_, i) => {
            const cycle = i % 4;
            let xOffset = 0;
            if (cycle === 1) xOffset = -60;
            if (cycle === 3) xOffset = 60;
            return { x: xOffset, y: i * 110 }; // 110px spacing
        });
        
        const svgHeight = (unit.lessons.length - 1) * 110;

        return (
            <div key={unit.id} className={`w-full relative flex flex-col items-center ${isUnitLocked ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                
                {/* Unit Header */}
                <div 
                    className="w-full mb-10 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group border-b-4 border-black/20"
                    style={{ backgroundColor: mainColor }}
                >
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-widest opacity-80 mb-1">Unit {unitIndex + 1}</h2>
                            <h3 className="text-2xl font-black leading-tight mb-2">{unit.title}</h3>
                            <p className="font-medium opacity-90 max-w-[80%] text-sm leading-relaxed">{unit.description}</p>
                        </div>
                         {isUnitCompleted && (
                            <div className="bg-white/20 p-3 rounded-2xl animate-bounce-short">
                                <Trophy size={32} className="text-white" />
                            </div>
                         )}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-6 flex items-center gap-4">
                        <div className="flex-1 bg-black/20 h-4 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-out"
                                style={{ width: `${percentComplete}%` }}
                            />
                        </div>
                        <span className="font-bold font-mono">{percentComplete}%</span>
                    </div>

                    {/* Background Decor */}
                    <Code className="absolute -right-4 -bottom-4 text-black/10 w-32 h-32 rotate-12" />
                </div>

                {/* Lessons Container */}
                <div className="relative w-full flex justify-center">
                    
                    {/* SVG Path Background */}
                    <svg 
                        className="absolute top-0 left-1/2 -translate-x-1/2 overflow-visible" 
                        width="200" 
                        height={svgHeight}
                        style={{ top: '40px' }} // Start from center of first button (approx)
                    >
                        {nodePositions.map((pos, i) => {
                            if (i === nodePositions.length - 1) return null;
                            const nextPos = nodePositions[i+1];
                            const currentLesson = unit.lessons[i];
                            const nextLesson = unit.lessons[i+1];
                            
                            // Line color depends on if the *next* lesson is unlocked/reachable
                            // If current is completed, the path to next is colored
                            const isPathColored = completedLessonIds.includes(currentLesson.id);
                            
                            const startX = pos.x + 100; // Center in 200px wide SVG
                            const startY = pos.y;
                            const endX = nextPos.x + 100;
                            const endY = nextPos.y;
                            
                            const cp1y = startY + 50;
                            const cp2y = endY - 50;

                            return (
                                <path 
                                    key={`path-${i}`}
                                    d={`M ${startX} ${startY} C ${startX} ${cp1y}, ${endX} ${cp2y}, ${endX} ${endY}`}
                                    fill="none"
                                    stroke={isPathColored ? mainColor : '#3f3f46'}
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    className="transition-colors duration-500"
                                />
                            );
                        })}
                    </svg>

                    {/* Buttons Layer */}
                    <div className="flex flex-col items-center w-full relative z-10" style={{ gap: '30px' }}> 
                        {/* Gap 30 + Button 80 = 110px spacing matches SVG */}
                        {unit.lessons.map((lesson, index) => {
                            const isCompleted = completedLessonIds.includes(lesson.id);
                            const isLocked = isUnitLocked || (!isCompleted && !completedLessonIds.includes(unit.lessons[index - 1]?.id) && (index > 0));
                            const isCurrent = !isLocked && !isCompleted;
                            
                            const pos = nodePositions[index];

                            return (
                                <div 
                                    key={lesson.id} 
                                    className="flex flex-col items-center relative"
                                    style={{ transform: `translateX(${pos.x}px)` }}
                                >
                                    {/* Tooltip for Current Lesson */}
                                    {isCurrent && (
                                        <div className="absolute -top-12 z-20 animate-bounce">
                                            <div 
                                                className="px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg text-brand-black"
                                                style={{ backgroundColor: '#fff' }}
                                            >
                                                Start
                                                <div 
                                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                                                    style={{ backgroundColor: '#fff' }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => !isLocked && onStartLesson(lesson)}
                                        disabled={isLocked}
                                        className={`
                                            relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 z-10
                                            ${isLocked ? 'bg-[#27272a] shadow-none ring-4 ring-[#3f3f46]' : ''}
                                        `}
                                        style={!isLocked ? { 
                                            backgroundColor: isCompleted ? '#FFC800' : mainColor,
                                            boxShadow: `0 8px 0 ${isCompleted ? '#E5B400' : darkColor}`
                                        } : {}}
                                    >
                                        {/* Icon */}
                                        {isCompleted ? (
                                            <Check className="text-[#5D4037] w-10 h-10" strokeWidth={4} />
                                        ) : isLocked ? (
                                            <Lock className="text-[#52525b]" size={28} />
                                        ) : (
                                            <Star fill="white" className="text-white w-10 h-10" />
                                        )}
                                        
                                        {/* Shine effect for current */}
                                        {isCurrent && (
                                            <div className="absolute inset-0 rounded-full ring-4 ring-white ring-opacity-50 animate-pulse"></div>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        );
      })}
    </div>
  );
};

function isUnitStartUnlocked(units: Unit[], currentUnitId: string, completedIds: string[]): boolean {
    const unitIndex = units.findIndex(u => u.id === currentUnitId);
    if (unitIndex === 0) return true;
    const prevUnit = units[unitIndex - 1];
    return prevUnit.lessons.every(l => completedIds.includes(l.id));
}