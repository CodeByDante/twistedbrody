import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Video } from '../types';
import { Plus, X, Save } from 'lucide-react';

interface VideoFormProps {
  onClose: () => void;
  editingVideo?: Video | null;
}

const VideoForm: React.FC<VideoFormProps> = ({ onClose, editingVideo }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  useEffect(() => {
    if (editingVideo) {
      setUrl(editingVideo.url);
      setTitle(editingVideo.title);
      setDescription(editingVideo.description);
      setHashtags(editingVideo.hashtags.join(' '));
      setCategory(editingVideo.category || '');
    }
  }, [editingVideo]);

  const defaultCategories = [
    { value: 'entretenimiento', label: 'Entretenimiento' },
    { value: 'educacion', label: 'Educación' },
    { value: 'musica', label: 'Música' },
    { value: 'gaming', label: 'Gaming' },
  ];

  const handleAddCategory = () => {
    if (newCategory.trim() && !customCategories.includes(newCategory.trim())) {
      setCustomCategories([...customCategories, newCategory.trim()]);
      setCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert('Por favor inicia sesión para agregar videos');
      return;
    }

    const videoData = {
      url,
      title,
      description,
      hashtags: hashtags.split(' ').filter(tag => tag.startsWith('#')),
      category,
      publisher: auth.currentUser.email || 'anónimo',
      createdAt: editingVideo ? editingVideo.createdAt : new Date(),
      updatedAt: new Date(),
    };

    try {
      if (editingVideo?.id) {
        const videoRef = doc(db, 'videos', editingVideo.id);
        await updateDoc(videoRef, videoData);
      } else {
        await addDoc(collection(db, 'videos'), videoData);
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar video:', error);
      alert('Error al guardar video');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1e1e1e] p-6 rounded-lg shadow-xl border border-[#bb86fc]/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">
          {editingVideo ? 'Editar Video' : 'Agregar Nuevo Video'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200">URL del Video</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1 block w-full rounded-md bg-[#121212] border-[#bb86fc]/20 text-white shadow-sm focus:border-[#bb86fc] focus:ring focus:ring-[#bb86fc]/50"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md bg-[#121212] border-[#bb86fc]/20 text-white shadow-sm focus:border-[#bb86fc] focus:ring focus:ring-[#bb86fc]/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md bg-[#121212] border-[#bb86fc]/20 text-white shadow-sm focus:border-[#bb86fc] focus:ring focus:ring-[#bb86fc]/50"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">Hashtags (separados por espacio)</label>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="#ejemplo #video"
            className="mt-1 block w-full rounded-md bg-[#121212] border-[#bb86fc]/20 text-white shadow-sm focus:border-[#bb86fc] focus:ring focus:ring-[#bb86fc]/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">Categoría</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nueva categoría"
              className="flex-1 rounded-md bg-[#121212] border-[#bb86fc]/20 text-white shadow-sm focus:border-[#bb86fc] focus:ring focus:ring-[#bb86fc]/50"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="px-4 py-2 bg-[#bb86fc] text-[#121212] rounded-md hover:bg-[#bb86fc]/90"
            >
              Agregar
            </button>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md bg-[#121212] border-[#bb86fc]/20 text-white shadow-sm focus:border-[#bb86fc] focus:ring focus:ring-[#bb86fc]/50"
          >
            <option value="">Selecciona una categoría</option>
            {defaultCategories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
            {customCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#121212] bg-[#bb86fc] hover:bg-[#bb86fc]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bb86fc]"
        >
          {editingVideo ? (
            <>
              <Save className="h-5 w-5 mr-2" />
              Guardar Cambios
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2" />
              Publicar Video
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default VideoForm;

<select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="mt-1 block w-full rounded-md bg-[#121212] border-[#bb86fc]/20 text-white shadow-sm focus:border-[#bb86fc] focus:ring focus:ring-[#bb86fc]/50"
>

{customCategories.length > 0 && (
  <div className="mt-2">
    <h4 className="text-sm text-gray-300 mb-1">Categorías personalizadas:</h4>
    <ul className="space-y-1">
      {customCategories.map((cat) => (
        <li key={cat} className="flex justify-between items-center bg-[#2c2c2c] px-3 py-1 rounded">
          <span className="text-white">{cat}</span>
          <button
            type="button"
            onClick={() =>
              setCustomCategories(customCategories.filter((c) => c !== cat))
            }
            className="text-red-400 hover:text-red-600 text-sm"
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  </div>
)}
