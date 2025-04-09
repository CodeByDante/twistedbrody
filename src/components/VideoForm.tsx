import React, { useState } from 'react';
import { X, Plus, Trash } from 'lucide-react';
import { useStore } from '../lib/store';
import type { VideoProvider } from '../types';

interface VideoFormProps {
  onClose: () => void;
}

export default function VideoForm({ onClose }: VideoFormProps) {
  const { categories, addVideo, addCategory } = useStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [newCategory, setNewCategory] = useState('');

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

  const detectVideoProvider = (url: string): VideoProvider | null => {
    const providers: Record<VideoProvider, RegExp> = {
      youtube: /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
      vimeo: /vimeo\.com\/(\d+)/,
      xvideos: /xvideos\.com\/video(\d+)/,
      pornhub: /pornhub\.com\/view_video\.php\?viewkey=([^&\s]+)/,
      gdrive: /drive\.google\.com\/file\/d\/([^/]+)/,
      dropbox: /dropbox\.com\/s\/([^?]+)/,
      terabox: /terabox\.com\/s\/([^?]+)/,
      telegram: /t\.me\/([^/]+)\/(\d+)/
    };

    for (const [provider, regex] of Object.entries(providers)) {
      if (regex.test(url)) {
        return provider as VideoProvider;
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const provider = detectVideoProvider(url);
    if (!provider) {
      alert('URL de video no soportada. Por favor, utiliza un enlace de YouTube, Vimeo, XVideos, PornHub, Google Drive, Dropbox, Terabox o Telegram.');
      return;
    }

    const video = {
      id: crypto.randomUUID(),
      title,
      description,
      url,
      hashtags,
      categoryId,
      userId: 'temp-user',
      createdAt: new Date().toISOString()
    };

    addVideo(video);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface p-6 rounded-lg w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6">Agregar Nuevo Video</h2>
        
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
          
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md"
          >
            Agregar Video
          </button>
        </form>
      </div>
    </div>
  );
}