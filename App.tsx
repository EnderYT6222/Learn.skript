import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { LessonPath } from './components/LessonPath';
import { QuizView } from './components/QuizView';
import { StatsPanel } from './components/StatsPanel';
import { AchievementsPanel } from './components/AchievementsPanel';
import { DocsView } from './components/DocsView';
import { PracticeView } from './components/PracticeView';
import { ShopView } from './components/ShopView';
import { SettingsView } from './components/SettingsView';
import { SandGround } from './components/SandGround';
import { Modal } from './components/Modal';
import { INITIAL_USER_STATE, ACHIEVEMENTS, DOCS, getUnits } from './constants';
import { Lesson, UserState, Difficulty, ShopItem } from './types';
import { User, Award, Settings, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

interface ModalState {
    isOpen: boolean;
    type: 'alert' | 'confirm';
    title?: string;
    message: string;
    onConfirm?: () => void;
}

function App() {
  const [activeTab, setActiveTab] = useState('learn');
  const [userState, setUserState] = useState<UserState>(INITIAL_USER_STATE);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [newUnlock, setNewUnlock] = useState<string | null>(null);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  
  // Modal State
  const [modal, setModal] = useState<ModalState>({ isOpen: false, type: 'alert', message: '' });

  // Get current units based on language
  const units = useMemo(() => getUnits(userState.language), [userState.language]);

  const showAlert = (message: string, title?: string) => {
      setModal({ isOpen: true, type: 'alert', message, title });
  };

  const showConfirm = (message: string, onConfirm: () => void, title?: string) => {
      setModal({ isOpen: true, type: 'confirm', message, title, onConfirm });
  };

  const closeModal = () => {
      setModal(prev => ({ ...prev, isOpen: false }));
  };

  // Global listener for SandGround iframe alerts
  useEffect(() => {
    const handler = (e: MessageEvent) => {
        if (e.data?.type === 'alert') {
            showAlert(e.data.message, "SandGround");
        }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('learnskript_state_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUserState({ ...INITIAL_USER_STATE, ...parsed });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('learnskript_state_v2', JSON.stringify(userState));
  }, [userState]);

  useEffect(() => {
    if (userState.theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.style.backgroundColor = '#0a0a0a';
        document.body.style.color = '#ededed';
    } else {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '#f3f4f6';
        document.body.style.color = '#1f2937';
    }
  }, [userState.theme]);

  useEffect(() => {
    const unlockedNow: string[] = [];
    ACHIEVEMENTS.forEach(ach => {
        if (!userState.unlockedAchievements.includes(ach.id)) {
            if (ach.condition(userState)) {
                unlockedNow.push(ach.id);
            }
        }
    });

    if (unlockedNow.length > 0) {
        setUserState(prev => ({
            ...prev,
            unlockedAchievements: [...prev.unlockedAchievements, ...unlockedNow]
        }));
        setNewUnlock(ACHIEVEMENTS.find(a => a.id === unlockedNow[0])?.title || "Achievement Unlocked!");
        setTimeout(() => setNewUnlock(null), 3000);
    }
  }, [userState.xp, userState.completedLessonIds.length, userState.streak, userState.gems]);


  const handleStartLesson = (lesson: Lesson) => {
    if (userState.hearts > 0 || userState.difficulty === 'easy') {
        setIsPracticeMode(false);
        setActiveLesson(lesson);
    } else {
        showAlert("You are out of hearts! Visit the shop or practice to refill.", "Out of Health");
        setActiveTab('shop');
    }
  };

  const handleStartPractice = () => {
    const allQuestions = units.flatMap(u => u.lessons)
        .filter(l => userState.completedLessonIds.includes(l.id))
        .flatMap(l => l.questions);
    
    if (allQuestions.length === 0) return;

    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const practiceQuestions = shuffled.slice(0, 10);

    const practiceLesson: Lesson = {
        id: 'practice-session',
        title: 'Practice Session',
        description: 'Reviewing your skills',
        questions: practiceQuestions,
        totalXP: 5, 
        gems: 0, 
        isCompleted: false,
        isLocked: false,
        icon: '🏋️'
    };

    setIsPracticeMode(true);
    setActiveLesson(practiceLesson);
  };

  const handleLessonComplete = (xpEarned: number) => {
    if (!activeLesson) return;

    setUserState(prev => ({
        ...prev,
        xp: prev.xp + xpEarned,
        gems: isPracticeMode ? prev.gems : prev.gems + activeLesson.gems,
        completedLessonIds: isPracticeMode 
            ? prev.completedLessonIds 
            : [...new Set([...prev.completedLessonIds, activeLesson.id])],
        streak: calculateStreak(prev, isPracticeMode),
        lastCompletedDate: isPracticeMode ? prev.lastCompletedDate : new Date().toISOString().split('T')[0]
    }));
    setActiveLesson(null);
    setIsPracticeMode(false);
  };

  const calculateStreak = (prev: UserState, isPractice: boolean) => {
      if (isPractice) return prev.streak; 
      
      const today = new Date().toISOString().split('T')[0];
      if (prev.lastCompletedDate === today) return prev.streak;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];

      if (prev.lastCompletedDate === yesterdayString) return prev.streak + 1;
      return 1;
  };

  const handleExitLesson = () => {
      showConfirm("Are you sure? You will lose progress for this lesson.", () => {
          setActiveLesson(null);
          setIsPracticeMode(false);
      }, "Quit Lesson?");
  };

  const handleLoseHeart = () => {
    if (isPracticeMode || userState.difficulty === 'easy') return;
    
    setUserState(prev => {
        const newHearts = Math.max(0, prev.hearts - 1);
        if (newHearts === 0) {
             setTimeout(() => {
                showAlert("Oh no! You ran out of hearts. Time to practice or refill!", "Game Over");
                setActiveLesson(null);
             }, 1000);
        }
        return { ...prev, hearts: newHearts };
    });
  };

  const handleBuyItem = (item: ShopItem) => {
      if (userState.gems < item.cost) return;

      if (item.id === 'refill_hearts') {
          if (userState.hearts === 5) {
              showAlert("Hearts are already full!");
              return;
          }
          setUserState(prev => ({ ...prev, hearts: 5, gems: prev.gems - item.cost }));
      } else {
          if (userState.inventory.includes(item.id) && item.type !== 'streak_freeze') {
              showAlert("You already own this!");
              return;
          }
           setUserState(prev => ({ 
               ...prev, 
               gems: prev.gems - item.cost,
               inventory: [...prev.inventory, item.id]
           }));
      }
  };

  const handleUpdateSettings = (key: keyof UserState, value: any) => {
      setUserState(prev => ({ ...prev, [key]: value }));
  };

  const handleOpenDocs = (concept: string) => {
      const doc = DOCS.find(d => d.concept === concept);
      if (doc) {
          setActiveDocId(doc.id);
          if(activeLesson) {
             showConfirm("Pause lesson to read documentation?", () => {
                 setActiveLesson(null);
                 setActiveTab('docs');
             });
          } else {
             setActiveTab('docs');
          }
      } else {
          showAlert("Documentation not available for this concept yet.");
      }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans transition-colors duration-300 ${userState.theme === 'dark' ? 'bg-brand-black text-white' : 'bg-gray-100 text-gray-900'}`}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userState={userState} />
        <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Global Modal */}
        <Modal 
            isOpen={modal.isOpen} 
            type={modal.type}
            title={modal.title}
            message={modal.message}
            onConfirm={modal.onConfirm}
            onCancel={closeModal}
        />

        {newUnlock && (
            <div className="fixed top-20 right-4 z-50 animate-bounce-short bg-brand-yellow text-brand-black px-6 py-4 rounded-xl shadow-lg border-b-4 border-yellow-600 flex items-center gap-3">
                <Award size={24} />
                <div>
                    <p className="text-xs font-bold uppercase opacity-80">Unlocked!</p>
                    <p className="font-bold">{newUnlock}</p>
                </div>
            </div>
        )}

        <main className={`flex-1 md:ml-64 pt-20 pb-24 md:pb-8 min-h-screen overflow-x-hidden ${userState.theme === 'dark' ? 'bg-brand-black' : 'bg-gray-50'}`}>
            {activeTab === 'learn' && (
                <>
                    <StatsPanel hearts={userState.hearts} xp={userState.xp} streak={userState.streak} gems={userState.gems} />
                    <div className="max-w-2xl mx-auto px-4">
                        <LessonPath units={units} completedLessonIds={userState.completedLessonIds} onStartLesson={handleStartLesson} />
                    </div>
                </>
            )}

            {activeTab === 'practice' && <PracticeView onStartPractice={handleStartPractice} unlockedCount={userState.completedLessonIds.length} />}
            
            {activeTab === 'sandground' && <SandGround language={userState.language} />}

            {activeTab === 'shop' && <ShopView userState={userState} buyItem={handleBuyItem} onShowAlert={showAlert} />}

            {activeTab === 'docs' && <DocsView userState={userState} initialDocId={activeDocId} />}
            
            {activeTab === 'settings' && <SettingsView userState={userState} updateSettings={handleUpdateSettings} resetProgress={() => setUserState(INITIAL_USER_STATE)} onShowConfirm={showConfirm} />}

            {activeTab === 'leaderboard' && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 font-bold text-xl">
                    <Award size={48} className="mb-4 opacity-50" />
                    <p>Leaderboard coming soon</p>
                </div>
            )}
            
            {activeTab === 'profile' && (
                <div className="p-4">
                    <div className={`max-w-4xl mx-auto rounded-3xl p-8 shadow-sm mb-8 border ${userState.theme === 'dark' ? 'bg-brand-dark border-gray-800' : 'bg-white border-gray-200'}`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 bg-brand-purple text-white rounded-2xl flex items-center justify-center text-4xl font-bold border-4 border-purple-400/20">
                                    <User size={48} />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-extrabold">Student</h1>
                                    <p className="text-gray-400">Joined 2024</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                             <div className={`border-2 p-4 rounded-xl ${userState.theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                                <p className="text-gray-500 font-bold text-xs uppercase mb-1">Total XP</p>
                                <p className="text-2xl font-black text-brand-purple">{userState.xp}</p>
                             </div>
                             <div className={`border-2 p-4 rounded-xl ${userState.theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                                <p className="text-gray-500 font-bold text-xs uppercase mb-1">Streak</p>
                                <p className="text-2xl font-black text-brand-red">{userState.streak}</p>
                             </div>
                        </div>
                    </div>
                    <AchievementsPanel userState={userState} />
                </div>
            )}
        </main>

        {activeLesson && (
            <QuizView 
                lesson={activeLesson}
                userHearts={userState.hearts}
                difficulty={userState.difficulty}
                language={userState.language}
                onComplete={handleLessonComplete}
                onExit={handleExitLesson}
                onLoseHeart={handleLoseHeart}
                onOpenDocs={handleOpenDocs}
                isPracticeMode={isPracticeMode}
            />
        )}
    </div>
  );
}

export default App;