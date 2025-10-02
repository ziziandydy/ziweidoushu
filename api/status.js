/**
 * Vercel Serverless Function for API Status
 * API Route: /api/status
 */

// 嘗試載入編譯後的 TypeScript 模組
let ZiweiCore;
try {
    const mainModule = require('../build/main.js');
    ZiweiCore = mainModule;
} catch (error) {
    ZiweiCore = null;
}

export default function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const moduleCount = ZiweiCore ? Object.keys(ZiweiCore).length : 0;
    const availableModules = ZiweiCore ? Object.keys(ZiweiCore) : [];

    res.status(200).json({
        status: 'operational',
        timestamp: new Date().toISOString(),
        service: 'Zi Wei Dou Shu API',
        version: '1.3.4',
        coreLibrary: ZiweiCore ? 'loaded' : 'failed',
        availableModules: moduleCount,
        moduleList: availableModules
    });
}
