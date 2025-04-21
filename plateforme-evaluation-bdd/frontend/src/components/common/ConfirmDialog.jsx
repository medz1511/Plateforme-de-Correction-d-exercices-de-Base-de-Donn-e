// src/components/common/ConfirmDialog.jsx
import React from 'react';
import { X } from 'lucide-react';

export default function ConfirmDialog({ open, title, message, onCancel, onConfirm, darkMode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold dark:text-gray-100">{title}</h3>
          <button onClick={onCancel}><X className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" /></button>
        </div>
        <p className="mb-6 text-gray-700 dark:text-gray-300">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
          >
            Oui, corriger
          </button>
        </div>
      </div>
    </div>
  );
}
