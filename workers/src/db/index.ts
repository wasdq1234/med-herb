import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';

import * as schema from './schema';

/**
 * D1 데이터베이스 인스턴스 생성
 */
export function createDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

export type Database = ReturnType<typeof createDb>;

// 스키마 재export
export * from './schema';
