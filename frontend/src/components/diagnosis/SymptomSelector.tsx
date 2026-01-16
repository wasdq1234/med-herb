/**
 * 증상 선택 컴포넌트
 */

import { useState, useMemo } from 'react';
import type { Symptom } from '@contracts/schemas';

interface SymptomSelectorProps {
  symptoms: Symptom[];
  selectedIds: string[];
  onSelect: (symptomId: string) => void;
  isLoading?: boolean;
}

export default function SymptomSelector({
  symptoms,
  selectedIds,
  onSelect,
  isLoading = false,
}: SymptomSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // 카테고리별 그룹화
  const groupedSymptoms = useMemo(() => {
    const groups: Record<string, Symptom[]> = {};

    symptoms.forEach((symptom) => {
      const category = symptom.category || '기타';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(symptom);
    });

    return groups;
  }, [symptoms]);

  if (isLoading) {
    return <div className="text-center py-8 text-neutral-500">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedSymptoms).map(([category, categorySymptoms]) => (
        <div key={category}>
          <h3 className="text-body-lg font-semibold text-neutral-700 mb-3">{category}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categorySymptoms.map((symptom) => {
              const isSelected = selectedIds.includes(symptom.id);
              const isHovered = hoveredId === symptom.id;

              return (
                <div
                  key={symptom.id}
                  data-testid={`symptom-${symptom.id}`}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 selected'
                      : 'border-neutral-200 bg-white hover:border-primary-300'
                  }`}
                  onMouseEnter={() => setHoveredId(symptom.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelect(symptom.id)}
                      className="mt-1 h-5 w-5 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                      aria-label={symptom.name}
                      data-testid="symptom-checkbox"
                    />
                    <div className="flex-1">
                      <span className="text-body-md font-medium text-neutral-800">
                        {symptom.name}
                      </span>
                    </div>
                  </label>

                  {/* 설명 툴팁 */}
                  {isHovered && symptom.description && (
                    <div className="absolute left-0 right-0 top-full mt-2 z-10 p-3 bg-neutral-800 text-white text-body-sm rounded-lg shadow-lg">
                      {symptom.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
