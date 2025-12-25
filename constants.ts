import { Unit, Achievement, UserState, Documentation, ShopItem, Lesson, Question, Language } from './types';
import React from 'react';

// Translation Dictionaries
const TRANSLATIONS = {
    en: {
        fillerQ: "What is a key feature of",
        fillerExp: "is crucial for modern web development.",
        fillerOpt1: "It helps build UIs",
        fillerOpt2: "It makes coffee",
        fillerOpt3: "It is a database",
        fillCodeQ: "Implement a basic",
        explanation: "Just a placeholder for advanced logic.",
        u1: "Digital Foundations",
        u1Desc: "Before we build apps, let's understand the web.",
        l1: "What is Code?",
        l1Desc: "Talking to computers.",
        q1: "What is code essentially?",
        q1Exp: "Code is a set of instructions, like a recipe, that tells a computer what to do.",
        q1o1: "A set of instructions",
        q1o2: "Hardware",
        q1o3: "Magic spells",
        q2: "Send a message to the console.",
        q2Exp: "`console.log` is how we print messages to the developer console. Type \"Hello\" inside the quotes.",
        l2: "What is HTML?",
        l2Desc: "The skeleton of the web.",
        q3: "Match the HTML tag to its purpose.",
        q3Exp: "Tags define elements. <h1> is a header, <p> is paragraph, <button> is interactive.",
        q4: "Create a button element.",
        q4Exp: "We use the `<button>` tag to create clickable buttons.",
        l3: "What is JavaScript?",
        l3Desc: "Making things happen.",
        q5: "Type the name of the language used for web logic.",
        q5Exp: "JavaScript provides the logic and interactivity, acting like the brain and muscles.",
    },
    tr: {
        fillerQ: "Hangisi şunun temel özelliğidir:",
        fillerExp: "modern web geliştirme için kritiktir.",
        fillerOpt1: "Arayüz oluşturmaya yarar",
        fillerOpt2: "Kahve yapar",
        fillerOpt3: "Bir veritabanıdır",
        fillCodeQ: "Temel bir tane uygula:",
        explanation: "İleri seviye mantık için yer tutucu.",
        u1: "Dijital Temeller",
        u1Desc: "Uygulama yapmadan önce web'i anlayalım.",
        l1: "Kod Nedir?",
        l1Desc: "Bilgisayarlarla konuşmak.",
        q1: "Kod aslında nedir?",
        q1Exp: "Kod, bir bilgisayara ne yapacağını söyleyen tarif benzeri talimatlar setidir.",
        q1o1: "Talimatlar seti",
        q1o2: "Donanım",
        q1o3: "Büyü sözleri",
        q2: "Konsola bir mesaj gönder.",
        q2Exp: "`console.log` geliştirici konsoluna mesaj yazdırmamızı sağlar. Tırnak içine \"Hello\" yaz.",
        l2: "HTML Nedir?",
        l2Desc: "Web'in iskeleti.",
        q3: "HTML etiketini amacı ile eşleştir.",
        q3Exp: "Etiketler elementleri tanımlar. <h1> başlık, <p> paragraf, <button> etkileşim içindir.",
        q4: "Bir buton elementi oluştur.",
        q4Exp: "Tıklanabilir düğmeler oluşturmak için `<button>` etiketini kullanırız.",
        l3: "JavaScript Nedir?",
        l3Desc: "Olayların gerçekleşmesini sağlamak.",
        q5: "Web mantığı için kullanılan dilin adını yaz.",
        q5Exp: "JavaScript mantık ve etkileşimi sağlar, beyin ve kaslar gibi davranır.",
    },
    es: {
        fillerQ: "¿Cuál es una característica clave de",
        fillerExp: "es crucial para el desarrollo web moderno.",
        fillerOpt1: "Ayuda a construir UIs",
        fillerOpt2: "Hace café",
        fillerOpt3: "Es una base de datos",
        fillCodeQ: "Implementa un básico",
        explanation: "Solo un marcador de posición.",
        u1: "Fundamentos Digitales",
        u1Desc: "Antes de crear apps, entendamos la web.",
        l1: "¿Qué es el código?",
        l1Desc: "Hablando con computadoras.",
        q1: "¿Qué es esencialmente el código?",
        q1Exp: "El código es un conjunto de instrucciones, como una receta, que le dice a la computadora qué hacer.",
        q1o1: "Un conjunto de instrucciones",
        q1o2: "Hardware",
        q1o3: "Hechizos mágicos",
        q2: "Envía un mensaje a la consola.",
        q2Exp: "`console.log` es cómo imprimimos mensajes. Escribe \"Hello\" dentro de las comillas.",
        l2: "¿Qué es HTML?",
        l2Desc: "El esqueleto de la web.",
        q3: "Une la etiqueta HTML con su propósito.",
        q3Exp: "Las etiquetas definen elementos. <h1> es encabezado, <p> es párrafo.",
        q4: "Crea un elemento de botón.",
        q4Exp: "Usamos la etiqueta `<button>` para crear botones clicables.",
        l3: "¿Qué es JavaScript?",
        l3Desc: "Haciendo que las cosas sucedan.",
        q5: "Escribe el nombre del lenguaje usado para la lógica web.",
        q5Exp: "JavaScript proporciona la lógica y la interactividad.",
    },
    pt: {
        fillerQ: "Qual é uma característica chave de",
        fillerExp: "é crucial para o desenvolvimento web moderno.",
        fillerOpt1: "Ajuda a construir UIs",
        fillerOpt2: "Faz café",
        fillerOpt3: "É um banco de dados",
        fillCodeQ: "Implemente um básico",
        explanation: "Apenas um espaço reservado.",
        u1: "Fundamentos Digitais",
        u1Desc: "Antes de criar apps, vamos entender a web.",
        l1: "O que é Código?",
        l1Desc: "Falando com computadores.",
        q1: "O que é código essencialmente?",
        q1Exp: "Código é um conjunto de instruções, como uma receita, que diz ao computador o que fazer.",
        q1o1: "Um conjunto de instruções",
        q1o2: "Hardware",
        q1o3: "Feitiços mágicos",
        q2: "Envie uma mensagem para o console.",
        q2Exp: "`console.log` é como imprimimos mensagens. Digite \"Hello\" dentro das aspas.",
        l2: "O que é HTML?",
        l2Desc: "O esqueleto da web.",
        q3: "Combine a tag HTML com seu propósito.",
        q3Exp: "Tags definem elementos. <h1> é cabeçalho, <p> é parágrafo.",
        q4: "Crie um elemento de botão.",
        q4Exp: "Usamos a tag `<button>` para criar botões clicáveis.",
        l3: "O que é JavaScript?",
        l3Desc: "Fazendo as coisas acontecerem.",
        q5: "Digite o nome da linguagem usada para lógica web.",
        q5Exp: "JavaScript fornece a lógica e a interatividade.",
    }
};

const TOPIC_TRANSLATIONS: Record<string, Record<Language, string>> = {
    'Digital Foundations': { en: 'Digital Foundations', tr: 'Dijital Temeller', es: 'Fundamentos Digitales', pt: 'Fundamentos Digitais' },
    'The User Interface': { en: 'The User Interface', tr: 'Kullanıcı Arayüzü', es: 'La Interfaz de Usuario', pt: 'A Interface do Usuário' },
    'Enter React': { en: 'Enter React', tr: 'React\'e Giriş', es: 'Entrando a React', pt: 'Entrando no React' },
    'React Essentials': { en: 'React Essentials', tr: 'React Temelleri', es: 'Esenciales de React', pt: 'Essenciais do React' },
    'State of Mind': { en: 'State of Mind', tr: 'Durum Yönetimi', es: 'Estado Mental', pt: 'Estado de Espírito' },
    'Side Effects': { en: 'Side Effects', tr: 'Yan Etkiler', es: 'Efectos Secundarios', pt: 'Efeitos Colaterais' },
    // Defaults for others to English if missing, or generic string
};

const getTopicTitle = (topic: string, lang: Language) => {
    return TOPIC_TRANSLATIONS[topic]?.[lang] || topic;
}

// Helper to generate a basic question for filler lessons
const createFillerQuestion = (id: string, topic: string, lang: Language): Question => {
    const t = TRANSLATIONS[lang];
    return {
        id,
        type: 'multiple-choice',
        question: `${t.fillerQ} ${topic}?`,
        concept: topic,
        explanation: `${topic} ${t.fillerExp}`,
        options: [
            { id: `${id}-o1`, text: t.fillerOpt1, isCorrect: true },
            { id: `${id}-o2`, text: t.fillerOpt2, isCorrect: false },
            { id: `${id}-o3`, text: t.fillerOpt3, isCorrect: false }
        ]
    };
};

// Helper to generate lessons
const createLesson = (id: string, title: string, topic: string, icon: string, lang: Language): Lesson => {
    const t = TRANSLATIONS[lang];
    return {
        id,
        title,
        description: `${t.u1Desc.split(' ')[0]} ${topic}.`, // Simple generic desc
        totalXP: 10,
        gems: 5,
        isCompleted: false,
        isLocked: true,
        icon,
        questions: [
            createFillerQuestion(`${id}-q1`, topic, lang),
            {
                id: `${id}-q2`,
                type: 'fill-code',
                question: `${t.fillCodeQ} ${topic}.`,
                codeSnippet: `const x = ${topic.replace(/\s/g, '')}("____");`,
                expectedAnswer: 'value',
                concept: topic,
                explanation: t.explanation
            }
        ]
    };
};

const UNIT_TOPICS = [
    { title: 'Digital Foundations', color: 'brand-green', icon: '🤖' },
    { title: 'The User Interface', color: 'brand-blue', icon: '🎨' },
    { title: 'Enter React', color: 'brand-purple', icon: '⚛️' },
    { title: 'React Essentials', color: 'brand-yellow', icon: '⚡' },
    { title: 'State of Mind', color: 'brand-red', icon: '🧠' },
    { title: 'Side Effects', color: 'brand-purple', icon: '🌊' },
    { title: 'Passing Props', color: 'brand-green', icon: '🎁' },
    { title: 'Lists & Keys', color: 'brand-blue', icon: '📋' },
    { title: 'Handling Events', color: 'brand-yellow', icon: '🖱️' },
    { title: 'Forms & Inputs', color: 'brand-red', icon: '📝' },
    { title: 'Conditional Rendering', color: 'brand-purple', icon: '🔀' },
    { title: 'Lifting State Up', color: 'brand-green', icon: '⬆️' },
    { title: 'Composition vs Inheritance', color: 'brand-blue', icon: '🧱' },
    { title: 'Context API', color: 'brand-yellow', icon: '🌍' },
    { title: 'React Router', color: 'brand-red', icon: '🛣️' },
    { title: 'API Calls with Fetch', color: 'brand-purple', icon: '📡' },
    { title: 'Custom Hooks', color: 'brand-green', icon: '🪝' },
    { title: 'Styling in React', color: 'brand-blue', icon: '💅' },
    { title: 'Performance Optimization', color: 'brand-yellow', icon: '🚀' },
    { title: 'Deploying React', color: 'brand-red', icon: '☁️' },
];

export const getUnits = (lang: Language): Unit[] => {
    const t = TRANSLATIONS[lang];
    
    // Generate base units
    const units = UNIT_TOPICS.map((topic, index) => {
        const unitNum = index + 1;
        const translatedTopic = getTopicTitle(topic.title, lang);
        
        const lessons: Lesson[] = [];
        for(let i=1; i<=5; i++) {
             lessons.push(createLesson(`u${unitNum}-l${i}`, `${translatedTopic} ${i}`, translatedTopic, topic.icon, lang));
        }

        return {
            id: `unit-${unitNum}`,
            title: `${translatedTopic}`,
            description: t.u1Desc, // Using generic desc for simplicity in generator
            color: topic.color,
            lessons: lessons
        };
    });

    // Custom Unit 1 Content (Hand-crafted)
    const u1 = units[0];
    u1.title = t.u1;
    u1.description = t.u1Desc;
    
    u1.lessons[0] = {
        ...u1.lessons[0],
        title: t.l1,
        description: t.l1Desc,
        questions: [
            {
                id: 'q1-1',
                type: 'multiple-choice',
                question: t.q1,
                concept: 'Programming Definition',
                explanation: t.q1Exp,
                options: [
                  { id: 'o1', text: t.q1o1, isCorrect: true },
                  { id: 'o2', text: t.q1o2, isCorrect: false },
                  { id: 'o3', text: t.q1o3, isCorrect: false },
                ]
            },
            {
                id: 'q1-2',
                type: 'fill-code',
                question: t.q2,
                codeSnippet: 'console.log("____");',
                expectedAnswer: 'Hello',
                concept: 'Console',
                explanation: t.q2Exp,
            }
        ]
    };

    u1.lessons[1] = {
        ...u1.lessons[1],
        title: t.l2,
        description: t.l2Desc,
        questions: [
            {
                id: 'q1-3',
                type: 'match-pairs',
                question: t.q3,
                concept: 'HTML Tags',
                explanation: t.q3Exp,
                pairs: [
                    { id: 'p1', left: '<h1>', right: lang === 'tr' ? 'Başlık' : (lang === 'es' || lang === 'pt' ? 'Titulo' : 'Title') },
                    { id: 'p2', left: '<p>', right: lang === 'tr' ? 'Paragraf' : (lang === 'es' ? 'Párrafo' : (lang === 'pt' ? 'Parágrafo' : 'Paragraph')) },
                    { id: 'p3', left: '<button>', right: lang === 'tr' ? 'Buton' : (lang === 'es' ? 'Botón' : (lang === 'pt' ? 'Botão' : 'Button')) }
                ]
            },
            {
                id: 'q1-4',
                type: 'fill-code',
                question: t.q4,
                codeSnippet: '<____>Click Me</____>',
                expectedAnswer: 'button',
                concept: 'HTML Tags',
                explanation: t.q4Exp,
            }
        ]
    };

    u1.lessons[2] = {
        ...u1.lessons[2],
        title: t.l3,
        description: t.l3Desc,
        questions: [
            {
                id: 'q1-5',
                type: 'text-input',
                question: t.q5,
                expectedAnswer: 'JavaScript',
                concept: 'JS Role',
                explanation: t.q5Exp,
            }
        ]
    };

    return units;
};

// Kept for backward compat or default init
export const INITIAL_UNITS: Unit[] = getUnits('en');


export const DOCS: Documentation[] = [
    {
        id: 'doc-code',
        title: 'Computer Programming',
        concept: 'Programming Definition',
        requiredLessonId: 'l1-1',
        content: `
# Computer Programming
**Computer programming** is the process of performing a particular computation...
## Overview
The source code of a program is written in one or more programming languages...
        `
    },
    // ... (Keep existing docs or expand as needed) ...
];

export const ACHIEVEMENTS: Omit<Achievement, 'icon'>[] = [
    {
        id: 'first-step',
        title: 'Hello World',
        description: 'Complete the very first lesson.',
        condition: (state: UserState) => state.completedLessonIds.length >= 1
    },
    {
        id: 'web-master',
        title: 'Web Master',
        description: 'Finish Unit 1 (The Foundation).',
        condition: (state: UserState) => state.completedLessonIds.includes('u1-l5') 
    },
    {
        id: 'rich-kid',
        title: 'Gem Collector',
        description: 'Amass 100 Gems.',
        condition: (state: UserState) => state.gems >= 100
    },
    {
        id: 'streak-master',
        title: 'Committed',
        description: 'Reach a 3-day streak.',
        condition: (state: UserState) => state.streak >= 3
    }
];

export const INITIAL_USER_STATE: UserState = {
  hearts: 5,
  xp: 0,
  gems: 50, 
  streak: 1,
  difficulty: 'medium',
  theme: 'dark',
  language: 'en',
  lastCompletedDate: null,
  completedLessonIds: [],
  currentUnitId: 'unit-1',
  unlockedAchievements: [],
  inventory: []
};
