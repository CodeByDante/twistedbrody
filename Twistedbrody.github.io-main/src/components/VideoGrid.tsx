import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Video } from '../types';
import { Hash, Folder, ChevronDown, ChevronUp, Edit2, Trash2, Search } from 'lucide-react';

interface VideoGridProps {
  onEdit: (video: Video) => void;
}

const VideoGrid: React.FC<VideoGridProps> = ({ onEdit }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [allHashtags, setAllHashtags] = useState<Set<string>>(new Set());
  const [allCategories, setAllCategories] = useState<Set<string>>(new Set());
  const [showHashtags, setShowHashtags] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videoData: Video[] = [];
      const hashtags = new Set<string>();
      const categories = new Set<string>();

      snapshot.forEach((doc) => {
        const video = { id: doc.id, ...doc.data() } as Video;
        videoData.push(video);
        video.hashtags.forEach(tag => hashtags.add(tag));
        if (video.category) categories.add(video.category);
      });

      setVideos(videoData);
      setAllHashtags(hashtags);
      setAllCategories(categories);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (videoId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este video?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'videos', videoId));
    } catch (error) {
      console.error('Error al eliminar video:', error);
      alert('Error al eliminar el video');
    }
  };

  const getVideoUrl = (url: string) => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtube.com') ? 
        url.split('v=')[1]?.split('&')[0] :
        url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }

    // Direct video links
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
      return url;
    }

    // For other platforms, show a link
    return null;
  };

  const filteredVideos = videos.filter(video => {
    const matchesHashtag = !selectedHashtag || video.hashtags.includes(selectedHashtag);
    const matchesCategory = !selectedCategory || video.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesHashtag && matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      'entretenimiento': 'Entretenimiento',
      'educacion': 'Educación',
      'musica': 'Música',
      'gaming': 'Gaming',
    };
    return categories[category] || category;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-[#1e1e1e] text-white rounded-lg border border-[#bb86fc]/20 focus:border-[#bb86fc] focus:ring focus:ring-[#bb86fc]/50"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#bb86fc]" />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-auto">
            <button
              onClick={() => setShowHashtags(!showHashtags)}
              className="w-full md:w-auto flex items-center justify-between px-4 py-2 bg-[#1e1e1e] text-white rounded-lg hover:bg-[#1e1e1e]/80 border border-[#bb86fc]/20"
            >
              <span className="flex items-center">
                <Hash className="h-5 w-5 mr-2 text-[#bb86fc]" />
                Hashtags
              </span>
              {showHashtags ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {showHashtags && (
              <div className="mt-2 p-4 bg-[#1e1e1e] rounded-lg border border-[#bb86fc]/20">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedHashtag(null)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      !selectedHashtag ? 'bg-[#bb86fc] text-[#121212]' : 'bg-[#121212] text-gray-200 hover:bg-[#bb86fc]/20'
                    }`}
                  >
                    Todos
                  </button>
                  {Array.from(allHashtags).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedHashtag(tag)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedHashtag === tag ? 'bg-[#bb86fc] text-[#121212]' : 'bg-[#121212] text-gray-200 hover:bg-[#bb86fc]/20'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-full md:w-auto">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="w-full md:w-auto flex items-center justify-between px-4 py-2 bg-[#1e1e1e] text-white rounded-lg hover:bg-[#1e1e1e]/80 border border-[#bb86fc]/20"
            >
              <span className="flex items-center">
                <Folder className="h-5 w-5 mr-2 text-[#bb86fc]" />
                Categorías
              </span>
              {showCategories ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {showCategories && (
              <div className="mt-2 p-4 bg-[#1e1e1e] rounded-lg border border-[#bb86fc]/20">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      !selectedCategory ? 'bg-[#bb86fc] text-[#121212]' : 'bg-[#121212] text-gray-200 hover:bg-[#bb86fc]/20'
                    }`}
                  >
                    Todas
                  </button>
                  {Array.from(allCategories).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedCategory === category ? 'bg-[#bb86fc] text-[#121212]' : 'bg-[#121212] text-gray-200 hover:bg-[#bb86fc]/20'
                      }`}
                    >
                      {getCategoryLabel(category)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-[#1e1e1e] rounded-lg shadow-xl overflow-hidden transform transition duration-300 hover:scale-105 border border-[#bb86fc]/20"
          >
            <div className="aspect-w-16 aspect-h-9">
              {getVideoUrl(video.url) ? (
                <iframe
                  src={getVideoUrl(video.url)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#121212]">
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#bb86fc] hover:underline"
                  >
                    Ver video en sitio original
                  </a>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-white flex-1">{video.title}</h3>
                {auth.currentUser?.email === video.publisher && (
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => onEdit(video)}
                      className="p-1 text-[#bb86fc] hover:bg-[#bb86fc]/20 rounded"
                      title="Editar"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => video.id && handleDelete(video.id)}
                      className="p-1 text-red-500 hover:bg-red-500/20 rounded"
                      title="Eliminar"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-300 text-sm mb-2">{video.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {video.hashtags.map((tag) => (
                  <span
                    key={tag}
                    onClick={() => setSelectedHashtag(tag)}
                    className="text-sm bg-[#121212] text-[#bb86fc] px-2 py-1 rounded-full cursor-pointer hover:bg-[#bb86fc]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {video.category && (
                <span className="text-sm bg-[#bb86fc]/20 text-[#bb86fc] px-2 py-1 rounded-full">
                  {getCategoryLabel(video.category)}
                </span>
              )}
              <p className="text-gray-400 text-sm mt-2">
                Publicado por {video.publisher}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;