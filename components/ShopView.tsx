import React from 'react';
import { ShopItem, UserState } from '../types';
import { Heart, Zap, Shield, Diamond, Check, ShoppingBag } from 'lucide-react';

interface ShopViewProps {
    userState: UserState;
    buyItem: (item: ShopItem) => void;
    onShowAlert: (msg: string) => void;
}

const SHOP_ITEMS: ShopItem[] = [
    {
        id: 'refill_hearts',
        title: 'Heart Refill',
        description: 'Restore full health to keep learning.',
        cost: 50,
        icon: <Heart className="text-brand-red fill-brand-red" size={32} />,
        type: 'heart_refill'
    },
    {
        id: 'streak_freeze',
        title: 'Streak Freeze',
        description: 'Miss a day without losing your streak.',
        cost: 200,
        icon: <Shield className="text-blue-400 fill-blue-400" size={32} />,
        type: 'streak_freeze'
    },
    {
        id: 'unlimited_hearts_1h',
        title: 'Unlimited Hearts (1h)',
        description: 'Learn without fear of failure for an hour.',
        cost: 300,
        icon: <Zap className="text-yellow-400 fill-yellow-400" size={32} />,
        type: 'theme_color' // abusing type for now
    }
];

export const ShopView: React.FC<ShopViewProps> = ({ userState, buyItem, onShowAlert }) => {
    return (
        <div className="max-w-4xl mx-auto p-6 md:p-10 pb-32">
            <div className="mb-10 text-center">
                <h1 className="text-3xl md:text-4xl font-black text-brand-text mb-2">Shop</h1>
                <p className="text-gray-400">Spend your hard-earned gems on power-ups.</p>
                
                <div className="mt-6 inline-flex items-center gap-2 bg-cyan-900/30 border border-cyan-500/30 px-6 py-2 rounded-full">
                    <Diamond className="text-cyan-400 fill-cyan-400" size={24} />
                    <span className="text-2xl font-black text-cyan-400">{userState.gems}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SHOP_ITEMS.map((item) => {
                    const canAfford = userState.gems >= item.cost;
                    const isOwned = userState.inventory.includes(item.id); 

                    return (
                        <div key={item.id} className="bg-brand-dark border-2 border-gray-800 rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:border-gray-600">
                            <div className="mb-4 p-4 bg-brand-black rounded-full shadow-inner">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-gray-400 text-sm mb-6 flex-1">{item.description}</p>
                            
                            <button
                                onClick={() => buyItem(item)}
                                disabled={!canAfford}
                                className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95
                                    ${canAfford 
                                        ? 'bg-brand-green text-white shadow-[0_4px_0_0_#46A302] hover:bg-brand-greenDark' 
                                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
                                `}
                            >
                                {isOwned && item.type === 'streak_freeze' ? (
                                    <> <Check size={18} /> Equipped </>
                                ) : (
                                    <>
                                        <Diamond size={16} className={canAfford ? 'fill-white' : 'fill-gray-500'} /> 
                                        {item.cost}
                                    </>
                                )}
                            </button>
                        </div>
                    )
                })}
            </div>
            
            <div className="mt-12 p-6 rounded-2xl border border-gray-800 bg-black/40 text-center">
                <ShoppingBag className="mx-auto text-gray-600 mb-2" size={32} />
                <h3 className="text-gray-400 font-bold uppercase text-xs tracking-widest">No real money required</h3>
                <p className="text-gray-500 text-sm mt-1">We believe education should be free. You can only earn gems by learning.</p>
            </div>
        </div>
    );
};