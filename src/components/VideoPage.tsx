import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useVideoStore } from '../store/videoStore';

const VideoPage = () => {
  const { id } = useParams();
  const { videos } = useVideoStore();
  const video = videos.find(v => v.id === id);
  
  const relatedVideos = videos
    .filter(v => v.id !== id && (
      v.category === video?.category ||
      v.hashtags.some(tag => video?.hashtags.includes(tag))
    ))
    .slice(0, 4);

  if (!video) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Video no encontrado</h2>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-surface rounded-lg overflow-hidden">
        <div className="aspect-video">
          <iframe
            src={video.url}
            className="w-full h-full"
            allowFullScreen
            title={video.title}
          />
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
          {video.description && (
            <p className="text-gray-400 mb-4">{video.description}</p>
          )}
          <div className="flex flex-wrap gap-2 mb-4">
            {video.hashtags.map(tag => (
              <Link
                key={tag}
                to={`/?tag=${tag}`}
                className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full hover:bg-primary/30"
              >
                #{tag}
              </Link>
            ))}
          </div>
          {video.category && (
            <div className="text-sm text-gray-400">
              Categoría: {video.category}
            </div>
          )}
        </div>
      </div>

      {relatedVideos.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Videos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedVideos.map(relatedVideo => (
              <Link
                key={relatedVideo.id}
                to={`/video/${relatedVideo.id}`}
                className="bg-surface rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
              >
                <div className="aspect-video bg-black">
                  {relatedVideo.thumbnailUrl ? (
                    <img
                      src={relatedVideo.thumbnailUrl}
                      alt={relatedVideo.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-light">
                      <span className="text-gray-400">Sin miniatura</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2">{relatedVideo.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPage