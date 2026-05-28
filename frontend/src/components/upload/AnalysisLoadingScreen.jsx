// frontend/src/components/upload/AnalysisLoadingScreen.jsx
// 🎬 Beautiful AI Analysis Loading Screen

import { useEffect, useState } from 'react';
import { FileText, Brain, Target, CheckCircle2, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const AnalysisLoadingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);

  // 🎯 Loading stages
  const steps = [
    {
      icon: FileText,
      title: 'Parsing your resume',
      description: 'Extracting text and structure from your PDF...',
      duration: 2000,
    },
    {
      icon: Brain,
      title: 'AI is analyzing',
      description: 'Comparing your resume with the job description...',
      duration: 4000,
    },
    {
      icon: Target,
      title: 'Calculating scores',
      description: 'Computing match score and ATS compatibility...',
      duration: 3000,
    },
    {
      icon: CheckCircle2,
      title: 'Finalizing results',
      description: 'Almost there, preparing your insights...',
      duration: 2000,
    },
  ];

  // 🎬 Auto-advance through stages
  useEffect(() => {
    if (currentStep >= steps.length - 1) return;

    const timer = setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, steps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-dark-600/90 backdrop-blur-md animate-fade-in">
      <div className="max-w-lg w-full mx-4">
        <div className="glass-card p-8 sm:p-12 text-center relative overflow-hidden">
          {/* 🌌 Animated background */}
          <div className="absolute inset-0 -z-10 opacity-30">
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          {/* ✨ Sparkles header */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3 h-3 animate-pulse" />
            AI Analysis in Progress
          </div>

          {/* 🎨 Main animated icon */}
          <div className="relative inline-flex mb-8">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow-primary animate-pulse">
              {(() => {
                const Icon = steps[currentStep].icon;
                return <Icon className="w-14 h-14 text-white" />;
              })()}
            </div>
            {/* Orbiting ring */}
            <div className="absolute inset-0 rounded-full border-4 border-primary-500/30 border-t-primary-500 animate-spin" style={{ animationDuration: '2s' }} />
          </div>

          {/* 📝 Current step info */}
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 animate-fade-in" key={`title-${currentStep}`}>
            {steps[currentStep].title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 min-h-[3rem] animate-fade-in" key={`desc-${currentStep}`}>
            {steps[currentStep].description}
          </p>

          {/* 📊 Progress steps */}
          <div className="space-y-3">
            {steps.map((step, index) => {
              const isComplete = index < currentStep;
              const isCurrent  = index === currentStep;
              const StepIcon   = step.icon;

              return (
                <div
                  key={index}
                  className={clsx(
                    'flex items-center gap-3 p-3 rounded-xl transition-all',
                    isCurrent  && 'bg-primary-50 dark:bg-primary-500/10 border border-primary-500/30',
                    isComplete && 'opacity-70',
                    !isCurrent && !isComplete && 'opacity-40'
                  )}
                >
                  <div className={clsx(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                    isComplete
                      ? 'bg-green-500'
                      : isCurrent
                        ? 'bg-gradient-to-br from-primary-500 to-secondary-500'
                        : 'bg-slate-200 dark:bg-white/10'
                  )}>
                    {isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <StepIcon className={clsx('w-4 h-4', isCurrent ? 'text-white' : 'text-slate-400')} />
                    )}
                  </div>
                  <span className={clsx(
                    'text-sm font-medium text-left flex-1',
                    isCurrent && 'text-slate-900 dark:text-white',
                    !isCurrent && 'text-slate-600 dark:text-slate-400'
                  )}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ⏱️ Note */}
          <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
            This usually takes 10-30 seconds. Please don't close this window.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisLoadingScreen;