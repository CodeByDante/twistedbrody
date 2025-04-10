import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Tag } from 'lucide-react';
import { useStore } from '../lib/store';
import type { Video, VideoProvider } from '../types';

function VideoPlayer({ url }: { url: string }) {
  const getVideoEmbedUrl = (url: string): { provider: VideoProvider; embedUrl: string } | null => {
    try {
      const urlObj = new URL(url);
      
      // YouTube
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        let videoId = '';
        if (urlObj.hostname.includes('youtu.be')) {
          videoId = urlObj.pathname.slice(1);
        } else if (urlObj.searchParams.has('v')) {
          videoId = urlObj.searchParams.get('v') || '';
        } else {
          videoId = urlObj.pathname.split('/').pop() || '';
        }
        if (videoId) {
          return {
            provider: 'youtube',
            embedUrl: `https://www.youtube.com/embed/${videoId}`
          };
        }
      }

      // Vimeo
      if (urlObj.hostname.includes('vimeo.com')) {
        const videoId = urlObj.pathname.split('/').pop();
        if (videoId) {
          return {
            provider: 'vimeo',
            embedUrl: `https://player.vimeo.com/video/${videoId}`
          };
        }
      }

      // XVideos
      if (urlObj.hostname.includes('xvideos.com')) {
        const match = url.match(/video(\d+)/);
        if (match) {
          return {
            provider: 'xvideos',
            embedUrl: `https://www.xvideos.com/embedframe/${match[1]}`
          };
        }
      }

      // PornHub
      if (urlObj.hostname.includes('pornhub.com')) {
        const viewkey = urlObj.searchParams.get('viewkey');
        if (viewkey) {
          return {
            provider: 'pornhub',
            embedUrl: `https://www.pornhub.com/embed/${viewkey}`
          };
        }
      }

      // Google Drive
      if (urlObj.hostname.includes('drive.google.com')) {
        const match = url.match(/\/d\/([^/]+)/);
        if (match) {
          return {
            provider: 'gdrive',
            embedUrl: `https://drive.google.com/file/d/${match[1]}/preview`
          };
        }
      }

      // Dropbox
      if (urlObj.hostname.includes('dropbox.com')) {
        return {
          provider: 'dropbox',
          embedUrl: url.replace('?dl=0', '?raw=1')
        };
      }

      // TeraBox
      if (urlObj.hostname.includes('terabox.com')) {
        return {
          provider: 'terabox',
          embedUrl: ''
        };
      }

      // Telegram
      if (urlObj.hostname.includes('t.me')) {
        const parts = urlObj.pathname.split('/').filter(Boolean);
        if (parts.length >= 2) {
          return {
            provider: 'telegram',
            embedUrl: `https://t.me/${parts[0]}/${parts[1]}`
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error parsing video URL:', error);
      return null;
    }
  };

  const videoData = getVideoEmbedUrl(url);
  console.log('Video data:', { url, videoData });

  if (!videoData) {
    return (
      <div className="aspect-video bg-surface-light rounded-lg flex items-center justify-center">
        <p className="text-gray-400">URL de video no soportada</p>
      </div>
    );
  }

  if (videoData.provider === 'terabox') {
    return (
      <div className="aspect-video bg-surface-light rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Los videos de TeraBox no se pueden incrustar directamente</p>
      </div>
    );
  }

  if (videoData.provider === 'telegram') {
    return (
      <a
        href={videoData.embedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="aspect-video bg-surface-light rounded-lg flex flex-col items-center justify-center gap-4 hover:bg-surface-light/80 transition-colors"
      >
        <img
          src="https://telegram.org/img/t_logo.svg"
          alt="Telegram"
          className="w-24 h-24"
        />
        <p className="text-gray-400">Haz clic para abrir en Telegram</p>
      </a>
    );
  }

  if (videoData.provider === 'dropbox') {
    return (
      <video
        src={videoData.embedUrl}
        controls
        className="w-full h-full rounded-lg"
      >
        <p className="text-gray-400">Tu navegador no soporta la reproducción de video</p>
      </video>
    );
  }

  return (
    <div className="aspect-video">
      <iframe
        src={videoData.embedUrl}
        className="w-full h-full rounded-lg"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        sandbox={videoData.provider === 'youtube' ? 'allow-same-origin allow-scripts' : undefined}
      />
    </div>
  );
}

function RelatedVideos({ currentVideoId, categoryId }: { currentVideoId: string; categoryId: string }) {
  const { videos } = useStore();
  
  const relatedVideos = videos
    .filter(video => video.id !== currentVideoId)
    .filter(video => video.categoryId === categoryId || !categoryId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  if (relatedVideos.length === 0) {
    return (
      <p className="text-gray-400 text-center py-8">No se encontraron videos relacionados</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {relatedVideos.map(video => (
        <Link
          key={video.id}
          to={`/video/${video.id}`}
          className="bg-surface rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
        >
          <div className="aspect-video bg-surface-light">
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Vista previa
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg line-clamp-2">{video.title}</h3>
            {video.description && (
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                {video.description}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function VideoPage() {
  const { id } = useParams<{ id: string }>();
  const { videos, categories } = useStore();
  const video = videos.find(v => v.id === id);

  if (!video) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-400">Video no encontrado</h2>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const category = categories.find(c => c.id === video.categoryId);

  return (
    <div className="space-y-8">
      <div className="bg-surface rounded-lg overflow-hidden">
        <VideoPlayer url={video.url} />
        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-bold">{video.title}</h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(video.createdAt).toLocaleDateString()}</span>
            </div>
            {category && (
              <Link
                to={`/?category=${category.id}`}
                className="flex items-center gap-1 hover:text-primary"
              >
                <Tag className="h-4 w-4" />
                <span>{category.name}</span>
              </Link>
            )}
          </div>

          {video.description && (
            <p className="text-gray-300 whitespace-pre-wrap">{video.description}</p>
          )}

          {video.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {video.hashtags.map(tag => (
                <Link
                  key={tag}
                  to={`/?hashtag=${encodeURIComponent(tag)}`}
                  className="text-primary hover:text-primary/80 text-sm"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Videos Relacionados</h2>
        <RelatedVideos currentVideoId={video.id} categoryId={video.categoryId} />
      </div>
    </div>
  );
}