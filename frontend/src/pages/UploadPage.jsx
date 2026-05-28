// frontend/src/pages/UploadPage.jsx
// 📤 Main Upload Page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Briefcase, Building2, FileText, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { analysisAPI } from '@services/api';
import { useAuth } from '@context/AuthContext';

import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import TextArea from '@components/ui/TextArea';
import Badge from '@components/ui/Badge';

import FileDropZone from '@components/upload/FileDropZone';
import FilePreview from '@components/upload/FilePreview';
import AnalysisLoadingScreen from '@components/upload/AnalysisLoadingScreen';
import UploadTips from '@components/upload/UploadTips';

const UploadPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  // 📝 Form state
  const [file, setFile]                     = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle]             = useState('');
  const [company, setCompany]               = useState('');
  const [errors, setErrors]                 = useState({});
  const [loading, setLoading]               = useState(false);

  // 🚦 Check user's remaining analyses
  const canAnalyze = user?.canAnalyze;
  const remaining  = typeof canAnalyze?.remaining === 'number'
    ? canAnalyze.remaining
    : 'Unlimited';

  // ✅ Validate form
  const validate = () => {
    const newErrors = {};

    if (!file) {
      newErrors.file = 'Please upload your resume';
    }

    if (!jobDescription.trim()) {
      newErrors.jobDescription = 'Job description is required';
    } else if (jobDescription.trim().length < 50) {
      newErrors.jobDescription = 'Job description must be at least 50 characters';
    } else if (jobDescription.length > 10000) {
      newErrors.jobDescription = 'Job description is too long (max 10,000 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🚀 Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors below');
      return;
    }

    // 🚦 Check limit
    if (canAnalyze && !canAnalyze.allowed) {
      toast.error('Monthly analysis limit reached. Upgrade to Pro for unlimited.');
      return;
    }

    setLoading(true);

    // 📦 Build form data
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription.trim());
    if (jobTitle.trim()) formData.append('jobTitle', jobTitle.trim());
    if (company.trim())  formData.append('company', company.trim());

    try {
      const { data } = await analysisAPI.analyze(formData);

      toast.success('Analysis complete! 🎉');

      // 🔄 Refresh user (updated analysis count)
      refreshUser();

      // 🎯 Navigate to results page
      navigate(`/analysis/${data.data.analysisId}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Analysis failed. Please try again.';

      // 🎯 Show friendlier errors for common issues
      if (message.includes('selectable text') || message.includes('scanned')) {
        toast.error(
          'This PDF appears to be scanned. Please use a text-based PDF (e.g., exported from Word or Google Docs).',
          { duration: 6000 }
        );
      } else if (message.includes('limit')) {
        toast.error(message, { duration: 5000 });
      } else if (message.includes('Password')) {
        toast.error('Password-protected PDFs are not supported. Please remove the password and try again.', {
          duration: 6000,
        });
      } else if (message.includes('Invalid PDF')) {
        toast.error('This file is not a valid PDF. Please upload a proper PDF file.', {
          duration: 5000,
        });
      } else if (message.includes('AI') || message.includes('Gemini')) {
        toast.error('AI service is temporarily unavailable. Please try again in a moment.', {
          duration: 5000,
        });
      } else {
        toast.error(message);
      }

      setLoading(false);
    }
  };

  // 🚫 Show limit-reached banner
  const limitReached = canAnalyze && !canAnalyze.allowed;

  return (
    <>
      {/* 🎬 Loading overlay during AI analysis */}
      {loading && <AnalysisLoadingScreen />}

      <div className="max-w-6xl mx-auto animate-fade-in">
        {/* 📌 Header */}
        <div className="mb-8">
          <Badge variant="primary" icon={Sparkles} className="mb-3">
            AI-Powered Analysis
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            New Resume Analysis
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Upload your resume and paste the job description to get instant AI insights.
          </p>
        </div>

        {/* 🚫 Limit warning */}
        {limitReached && (
          <Card variant="glass" className="mb-6 !bg-red-50 dark:!bg-red-500/10 border-red-200 dark:border-red-500/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 dark:text-red-300 mb-1">
                  Monthly limit reached
                </h3>
                <p className="text-sm text-red-700 dark:text-red-200 mb-3">
                  You've used all 5 analyses this month on your {user?.plan} plan. Upgrade to Pro for unlimited analyses.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/pricing')}
                >
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* 📊 Quota info bar */}
        {!limitReached && (
          <div className="mb-6 flex items-center justify-between p-4 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary-500" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                You have <strong className="text-primary-600 dark:text-primary-400">{remaining}</strong> {typeof remaining === 'number' ? 'analyses' : ''} remaining this month
              </span>
            </div>
            <Badge variant="primary">{user?.plan?.toUpperCase()}</Badge>
          </div>
        )}

        {/* 📋 Main Form Grid */}
        <div className="grid xl:grid-cols-3 gap-6">
          {/* 📝 Left: Form (2 columns on XL screens) */}
          <div className="xl:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 📤 Step 1: Upload */}
              <Card variant="glass">
                <Card.Header>
                  <Card.Title>
                    <span className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-bold">
                        1
                      </span>
                      Upload Resume
                    </span>
                  </Card.Title>
                  <Card.Description>PDF file, max 5MB</Card.Description>
                </Card.Header>

                {file ? (
                  <FilePreview
                    file={file}
                    onRemove={() => setFile(null)}
                    disabled={loading}
                  />
                ) : (
                  <FileDropZone
                    onFileSelect={(f) => {
                      setFile(f);
                      if (errors.file) setErrors(prev => ({ ...prev, file: '' }));
                    }}
                    disabled={loading}
                  />
                )}

                {errors.file && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.file}
                  </p>
                )}
              </Card>

              {/* 📝 Step 2: Job Description */}
              <Card variant="glass">
                <Card.Header>
                  <Card.Title>
                    <span className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-bold">
                        2
                      </span>
                      Job Description
                    </span>
                  </Card.Title>
                  <Card.Description>Paste the full job posting for accurate analysis</Card.Description>
                </Card.Header>

                <TextArea
                  placeholder="Paste the complete job description here, including responsibilities, requirements, and qualifications..."
                  value={jobDescription}
                  onChange={(e) => {
                    setJobDescription(e.target.value);
                    if (errors.jobDescription) setErrors(prev => ({ ...prev, jobDescription: '' }));
                  }}
                  error={errors.jobDescription}
                  rows={10}
                  maxLength={10000}
                  showCount
                  disabled={loading}
                />
              </Card>

              {/* 🏷️ Step 3: Optional Details */}
              <Card variant="glass">
                <Card.Header>
                  <Card.Title>
                    <span className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-bold">
                        3
                      </span>
                      Additional Details
                    </span>
                  </Card.Title>
                  <Card.Description>Optional - helps organize your analyses</Card.Description>
                </Card.Header>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Job Title"
                    placeholder="e.g., Senior Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    icon={Briefcase}
                    disabled={loading}
                  />
                  <Input
                    label="Company"
                    placeholder="e.g., Google"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    icon={Building2}
                    disabled={loading}
                  />
                </div>
              </Card>

              {/* 🚀 Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  icon={Sparkles}
                  disabled={limitReached}
                >
                  {loading ? 'Analyzing...' : 'Run AI Analysis'}
                </Button>
              </div>
            </form>
          </div>

          {/* 💡 Right: Tips (1 column on XL, full width below on smaller) */}
          <div className="xl:col-span-1">
            <div className="xl:sticky xl:top-6 space-y-6">
              <UploadTips />

              {/* 📊 Quick info card */}
              <Card variant="gradient">
                <div className="text-center">
                  <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 items-center justify-center mb-3">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                    What you'll get
                  </h3>
                  <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2 text-left">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500 mt-0.5">✓</span>
                      <span>Overall match score (0-100)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500 mt-0.5">✓</span>
                      <span>ATS compatibility rating</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500 mt-0.5">✓</span>
                      <span>Matched & missing skills</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500 mt-0.5">✓</span>
                      <span>Detailed improvements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500 mt-0.5">✓</span>
                      <span>Job role recommendations</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPage;