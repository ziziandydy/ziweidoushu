const handler = require('../api/knowledge');

function mockRes() {
    const res = {
        headers: {},
        statusCode: null,
        body: null,
        setHeader(k, v) { this.headers[k] = v; },
        status(code) { this.statusCode = code; return this; },
        json(obj) { this.body = obj; return this; },
        end() { return this; },
    };
    return res;
}

describe('GET /api/knowledge', () => {
    test('依 tags 回傳條目', async () => {
        const res = mockRes();
        await handler({ method: 'GET', query: { tags: '財帛宮' }, headers: {} }, res);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.count).toBeGreaterThan(0);
        expect(res.body.entries[0].tags).toContain('財帛宮');
    });

    test('缺少 tags 回傳 400', async () => {
        const res = mockRes();
        await handler({ method: 'GET', query: {}, headers: {} }, res);
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('非 GET 回傳 405', async () => {
        const res = mockRes();
        await handler({ method: 'POST', query: {}, headers: {} }, res);
        expect(res.statusCode).toBe(405);
    });

    test('limit 生效', async () => {
        const res = mockRes();
        await handler({ method: 'GET', query: { tags: '財帛宮,化祿,四化', limit: '2' }, headers: {} }, res);
        expect(res.body.entries.length).toBeLessThanOrEqual(2);
    });
});
