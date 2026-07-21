export interface AnalysisDict {
    meta: {
        title: string;
        description: string;
        keywords: string;
        ogTitle: string;
        ogDescription: string;
    };
    header: { title: string; subtitle: string };
    intro: string;
    steps: { step1: string; step2: string; step3: string; step4: string };
    form: {
        title: string;
        name: { label: string; placeholder: string };
        gender: { label: string; male: string; female: string };
        calendarType: { label: string; solar: string; lunar: string };
        birthYear: { label: string; placeholder: string; suffix: string };
        birthMonth: { label: string; placeholder: string; suffix: string };
        birthDay: { label: string; placeholder: string; suffix: string };
        birthHour: { label: string; placeholder: string };
        hourOptions: Record<string, string>;
        leapMonth: string;
        calculate: string;
        calculating: string;
        missingFields: string;
        calculationFailed: string;
    };
    chart: {
        title: string;
        centerTitle: string;
        destinyLord: string;
        bodyLord: string;
        element: string;
        nextStep: string;
    };
    stars: {
        title: string;
        energy: string;
        majorStars: string;
        noMajorStar: string;
        palaceDescription: string; // {palace}
        back: string;
        next: string;
    };
    analysis: {
        titleWithName: string; // {name}
        loading: string;
        serviceUnavailable: string;
        retryButton: string;
        back: string;
    };
    qa: {
        title: string;
        creditLabel: string; // {credits} / {total}
        paidMode: string;
        pricing: { title: string; freePlan: string; paidPlan: string; viewDetails: string };
        quickQuestions: { title: string; questions: string[] };
        chat: {
            placeholder: string;
            sendButton: string;
            emptyState: string;
            thinking: string;
            needChart: string;
            genericError: string;
            networkError: string;
        };
        modal: {
            title: string;
            description: string;
            pricingTitle: string;
            price: string;
            duration: string;
            paymentMethod: string;
            immediate: string;
            viewFullPricing: string;
            cancelButton: string;
            unlockButton: string;
        };
        payment: { redirecting: string; doNotClose: string; error: string };
    };
    footer: { disclaimerTitle: string; disclaimer: string };
    ads: { label: string };
}

const zhTW: AnalysisDict = {
    meta: {
        title: '紫微斗數命盤計算 | AI 命理分析系統 - 免費線上命盤',
        description:
            '免費紫微斗數命盤計算工具，輸入出生年月日時即可自動生成命盤。結合 AI 技術提供深度命理分析，包含主星亮度、格局特質、命宮說明等全方位解析。支援農曆西曆轉換，採用中州派理論。',
        keywords:
            '紫微斗數命盤,命盤計算,免費命盤,線上命盤,紫微星盤,命盤分析,AI 命理,中州派,十二宮位,十四主星,四化星,流年運勢',
        ogTitle: '紫微斗數命盤計算 | AI 命理分析系統',
        ogDescription: '免費紫微斗數命盤計算工具，輸入出生年月日時即可自動生成命盤。結合 AI 技術提供深度命理分析。',
    },
    header: {
        title: '紫微斗數命盤',
        subtitle: '遵循中州派傳統理論 · 結合 AI 技術的專業命理分析系統',
    },
    intro:
        '本系統採用傳統中州派理論，結合現代 OpenAI GPT-4o 人工智慧技術，為您提供專業、準確的命盤計算與深度解析。系統會自動計算您的十二宮位、十四主星、輔星配置，並提供多維度命理分析和互動問答功能。請按照下方步驟輸入您的出生資料，開始探索您的命運軌跡。',
    steps: { step1: '基本資料', step2: '命盤圖表', step3: '命盤星曜', step4: '詳細解析' },
    form: {
        title: '個人基本資料',
        name: { label: '姓名', placeholder: '請輸入您的姓名' },
        gender: { label: '性別', male: '男', female: '女' },
        calendarType: { label: '曆法類型', solar: '西曆', lunar: '農曆' },
        birthYear: { label: '出生年', placeholder: '選擇年份', suffix: '年' },
        birthMonth: { label: '出生月', placeholder: '選擇月份', suffix: '月' },
        birthDay: { label: '出生日', placeholder: '選擇日期', suffix: '日' },
        birthHour: { label: '出生時辰', placeholder: '選擇時辰' },
        hourOptions: {
            子時: '子時 (23:00-01:00)',
            丑時: '丑時 (01:00-03:00)',
            寅時: '寅時 (03:00-05:00)',
            卯時: '卯時 (05:00-07:00)',
            辰時: '辰時 (07:00-09:00)',
            巳時: '巳時 (09:00-11:00)',
            午時: '午時 (11:00-13:00)',
            未時: '未時 (13:00-15:00)',
            申時: '申時 (15:00-17:00)',
            酉時: '酉時 (17:00-19:00)',
            戌時: '戌時 (19:00-21:00)',
            亥時: '亥時 (21:00-23:00)',
        },
        leapMonth: '此月為閏月',
        calculate: '計算命盤',
        calculating: '計算中...',
        missingFields: '請填寫完整資料',
        calculationFailed: '計算失敗，請稍後再試',
    },
    chart: {
        title: '📊 紫微斗數命盤圖',
        centerTitle: '命主身主',
        destinyLord: '命主',
        bodyLord: '身主',
        element: '五行局',
        nextStep: '星曜分析 →',
    },
    stars: {
        title: '❤️ 命盤星曜分析',
        energy: '能量',
        majorStars: '主要星曜',
        noMajorStar: '無主星',
        palaceDescription: '{palace}的星曜配置影響個人相關運勢',
        back: '← 返回命盤圖表',
        next: '詳細解析 →',
    },
    analysis: {
        titleWithName: '📖 {name}的命盤詳細解析',
        loading: 'AI 正在分析您的命盤，請稍候...',
        serviceUnavailable: '分析服務暫時無法使用',
        retryButton: '重試',
        back: '← 返回星曜分析',
    },
    qa: {
        title: '💬 命盤問答',
        creditLabel: '💎 Credit: {credits} / {total}',
        paidMode: '💎 付費模式 (無限問答)',
        pricing: {
            title: '💰 服務方案',
            freePlan: '免費方案：每月 3 次問答機會',
            paidPlan: '付費方案：NT$ 199 解鎖 1 小時無限問答',
            viewDetails: '查看詳情 →',
        },
        quickQuestions: {
            title: '快速問答建議：',
            questions: ['今年流年運勢如何？', '我的工作運如何？', '我的桃花運如何？'],
        },
        chat: {
            placeholder: '輸入您想問的問題...',
            sendButton: '發送',
            emptyState: '開始與 AI 命理師對話吧！',
            thinking: '正在分析您的問題，請稍候...',
            needChart: '請先計算您的命盤，才能開始問答。請回到步驟一填寫基本資料並計算命盤。',
            genericError: '抱歉，無法獲取回答。請稍後再試。',
            networkError: '網路連接錯誤，請檢查網路後重試。',
        },
        modal: {
            title: '💎 Credit 用完了',
            description: '您本月的免費問答次數已用完。是否要開啟付費模式繼續使用？',
            pricingTitle: '💰 付費解鎖方案',
            price: 'NT$ 199',
            duration: '服務時長：1 小時無限問答',
            paymentMethod: '付款方式：信用卡一次付清（綠界金流）',
            immediate: '立即生效：付款後立即開始計時',
            viewFullPricing: '查看完整價格方案 →',
            cancelButton: '取消',
            unlockButton: '💰 立即付費解鎖',
        },
        payment: {
            redirecting: '正在導向付款頁面...',
            doNotClose: '請稍候，不要關閉視窗',
            error: '付款流程發生錯誤，請稍後再試。',
        },
    },
    footer: {
        disclaimerTitle: '免責聲明',
        disclaimer:
            '本服務提供的紫微斗數命理解析僅供娛樂和文化學習參考，不應作為重要人生決策的依據。命理結果不保證準確性，請理性對待。',
    },
    ads: { label: '廣告' },
};

const en: AnalysisDict = {
    meta: {
        title: 'Zi Wei Dou Shu Chart Calculation | AI Destiny Analysis System - Free Online Chart',
        description:
            'Free Zi Wei Dou Shu chart calculation tool. Enter your birth date and time to automatically generate your destiny chart. AI-powered in-depth analysis based on Zhongzhou School theory, supporting Lunar and Solar calendars.',
        keywords:
            'Zi Wei Dou Shu,Destiny Chart,Purple Star Astrology,AI Analysis,Zhongzhou School,Birth Chart,12 Palaces,14 Major Stars,Free Chart Calculation,Chinese Astrology',
        ogTitle: 'Zi Wei Dou Shu Chart Calculation | AI Destiny Analysis System',
        ogDescription:
            'Free Zi Wei Dou Shu chart calculation with AI-powered professional analysis. Supports Lunar and Solar calendars.',
    },
    header: {
        title: 'Zi Wei Dou Shu Destiny Chart',
        subtitle: 'Zhongzhou School theory · Professional destiny analysis powered by AI',
    },
    intro:
        'This system combines traditional Zhongzhou School theory with OpenAI GPT-4o technology to deliver professional, accurate chart calculation and in-depth analysis. It automatically computes your 12 palaces, 14 major stars, and minor star configuration, with multi-dimensional analysis and interactive Q&A. Enter your birth information below to begin.',
    steps: { step1: 'Birth Info', step2: 'Destiny Chart', step3: 'Stars', step4: 'Analysis' },
    form: {
        title: 'Personal Information',
        name: { label: 'Name', placeholder: 'Please enter your name' },
        gender: { label: 'Gender', male: 'Male', female: 'Female' },
        calendarType: { label: 'Calendar Type', solar: 'Solar', lunar: 'Lunar' },
        birthYear: { label: 'Birth Year', placeholder: 'Select year', suffix: '' },
        birthMonth: { label: 'Birth Month', placeholder: 'Select month', suffix: '' },
        birthDay: { label: 'Birth Day', placeholder: 'Select day', suffix: '' },
        birthHour: { label: 'Birth Hour', placeholder: 'Select hour' },
        hourOptions: {
            子時: 'Zi Hour (23:00-01:00)',
            丑時: 'Chou Hour (01:00-03:00)',
            寅時: 'Yin Hour (03:00-05:00)',
            卯時: 'Mao Hour (05:00-07:00)',
            辰時: 'Chen Hour (07:00-09:00)',
            巳時: 'Si Hour (09:00-11:00)',
            午時: 'Wu Hour (11:00-13:00)',
            未時: 'Wei Hour (13:00-15:00)',
            申時: 'Shen Hour (15:00-17:00)',
            酉時: 'You Hour (17:00-19:00)',
            戌時: 'Xu Hour (19:00-21:00)',
            亥時: 'Hai Hour (21:00-23:00)',
        },
        leapMonth: 'Born in a lunar leap month',
        calculate: 'Calculate Chart',
        calculating: 'Calculating...',
        missingFields: 'Please fill in all required fields',
        calculationFailed: 'Calculation failed, please try again later',
    },
    chart: {
        title: '📊 Your Zi Wei Dou Shu Destiny Chart',
        centerTitle: 'Destiny & Body Lords',
        destinyLord: 'Destiny Lord',
        bodyLord: 'Body Lord',
        element: 'Element',
        nextStep: 'Star Analysis →',
    },
    stars: {
        title: '❤️ Star Configuration Analysis',
        energy: 'Energy',
        majorStars: 'Major stars',
        noMajorStar: 'No major star',
        palaceDescription: 'The star configuration of {palace} influences the related aspects of your life',
        back: '← Back to Chart',
        next: 'Detailed Analysis →',
    },
    analysis: {
        titleWithName: "📖 {name}'s Detailed Chart Analysis",
        loading: 'AI is analyzing your destiny chart, please wait...',
        serviceUnavailable: 'Analysis service is temporarily unavailable',
        retryButton: 'Retry',
        back: '← Back to Star Analysis',
    },
    qa: {
        title: '💬 AI Q&A Consultation',
        creditLabel: '💎 Credit: {credits} / {total}',
        paidMode: '💎 Paid Mode (Unlimited)',
        pricing: {
            title: '💰 Service Plans',
            freePlan: 'Free plan: 3 questions per month',
            paidPlan: 'Paid plan: NT$ 199 unlocks 1 hour of unlimited Q&A',
            viewDetails: 'View details →',
        },
        quickQuestions: {
            title: 'Quick questions:',
            questions: [
                'How is my fortune this year?',
                'How are my career prospects?',
                'How is my romantic fortune?',
            ],
        },
        chat: {
            placeholder: 'Enter your question...',
            sendButton: 'Send',
            emptyState: 'Start a conversation with the AI destiny master!',
            thinking: 'Analyzing your question, please wait...',
            needChart: 'Please calculate your destiny chart first before asking questions.',
            genericError: 'Sorry, unable to get an answer. Please try again later.',
            networkError: 'Network error, please check your connection and try again.',
        },
        modal: {
            title: '💎 Credits Used Up',
            description:
                'Your free questions for this month have been used up. Would you like to enable paid mode to continue?',
            pricingTitle: '💰 Paid Unlock Plan',
            price: 'NT$ 199',
            duration: 'Duration: 1 hour of unlimited Q&A',
            paymentMethod: 'Payment: one-time credit card payment (ECPay)',
            immediate: 'Effective immediately after payment',
            viewFullPricing: 'View full pricing →',
            cancelButton: 'Not Now',
            unlockButton: '💰 Pay to Unlock',
        },
        payment: {
            redirecting: 'Redirecting to payment page...',
            doNotClose: 'Please wait, do not close this window',
            error: 'An error occurred during the payment process. Please try again later.',
        },
    },
    footer: {
        disclaimerTitle: 'Disclaimer',
        disclaimer:
            'The Zi Wei Dou Shu analysis provided by this service is for entertainment and cultural learning reference only, and should not be the basis for important life decisions. Accuracy is not guaranteed.',
    },
    ads: { label: 'Advertisement' },
};

export function getAnalysisDict(locale: string): AnalysisDict {
    return locale === 'en' ? en : zhTW;
}
