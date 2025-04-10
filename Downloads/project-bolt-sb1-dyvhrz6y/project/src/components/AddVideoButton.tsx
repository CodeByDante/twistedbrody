import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import VideoForm from './VideoForm';

export default function AddVideoButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 rounded-full bg-primary p-4 shadow-lg hover:bg-primary/90 transition-colors"
      >
        <Plus className="h-6 w-6" />
      </button>

      {isOpen && <VideoForm onClose={() => setIsOpen(false)} />}
    </>
  );
}