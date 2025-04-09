import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import type { Video, Category, User } from '../types';

interface Store {
  videos: Video[];
  categories: Category[];
  user: User | null;
  setVideos: (videos: Video[]) => void;
  setCategories: (categories: Category[]) => void;
  setUser: (user: User | null) => void;
  addVideo: (video: Video) => Promise<void>;
  removeVideo: (id: string) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  fetchVideos: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  updateVideo: (id: string, data: Partial<Video>) => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  videos: [],
  categories: [],
  user: null,
  setVideos: (videos) => set({ videos }),
  setCategories: (categories) => set({ categories }),
  setUser: (user) => set({ user }),
  
  fetchVideos: async () => {
    try {
      const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const videos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Video[];
      set({ videos });
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  },

  fetchCategories: async () => {
    try {
      const q = query(collection(db, 'categories'), orderBy('name'));
      const snapshot = await getDocs(q);
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      set({ categories });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  },

  addVideo: async (video) => {
    try {
      const docRef = await addDoc(collection(db, 'videos'), video);
      const newVideo = { ...video, id: docRef.id };
      set(state => ({ videos: [newVideo, ...state.videos] }));
    } catch (error) {
      console.error('Error adding video:', error);
      throw error;
    }
  },

  removeVideo: async (id) => {
    try {
      await deleteDoc(doc(db, 'videos', id));
      set(state => ({
        videos: state.videos.filter(v => v.id !== id)
      }));
    } catch (error) {
      console.error('Error removing video:', error);
      throw error;
    }
  },

  addCategory: async (category) => {
    try {
      const docRef = await addDoc(collection(db, 'categories'), category);
      const newCategory = { ...category, id: docRef.id };
      set(state => ({
        categories: [...state.categories, newCategory]
      }));
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  removeCategory: async (id) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      set(state => ({
        categories: state.categories.filter(c => c.id !== id)
      }));
    } catch (error) {
      console.error('Error removing category:', error);
      throw error;
    }
  },

  updateVideo: async (id, data) => {
    try {
      await updateDoc(doc(db, 'videos', id), data);
      set(state => ({
        videos: state.videos.map(v => 
          v.id === id ? { ...v, ...data } : v
        )
      }));
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  },
}));