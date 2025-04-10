import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Plus } from 'lucide-react';
import { useStore } from '../lib/store';
import type { Video } from '../types';

export default function EditVideoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { videos, categories, updateVideo, addCategory } = useStore();
  const video = videos.find(v => v.id === id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setDescription(video.description || '');
      setUrl(video.url);
      setHashtags(video.hashtags);
      setCategoryId(video.categoryId);
    }
  }, [video]);

  if (!video) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-400">Video no encontrado</h2>
        <button
          onClick={() => navigate('/')}
          className="text-primary hover:underline mt-4 inline-block"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const handleHashtagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && hashtagInput.trim()) {
      e.preventDefault();
      const tag = hashtagInput.trim().startsWith('#') 
        ? hashtagInput.trim() 
        : `#${hashtagInput.trim()}`;
      if (!hashtags.includes(tag)) {
        setHashtags([...hashtags, tag]);
      }
      setHashtagInput('');
    }
  };

  const handleHashtagRemove = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const category = {
        id: crypto.randomUUID(),
        name: newCategory.trim(),
        userId: 'temp-user'
      };
      addCategory(category);
      setCategoryId(category.id);
      setNewCategory('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedVideo: Partial<Video> = {
      title,
      description: description || undefined,
      url,
      hashtags,
      categoryId
    };

    try {
      await updateVideo(video.id, updatedVideo);
      navigate(`/video/${video.id}`);
    } catch (error) {
      console.error('Error al actualizar el video:', error);
      alert('Error al actualizar el video. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-surface p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Editar Video</h1>
          <button
            onClick={() => navigate(`/video/${video.id}`)}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Título *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-surface-light rounded-md border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-surface-light rounded-md border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary"
              rows={3}
            />
          </div>
          
          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-1">
              URL del Video *
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 bg-surface-light rounded-md border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary"
              required
              placeholder="Enlace de YouTube, Vimeo, XVideos, etc."
            />
          </div>

          <div>
            <label htmlFor="hashtags" className="block text-sm font-medium mb-1">
              Hashtags
            </label>
            <input
              type="text"
              id="hashtags"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              onKeyDown={handleHashtagAdd}
              placeholder="Escribe y presiona Enter para agregar"
              className="w-full px-3 py-2 bg-surface-light rounded-md border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {hashtags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-primary/20 text-primary px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleHashtagRemove(tag)}
                      className="hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">Categoría</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 bg-surface-light rounded-md border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Agregar nueva categoría"
                className="flex-1 px-3 py-2 bg-surface-light rounded-md border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded-md"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md"
            >
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={() => navigate(`/video/${video.id}`)}
              className="flex-1 bg-surface-light hover:bg-surface text-white font-medium py-2 px-4 rounded-md"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}