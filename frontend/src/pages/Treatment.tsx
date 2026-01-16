/**
 * 치료법/약재 페이지
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagnosisStore } from '../stores/diagnosisStore';
import TreatmentAxisCard from '../components/diagnosis/TreatmentAxisCard';
import HerbTable from '../components/diagnosis/HerbTable';
import type { TreatmentAxisResult, HerbRecommendation } from '@contracts/schemas';

interface TreatmentData {
  treatmentAxes: TreatmentAxisResult[];
  herbs: HerbRecommendation[];
}

export default function TreatmentPage() {
  const navigate = useNavigate();
  const { sessionId, reset } = useDiagnosisStore();

  const [data, setData] = useState<TreatmentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 세션 ID가 없으면 Mock 데이터 사용
    if (!sessionId) {
      const mockData: TreatmentData = {
        treatmentAxes: [
          {
            id: 'tax-001',
            name: '보기(補氣)',
            description: '기를 보충하는 치료 방향',
          },
          {
            id: 'tax-002',
            name: '보혈(補血)',
            description: '혈을 보충하는 치료 방향',
          },
          {
            id: 'tax-003',
            name: '거담(祛痰)',
            description: '담음을 제거하는 치료 방향',
          },
        ],
        herbs: [
          {
            id: 'herb-001',
            name: '인삼',
            scientificName: 'Panax ginseng',
            effect: '기력 보충, 면역력 강화',
            relevanceScore: 95,
            evidence: '기허증 치료에 대표적인 약재',
            referenceUrl: 'https://example.com/herbs/ginseng',
          },
          {
            id: 'herb-002',
            name: '당귀',
            scientificName: 'Angelica gigas',
            effect: '보혈, 활혈, 진통',
            relevanceScore: 88,
            evidence: '혈허증 치료에 효과적',
            referenceUrl: 'https://example.com/herbs/angelica',
          },
          {
            id: 'herb-003',
            name: '백출',
            scientificName: 'Atractylodes macrocephala',
            effect: '건비, 거습, 이수',
            relevanceScore: 82,
            evidence: '소화기능 강화에 도움',
            referenceUrl: 'https://example.com/herbs/atractylodes',
          },
          {
            id: 'herb-004',
            name: '황기',
            scientificName: 'Astragalus membranaceus',
            effect: '보기, 고표, 이수',
            relevanceScore: 78,
            evidence: '기력 회복에 효과적',
            referenceUrl: 'https://example.com/herbs/astragalus',
          },
          {
            id: 'herb-005',
            name: '천궁',
            scientificName: 'Cnidium officinale',
            effect: '활혈, 행기, 진통',
            relevanceScore: 72,
            evidence: '두통 완화에 효과적',
            referenceUrl: 'https://example.com/herbs/cnidium',
          },
        ],
      };

      setTimeout(() => {
        setData(mockData);
        setIsLoading(false);
      }, 300);
      return;
    }

    // 실제 데이터 로딩 (추후 구현)
    setIsLoading(false);
  }, [sessionId]);

  const handleRestart = () => {
    reset();
    navigate('/diagnosis');
  };

  const handleBackToResults = () => {
    navigate('/result');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4" />
          <p className="text-heading-md text-neutral-700">치료 정보 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-heading-lg text-neutral-900">치료 방향 및 약재</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 치료축 섹션 */}
        <section className="mb-8">
          <h2 className="text-heading-md text-neutral-800 mb-4">권장 치료 방향</h2>
          <p className="text-body-md text-neutral-500 mb-6">
            진단 결과에 따른 한의학적 치료 방향입니다.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {data?.treatmentAxes.map((axis) => (
              <TreatmentAxisCard key={axis.id} axis={axis} />
            ))}
          </div>
        </section>

        {/* 약재 섹션 */}
        <section className="mb-8">
          <h2 className="text-heading-md text-neutral-800 mb-4">추천 약재</h2>
          <p className="text-body-md text-neutral-500 mb-6">
            증상 개선에 도움이 될 수 있는 약재들입니다. 자세한 정보는 근거 링크를 확인하세요.
          </p>

          <HerbTable herbs={data?.herbs || []} />
        </section>

        {/* 주의사항 */}
        <section className="mb-8">
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <h3 className="text-body-lg font-semibold text-warning-800 mb-2">
              ⚠️ 주의사항
            </h3>
            <p className="text-body-md text-warning-700">
              이 정보는 참고용입니다. 실제 치료를 위해서는 반드시 전문 한의사와 상담하세요.
              자가 진단 및 자가 처방은 위험할 수 있습니다.
            </p>
          </div>
        </section>

        {/* 액션 버튼 */}
        <div className="flex gap-4">
          <button
            onClick={handleBackToResults}
            className="flex-1 py-3 px-4 border-2 border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 transition-colors"
          >
            결과로 돌아가기
          </button>
          <button
            onClick={handleRestart}
            className="flex-1 py-3 px-4 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            다시 진단하기
          </button>
        </div>
      </main>
    </div>
  );
}
