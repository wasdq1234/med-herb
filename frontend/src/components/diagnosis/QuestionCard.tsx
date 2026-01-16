/**
 * 질문 카드 컴포넌트
 */

import { useState, useEffect } from 'react';
import type { Question, Answer } from '@contracts/schemas';

interface QuestionCardProps {
  question: Question;
  answer?: Answer;
  onChange: (answer: Answer) => void;
}

export default function QuestionCard({ question, answer, onChange }: QuestionCardProps) {
  const [sliderValue, setSliderValue] = useState<number>(
    typeof answer?.value === 'number' ? answer.value : question.sliderMin ?? 5
  );

  useEffect(() => {
    if (typeof answer?.value === 'number') {
      setSliderValue(answer.value);
    }
  }, [answer]);

  const handleRadioChange = (value: string) => {
    onChange({ questionId: question.id, value });
  };

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    onChange({ questionId: question.id, value });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-heading-md text-neutral-900 mb-6">{question.questionText}</h3>

      {question.questionType === 'radio' && question.options && (
        <div className="space-y-3">
          {question.options.map((option) => (
            <label
              key={option.value}
              data-testid="radio-option"
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                answer?.value === option.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-primary-300'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.value}
                checked={answer?.value === option.value}
                onChange={() => handleRadioChange(option.value)}
                className="h-5 w-5 border-neutral-300 text-primary-500 focus:ring-primary-500"
                aria-label={option.label}
              />
              <span className="text-body-md text-neutral-700">{option.label}</span>
            </label>
          ))}
        </div>
      )}

      {question.questionType === 'slider' && (
        <div className="space-y-4">
          <div className="flex justify-between text-body-sm text-neutral-500">
            <span>{question.sliderMin}</span>
            <span data-testid="slider-value" className="text-heading-md text-primary-600 font-bold">
              {sliderValue}
            </span>
            <span>{question.sliderMax}</span>
          </div>
          <input
            type="range"
            role="slider"
            min={question.sliderMin ?? 1}
            max={question.sliderMax ?? 10}
            value={sliderValue}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-full h-3 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
          <div className="flex justify-between text-body-sm text-neutral-400">
            <span>낮음</span>
            <span>높음</span>
          </div>
        </div>
      )}
    </div>
  );
}
