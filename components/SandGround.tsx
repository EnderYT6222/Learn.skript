import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Download, Terminal, Eye, Code2 } from 'lucide-react';
import { TRANSLATIONS } from '../translations';
import { Language } from '../types';

interface SandGroundProps {
    language: Language;
}

const DEFAULT_CODE = `
// Welcome to SandGround!
// Write some HTML/JS here. 

document.body.style.color = 'white';
document.body.style.fontFamily = 'monospace';
document.body.innerHTML = \`
  <div style="padding: 20px; text-align: center;">
    <h1 style="color: #9333ea;">Hello World!</h1>
    <p>This is your playground.</p>
    <button id="btn" style="
      padding: 10px 20px; 
      border-radius: 8px; 
      border: none; 
      background: #58CC02; 
      color: white; 
      font-weight: bold; 
      cursor: pointer;
    ">Click Me</button>
  </div>
\`;

document.getElementById('btn').addEventListener('click', () => {
    alert("You clicked the button! No more browser alerts.");
});
`.trim();

export const SandGround: React.FC<SandGroundProps> = ({ language }) => {
    const t = TRANSLATIONS[language];
    const [code, setCode] = useState(DEFAULT_CODE);
    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
    const [showConsole, setShowConsole] = useState(true);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const runCode = () => {
        if (!iframeRef.current) return;
        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        setConsoleOutput([]);

        // Capture logs AND override alert
        const script = `
            <script>
                // Override console
                const originalLog = console.log;
                console.log = (...args) => {
                    window.parent.postMessage({ type: 'console', messages: args }, '*');
                    originalLog(...args);
                };
                window.onerror = (msg, url, line) => {
                     window.parent.postMessage({ type: 'error', messages: [msg] }, '*');
                }
                
                // Override alert
                window.alert = (msg) => {
                     window.parent.postMessage({ type: 'alert', message: msg }, '*');
                }
            </script>
        `;

        const content = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>body { margin: 0; background-color: #0a0a0a; color: white; }</style>
                ${script}
            </head>
            <body>
                <script>
                    try {
                        ${code}
                    } catch (e) {
                        console.log("Error: " + e.message);
                    }
                </script>
            </body>
            </html>
        `;

        doc.open();
        doc.write(content);
        doc.close();
    };

    // Need to handle alert events from iframe in App.tsx or pass handler here.
    // However, App.tsx handles global listeners. We just ensure we post the message 'alert'.
    // NOTE: 'App.tsx' needs to listen for 'alert' type message now.

    useEffect(() => {
        const handler = (e: MessageEvent) => {
            if (e.data?.type === 'console' || e.data?.type === 'error') {
                setConsoleOutput(prev => [...prev, ...e.data.messages.map((m: any) => String(m))]);
            }
            // 'alert' type handled by App.tsx global listener if we set it up there, 
            // OR we can handle it here if we want SandGround specific behavior,
            // BUT to show the nice Modal, passing a callback from App or using global event listener in App is best.
            // Since we didn't pass a callback to SandGround in App.tsx yet, let's rely on bubbling or just standard window event in App.tsx.
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, []);

    // Auto-run on mount
    useEffect(() => {
        runCode();
    }, []);

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([code], {type: 'text/javascript'});
        element.href = URL.createObjectURL(file);
        element.download = "sandground.js";
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen bg-[#1e1e1e] text-white">
            {/* Header */}
            <div className="h-16 border-b border-[#333] flex items-center justify-between px-4 bg-[#252526]">
                <div className="flex items-center gap-2 font-bold text-lg">
                    <Code2 className="text-brand-purple" />
                    <span>{t['sandground.title']}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCode(DEFAULT_CODE)} title={t['sandground.reset']} className="p-2 hover:bg-[#333] rounded-lg text-gray-400 hover:text-white transition-colors">
                        <RotateCcw size={18} />
                    </button>
                    <button onClick={handleDownload} title={t['sandground.download']} className="p-2 hover:bg-[#333] rounded-lg text-gray-400 hover:text-white transition-colors">
                        <Download size={18} />
                    </button>
                    <div className="h-6 w-px bg-[#3f3f46] mx-2"></div>
                    <button onClick={runCode} className="flex items-center gap-2 bg-brand-green text-black px-4 py-2 rounded-lg font-bold hover:bg-brand-greenDark transition-colors">
                        <Play size={16} fill="black" /> {t['sandground.run']}
                    </button>
                </div>
            </div>

            {/* Main Split View */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Editor */}
                <div className="flex-1 border-r border-[#333] flex flex-col">
                    <textarea 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm resize-none focus:outline-none"
                        spellCheck="false"
                    />
                </div>

                {/* Preview & Console */}
                <div className="flex-1 flex flex-col min-h-[50%] md:min-h-0">
                    <div className="flex-1 relative bg-black">
                        <iframe 
                            ref={iframeRef}
                            className="w-full h-full border-none"
                            title="preview"
                            sandbox="allow-scripts allow-same-origin"
                        />
                    </div>
                    
                    {/* Console Toggle */}
                    <div className="border-t border-[#333] bg-[#252526]">
                         <button 
                            onClick={() => setShowConsole(!showConsole)}
                            className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase"
                        >
                            <span className="flex items-center gap-2"><Terminal size={14} /> {t['sandground.console']}</span>
                            <span>{showConsole ? '▼' : '▲'}</span>
                         </button>
                         
                         {showConsole && (
                             <div className="h-32 overflow-y-auto p-2 bg-[#1e1e1e] font-mono text-xs text-green-400 border-t border-[#333]">
                                 {consoleOutput.length === 0 && <span className="text-gray-600 italic">No output...</span>}
                                 {consoleOutput.map((log, i) => (
                                     <div key={i} className="border-b border-[#333] pb-1 mb-1 last:border-0">{log}</div>
                                 ))}
                             </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};