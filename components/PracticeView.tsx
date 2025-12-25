import React from 'react';
import { Dumbbell, Infinity as InfinityIcon } from 'lucide-react';

interface PracticeViewProps {
    onStartPractice: () => void;
    unlockedCount: number;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ onStartPractice, unlockedCount }) => {
    const canPractice = unlockedCount > 0;

    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] p-6 text-center">
            <div className="mb-8 relative">
                <div className="absolute inset-0 bg-brand-purple blur-[60px] opacity-20 rounded-full"></div>
                <div className="relative bg-brand-dark p-8 rounded-[3rem] shadow-2xl border border-gray-800">
                    <Dumbbell size={80} className="text-brand-purple" />
                </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                Practice Hub
            </h1>
            
            <p className="text-xl text-gray-400 max-w-md mb-10 leading-relaxed">
                Review past lessons to keep your skills sharp. Practice mode costs <span className="text-brand-purple font-bold">0 hearts</span>.
            </p>

            <button
                onClick={onStartPractice}
                disabled={!canPractice}
                className={`group relative px-10 py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all
                    ${canPractice 
                        ? 'bg-brand-purple text-white hover:bg-brand-purpleDark shadow-[0_6px_0_0_#581c87] active:translate-y-[6px] active:shadow-none' 
                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'}
                `}
            >
                <span className="flex items-center gap-3">
                    <InfinityIcon size={24} /> 
                    {canPractice ? 'Start Session' : 'Complete a lesson first'}
                </span>
            </button>
            
            {!canPractice && (
                <p className="mt-4 text-sm text-brand-red font-bold animate-pulse">
                    Finish your first lesson to unlock practice!
                </p>
            )}
        </div>
    );
};