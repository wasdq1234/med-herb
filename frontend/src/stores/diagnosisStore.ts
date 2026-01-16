/**
 * 진단 상태 관리 스토어
 */

import { create } from 'zustand';
import type { Answer } from '@contracts/schemas';

type DiagnosisStep = 'symptoms' | 'questions' | 'submitting' | 'result';

interface DiagnosisState {
  // 현재 단계
  step: DiagnosisStep;

  // 선택된 증상 ID 목록
  selectedSymptomIds: string[];

  // 질문 응답 목록
  answers: Answer[];

  // 현재 질문 인덱스
  currentQuestionIndex: number;

  // 진단 결과 세션 ID
  sessionId: string | null;

  // 에러 상태
  error: string | null;

  // 액션
  setStep: (step: DiagnosisStep) => void;
  toggleSymptom: (symptomId: string) => void;
  setSymptoms: (symptomIds: string[]) => void;
  setAnswer: (answer: Answer) => void;
  getAnswer: (questionId: string) => Answer | undefined;
  setCurrentQuestionIndex: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  setSessionId: (sessionId: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  step: 'symptoms' as DiagnosisStep,
  selectedSymptomIds: [],
  answers: [],
  currentQuestionIndex: 0,
  sessionId: null,
  error: null,
};

export const useDiagnosisStore = create<DiagnosisState>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  toggleSymptom: (symptomId) =>
    set((state) => {
      const isSelected = state.selectedSymptomIds.includes(symptomId);
      return {
        selectedSymptomIds: isSelected
          ? state.selectedSymptomIds.filter((id) => id !== symptomId)
          : [...state.selectedSymptomIds, symptomId],
      };
    }),

  setSymptoms: (symptomIds) => set({ selectedSymptomIds: symptomIds }),

  setAnswer: (answer) =>
    set((state) => {
      const existingIndex = state.answers.findIndex((a) => a.questionId === answer.questionId);
      if (existingIndex >= 0) {
        const newAnswers = [...state.answers];
        newAnswers[existingIndex] = answer;
        return { answers: newAnswers };
      }
      return { answers: [...state.answers, answer] };
    }),

  getAnswer: (questionId) => {
    return get().answers.find((a) => a.questionId === questionId);
  },

  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
    })),

  prevQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
    })),

  setSessionId: (sessionId) => set({ sessionId }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));
