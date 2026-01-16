/**
 * 진단 결과 페이지
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagnosisStore } from '../stores/diagnosisStore';
import SyndromeCard from '../components/diagnosis/SyndromeCard';
import EvidenceModal from '../components/diagnosis/EvidenceModal';
import type { SyndromeResult, TreatmentAxisResult, HerbRecommendation } from '@contracts/schemas';

interface DiagnosisResult {
  sessionId: string;
  syndromes: SyndromeResult[];
  treatmentAxes: TreatmentAxisResult[];
  herbs: HerbRecommendation[];
  createdAt: string;
}

export default function ResultPage() {
  const navigate = useNavigate();
  const { sessionId, reset } = useDiagnosisStore();

  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSyndrome, setSelectedSyndrome] = useState<SyndromeResult | null>(null);
  const [showTreatment, setShowTreatment] = useState(false);

  useEffect(() => {
    // 세션 ID가 없으면 진단 페이지로 리다이렉트
    if (!sessionId) {
      // Mock 데이터로 대체 (테스트용)
      const mockResult: DiagnosisResult = {
        sessionId: 'mock-session',
        syndromes: [
          {
            id: 'snd-001',
            name: '기허증',
            description: '기가 허약하여 발생하는 증상군',
            matchScore: 85,
            evidences: ['피로감이 지속됨', '소화기능 저하', '면역력 약화'],
          },
          {
            id: 'snd-002',
            name: '혈허증',
            description: '혈이 부족하여 발생하는 증상군',
            matchScore: 72,
            evidences: ['어지럼증 호소', '안색이 창백함', '수면 장애'],
          },
          {
            id: 'snd-003',
            name: '담음증',
            description: '담음이 정체되어 발생하는 증상군',
            matchScore: 58,
            evidences: ['두통이 있음', '속이 더부룩함'],
          },
        ],
        treatmentAxes: [
          { id: 'tax-001', name: '보기(補氣)', description: '기를 보충하는 치료 방향' },
          { id: 'tax-002', name: '보혈(補血)', description: '혈을 보충하는 치료 방향' },
        ],
        herbs: [
          {
            id: 'herb-001',
            name: '인삼',
            scientificName: 'Panax ginseng',
            effect: '기력 보충, 면역력 강화',
            relevanceScore: 95,
            evidence: '기허증 치료에 대표적인 약재',
            referenceUrl: null,
          },
        ],
        createdAt: new Date().toISOString(),
      };

      setTimeout(() => {
        setResult(mockResult);
        setIsLoading(false);
      }, 500);
      return;
    }

    // 실제 결과 로딩 로직 (추후 구현)
    setIsLoading(false);
  }, [sessionId]);

  const handleRestart = () => {
    reset();
    navigate('/diagnosis');
  };

  const handleViewTreatment = () => {
    navigate('/treatment');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4" />
          <p className="text-heading-md text-neutral-700">결과 분석 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-heading-lg text-neutral-900">진단 결과</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* 변증 결과 카드 */}
        <section className="mb-8">
          <h2 className="text-heading-md text-neutral-800 mb-4">변증 분석 결과</h2>
          <p className="text-body-md text-neutral-500 mb-6">
            입력하신 증상을 바탕으로 분석한 변증 결과입니다. 카드를 클릭하면 상세 근거를
            확인할 수 있습니다.
          </p>

          <div className="space-y-4">
            {result?.syndromes.map((syndrome, index) => (
              <SyndromeCard
                key={syndrome.id}
                syndrome={syndrome}
                rank={index + 1}
                onClick={setSelectedSyndrome}
              />
            ))}
          </div>
        </section>

        {/* 치료법 섹션 */}
        {showTreatment && result && (
          <section className="mb-8">
            <h2 className="text-heading-md text-neutral-800 mb-4">권장 치료 방향</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                {result.treatmentAxes.map((axis) => (
                  <div key={axis.id} className="border-b border-neutral-100 pb-4 last:border-0">
                    <h3 className="text-body-lg font-semibold text-neutral-800">{axis.name}</h3>
                    <p className="text-body-md text-neutral-600">{axis.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-heading-md text-neutral-800 mb-4 mt-8">추천 약재</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {result.herbs.map((herb) => (
                <div key={herb.id} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-body-lg font-semibold text-neutral-800">{herb.name}</h3>
                  <p className="text-body-sm text-neutral-500 italic">{herb.scientificName}</p>
                  <p className="text-body-md text-neutral-600 mt-2">{herb.effect}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 액션 버튼 */}
        <div className="flex gap-4">
          {!showTreatment && (
            <button
              onClick={handleViewTreatment}
              className="flex-1 py-3 px-4 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              치료법 보기
            </button>
          )}
          <button
            onClick={handleRestart}
            className={`py-3 px-4 border-2 border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 transition-colors ${
              showTreatment ? 'flex-1' : ''
            }`}
          >
            다시 진단하기
          </button>
        </div>
      </main>

      {/* 근거 상세 모달 */}
      <EvidenceModal
        syndrome={selectedSyndrome}
        isOpen={selectedSyndrome !== null}
        onClose={() => setSelectedSyndrome(null)}
      />
    </div>
  );
}
