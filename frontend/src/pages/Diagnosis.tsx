/**
 * 진단 페이지
 *
 * 증상 선택 → 질문 응답 → 결과 단계로 구성
 */

import { useDiagnosisFlow } from '../hooks/useDiagnosis';
import { useDiagnosisStore } from '../stores/diagnosisStore';
import SymptomSelector from '../components/diagnosis/SymptomSelector';
import QuestionCard from '../components/diagnosis/QuestionCard';

export default function DiagnosisPage() {
  const {
    step,
    selectedSymptomIds,
    currentQuestionIndex,
    currentQuestion,
    totalQuestions,
    isLastQuestion,
    canProceedToQuestions,
    symptoms,
    isSymptomsLoading,
    isQuestionsLoading,
    isSubmitting,
    error: mutationError,
    toggleSymptom,
    setAnswer,
    nextQuestion,
    prevQuestion,
    goToQuestions,
    goToSymptoms,
    submitDiagnosis,
  } = useDiagnosisFlow();

  const { getAnswer, error: storeError } = useDiagnosisStore();

  // 에러는 hook 에러 또는 스토어 에러
  const error = mutationError || storeError;

  // 진행률 표시
  const stepProgress = step === 'symptoms' ? '1/3' : step === 'questions' ? '2/3' : '3/3';

  // 질문 진행률
  const questionProgress = totalQuestions > 0 ? `Q${currentQuestionIndex + 1}/${totalQuestions}` : '';

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-heading-lg text-neutral-900">한방 건강 진단</h1>
            <span className="text-body-md text-neutral-500">{stepProgress}</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* 에러 표시 */}
        {error && (
          <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg" role="alert">
            <p className="text-body-md text-error-700">{error}</p>
          </div>
        )}

        {/* 증상 선택 단계 */}
        {step === 'symptoms' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-heading-md text-neutral-800 mb-2">증상을 선택해주세요</h2>
              <p className="text-body-md text-neutral-500">
                현재 불편하신 증상을 모두 선택해주세요.
              </p>
            </div>

            <SymptomSelector
              symptoms={symptoms}
              selectedIds={selectedSymptomIds}
              onSelect={toggleSymptom}
              isLoading={isSymptomsLoading}
            />

            <div className="flex justify-end pt-4">
              <button
                onClick={goToQuestions}
                disabled={!canProceedToQuestions}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
              >
                다음
              </button>
            </div>
          </div>
        )}

        {/* 질문 응답 단계 */}
        {step === 'questions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-md text-neutral-800">상세 질문</h2>
              <span className="text-body-md text-neutral-500">{questionProgress}</span>
            </div>

            {isQuestionsLoading ? (
              <div className="text-center py-8 text-neutral-500">로딩 중...</div>
            ) : currentQuestion ? (
              <QuestionCard
                question={currentQuestion}
                answer={getAnswer(currentQuestion.id)}
                onChange={setAnswer}
              />
            ) : null}

            <div className="flex justify-between pt-4">
              <button
                onClick={currentQuestionIndex === 0 ? goToSymptoms : prevQuestion}
                className="px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 transition-colors"
              >
                이전
              </button>

              {isLastQuestion ? (
                <button
                  onClick={submitDiagnosis}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? '진단 중...' : '진단받기'}
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                >
                  다음
                </button>
              )}
            </div>
          </div>
        )}

        {/* 제출 중 */}
        {step === 'submitting' && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4" />
            <p className="text-heading-md text-neutral-700">진단 중...</p>
            <p className="text-body-md text-neutral-500 mt-2">
              입력하신 정보를 분석하고 있습니다.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
