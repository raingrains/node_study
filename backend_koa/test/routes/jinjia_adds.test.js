const request = require('supertest');
const app = require('../../app'); // 假设你的 Koa 实例在 app.js 中导出

describe('POST /data/jinjia_adds', () => {
    it('should add multiple records successfully', async () => {
        const testData = [
            { date: '2024-08-01 00:00:01', huishou: 500, data: 1000 },
            { date: '2024-08-02 00:00:01', huishou: 510, data: 1010 }
        ];

        const response = await request(app.callback())
            .post('/data/jinjia_adds')
            .send(testData)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
    });

    it('should return 400 for invalid input format', async () => {
        const invalidData = { date: '2024-08-01 00:00:01', huishou: 500, data: 1000 }; // 非数组格式

        const response = await request(app.callback())
            .post('/data/jinjia_adds')
            .send(invalidData)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', '参数格式错误');
    });

    it('should return 400 for missing fields in input', async () => {
        const incompleteData = [
            { date: '2024-08-01 00:00:01', huishou: 500 } // 缺少 data 字段
        ];

        const response = await request(app.callback())
            .post('/data/jinjia_adds')
            .send(incompleteData)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', '参数格式错误');
    });

    it('should return 500 for database insertion failure', async () => {
        const testData = [
            { date: 'invalid-date', huishou: 500, data: 1000 } // 无效的日期格式
        ];

        const response = await request(app.callback())
            .post('/data/jinjia_adds')
            .send(testData)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', '记录新增失败');
    });
});
