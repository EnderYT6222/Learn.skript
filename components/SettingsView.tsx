import React from 'react';
import { UserState, Theme, Language } from '../types';
import { Moon, Sun, Monitor, Languages, Database, RefreshCw } from 'lucide-react';

interface SettingsViewProps {
    userState: UserState;
    updateSettings: (key: keyof UserState, value: any) => void;
    resetProgress: () => void;
    onShowConfirm: (msg: string, action: () => void) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ userState, updateSettings, resetProgress, onShowConfirm }) => {
    
    return (
        <div className="max-w-2xl mx-auto p-6 md:p-10 pb-32">
             <h1 className="text-3xl font-black text-brand-text mb-8 border-b border-gray-800 pb-4">Settings</h1>

             {/* Appearance */}
             <div className="mb-10">
                <h2 className="text-sm font-bold uppercase text-gray-500 mb-4 tracking-widest">Appearance</h2>
                <div className="bg-brand-dark rounded-2xl border border-gray-800 overflow-hidden">
                    <div className="grid grid-cols-2 p-1 gap-1">
                        <button 
                            onClick={() => updateSettings('theme', 'dark')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold transition-all ${userState.theme === 'dark' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Moon size={18} /> Dark
                        </button>
                        <button 
                            onClick={() => updateSettings('theme', 'light')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold transition-all ${userState.theme === 'light' ? 'bg-gray-200 text-black shadow-sm' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Sun size={18} /> Light
                        </button>
                    </div>
                </div>
             </div>

             {/* Language */}
             <div className="mb-10">
                <h2 className="text-sm font-bold uppercase text-gray-500 mb-4 tracking-widest">Language</h2>
                <div className="bg-brand-dark rounded-2xl border border-gray-800 p-4">
                    <div className="flex items-center gap-3 mb-4 text-brand-text">
                        <Languages size={24} className="text-brand-purple" />
                        <span className="font-bold">Learning Language</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         {[
                             { code: 'en', label: 'English' },
                             { code: 'tr', label: 'Türkçe' },
                             { code: 'es', label: 'Español' },
                             { code: 'pt', label: 'Português' }
                         ].map(lang => (
                             <button
                                key={lang.code}
                                onClick={() => updateSettings('language', lang.code)}
                                className={`p-3 rounded-xl border-2 text-left font-bold transition-all ${
                                    userState.language === lang.code 
                                        ? 'border-brand-purple bg-brand-purple/10 text-brand-purple' 
                                        : 'border-gray-700 hover:border-gray-500 text-gray-400'
                                }`}
                             >
                                 {lang.label}
                             </button>
                         ))}
                    </div>
                </div>
             </div>

             {/* Danger Zone */}
             <div className="mb-10">
                <h2 className="text-sm font-bold uppercase text-brand-red mb-4 tracking-widest">Danger Zone</h2>
                <button 
                    onClick={() => {
                        onShowConfirm("Are you sure? All progress will be lost permanently.", resetProgress);
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-brand-red/30 bg-brand-red/5 text-brand-red hover:bg-brand-red/10 transition-colors"
                >
                    <span className="font-bold flex items-center gap-2"><RefreshCw size={18} /> Reset Progress</span>
                </button>
             </div>

             {/* Version Info */}
             <div className="text-center text-gray-600 text-xs">
                 <p className="font-mono mb-1">Learn.skript v2.0.1 (Build 892)</p>
                 <p>User ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
             </div>
        </div>
    );
};