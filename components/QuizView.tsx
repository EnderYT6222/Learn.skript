import React, { useState, useEffect } from 'react';
import { Lesson, Option, Difficulty, Pair } from '../types';
import { X, Heart, BookOpen, Check, Zap, Infinity as InfinityIcon, ArrowUp, ArrowDown, Diamond } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TRANSLATIONS } from '../translations';
import { Language } from '../types';
import { Mascot } from './Mascot';

interface QuizViewProps {
  lesson: Lesson;
  userHearts: number;
  difficulty: Difficulty;
  language?: Language; 
  onComplete: (xpEarned: number) => void;
  onExit: () => void;
  onLoseHeart: () => void;
  onOpenDocs: (concept: string) => void;
  isPracticeMode?: boolean;
}

export const QuizView: React.FC<QuizViewProps> = ({ 
    lesson, 
    userHearts, 
    difficulty,
    language = 'en',
    onComplete, 
    onExit, 
    onLoseHeart,
    onOpenDocs,
    isPracticeMode = false
}) => {
  const t = TRANSLATIONS[language];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<Option[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  
  const [textInput, setTextInput] = useState("");
  const [fillCodeInput, setFillCodeInput] = useState("");
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  const [shuffledLeft, setShuffledLeft] = useState<Pair[]>([]);
  const [shuffledRight, setShuffledRight] = useState<Pair[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [isCompleted, setIsCompleted] = useState(false);

  // Bobo State
  const [boboMood, setBoboMood] = useState<'idle' | 'happy' | 'sad' | 'dancing'>('idle');
  const [boboMessage, setBoboMessage] = useState<string | undefined>(undefined);

  const currentQuestion = lesson.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / lesson.questions.length) * 100;

  useEffect(() => {
    resetQuestionState();

    if (currentQuestion) {
        if (currentQuestion.type === 'match-pairs' && currentQuestion.pairs) {
            setShuffledLeft([...currentQuestion.pairs].sort(() => 0.5 - Math.random()));
            setShuffledRight([...currentQuestion.pairs].sort(() => 0.5 - Math.random()));
        } else if (currentQuestion.type === 'order-list' && currentQuestion.items) {
            setOrderedItems([...currentQuestion.items].sort(() => 0.5 - Math.random()));
        } else if (currentQuestion.type === 'multiple-choice' && currentQuestion.options) {
            const opts = [...currentQuestion.options];
            for (let i = opts.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [opts[i], opts[j]] = [opts[j], opts[i]];
            }
            setShuffledOptions(opts);
        }
    }
  }, [currentQuestionIndex, currentQuestion]);

  const resetQuestionState = () => {
    setSelectedOptionId(null);
    setStatus('idle');
    setBoboMood('idle');
    setBoboMessage(undefined);
    setTextInput("");
    setFillCodeInput("");
    setOrderedItems([]);
    setSelectedLeft(null);
    setMatchedPairs([]);
  }

  useEffect(() => {
    if (isCompleted) {
        setBoboMood('dancing');
        setBoboMessage("Wohoooo.");
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 60 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
        return () => clearInterval(interval);
    }
  }, [isCompleted]);

  const handleCheck = () => {
    let isCorrect = false;

    if (currentQuestion.type === 'text-input') {
        if (textInput.trim().toLowerCase() === currentQuestion.expectedAnswer?.toLowerCase()) {
            isCorrect = true;
        }
    } else if (currentQuestion.type === 'fill-code' || currentQuestion.type === 'fill-blank-code') {
        if (currentQuestion.expectedAnswer) {
            if (fillCodeInput.trim() === currentQuestion.expectedAnswer) {
                isCorrect = true;
            }
        } else if (selectedOptionId && currentQuestion.options) {
             const selectedOption = currentQuestion.options.find(o => o.id === selectedOptionId);
             if (selectedOption?.isCorrect) isCorrect = true;
        }
    } else if (currentQuestion.type === 'match-pairs') {
        if (matchedPairs.length === currentQuestion.pairs?.length) {
            isCorrect = true;
        }
    } else if (currentQuestion.type === 'order-list') {
        if (JSON.stringify(orderedItems) === JSON.stringify(currentQuestion.correctOrder)) {
            isCorrect = true;
        }
    } else {
        if (!selectedOptionId) return;
        const selectedOption = currentQuestion.options?.find(o => o.id === selectedOptionId);
        if (selectedOption?.isCorrect) isCorrect = true;
    }

    if (isCorrect) {
      setStatus('correct');
      setBoboMood('happy');
      setBoboMessage("Wohoooo.");
    } else {
      setStatus('incorrect');
      setBoboMood('sad');
      setBoboMessage("Ooopsie.");
      if (!isPracticeMode && difficulty !== 'easy') {
        onLoseHeart();
      }
    }
  };

  const handleMatchClick = (side: 'left' | 'right', pair: Pair) => {
      if (status !== 'idle') return;

      if (side === 'left') {
          setSelectedLeft(pair.id);
      } else {
          if (selectedLeft) {
              if (selectedLeft === pair.id) {
                  setMatchedPairs(prev => [...prev, pair.id]);
                  setSelectedLeft(null);
                  if (matchedPairs.length + 1 === currentQuestion.pairs?.length) {
                      setStatus('correct');
                      setBoboMood('happy');
                      setBoboMessage("Wohoooo.");
                  }
              } else {
                  if (!isPracticeMode && difficulty !== 'easy') onLoseHeart();
                  setSelectedLeft(null);
                  setBoboMood('sad');
                  setBoboMessage("Ooopsie.");
                  // Reset mood after short delay so user can try again immediately
                  setTimeout(() => {
                      if(status === 'idle') {
                          setBoboMood('idle');
                          setBoboMessage(undefined);
                      }
                  }, 1500);
              }
          }
      }
  }
  
  const moveItem = (index: number, direction: 'up' | 'down') => {
      if (status !== 'idle') return;
      const newItems = [...orderedItems];
      if (direction === 'up') {
          if (index === 0) return;
          [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      } else {
          if (index === newItems.length - 1) return;
          [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      }
      setOrderedItems(newItems);
  }

  const handleNext = () => {
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const highlightSyntax = (code: string) => {
      const keywords = ['function', 'const', 'let', 'var', 'return', 'import', 'from', 'export', 'default', 'class', 'if', 'else', 'for'];
      return code.split(/(\s+)/).map((word, i) => {
          if (keywords.includes(word)) {
              return <span key={i} className="text-brand-purple">{word}</span>;
          }
          if (word.startsWith('<') || word.endsWith('>')) {
              return <span key={i} className="text-blue-400">{word}</span>;
          }
          return word;
      });
  };

  const renderCodeSnippet = (code: string) => (
    <div className="mb-10 rounded-lg overflow-hidden shadow-2xl border border-[#333] bg-[#1e1e1e] font-mono text-sm">
        <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333]">
            <div className="flex items-center gap-2">
                <span className="text-blue-400 text-xs">TSX</span>
            </div>
            <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
        </div>
        <div className="flex">
             <div className="bg-[#1e1e1e] text-[#858585] p-4 text-right select-none border-r border-[#333] hidden md:block">
                {code.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
             </div>
             <div className="p-4 text-[#d4d4d4] w-full overflow-x-auto whitespace-pre leading-relaxed">
                {code.split('____').map((part, i, arr) => (
                    <React.Fragment key={i}>
                        {highlightSyntax(part)}
                        {i < arr.length - 1 && (
                            <input 
                                type="text"
                                value={fillCodeInput}
                                onChange={(e) => setFillCodeInput(e.target.value)}
                                disabled={status !== 'idle'}
                                className={`inline-block mx-1 bg-brand-dark/50 border-b-2 outline-none text-center font-bold font-mono transition-all text-brand-yellow
                                    ${status === 'correct' ? 'border-brand-green text-brand-green' : 'border-gray-500'}
                                    ${status === 'incorrect' ? 'border-brand-red text-brand-red' : ''}
                                    ${status === 'idle' ? 'focus:border-brand-purple' : ''}
                                `}
                                style={{ width: `${Math.max(3, fillCodeInput.length + 1)}ch`, minWidth: '40px' }}
                                autoComplete="off" spellCheck="false"
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    </div>
  );

  if (isCompleted) {
    return (
        <div className="fixed inset-0 bg-brand-black z-50 flex flex-col items-center justify-center p-8 text-center animate-slide-up">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-brand-purple opacity-20 blur-3xl rounded-full"></div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
                {/* Dancing Bobo */}
                <Mascot mood="dancing" message="Wohoooo." className="mb-6 scale-125" />

                <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">
                    {isPracticeMode ? "Practice Complete!" : "Lesson Passed!"}
                </h1>
                
                <div className="flex justify-center gap-4 mb-12">
                    <div className="bg-brand-dark p-6 rounded-2xl border border-gray-800 min-w-[140px]">
                        <span className="text-brand-muted text-xs font-bold uppercase tracking-wider mb-2 block">{t['ui.xp']}</span>
                        <div className="flex items-center justify-center gap-2 text-brand-yellow text-4xl font-black">
                            <Zap className="fill-brand-yellow" size={32} /> +{lesson.totalXP}
                        </div>
                    </div>
                    {/* Gems Reward */}
                    {!isPracticeMode && (
                        <div className="bg-brand-dark p-6 rounded-2xl border border-gray-800 min-w-[140px]">
                            <span className="text-brand-muted text-xs font-bold uppercase tracking-wider mb-2 block">{t['ui.gems']}</span>
                            <div className="flex items-center justify-center gap-2 text-cyan-400 text-4xl font-black">
                                <Diamond className="fill-cyan-400" size={32} /> +{lesson.gems}
                            </div>
                        </div>
                    )}
                </div>

                <button 
                    onClick={() => onComplete(lesson.totalXP)}
                    className="w-full max-w-sm py-4 rounded-xl font-bold uppercase tracking-widest bg-brand-green text-white text-lg hover:bg-brand-greenDark transition-all shadow-lg active:scale-95"
                >
                    {t['btn.continue']}
                </button>
            </div>
        </div>
    );
  }

  if (!currentQuestion) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="fixed inset-0 bg-brand-black z-50 flex flex-col h-full font-sans">
      {/* Header */}
      <div className="flex items-center gap-6 p-6 max-w-5xl mx-auto w-full">
        <button onClick={onExit} className="text-gray-500 hover:text-white transition-colors">
          <X size={32} />
        </button>
        <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-green transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_rgba(88,204,2,0.3)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        {isPracticeMode || difficulty === 'easy' ? (
            <div className="flex items-center text-brand-purple font-black text-xl gap-2 bg-brand-purple/10 px-3 py-1 rounded-lg border border-brand-purple/20">
                <InfinityIcon className="text-brand-purple" size={24} />
            </div>
        ) : (
            <div className="flex items-center text-brand-red font-black text-xl gap-2 bg-brand-red/10 px-3 py-1 rounded-lg border border-brand-red/20">
                <Heart className="fill-brand-red" size={20} /> {userHearts}
            </div>
        )}
      </div>

      {/* Main Learning Area */}
      <div className="flex-1 overflow-y-auto w-full flex flex-col items-center justify-start pt-8 pb-40 px-4">
        <div className="max-w-3xl w-full">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-8 leading-tight">
            {currentQuestion.question}
            </h2>

            {(currentQuestion.codeSnippet && currentQuestion.type !== 'order-list') && renderCodeSnippet(currentQuestion.codeSnippet)}

            {currentQuestion.type === 'multiple-choice' && (
                <div className="grid grid-cols-1 gap-4">
                {shuffledOptions.map((option, idx) => (
                    <button
                    key={option.id}
                    onClick={() => status === 'idle' && setSelectedOptionId(option.id)}
                    disabled={status !== 'idle'}
                    className={`group w-full p-5 rounded-2xl border-2 text-left transition-all duration-200
                        ${selectedOptionId === option.id 
                        ? 'border-brand-purple bg-brand-purple/10 shadow-[inset_0_0_0_2px_#9333ea]' 
                        : 'border-gray-800 bg-brand-dark hover:bg-[#1a1a1a] hover:border-gray-700'}
                        ${status !== 'idle' && option.isCorrect ? '!border-brand-green !bg-brand-green/10 !text-brand-green' : ''}
                        ${status === 'incorrect' && selectedOptionId === option.id && !option.isCorrect ? '!border-brand-red !bg-brand-red/10 !text-brand-red' : ''}
                    `}
                    >
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-black transition-colors
                            ${selectedOptionId === option.id ? 'border-brand-purple text-brand-purple bg-transparent' : 'border-gray-700 text-gray-500 bg-transparent'}
                            ${status !== 'idle' && option.isCorrect ? '!border-brand-green !text-brand-green !bg-transparent' : ''}
                            ${status === 'incorrect' && selectedOptionId === option.id && !option.isCorrect ? '!border-brand-red !text-brand-red !bg-transparent' : ''}
                        `}>
                            {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={`font-bold text-lg ${selectedOptionId === option.id ? 'text-brand-purple' : 'text-gray-300'}
                            ${status !== 'idle' && option.isCorrect ? '!text-brand-green' : ''}
                            ${status === 'incorrect' && selectedOptionId === option.id && !option.isCorrect ? '!text-brand-red' : ''}
                        `}>
                            {option.text}
                        </span>
                    </div>
                    </button>
                ))}
                </div>
            )}
            
            {/* Input types omitted for brevity, existing logic applies */}
            {currentQuestion.type === 'text-input' && (
                <div className="w-full">
                    <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Type your code here..." disabled={status !== 'idle'}
                        className={`w-full p-6 text-xl rounded-2xl bg-[#1e1e1e] border-2 text-white font-mono outline-none focus:border-brand-purple transition-all ${status === 'correct' ? '!border-brand-green !text-brand-green' : ''} ${status === 'incorrect' ? '!border-brand-red !text-brand-red' : ''}`}
                    />
                </div>
            )}
            
            {/* Match Pairs, Order List logic remains same but ensuring no alerts */}
             {currentQuestion.type === 'match-pairs' && (
                <div className="grid grid-cols-2 gap-8 w-full">
                    <div className="space-y-4">
                        {shuffledLeft.map(pair => (
                            <button key={`left-${pair.id}`} onClick={() => handleMatchClick('left', pair)} disabled={matchedPairs.includes(pair.id) || status !== 'idle'}
                                className={`w-full p-6 rounded-2xl border-2 font-bold text-center transition-all ${matchedPairs.includes(pair.id) ? 'opacity-0 cursor-default' : 'opacity-100'} ${selectedLeft === pair.id ? 'bg-brand-purple text-white border-brand-purple' : 'bg-brand-dark border-gray-800 hover:border-gray-600'}`}>{pair.left}</button>
                        ))}
                    </div>
                    <div className="space-y-4">
                         {shuffledRight.map(pair => (
                            <button key={`right-${pair.id}`} onClick={() => handleMatchClick('right', pair)} disabled={matchedPairs.includes(pair.id) || status !== 'idle'}
                                className={`w-full p-6 rounded-2xl border-2 font-bold text-center transition-all ${matchedPairs.includes(pair.id) ? 'opacity-0 cursor-default' : 'opacity-100'} bg-brand-dark border-gray-800 hover:border-gray-600`}>{pair.right}</button>
                        ))}
                    </div>
                </div>
            )}
             {currentQuestion.type === 'order-list' && (
                <div className="w-full space-y-3">
                    {orderedItems.map((item, index) => (
                        <div key={index} className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${status === 'correct' ? 'border-brand-green bg-brand-green/10' : 'border-gray-800 bg-brand-dark'} ${status === 'incorrect' ? 'border-brand-red bg-brand-red/10' : ''}`}>
                            <div className="flex flex-col gap-1">
                                <button onClick={() => moveItem(index, 'up')} disabled={index === 0 || status !== 'idle'} className="p-1 hover:bg-gray-700 rounded text-gray-400 disabled:opacity-30"><ArrowUp size={16} /></button>
                                <button onClick={() => moveItem(index, 'down')} disabled={index === orderedItems.length - 1 || status !== 'idle'} className="p-1 hover:bg-gray-700 rounded text-gray-400 disabled:opacity-30"><ArrowDown size={16} /></button>
                            </div>
                            <div className="font-mono text-sm md:text-base text-gray-200 flex-1">{highlightSyntax(item)}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Footer / Feedback */}
      <div className={`fixed bottom-0 left-0 right-0 p-6 md:p-8 transition-all duration-300 ease-in-out border-t-2 z-40
         ${status === 'idle' ? 'bg-brand-black border-gray-800' : 
           status === 'correct' ? 'bg-[#0f1d05] border-brand-green' : 'bg-[#1d0505] border-brand-red'}
      `}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative">
          
          {/* Bobo Positioning */}
          <div className="hidden md:block absolute bottom-[100%] left-0 z-50">
             <Mascot mood={boboMood} message={boboMessage} />
          </div>

          <div className="flex-1 w-full md:w-auto md:ml-10">
             {status === 'correct' && (
                 <div className="flex items-center gap-4 text-brand-green font-black text-2xl animate-bounce-short">
                     <div className="bg-brand-green p-2 rounded-full shadow-sm text-black"><Check size={32} strokeWidth={4} /></div>
                     <span>{t['feedback.correct']}</span>
                 </div>
             )}
             {status === 'incorrect' && (
                 <div className="w-full">
                     <div className="flex items-center gap-4 text-brand-red font-black text-2xl mb-3">
                        <div className="bg-brand-red p-2 rounded-full shadow-sm text-black"><X size={32} strokeWidth={4} /></div>
                        <span>{t['feedback.incorrect']}</span>
                     </div>
                     <div className="text-brand-redDark font-semibold mb-3 ml-2">
                        {currentQuestion.explanation}
                     </div>
                     
                     <button 
                        onClick={() => onOpenDocs(currentQuestion.concept)}
                        className="mt-3 flex items-center gap-2 text-sm font-bold text-brand-purple hover:text-white transition-colors bg-brand-purple/10 px-4 py-2 rounded-lg border border-brand-purple/30"
                     >
                        <BookOpen size={16} /> Wiki: {currentQuestion.concept}
                     </button>
                 </div>
             )}
          </div>

          <div className="w-full md:w-auto">
            {status === 'idle' ? (
                <button onClick={handleCheck} disabled={currentQuestion.type === 'match-pairs'} 
                    className={`w-full md:w-48 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-[0_4px_0_0_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-[4px] ${(selectedOptionId || textInput.length > 0 || fillCodeInput.length > 0 || currentQuestion.type === 'match-pairs' || currentQuestion.type === 'order-list') ? 'bg-brand-green text-black hover:bg-brand-greenDark' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
                    {currentQuestion.type === 'match-pairs' ? t['btn.match'] : t['btn.check']}
                </button>
            ) : (
                <button onClick={handleNext} className={`w-full md:w-48 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-[0_4px_0_0_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-[4px] ${status === 'correct' ? 'bg-brand-green text-black hover:bg-brand-greenDark shadow-[0_4px_0_0_#46A302]' : 'bg-brand-red text-white hover:bg-brand-redDark shadow-[0_4px_0_0_#EA2B2B]'}`}>
                    {t['btn.continue']}
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};