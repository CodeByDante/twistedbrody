import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Auth from './components/Auth';
import VideoForm from './components/VideoForm';
import VideoGrid from './components/VideoGrid';
import { Video, Plus, X } from 'lucide-react';

function App() {
  const [user] = useAuthState(auth);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);

  return (
    <div className="min-h-screen bg-[#121212]">
      <header className="bg-[#1e1e1e] shadow-lg border-b border-[#bb86fc]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Video className="h-8 w-8 text-[#bb86fc]" />
              <h1 className="ml-2 text-2xl font-bold text-white">TwistedBrody Video</h1>
            </div>
            <Auth />
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {user && (
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingVideo(null);
            }}
            className="fixed right-4 bottom-4 z-50 flex items-center px-4 py-2 bg-[#bb86fc] text-[#121212] rounded-full shadow-lg hover:bg-[#bb86fc]/90 transition-all duration-300 font-medium"
          >
            {showForm ? (
              <>
                <X className="h-5 w-5 mr-2" />
                Cerrar
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Publicar Video
              </>
            )}
          </button>
        )}
        
        {user && showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center backdrop-blur-sm">
            <div className="w-full max-w-2xl m-4">
              <VideoForm 
                onClose={() => {
                  setShowForm(false);
                  setEditingVideo(null);
                }}
                editingVideo={editingVideo}
              />
            </div>
          </div>
        )}
        <VideoGrid 
          onEdit={(video) => {
            setEditingVideo(video);
            setShowForm(true);
          }}
        />
      </main>
    </div>
  );
}

export default App;