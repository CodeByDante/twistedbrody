import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link to={`/video/${video.id}`} className="bg-[#1a1a1a] rounded-lg overflow-hidden shadow-lg hover:transform hover:scale-105 transition-transform duration-200">
      <div className="aspect-video relative">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#2a2a2a] flex items-center justify-center">
            <span className="text-gray-500">Sin miniatura</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate">{video.title}</h3>
        {video.description && (
          <p className="text-gray-400 text-sm mt-2 line-clamp-2">{video.description}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {video.hashtags.map((tag) => (
            <span
              key={tag}
              className="bg-[#bb86fc] bg-opacity-20 text-[#bb86fc] px-2 py-1 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="mt-3 text-xs text-gray-400">
          {format(video.createdAt.toDate(), "d 'de' MMMM, yyyy", { locale: es })}
        </div>
      </div>
    </Link>
  );
}