/**
 * 테스트 셋업
 *
 * 테스트 실행 전 D1 데이터베이스 초기화
 */

// @ts-expect-error - cloudflare:test types not available in typecheck
import { env } from 'cloudflare:test';
import { beforeAll, afterAll, beforeEach } from 'vitest';
import { AuthService } from '../services/authService';

/**
 * 테스트용 관리자 생성
 */
async function createTestAdmin() {
  const authService = new AuthService(env);
  const passwordHash = await authService.hashPassword('testpass123');

  await env.DB.prepare(`
    INSERT OR REPLACE INTO admin (id, username, password_hash, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    'test-admin-1',
    'testadmin',
    passwordHash,
    '2024-01-01T00:00:00.000Z',
    '2024-01-01T00:00:00.000Z'
  ).run();
}

/**
 * 테이블 생성 SQL
 */
const createTablesSql = `
-- Admin
CREATE TABLE IF NOT EXISTS admin (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Symptom
CREATE TABLE IF NOT EXISTS symptom (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Question
CREATE TABLE IF NOT EXISTS question (
  id TEXT PRIMARY KEY,
  symptom_id TEXT REFERENCES symptom(id),
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL,
  options TEXT,
  slider_min INTEGER,
  slider_max INTEGER,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Syndrome
CREATE TABLE IF NOT EXISTS syndrome (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  characteristics TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Treatment Axis
CREATE TABLE IF NOT EXISTS treatment_axis (
  id TEXT PRIMARY KEY,
  syndrome_id TEXT REFERENCES syndrome(id),
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Herb
CREATE TABLE IF NOT EXISTS herb (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  scientific_name TEXT,
  effect TEXT,
  category TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Syndrome Herb
CREATE TABLE IF NOT EXISTS syndrome_herb (
  id TEXT PRIMARY KEY,
  syndrome_id TEXT NOT NULL REFERENCES syndrome(id),
  herb_id TEXT NOT NULL REFERENCES herb(id),
  relevance_score REAL NOT NULL DEFAULT 1.0,
  evidence TEXT,
  reference_url TEXT,
  created_at TEXT NOT NULL
);

-- Diagnosis Rule
CREATE TABLE IF NOT EXISTS diagnosis_rule (
  id TEXT PRIMARY KEY,
  syndrome_id TEXT NOT NULL REFERENCES syndrome(id),
  rule_type TEXT NOT NULL,
  condition TEXT NOT NULL,
  weight REAL NOT NULL DEFAULT 1.0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Diagnosis Log
CREATE TABLE IF NOT EXISTS diagnosis_log (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  selected_symptoms TEXT NOT NULL,
  answers TEXT NOT NULL,
  results TEXT NOT NULL,
  created_at TEXT NOT NULL
);
`;

/**
 * 테스트용 시드 데이터 (관리자 제외)
 */
const seedDataSql = `

-- Test Symptoms
INSERT OR REPLACE INTO symptom (id, name, description, category, display_order, is_active, created_at, updated_at)
VALUES ('symptom-1', '두통', '머리가 아픈 증상', '통증', 1, 1, '2024-01-01T00:00:00.000Z', '2024-01-01T00:00:00.000Z');

INSERT OR REPLACE INTO symptom (id, name, description, category, display_order, is_active, created_at, updated_at)
VALUES ('symptom-2', '피로', '만성적인 피로감', '전신', 2, 1, '2024-01-01T00:00:00.000Z', '2024-01-01T00:00:00.000Z');

-- Test Questions
INSERT OR REPLACE INTO question (id, symptom_id, question_text, question_type, options, slider_min, slider_max, display_order, is_active, created_at, updated_at)
VALUES ('question-1', 'symptom-1', '두통의 위치는 어디입니까?', 'radio', '[{"value":"front","label":"앞머리"},{"value":"back","label":"뒷머리"},{"value":"side","label":"옆머리"}]', NULL, NULL, 1, 1, '2024-01-01T00:00:00.000Z', '2024-01-01T00:00:00.000Z');

INSERT OR REPLACE INTO question (id, symptom_id, question_text, question_type, options, slider_min, slider_max, display_order, is_active, created_at, updated_at)
VALUES ('question-2', 'symptom-1', '두통의 강도는 어느 정도입니까?', 'slider', NULL, 1, 10, 2, 1, '2024-01-01T00:00:00.000Z', '2024-01-01T00:00:00.000Z');

-- Test Syndromes
INSERT OR REPLACE INTO syndrome (id, name, description, category, characteristics, is_active, created_at, updated_at)
VALUES ('syndrome-1', '간기울결', '간의 기운이 울체된 상태', '기울', '스트레스, 감정 불안정', 1, '2024-01-01T00:00:00.000Z', '2024-01-01T00:00:00.000Z');

INSERT OR REPLACE INTO syndrome (id, name, description, category, characteristics, is_active, created_at, updated_at)
VALUES ('syndrome-2', '기혈양허', '기와 혈이 모두 부족한 상태', '허증', '피로, 무기력', 1, '2024-01-01T00:00:00.000Z', '2024-01-01T00:00:00.000Z');

-- Test Herbs
INSERT OR REPLACE INTO herb (id, name, scientific_name, effect, category, is_active, created_at, updated_at)
VALUES ('herb-1', '시호', 'Bupleurum falcatum', '간기울결 개선', '해표약', 1, '2024-01-01T00:00:00.000Z', '2024-01-01T00:00:00.000Z');

INSERT OR REPLACE INTO herb (id, name, scientific_name, effect, category, is_active, created_at, updated_at)
VALUES ('herb-2', '당귀', 'Angelica sinensis', '보혈 작용', '보익약', 1, '2024-01-01T00:00:00.000Z', '2024-01-01T00:00:00.000Z');
`;

/**
 * 테스트 전 DB 초기화
 */
beforeAll(async () => {
  // 테이블 생성
  const statements = createTablesSql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const sql of statements) {
    try {
      await env.DB.prepare(sql).run();
    } catch (error) {
      console.error('Failed to create table:', sql.substring(0, 50), error);
    }
  }

  // 시드 데이터 삽입
  const seedStatements = seedDataSql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const sql of seedStatements) {
    try {
      await env.DB.prepare(sql).run();
    } catch (error) {
      console.error('Failed to seed data:', sql.substring(0, 50), error);
    }
  }

  // 테스트 관리자 생성 (비밀번호: testpass123)
  await createTestAdmin();
});

/**
 * 각 테스트 전 데이터 리셋
 */
beforeEach(async () => {
  // 테스트별 데이터 리셋이 필요한 경우 여기에 구현
});

/**
 * 테스트 후 정리
 */
afterAll(async () => {
  // 정리 작업이 필요한 경우 여기에 구현
});
