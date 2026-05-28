// frontend/src/components/analysis/DeleteConfirmModal.jsx
// 🗑️ Delete confirmation modal

import Modal from '@components/ui/Modal';
import Button from '@components/ui/Button';
import { AlertTriangle, Trash2 } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, loading = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose={!loading}>
      <div className="text-center">
        {/* ⚠️ Warning icon */}
        <div className="inline-flex w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        {/* 📝 Title */}
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Delete this analysis?
        </h2>

        {/* 💬 Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          This action cannot be undone. The analysis will be permanently deleted from your account.
        </p>

        {/* 🎯 Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={onConfirm}
            loading={loading}
            icon={Trash2}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;