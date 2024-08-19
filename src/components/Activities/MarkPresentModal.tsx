import React from "react";

interface MarkPresentModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const MarkPresentModal: React.FC<MarkPresentModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Mark Yourself as Present</h2>
        <p className="mb-4">You are not marked as present. Do you want to mark yourself as present?</p>
        <div className="flex justify-end">
          <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={onCancel}>
            Exit
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={onConfirm}>
            Mark as Present
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkPresentModal;
