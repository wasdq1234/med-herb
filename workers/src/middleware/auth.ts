/**
 * 인증 미들웨어
 *
 * JWT 토큰 검증 및 관리자 인증 처리
 */

import { createMiddleware } from 'hono/factory';
import type { Context, Next } from 'hono';
import { AuthService, type JwtPayload } from '../services/authService';
import type { Env } from '../types';

/**
 * 인증된 사용자 정보 타입
 */
export interface AuthUser {
  id: string;
  username: string;
}

/**
 * 인증 컨텍스트 변수 타입
 */
export interface AuthVariables {
  user: AuthUser;
}

/**
 * 인증 미들웨어
 *
 * Authorization 헤더에서 Bearer 토큰을 추출하고 검증합니다.
 * 검증 성공 시 c.set('user', AuthUser)로 사용자 정보를 설정합니다.
 */
export const authMiddleware = createMiddleware<{
  Bindings: Env;
  Variables: AuthVariables;
}>(async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader) {
    return c.json(
      {
        success: false,
        error: 'UNAUTHORIZED',
        message: '인증 토큰이 필요합니다',
      },
      401
    );
  }

  if (!authHeader.startsWith('Bearer ')) {
    return c.json(
      {
        success: false,
        error: 'UNAUTHORIZED',
        message: '잘못된 인증 형식입니다',
      },
      401
    );
  }

  const token = authHeader.slice(7); // 'Bearer ' 제거

  const authService = new AuthService(c.env);

  // 테스트 토큰 확인 (개발/테스트 환경)
  const testUser = authService.verifyTestToken(token);
  if (testUser) {
    c.set('user', {
      id: testUser.adminId,
      username: testUser.username,
    });
    return next();
  }

  // 실제 JWT 토큰 검증
  const payload = await authService.verifyAccessToken(token);

  if (!payload) {
    return c.json(
      {
        success: false,
        error: 'UNAUTHORIZED',
        message: '유효하지 않은 토큰입니다',
      },
      401
    );
  }

  c.set('user', {
    id: payload.sub,
    username: payload.username,
  });

  return next();
});

/**
 * 선택적 인증 미들웨어
 *
 * 토큰이 있으면 검증하고, 없어도 요청을 허용합니다.
 */
export const optionalAuthMiddleware = createMiddleware<{
  Bindings: Env;
  Variables: Partial<AuthVariables>;
}>(async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.slice(7);

  const authService = new AuthService(c.env);

  // 테스트 토큰 확인
  const testUser = authService.verifyTestToken(token);
  if (testUser) {
    c.set('user', {
      id: testUser.adminId,
      username: testUser.username,
    });
    return next();
  }

  // 실제 JWT 토큰 검증
  const payload = await authService.verifyAccessToken(token);

  if (payload) {
    c.set('user', {
      id: payload.sub,
      username: payload.username,
    });
  }

  return next();
});
