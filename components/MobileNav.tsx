import React from 'react';
import { Home, Award, User, ShoppingBag, Dumbbell, Code2 } from 'lucide-react';

interface MobileNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'learn', icon: <Home size={24} /> },
        { id: 'practice', icon: <Dumbbell size={24} /> },
        { id: 'sandground', icon: <Code2 size={24} /> }, // Added SandGround
        { id: 'shop', icon: <ShoppingBag size={24} /> },
        { id: 'profile', icon: <User size={24} /> },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-dark border-t border-gray-800 h-20 flex justify-around items-center z-50 px-2 pb-2">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`p-3 rounded-xl transition-all ${
                        activeTab === item.id
                            ? 'text-brand-purple bg-brand-purple/10'
                            : 'text-gray-500'
                    }`}
                >
                    {item.icon}
                </button>
            ))}
        </div>
    );
};
