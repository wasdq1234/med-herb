/**
 * 변증 근거 상세 모달 컴포넌트
 */

import { useEffect, useRef } from 'react';
import type { SyndromeResult } from '@contracts/schemas';

interface EvidenceModalProps {
  syndrome: SyndromeResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EvidenceModal({ syndrome, isOpen, onClose }: EvidenceModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !syndrome) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 id="modal-title" className="text-heading-lg text-neutral-900">
              {syndrome.name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label="닫기"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-body-md text-primary-600 font-semibold mt-1">
            일치도: {syndrome.matchScore}%
          </p>
        </div>

        {/* 본문 */}
        <div className="px-6 py-4">
          <p className="text-body-md text-neutral-600 mb-6">{syndrome.description}</p>

          <h3 className="text-body-lg font-semibold text-neutral-800 mb-3">진단 근거</h3>
          <ul className="space-y-3">
            {syndrome.evidences.map((evidence, index) => (
              <li
                key={index}
                className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-body-sm font-bold">
                  {index + 1}
                </span>
                <span className="text-body-md text-neutral-700">{evidence}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 푸터 */}
        <div className="sticky bottom-0 bg-white border-t border-neutral-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
