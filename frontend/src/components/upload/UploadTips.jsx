// frontend/src/components/upload/UploadTips.jsx
// 💡 Tips sidebar for better analysis

import Card from '@components/ui/Card';
import { Lightbulb, FileText, Target, Zap } from 'lucide-react';

const UploadTips = () => {
  const tips = [
    {
      icon: FileText,
      title: 'Use a clean PDF',
      description: 'Avoid scanned images. Make sure text is selectable.',
    },
    {
      icon: Target,
      title: 'Tailor to the job',
      description: 'Paste the EXACT job description for the best match analysis.',
    },
    {
      icon: Zap,
      title: 'Include keywords',
      description: 'Use industry-specific terms from the job posting.',
    },
  ];

  return (
    <Card variant="glass">
      <Card.Header>
        <Card.Title>
          <span className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Pro Tips
          </span>
        </Card.Title>
        <Card.Description>Get the most accurate analysis</Card.Description>
      </Card.Header>

      <div className="space-y-4">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div key={index} className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                  {tip.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {tip.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🎯 Example placeholder */}
      <Card.Footer>
        <div className="bg-primary-50 dark:bg-primary-500/10 rounded-lg p-3 border border-primary-200 dark:border-primary-500/20">
          <p className="text-xs text-primary-700 dark:text-primary-300">
            💡 <strong>Did you know?</strong> Customizing your resume for each application can increase your chances by up to 40%.
          </p>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default UploadTips;