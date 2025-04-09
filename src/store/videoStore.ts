import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where 
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { Video, Category } from '../types';

interface VideoStore {
  videos: Video[];
  categories: Category[];
  selectedCategory: string | null;
  selectedHashtag: string | null;
  isLoading: boolean;
  error: string | null;
  setVideos: (videos: Video[]) => void;
  setCategories: (categories: Category[]) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedHashtag: (hashtag: string | null) => void;
  fetchVideos: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addVideo: (video: Omit<Video, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateVideo: (id: string, data: Partial<Video>) => Promise<void>;
  removeVideo: (id: string) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  videos: [],
  categories: [],
  selectedCategory: null,
  selectedHashtag: null,
  isLoading: false,
  error: null,

  setVideos: (videos) => set({ videos }),
  setCategories: (categories) => set({ categories }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedHashtag: (hashtag) => set({ selectedHashtag: hashtag }),

  fetchVideos: async () => {
    try {
      set({ isLoading: true, error: null });
      const videosRef = collection(db, 'videos');
      const querySnapshot = await getDocs(videosRef);
      const videos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Video[];
      set({ videos, isLoading: false });
    } catch (error) {
      set({ error: 'Error al cargar los videos', isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const categoriesRef = collection(db, 'categories');
      const querySnapshot = await getDocs(categoriesRef);
      const categories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      set({ categories });
    } catch (error) {
      set({ error: 'Error al cargar las categorías' });
    }
  },

  addVideo: async (videoData) => {
    try {
      if (!auth.currentUser) throw new Error('Debes iniciar sesión para agregar videos');
      
      const newVideo = {
        ...videoData,
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'videos'), newVideo);
      const video = { ...newVideo, id: docRef.id };
      set(state => ({ videos: [...state.videos, video] }));
    } catch (error) {
      set({ error: 'Error al agregar el video' });
    }
  },

  updateVideo: async (id, data) => {
    try {
      const videoRef = doc(db, 'videos', id);
      await updateDoc(videoRef, data);
      set(state => ({
        videos: state.videos.map(video =>
          video.id === id ? { ...video, ...data } : video
        )
      }));
    } catch (error) {
      set({ error: 'Error al actualizar el video' });
    }
  },

  removeVideo: async (id) => {
    try {
      await deleteDoc(doc(db, 'videos', id));
      set(state => ({
        videos: state.videos.filter(video => video.id !== id)
      }));
    } catch (error) {
      set({ error: 'Error al eliminar el video' });
    }
  },

  addCategory: async (name) => {
    try {
      if (!auth.currentUser) throw new Error('Debes iniciar sesión para agregar categorías');
      
      const newCategory = {
        name,
        userId: auth.currentUser.uid,
      };

      const docRef = await addDoc(collection(db, 'categories'), newCategory);
      const category = { ...newCategory, id: docRef.id };
      set(state => ({ categories: [...state.categories, category] }));
    } catch (error) {
      set({ error: 'Error al agregar la categoría' });
    }
  },

  removeCategory: async (id) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      set(state => ({
        categories: state.categories.filter(category => category.id !== id)
      }));
    } catch (error) {
      set({ error: 'Error al eliminar la categoría' });
    }
  },
}));