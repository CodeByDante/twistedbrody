import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useVideoStore } from '../store/videoStore';
import { getVideoProvider, extractVideoId, generateEmbedUrl } from '../utils/videoUtils';

interface AddVideoModalProps {
  onClose: () => void;
}

const AddVideoModal = ({ onClose }: AddVideoModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const { categories, addVideo, addCategory } = useVideoStore();

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      await addCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const provider = getVideoProvider(url);
    if (!provider) {
      alert('URL de video no válida');
      return;
    }

    const videoId = extractVideoId(url, provider);
    const embedUrl = generateEmbedUrl(url, provider, videoId);

    const newVideo = {
      title,
      description,
      url: embedUrl,
      hashtags: hashtags.split(' ').filter(Boolean).map(tag => tag.startsWith('#') ? tag.slice(1) : tag),
      category,
    };

    try {
      await addVideo(newVideo);
      onClose();
    } catch (error) {
      alert('Error al agregar el video. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Agregar Nuevo Video</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-surface-light rounded-lg px-4 py-2"
              placeholder="Ingresa el título del video"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface-light rounded-lg px-4 py-2 h-24"
              placeholder="Describe el contenido del video"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL del Video *</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full bg-surface-light rounded-lg px-4 py-2"
              placeholder="Pega la URL del video"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Hashtags</label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="Ingresa hashtags separados por espacios"
              className="w-full bg-surface-light rounded-lg px-4 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-surface-light rounded-lg px-4 py-2"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nueva categoría"
                className="flex-1 bg-surface-light rounded-lg px-4 py-2"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-4 py-2 rounded-lg bg-primary text-background hover:bg-primary/90"
              >
                Agregar
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface-light hover:bg-surface-light/80"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-background hover:bg-primary/90"
            >
              Agregar Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVideoModal;