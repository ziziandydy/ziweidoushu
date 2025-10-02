/**
 * Vercel Serverless Function for API Health Check
 * API Route: /api/health
 */

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

    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Zi Wei Dou Shu API',
        version: '1.3.4'
    });
}
