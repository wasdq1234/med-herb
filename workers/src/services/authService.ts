/**
 * 인증 서비스
 *
 * JWT 토큰 생성/검증 및 비밀번호 해싱 처리
 */

import { nanoid } from 'nanoid';
import type { Env } from '../types';

/**
 * JWT 페이로드 타입
 */
export interface JwtPayload {
  sub: string; // admin ID
  username: string;
  iat: number; // issued at
  exp: number; // expiration
  type: 'access' | 'refresh';
}

/**
 * 토큰 생성 결과
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Base64URL 인코딩
 */
function base64urlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Base64URL 디코딩
 */
function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4;
  if (padding) {
    base64 += '='.repeat(4 - padding);
  }
  return atob(base64);
}

/**
 * HMAC-SHA256 서명 생성
 */
async function createHmacSignature(
  data: string,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  );

  return base64urlEncode(
    String.fromCharCode(...new Uint8Array(signature))
  );
}

/**
 * JWT 토큰 생성
 */
async function createJwt(
  payload: JwtPayload,
  secret: string
): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerEncoded = base64urlEncode(JSON.stringify(header));
  const payloadEncoded = base64urlEncode(JSON.stringify(payload));

  const data = `${headerEncoded}.${payloadEncoded}`;
  const signature = await createHmacSignature(data, secret);

  return `${data}.${signature}`;
}

/**
 * JWT 토큰 검증 및 디코딩
 */
async function verifyJwt(
  token: string,
  secret: string
): Promise<JwtPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [headerEncoded, payloadEncoded, signature] = parts;
    const data = `${headerEncoded}.${payloadEncoded}`;

    // 서명 검증
    const expectedSignature = await createHmacSignature(data, secret);
    if (signature !== expectedSignature) {
      return null;
    }

    // 페이로드 디코딩
    const payload: JwtPayload = JSON.parse(base64urlDecode(payloadEncoded));

    // 만료 시간 검증
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * 비밀번호 해싱 (PBKDF2)
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const hashArray = new Uint8Array(derivedBits);
  const combined = new Uint8Array(salt.length + hashArray.length);
  combined.set(salt);
  combined.set(hashArray, salt.length);

  return base64urlEncode(String.fromCharCode(...combined));
}

/**
 * 비밀번호 검증
 */
async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    const combined = Uint8Array.from(
      base64urlDecode(storedHash),
      (c) => c.charCodeAt(0)
    );
    const salt = combined.slice(0, 16);
    const storedHashBytes = combined.slice(16);

    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      256
    );

    const hashArray = new Uint8Array(derivedBits);

    // 시간 안전 비교
    if (hashArray.length !== storedHashBytes.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < hashArray.length; i++) {
      result |= hashArray[i] ^ storedHashBytes[i];
    }

    return result === 0;
  } catch {
    return false;
  }
}

/**
 * AuthService 클래스
 */
export class AuthService {
  private jwtSecret: string;
  private accessTokenExpiry = 3600; // 1시간
  private refreshTokenExpiry = 604800; // 7일

  constructor(env: Env) {
    this.jwtSecret = env.JWT_SECRET || 'default-dev-secret-change-in-production';
  }

  /**
   * 비밀번호 해싱
   */
  async hashPassword(password: string): Promise<string> {
    return hashPassword(password);
  }

  /**
   * 비밀번호 검증
   */
  async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    return verifyPassword(password, storedHash);
  }

  /**
   * 토큰 쌍 생성
   */
  async generateTokens(adminId: string, username: string): Promise<TokenPair> {
    const now = Math.floor(Date.now() / 1000);

    const accessPayload: JwtPayload = {
      sub: adminId,
      username,
      iat: now,
      exp: now + this.accessTokenExpiry,
      type: 'access',
    };

    const refreshPayload: JwtPayload = {
      sub: adminId,
      username,
      iat: now,
      exp: now + this.refreshTokenExpiry,
      type: 'refresh',
    };

    const accessToken = await createJwt(accessPayload, this.jwtSecret);
    const refreshToken = await createJwt(refreshPayload, this.jwtSecret);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.accessTokenExpiry,
    };
  }

  /**
   * 액세스 토큰 검증
   */
  async verifyAccessToken(token: string): Promise<JwtPayload | null> {
    const payload = await verifyJwt(token, this.jwtSecret);

    if (!payload || payload.type !== 'access') {
      return null;
    }

    return payload;
  }

  /**
   * 리프레시 토큰 검증
   */
  async verifyRefreshToken(token: string): Promise<JwtPayload | null> {
    const payload = await verifyJwt(token, this.jwtSecret);

    if (!payload || payload.type !== 'refresh') {
      return null;
    }

    return payload;
  }

  /**
   * 리프레시 토큰으로 새 액세스 토큰 발급
   */
  async refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string; expiresIn: number } | null> {
    const payload = await this.verifyRefreshToken(refreshToken);

    if (!payload) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    const accessPayload: JwtPayload = {
      sub: payload.sub,
      username: payload.username,
      iat: now,
      exp: now + this.accessTokenExpiry,
      type: 'access',
    };

    const accessToken = await createJwt(accessPayload, this.jwtSecret);

    return {
      accessToken,
      expiresIn: this.accessTokenExpiry,
    };
  }

  /**
   * 테스트용 토큰 검증 (Bearer test-token-{adminId} 형식)
   * 개발/테스트 환경에서만 사용
   */
  verifyTestToken(token: string): { adminId: string; username: string } | null {
    const testTokenMatch = token.match(/^test-token-(.+)$/);
    if (testTokenMatch) {
      return {
        adminId: testTokenMatch[1],
        username: 'testadmin',
      };
    }
    return null;
  }
}

/**
 * 새 관리자 ID 생성
 */
export function generateAdminId(): string {
  return `admin-${nanoid(12)}`;
}
