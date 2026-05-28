// frontend/src/components/analysis/ATSDetailsTab.jsx
// 🎯 ATS Details tab - section scores + checklist

import Card from '@components/ui/Card';
import ProgressBar from '@components/ui/ProgressBar';
import Badge from '@components/ui/Badge';
import { CheckCircle2, XCircle, Target, BarChart3 } from 'lucide-react';
import clsx from 'clsx';

const ATSDetailsTab = ({ analysis }) => {
  const sectionScores = analysis.analysis?.sectionScores || {};
  const atsFeedback   = analysis.analysis?.atsFeedback   || {};

  // 📊 Section labels (pretty names)
  const sectionLabels = {
    contact:        'Contact Info',
    summary:        'Professional Summary',
    experience:     'Work Experience',
    education:      'Education',
    skills:         'Skills',
    projects:       'Projects',
    certifications: 'Certifications',
    formatting:     'Formatting & Layout',
  };

  // ✅ ATS checklist items
  const checklistItems = [
    { key: 'hasContactInfo',    label: 'Contact information present'     },
    { key: 'hasWorkExperience', label: 'Work experience section'         },
    { key: 'hasEducation',      label: 'Education section'               },
    { key: 'hasSkills',         label: 'Skills section'                  },
    { key: 'hasSummary',        label: 'Professional summary'            },
    { key: 'properFormatting',  label: 'Proper ATS-friendly formatting'  },
  ];

  // 🎨 Get color for score
  const getProgressVariant = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'primary';
    if (score >= 40) return 'warning';
    return 'error';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 📊 Section Scores */}
      <Card variant="glass">
        <Card.Header>
          <Card.Title>
            <span className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-500" />
              Section Scores
            </span>
          </Card.Title>
          <Card.Description>How each section of your resume scored</Card.Description>
        </Card.Header>

        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(sectionLabels).map(([key, label]) => {
            const score = sectionScores[key] || 0;
            return (
              <div key={key}>
                <ProgressBar
                  value={score}
                  label={label}
                  showLabel
                  variant={getProgressVariant(score)}
                  size="md"
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* ✅ ATS Checklist */}
      <Card variant="glass">
        <Card.Header>
          <Card.Title>
            <span className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-500" />
              ATS Compatibility Checklist
            </span>
          </Card.Title>
          <Card.Description>Critical items for ATS systems</Card.Description>
        </Card.Header>

        <div className="grid sm:grid-cols-2 gap-3">
          {checklistItems.map((item) => {
            const passed = atsFeedback[item.key];
            return (
              <div
                key={item.key}
                className={clsx(
                  'flex items-center gap-3 p-3 rounded-lg border',
                  passed
                    ? 'bg-green-50 dark:bg-green-500/5 border-green-200 dark:border-green-500/20'
                    : 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20'
                )}
              >
                {passed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                )}
                <span className={clsx(
                  'text-sm',
                  passed
                    ? 'text-green-900 dark:text-green-300'
                    : 'text-red-900 dark:text-red-300'
                )}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 📈 Additional metrics */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card variant="glass">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
            Keyword Density
          </h3>
          <ProgressBar
            value={atsFeedback.keywordDensity || 0}
            showLabel
            variant={getProgressVariant(atsFeedback.keywordDensity || 0)}
            size="lg"
          />
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            How well your resume uses keywords from the job description
          </p>
        </Card>

        <Card variant="glass">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
            Readability Score
          </h3>
          <ProgressBar
            value={atsFeedback.readabilityScore || 0}
            showLabel
            variant={getProgressVariant(atsFeedback.readabilityScore || 0)}
            size="lg"
          />
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            How easy your resume is for ATS systems to parse
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ATSDetailsTab;