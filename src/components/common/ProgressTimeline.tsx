import React from 'react';

interface ProgressTimelineProps {
  currentStep: 1 | 2 | 3 | 4 | 5;
  steps: string[];
}

export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ currentStep, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={stepNum} className="flex flex-col items-center flex-1">
              {/* Step circle */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                  transition-all duration-300
                  ${isCurrent ? 'bg-roots-green text-white scale-110' : ''}
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-gray-200 text-gray-600' : ''}
                `}
              >
                {isCompleted ? '✓' : stepNum}
              </div>

              {/* Step label */}
              <div className="text-xs text-center mt-2 max-w-20">
                <p className={`font-medium ${isCurrent ? 'text-roots-green' : ''}`}>
                  {step}
                </p>
              </div>

              {/* Connector line */}
              {stepNum < steps.length && (
                <div
                  className={`
                    absolute w-12 h-1 top-5
                    ${isCompleted || isCurrent ? 'bg-roots-green' : 'bg-gray-300'}
                    transition-all duration-300
                  `}
                  style={{
                    left: `calc(50% + 20px)`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
