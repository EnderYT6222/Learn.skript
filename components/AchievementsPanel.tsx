import React from 'react';
import { ACHIEVEMENTS } from '../constants';
import { UserState } from '../types';
import { Award, Lock } from 'lucide-react';

interface AchievementsPanelProps {
    userState: UserState;
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ userState }) => {
    // Calculate overall stats
    const unlockedCount = userState.unlockedAchievements.length;
    const totalCount = ACHIEVEMENTS.length;
    const progress = (unlockedCount / totalCount) * 100;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="bg-brand-dark rounded-2xl p-6 shadow-sm border border-gray-800 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Award className="text-brand-yellow" size={32} />
                        Achievements
                    </h2>
                    <span className="text-gray-400 font-bold">{unlockedCount} / {totalCount}</span>
                </div>
                {/* Overall Progress */}
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-brand-yellow transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ACHIEVEMENTS.map((achievement) => {
                    const isUnlocked = userState.unlockedAchievements.includes(achievement.id);

                    return (
                        <div 
                            key={achievement.id}
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                                isUnlocked 
                                    ? 'bg-brand-yellow/10 border-brand-yellow/50' 
                                    : 'bg-brand-dark border-gray-800 opacity-50'
                            }`}
                        >
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 text-2xl shadow-sm
                                ${isUnlocked ? 'bg-gradient-to-br from-brand-yellow to-brand-yellowDark text-black' : 'bg-gray-800 text-gray-600'}
                            `}>
                                {isUnlocked ? <Award size={32} /> : <Lock size={24} />}
                            </div>
                            
                            <div>
                                <h3 className={`font-bold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                                    {achievement.title}
                                </h3>
                                <p className="text-sm text-gray-400 leading-tight mt-1">
                                    {achievement.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};