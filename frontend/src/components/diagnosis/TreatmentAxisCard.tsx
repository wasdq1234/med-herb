/**
 * 치료축 카드 컴포넌트
 */

import type { TreatmentAxisResult } from '@contracts/schemas';

interface TreatmentAxisCardProps {
  axis: TreatmentAxisResult;
}

export default function TreatmentAxisCard({ axis }: TreatmentAxisCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary-500">
      <h3 className="text-heading-md text-neutral-900 mb-2">{axis.name}</h3>
      {axis.description && (
        <p className="text-body-md text-neutral-600">{axis.description}</p>
      )}
    </div>
  );
}
