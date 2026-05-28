// frontend/src/pages/AnalysisResults.jsx
// 📈 Main Analysis Results Page

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { analysisAPI } from '@services/api';

import Spinner from '@components/ui/Spinner';
import EmptyState from '@components/ui/EmptyState';
import Button from '@components/ui/Button';
import { FileX, ArrowLeft } from 'lucide-react';

import AnalysisHeader from '@components/analysis/AnalysisHeader';
import ScoreHero from '@components/analysis/ScoreHero';
import TabsNavigation from '@components/analysis/TabsNavigation';
import OverviewTab from '@components/analysis/OverviewTab';
import ATSDetailsTab from '@components/analysis/ATSDetailsTab';
import SkillsTab from '@components/analysis/SkillsTab';
import ImprovementsTab from '@components/analysis/ImprovementsTab';
import DeleteConfirmModal from '@components/analysis/DeleteConfirmModal';

const AnalysisResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [activeTab, setActiveTab]     = useState('overview');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting]       = useState(false);

  // 📥 Fetch analysis
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const { data } = await analysisAPI.getById(id);
        setAnalysis(data.data.analysis);
      } catch (err) {
        console.error('Failed to fetch analysis:', err);
        setError(err.response?.data?.message || 'Failed to load analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  // 🗑️ Delete handler
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await analysisAPI.delete(id);
      toast.success('Analysis deleted successfully');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete analysis';
      toast.error(message);
      setDeleting(false);
    }
  };

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="xl" label="Loading analysis..." />
      </div>
    );
  }

  // ❌ Error state
  if (error || !analysis) {
    return (
      <div className="max-w-2xl mx-auto">
        <EmptyState
          icon={FileX}
          title="Analysis not found"
          description={error || "We couldn't find this analysis. It may have been deleted."}
          action={
            <Button
              variant="primary"
              icon={ArrowLeft}
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          }
        />
      </div>
    );
  }

  // 🎯 Render tab content
  const renderTab = () => {
    switch (activeTab) {
      case 'overview':     return <OverviewTab     analysis={analysis} />;
      case 'ats':          return <ATSDetailsTab   analysis={analysis} />;
      case 'skills':       return <SkillsTab       analysis={analysis} />;
      case 'improvements': return <ImprovementsTab analysis={analysis} />;
      default:             return <OverviewTab     analysis={analysis} />;
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto animate-fade-in">
        {/* 📌 Header */}
        <AnalysisHeader
          analysis={analysis}
          onDelete={() => setDeleteModalOpen(true)}
        />

        {/* 🎯 Score Hero */}
        <ScoreHero analysis={analysis} />

        {/* 📑 Tabs */}
        <TabsNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* 📄 Tab Content */}
        {renderTab()}
      </div>

      {/* 🗑️ Delete Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
};

export default AnalysisResults;