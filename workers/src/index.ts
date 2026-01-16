import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

import type { Env } from './types';

const app = new Hono<{ Bindings: Env }>();

// 미들웨어
app.use('*', logger());
app.use('*', prettyJSON());
app.use(
  '*',
  cors({
    origin: ['http://localhost:5173', 'https://med-herb.pages.dev'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// 헬스 체크
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 버전
app.get('/api/v1', (c) => {
  return c.json({
    name: 'med-herb-api',
    version: '0.1.0',
    description: '한방진단 API',
  });
});

// TODO: 라우트 추가
// app.route('/api/v1/symptoms', symptomsRoute);
// app.route('/api/v1/diagnosis', diagnosisRoute);
// app.route('/api/v1/admin', adminRoute);

// 404 핸들러
app.notFound((c) => {
  return c.json({ error: 'Not Found', message: '요청한 리소스를 찾을 수 없습니다.' }, 404);
});

// 에러 핸들러
app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json(
    {
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : '서버 오류가 발생했습니다.',
    },
    500
  );
});

export default app;
