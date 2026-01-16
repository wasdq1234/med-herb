/**
 * 약재 테이블 컴포넌트
 */

import type { HerbRecommendation } from '@contracts/schemas';

interface HerbTableProps {
  herbs: HerbRecommendation[];
}

export default function HerbTable({ herbs }: HerbTableProps) {
  if (herbs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-body-md text-neutral-500">추천 약재가 없습니다</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-success-100 text-success-700';
    if (score >= 70) return 'bg-primary-100 text-primary-700';
    return 'bg-neutral-100 text-neutral-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="px-4 py-3 text-left text-body-sm font-semibold text-neutral-700">
              약재명
            </th>
            <th className="px-4 py-3 text-left text-body-sm font-semibold text-neutral-700">
              효능
            </th>
            <th className="px-4 py-3 text-center text-body-sm font-semibold text-neutral-700">
              관련도
            </th>
            <th className="px-4 py-3 text-center text-body-sm font-semibold text-neutral-700">
              근거
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {herbs.map((herb) => (
            <tr key={herb.id} className="hover:bg-neutral-50 transition-colors">
              <td className="px-4 py-4">
                <div>
                  <p className="text-body-md font-semibold text-neutral-900">
                    {herb.name}
                  </p>
                  {herb.scientificName && (
                    <p className="text-body-sm text-neutral-500 italic">
                      {herb.scientificName}
                    </p>
                  )}
                </div>
              </td>
              <td className="px-4 py-4">
                <p className="text-body-md text-neutral-700">{herb.effect}</p>
                {herb.evidence && (
                  <p className="text-body-sm text-neutral-500 mt-1">
                    {herb.evidence}
                  </p>
                )}
              </td>
              <td className="px-4 py-4 text-center">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-body-sm font-bold ${getScoreColor(herb.relevanceScore)}`}
                >
                  {herb.relevanceScore}%
                </span>
              </td>
              <td className="px-4 py-4 text-center">
                {herb.referenceUrl ? (
                  <a
                    href={herb.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:text-primary-600 text-body-sm font-medium underline"
                  >
                    자세히 보기
                  </a>
                ) : (
                  <span className="text-neutral-400 text-body-sm">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
