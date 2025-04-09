import { Timestamp } from 'firebase/firestore';

export interface Video {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  hashtags: string[];
  category?: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Category {
  id: string;
  name: string;
  userId: string;
  createdAt: Timestamp;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}