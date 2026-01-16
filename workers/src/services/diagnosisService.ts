/**
 * 진단 서비스
 *
 * 증상/질문 조회 및 진단 로직 처리
 */

import type { Env } from '../types';
import type { DiagnosisRequest } from '@contracts/schemas/diagnosis';

interface Symptom {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  display_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface Question {
  id: string;
  symptom_id: string | null;
  question_text: string;
  question_type: string;
  options: string | null;
  slider_min: number | null;
  slider_max: number | null;
  display_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface Syndrome {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  characteristics: string | null;
  is_active: number;
}

interface Herb {
  id: string;
  name: string;
  scientific_name: string | null;
  effect: string | null;
  category: string | null;
  is_active: number;
}

interface SyndromeHerb {
  herb_id: string;
  relevance_score: number;
  evidence: string | null;
  reference_url: string | null;
}

interface TreatmentAxis {
  id: string;
  syndrome_id: string;
  name: string;
  description: string | null;
}

export class DiagnosisService {
  constructor(private env: Env) {}

  /**
   * 활성 증상 목록 조회
   */
  async getActiveSymptoms(category?: string) {
    let sql = `
      SELECT id, name, description, category, display_order, is_active, created_at, updated_at
      FROM symptom
      WHERE is_active = 1
    `;
    const params: string[] = [];

    if (category) {
      sql += ` AND category = ?`;
      params.push(category);
    }

    sql += ` ORDER BY display_order ASC`;

    const result = await this.env.DB.prepare(sql)
      .bind(...params)
      .all<Symptom>();

    return (result.results || []).map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      category: s.category,
      displayOrder: s.display_order,
      isActive: s.is_active === 1,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
    }));
  }

  /**
   * 활성 질문 목록 조회
   */
  async getActiveQuestions(symptomId?: string) {
    let sql = `
      SELECT id, symptom_id, question_text, question_type, options, slider_min, slider_max, display_order, is_active, created_at, updated_at
      FROM question
      WHERE is_active = 1
    `;
    const params: string[] = [];

    if (symptomId) {
      // 특정 증상 관련 질문 또는 공통 질문 (symptom_id IS NULL)
      sql += ` AND (symptom_id = ? OR symptom_id IS NULL)`;
      params.push(symptomId);
    }

    sql += ` ORDER BY display_order ASC`;

    const result = await this.env.DB.prepare(sql)
      .bind(...params)
      .all<Question>();

    return (result.results || []).map((q) => ({
      id: q.id,
      symptomId: q.symptom_id,
      questionText: q.question_text,
      questionType: q.question_type,
      options: q.options ? JSON.parse(q.options) : null,
      sliderMin: q.slider_min,
      sliderMax: q.slider_max,
      displayOrder: q.display_order,
      isActive: q.is_active === 1,
      createdAt: q.created_at,
      updatedAt: q.updated_at,
    }));
  }

  /**
   * 진단 실행
   */
  async runDiagnosis(request: DiagnosisRequest) {
    const sessionId = this.generateSessionId();
    const createdAt = new Date().toISOString();

    // 선택된 증상 조회
    const symptoms = await this.getSymptomsByIds(request.symptomIds);

    // 변증 결과 계산 (심플 버전 - 증상 기반 매칭)
    const syndromes = await this.calculateSyndromeMatches(symptoms, request.answers);

    // 치료축 조회
    const treatmentAxes = await this.getTreatmentAxes(syndromes.map((s) => s.id));

    // 약재 추천 조회
    const herbs = await this.getRecommendedHerbs(syndromes.map((s) => s.id));

    // 진단 로그 저장
    await this.saveDiagnosisLog(sessionId, request, { syndromes, treatmentAxes, herbs }, createdAt);

    return {
      sessionId,
      syndromes,
      treatmentAxes,
      herbs,
      createdAt,
    };
  }

  /**
   * 세션 ID 생성
   */
  private generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return `diag-${timestamp}-${random}`;
  }

  /**
   * ID로 증상 조회
   */
  private async getSymptomsByIds(ids: string[]) {
    if (ids.length === 0) return [];

    const placeholders = ids.map(() => '?').join(',');
    const result = await this.env.DB.prepare(
      `SELECT id, name, description, category FROM symptom WHERE id IN (${placeholders})`
    )
      .bind(...ids)
      .all<{ id: string; name: string; description: string | null; category: string | null }>();

    return result.results || [];
  }

  /**
   * 변증 매칭 계산 (심플 버전)
   */
  private async calculateSyndromeMatches(
    symptoms: Array<{ id: string; name: string; description: string | null; category: string | null }>,
    answers: Array<{ questionId: string; value: string | number }>
  ) {
    // 모든 활성 변증 조회
    const result = await this.env.DB.prepare(
      `SELECT id, name, description, category, characteristics FROM syndrome WHERE is_active = 1`
    ).all<Syndrome>();

    const syndromes = result.results || [];

    // 간단한 매칭 로직: 증상과 변증의 특성을 비교
    const matches = syndromes.map((syndrome) => {
      const evidences: string[] = [];
      let score = 0;

      // 증상 이름이 변증 특성에 포함되는지 확인
      symptoms.forEach((symptom) => {
        if (syndrome.characteristics?.includes(symptom.name)) {
          score += 30;
          evidences.push(symptom.name);
        }
        // 카테고리 매칭
        if (symptom.category && syndrome.category === symptom.category) {
          score += 10;
        }
      });

      // 응답 기반 추가 점수 (슬라이더 값이 높을수록 추가 점수)
      answers.forEach((answer) => {
        if (typeof answer.value === 'number' && answer.value >= 7) {
          score += 5;
        }
      });

      // 최대 100점으로 제한
      return {
        id: syndrome.id,
        name: syndrome.name,
        description: syndrome.description,
        matchScore: Math.min(score, 100),
        evidences,
      };
    });

    // 점수 높은 순으로 정렬, 점수가 0보다 큰 것만 반환
    return matches
      .filter((m) => m.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5); // 상위 5개만
  }

  /**
   * 치료축 조회
   */
  private async getTreatmentAxes(syndromeIds: string[]) {
    if (syndromeIds.length === 0) return [];

    const placeholders = syndromeIds.map(() => '?').join(',');
    const result = await this.env.DB.prepare(
      `SELECT id, name, description FROM treatment_axis WHERE syndrome_id IN (${placeholders}) ORDER BY display_order ASC`
    )
      .bind(...syndromeIds)
      .all<{ id: string; name: string; description: string | null }>();

    return (result.results || [])
      .slice(0, 3) // 최대 3개 치료축 반환
      .map((axis) => ({
        id: axis.id,
        name: axis.name,
        description: axis.description,
      }));
  }

  /**
   * 추천 약재 조회
   */
  private async getRecommendedHerbs(syndromeIds: string[]) {
    if (syndromeIds.length === 0) return [];

    const placeholders = syndromeIds.map(() => '?').join(',');
    const result = await this.env.DB.prepare(
      `SELECT h.id, h.name, h.scientific_name, h.effect, sh.relevance_score, sh.evidence, sh.reference_url
       FROM herb h
       INNER JOIN syndrome_herb sh ON h.id = sh.herb_id
       WHERE sh.syndrome_id IN (${placeholders}) AND h.is_active = 1
       ORDER BY sh.relevance_score DESC`
    )
      .bind(...syndromeIds)
      .all<{
        id: string;
        name: string;
        scientific_name: string | null;
        effect: string | null;
        relevance_score: number;
        evidence: string | null;
        reference_url: string | null;
      }>();

    // 중복 제거 (여러 변증에서 같은 약재가 추천될 수 있음)
    const seen = new Set<string>();
    return (result.results || [])
      .filter((h) => {
        if (seen.has(h.id)) return false;
        seen.add(h.id);
        return true;
      })
      .slice(0, 5) // 최대 5개 약재 반환 (우선순위 기반)
      .map((h) => ({
        id: h.id,
        name: h.name,
        scientificName: h.scientific_name,
        effect: h.effect,
        relevanceScore: h.relevance_score,
        evidence: h.evidence,
        referenceUrl: h.reference_url,
      }));
  }

  /**
   * 진단 로그 저장
   */
  private async saveDiagnosisLog(
    sessionId: string,
    request: DiagnosisRequest,
    results: { syndromes: unknown[]; treatmentAxes: unknown[]; herbs: unknown[] },
    createdAt: string
  ) {
    await this.env.DB.prepare(
      `INSERT INTO diagnosis_log (id, session_id, selected_symptoms, answers, results, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(
        `log-${sessionId}`,
        sessionId,
        JSON.stringify(request.symptomIds),
        JSON.stringify(request.answers),
        JSON.stringify(results),
        createdAt
      )
      .run();
  }
}
