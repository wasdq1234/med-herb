/**
 * 변증 결과 카드 컴포넌트
 */

import type { SyndromeResult } from '@contracts/schemas';

interface SyndromeCardProps {
  syndrome: SyndromeResult;
  rank: number;
  onClick: (syndrome: SyndromeResult) => void;
}

export default function SyndromeCard({ syndrome, rank, onClick }: SyndromeCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-warning-600';
    return 'text-neutral-600';
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-primary-500 text-white';
    if (rank === 2) return 'bg-primary-100 text-primary-700';
    return 'bg-neutral-100 text-neutral-700';
  };

  return (
    <div
      onClick={() => onClick(syndrome)}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-300"
      role="button"
      tabIndex={0}
      data-testid="syndrome-card"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(syndrome);
        }
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-body-sm font-bold ${getRankStyle(rank)}`}
          >
            {rank}위
          </span>
          <h3 className="text-heading-md text-neutral-900">{syndrome.name}</h3>
        </div>
        <span className={`text-heading-lg font-bold ${getScoreColor(syndrome.matchScore)}`}>
          {syndrome.matchScore}%
        </span>
      </div>

      <p className="text-body-md text-neutral-600 mb-4">{syndrome.description}</p>

      <div className="flex items-center justify-between text-body-sm">
        <span className="text-neutral-500">근거 {syndrome.evidences.length}개</span>
        <span className="text-primary-500 font-medium">자세히 보기 →</span>
      </div>
    </div>
  );
}
