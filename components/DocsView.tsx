import React, { useState, useEffect } from 'react';
import { DOCS } from '../constants';
import { UserState } from '../types';
import { Book, Lock, ChevronRight, FileText, Search, AlignLeft } from 'lucide-react';

interface DocsViewProps {
  userState: UserState;
  initialDocId?: string | null;
}

export const DocsView: React.FC<DocsViewProps> = ({ userState, initialDocId }) => {
    const [selectedDocId, setSelectedDocId] = useState<string | null>(initialDocId || null);

    const unlockedDocs = DOCS.filter(doc => userState.completedLessonIds.includes(doc.requiredLessonId));
    const lockedDocs = DOCS.filter(doc => !userState.completedLessonIds.includes(doc.requiredLessonId));

    const activeDoc = unlockedDocs.find(d => d.id === selectedDocId) || unlockedDocs[0];

    useEffect(() => {
        if (initialDocId) setSelectedDocId(initialDocId);
    }, [initialDocId]);

    const isDark = userState.theme === 'dark';

    return (
        <div className={`flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden font-sans ${isDark ? 'text-gray-200' : 'text-gray-900 bg-gray-50'}`}>
            {/* Sidebar List (Index) */}
            <div className={`w-full md:w-80 border-r overflow-y-auto shrink-0 z-10 ${isDark ? 'bg-brand-dark border-gray-800' : 'bg-white border-gray-200'}`}>
                <div className={`p-4 border-b sticky top-0 z-20 ${isDark ? 'bg-brand-dark border-gray-800' : 'bg-white border-gray-200'}`}>
                    <div className={`relative flex items-center ${isDark ? 'bg-black/40' : 'bg-gray-100'} rounded-lg px-3 py-2`}>
                        <Search size={16} className="text-gray-500 mr-2" />
                        <input 
                            type="text" 
                            placeholder="Search wiki..." 
                            className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-500"
                        />
                    </div>
                </div>
                
                <div className="py-2">
                    {unlockedDocs.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            <Book size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Knowledge base empty.</p>
                        </div>
                    )}

                    {unlockedDocs.map(doc => (
                        <button
                            key={doc.id}
                            onClick={() => setSelectedDocId(doc.id)}
                            className={`w-full text-left px-6 py-3 transition-all flex items-center justify-between group border-l-4
                                ${activeDoc?.id === doc.id 
                                    ? (isDark ? 'bg-brand-purple/10 border-brand-purple text-brand-purple' : 'bg-blue-50 border-blue-600 text-blue-800')
                                    : 'border-transparent hover:bg-black/5'
                                }
                            `}
                        >
                            <span className="font-medium text-sm truncate">{doc.title}</span>
                        </button>
                    ))}

                    {lockedDocs.length > 0 && <div className="px-6 py-2 mt-4 text-xs font-bold uppercase text-gray-500 tracking-wider">Locked Entries</div>}

                    {lockedDocs.map(doc => (
                        <div key={doc.id} className="px-6 py-3 flex items-center justify-between text-gray-500 opacity-60 cursor-not-allowed">
                             <span className="text-sm truncate flex items-center gap-2">
                                <Lock size={12} /> {doc.title}
                             </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Area (Wikipedia Style) */}
            <div className={`flex-1 overflow-y-auto p-4 md:p-12 ${isDark ? 'bg-brand-black' : 'bg-white'}`}>
                {activeDoc ? (
                    <div className="max-w-3xl mx-auto">
                        {/* Title Header */}
                        <div className="border-b mb-8 pb-4 border-gray-300 dark:border-gray-700">
                             <h1 className={`text-4xl font-serif mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                                 {activeDoc.title}
                             </h1>
                             <p className="text-sm text-gray-500">From Learn.skript, the free interactive academy.</p>
                        </div>

                        {/* Article Content */}
                        <div className={`prose max-w-none ${isDark ? 'prose-invert' : 'prose-neutral'} 
                            prose-headings:font-serif prose-headings:font-normal prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b prose-h2:pb-2 prose-h2:mt-8
                            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                        `}>
                            {activeDoc.content.split('\n').map((line, idx) => {
                                // Basic Markdown Parsing for Wiki Feel
                                if (line.trim().startsWith('# ')) return null; // Title handled above
                                if (line.trim().startsWith('## ')) {
                                    return <h2 key={idx}>{line.replace('## ', '')}</h2>
                                }
                                if (line.trim().startsWith('### ')) {
                                    return <h3 key={idx} className="text-lg font-bold mt-6">{line.replace('### ', '')}</h3>
                                }
                                if (line.trim().startsWith('* ')) {
                                    return <li key={idx} className="list-disc ml-4">{line.replace('* ', '')}</li>
                                }
                                if (line.includes('```javascript')) return null;
                                if (line.includes('```')) return null;

                                if (line.includes('const ') || line.includes('function') || line.includes('return') || line.includes('//')) {
                                    return (
                                        <div key={idx} className="bg-gray-100 dark:bg-[#1e1e1e] border dark:border-gray-700 rounded p-4 my-4 font-mono text-sm overflow-x-auto shadow-inner">
                                            {line}
                                        </div>
                                    )
                                }
                                if (line.trim() === '') return <br key={idx} />;
                                
                                return <p key={idx} className="mb-4 leading-relaxed">{line}</p>
                            })}
                        </div>
                        
                        {/* Categories / Footer */}
                        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500">
                            Categories: <span className="text-blue-600 dark:text-blue-400">Web Development</span> | <span className="text-blue-600 dark:text-blue-400">React</span> | <span className="text-blue-600 dark:text-blue-400">Fundamentals</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <FileText size={64} className="mb-4 opacity-20" />
                        <p>Select an article from the index.</p>
                    </div>
                )}
            </div>
        </div>
    );
};