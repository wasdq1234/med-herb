/**
 * 진단 관련 커스텀 훅
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getSymptoms, getQuestions, submitDiagnosis } from '../api/diagnosis';
import { useDiagnosisStore } from '../stores/diagnosisStore';
import type { DiagnosisRequest } from '@contracts/schemas';

/**
 * 증상 목록 조회 훅
 */
export function useSymptoms(category?: string) {
  return useQuery({
    queryKey: ['symptoms', category],
    queryFn: () => getSymptoms(category),
  });
}

/**
 * 질문 목록 조회 훅
 */
export function useQuestions(symptomIds: string[]) {
  return useQuery({
    queryKey: ['questions', symptomIds],
    queryFn: async () => {
      // 선택된 증상들에 대한 질문 + 공통 질문 조회
      const questionPromises = symptomIds.map((id) => getQuestions(id));
      const questionArrays = await Promise.all(questionPromises);

      // 중복 제거 및 정렬
      const questionMap = new Map<string, (typeof questionArrays)[0][0]>();
      questionArrays.flat().forEach((q) => {
        if (!questionMap.has(q.id)) {
          questionMap.set(q.id, q);
        }
      });

      return Array.from(questionMap.values()).sort((a, b) => a.displayOrder - b.displayOrder);
    },
    enabled: symptomIds.length > 0,
  });
}

/**
 * 진단 제출 훅
 */
export function useDiagnosisMutation() {
  const navigate = useNavigate();
  const { setSessionId, setStep, setError } = useDiagnosisStore();

  return useMutation({
    mutationFn: (request: DiagnosisRequest) => submitDiagnosis(request),
    onSuccess: (data) => {
      setSessionId(data.sessionId);
      setStep('result');
      navigate('/result');
    },
    onError: (error: Error) => {
      setError(error.message || '진단에 실패했습니다');
    },
  });
}

/**
 * 진단 흐름 관리 훅
 */
export function useDiagnosisFlow() {
  const {
    step,
    selectedSymptomIds,
    answers,
    currentQuestionIndex,
    setStep,
    toggleSymptom,
    setAnswer,
    nextQuestion,
    prevQuestion,
    reset,
  } = useDiagnosisStore();

  const symptomsQuery = useSymptoms();
  const questionsQuery = useQuestions(selectedSymptomIds);
  const diagnosisMutation = useDiagnosisMutation();

  const currentQuestion = questionsQuery.data?.[currentQuestionIndex];
  const totalQuestions = questionsQuery.data?.length ?? 0;
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;

  const canProceedToQuestions = selectedSymptomIds.length > 0;

  const goToQuestions = () => {
    if (canProceedToQuestions) {
      setStep('questions');
    }
  };

  const goToSymptoms = () => {
    setStep('symptoms');
  };

  const submitDiagnosis = () => {
    setStep('submitting');
    diagnosisMutation.mutate({
      symptomIds: selectedSymptomIds,
      answers,
    });
  };

  return {
    // State
    step,
    selectedSymptomIds,
    answers,
    currentQuestionIndex,
    currentQuestion,
    totalQuestions,
    isLastQuestion,
    canProceedToQuestions,

    // Queries
    symptoms: symptomsQuery.data ?? [],
    questions: questionsQuery.data ?? [],
    isSymptomsLoading: symptomsQuery.isLoading,
    isQuestionsLoading: questionsQuery.isLoading,
    isSubmitting: diagnosisMutation.isPending,
    error: diagnosisMutation.error?.message,

    // Actions
    toggleSymptom,
    setAnswer,
    nextQuestion,
    prevQuestion,
    goToQuestions,
    goToSymptoms,
    submitDiagnosis,
    reset,
  };
}
