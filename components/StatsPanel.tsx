import React from 'react';
import { Heart, Zap, Flame, Diamond } from 'lucide-react';

interface StatsPanelProps {
    hearts: number;
    xp: number;
    streak: number;
    gems: number;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ hearts, xp, streak, gems }) => {
    return (
        <div className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-brand-black/90 backdrop-blur-md border-b border-gray-800 z-20 flex items-center justify-end px-4 md:px-8">
            <div className="flex items-center gap-4 md:gap-6">
                 {/* Streak */}
                <div className="flex items-center gap-1.5 text-brand-yellow font-black uppercase tracking-wide cursor-help" title="Daily Streak">
                    <Flame className="fill-brand-yellow" size={20} /> <span className="text-sm md:text-base">{streak}</span>
                </div>
                
                {/* Gems */}
                <div className="flex items-center gap-1.5 text-cyan-400 font-black uppercase tracking-wide cursor-help" title="Gems">
                    <Diamond className="fill-cyan-400" size={20} /> <span className="text-sm md:text-base">{gems}</span>
                </div>

                {/* XP */}
                <div className="hidden md:flex items-center gap-1.5 text-brand-purple font-black uppercase tracking-wide">
                    <Zap className="fill-brand-purple" size={20} /> <span className="text-sm md:text-base">{xp} XP</span>
                </div>

                {/* Hearts */}
                <div className="flex items-center gap-1.5 text-brand-red font-black uppercase tracking-wide cursor-help" title="Hearts">
                    <Heart className="fill-brand-red" size={20} /> <span className="text-sm md:text-base">{hearts === Infinity ? '∞' : hearts}</span>
                </div>
            </div>
        </div>
    );
}