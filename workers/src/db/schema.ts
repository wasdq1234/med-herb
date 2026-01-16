import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

/**
 * 관리자 테이블
 */
export const admin = sqliteTable('admin', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

/**
 * 증상 테이블
 */
export const symptom = sqliteTable('symptom', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category'),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

/**
 * 질문 테이블
 */
export const question = sqliteTable('question', {
  id: text('id').primaryKey(),
  symptomId: text('symptom_id').references(() => symptom.id),
  questionText: text('question_text').notNull(),
  questionType: text('question_type').notNull(), // 'radio' | 'slider'
  options: text('options'), // JSON string for radio options
  sliderMin: integer('slider_min'),
  sliderMax: integer('slider_max'),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

/**
 * 변증(증후군) 테이블
 */
export const syndrome = sqliteTable('syndrome', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category'),
  characteristics: text('characteristics'), // JSON string
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

/**
 * 치료축 테이블
 */
export const treatmentAxis = sqliteTable('treatment_axis', {
  id: text('id').primaryKey(),
  syndromeId: text('syndrome_id').references(() => syndrome.id),
  name: text('name').notNull(),
  description: text('description'),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

/**
 * 약재 테이블
 */
export const herb = sqliteTable('herb', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  scientificName: text('scientific_name'),
  effect: text('effect'),
  category: text('category'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

/**
 * 변증-약재 연결 테이블
 */
export const syndromeHerb = sqliteTable('syndrome_herb', {
  id: text('id').primaryKey(),
  syndromeId: text('syndrome_id')
    .notNull()
    .references(() => syndrome.id),
  herbId: text('herb_id')
    .notNull()
    .references(() => herb.id),
  relevanceScore: real('relevance_score').notNull().default(1.0),
  evidence: text('evidence'),
  referenceUrl: text('reference_url'),
  createdAt: text('created_at').notNull(),
});

/**
 * 진단 규칙 테이블
 */
export const diagnosisRule = sqliteTable('diagnosis_rule', {
  id: text('id').primaryKey(),
  syndromeId: text('syndrome_id')
    .notNull()
    .references(() => syndrome.id),
  ruleType: text('rule_type').notNull(), // 'symptom_weight' | 'question_answer'
  condition: text('condition').notNull(), // JSON string
  weight: real('weight').notNull().default(1.0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

/**
 * 진단 로그 테이블
 */
export const diagnosisLog = sqliteTable('diagnosis_log', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull(),
  selectedSymptoms: text('selected_symptoms').notNull(), // JSON string
  answers: text('answers').notNull(), // JSON string
  results: text('results').notNull(), // JSON string
  createdAt: text('created_at').notNull(),
});

// 타입 export
export type Admin = typeof admin.$inferSelect;
export type NewAdmin = typeof admin.$inferInsert;

export type Symptom = typeof symptom.$inferSelect;
export type NewSymptom = typeof symptom.$inferInsert;

export type Question = typeof question.$inferSelect;
export type NewQuestion = typeof question.$inferInsert;

export type Syndrome = typeof syndrome.$inferSelect;
export type NewSyndrome = typeof syndrome.$inferInsert;

export type TreatmentAxis = typeof treatmentAxis.$inferSelect;
export type NewTreatmentAxis = typeof treatmentAxis.$inferInsert;

export type Herb = typeof herb.$inferSelect;
export type NewHerb = typeof herb.$inferInsert;

export type SyndromeHerb = typeof syndromeHerb.$inferSelect;
export type NewSyndromeHerb = typeof syndromeHerb.$inferInsert;

export type DiagnosisRule = typeof diagnosisRule.$inferSelect;
export type NewDiagnosisRule = typeof diagnosisRule.$inferInsert;

export type DiagnosisLog = typeof diagnosisLog.$inferSelect;
export type NewDiagnosisLog = typeof diagnosisLog.$inferInsert;
