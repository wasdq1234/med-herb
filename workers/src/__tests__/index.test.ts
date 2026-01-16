// @ts-expect-error - cloudflare:test types not available in typecheck
import { env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import app from '../index';

describe('Workers API', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await app.request('/health', {}, env);

      expect(response.status).toBe(200);

      const data = await response.json() as { status: string; timestamp: string };
      expect(data).toHaveProperty('status', 'ok');
      expect(data).toHaveProperty('timestamp');
      expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp);
    });
  });

  describe('GET /api/v1', () => {
    it('should return API information', async () => {
      const response = await app.request('/api/v1', {}, env);

      expect(response.status).toBe(200);

      const data = await response.json() as { name: string; version: string; description: string };
      expect(data).toEqual({
        name: 'med-herb-api',
        version: '0.1.0',
        description: '한방진단 API',
      });
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await app.request('/non-existent', {}, env);

      expect(response.status).toBe(404);

      const data = await response.json() as { error: string; message: string };
      expect(data).toHaveProperty('error', 'Not Found');
      expect(data).toHaveProperty('message', '요청한 리소스를 찾을 수 없습니다.');
    });
  });

  describe('CORS Middleware', () => {
    it('should include CORS headers', async () => {
      const response = await app.request('/health', {
        headers: {
          'Origin': 'http://localhost:5173',
        },
      }, env);

      expect(response.headers.get('access-control-allow-origin')).toBeTruthy();
    });

    it('should handle OPTIONS preflight request', async () => {
      const response = await app.request('/api/v1', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:5173',
          'Access-Control-Request-Method': 'GET',
        },
      }, env);

      expect(response.status).toBe(204);
    });
  });
});
