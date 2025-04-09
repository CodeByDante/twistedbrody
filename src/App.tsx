import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Camera } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import VideoPage from './pages/VideoPage';
import AddVideoButton from './components/AddVideoButton';
import { useStore } from './lib/store';

function App() {
  const { fetchVideos, fetchCategories } = useStore();

  useEffect(() => {
    fetchVideos();
    fetchCategories();
  }, [fetchVideos, fetchCategories]);

  return (
    <Router>
      <div className="min-h-screen bg-background text-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/video/:id" element={<VideoPage />} />
          </Routes>
        </main>
        <AddVideoButton />
      </div>
    </Router>
  );
}

export default App