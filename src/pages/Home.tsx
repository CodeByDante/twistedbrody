import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';
import { useStore } from '../lib/store';

export default function Home() {
  const { videos, categories, removeVideo } = useStore();
  const [searchParams] = useSearchParams();
  const selectedHashtag = searchParams.get('hashtag');
  const selectedCategory = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Sin categoría';
  };

  const handleDelete = (videoId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este video?')) {
      removeVideo(videoId);
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesHashtag = !selectedHashtag || video.hashtags.includes(selectedHashtag);
    const matchesCategory = !selectedCategory || video.categoryId === selectedCategory;
    const matchesSearch = !searchQuery || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesHashtag && matchesCategory && matchesSearch;
  });

  const getFilterText = () => {
    if (searchQuery) {
      return `Resultados para "${searchQuery}"`;
    }
    if (selectedHashtag) {
      return `Videos con ${selectedHashtag}`;
    }
    if (selectedCategory) {
      const categoryName = getCategoryName(selectedCategory);
      return `Videos en ${categoryName}`;
    }
    return 'Todos los Videos';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">{getFilterText()}</h1>
        {(selectedHashtag || selectedCategory || searchQuery) && (
          <Link
            to="/"
            className="text-primary hover:text-primary/80 text-sm flex items-center gap-1"
          >
            Limpiar filtros
          </Link>
        )}
      </div>

      {filteredVideos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No se encontraron videos</p>
          {(selectedHashtag || selectedCategory || searchQuery) && (
            <Link to="/" className="text-primary hover:underline mt-4 inline-block">
              Ver todos los videos
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <div key={video.id} className="bg-surface rounded-lg overflow-hidden">
              <Link to={`/video/${video.id}`}>
                <div className="aspect-video bg-surface-light">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Vista previa
                  </div>
                </div>
              </Link>
              
              <div className="p-4 space-y-3">
                <Link to={`/video/${video.id}`}>
                  <h2 className="text-xl font-semibold hover:text-primary truncate">
                    {video.title}
                  </h2>
                </Link>
                
                {video.description && (
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {video.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {video.hashtags.map(tag => (
                    <Link
                      key={tag}
                      to={`/?hashtag=${encodeURIComponent(tag)}`}
                      className={`text-sm px-2 py-1 rounded-full transition-colors ${
                        tag === selectedHashtag
                          ? 'bg-primary text-white'
                          : 'text-primary hover:bg-primary/10'
                      }`}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <Link
                    to={`/?category=${video.categoryId}`}
                    className={`text-sm ${
                      video.categoryId === selectedCategory
                        ? 'text-primary'
                        : 'text-gray-400 hover:text-primary'
                    }`}
                  >
                    {getCategoryName(video.categoryId)}
                  </Link>
                  
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/video/${video.id}/edit`}
                      className="p-1 hover:text-primary"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="p-1 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}