export interface Video {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  hashtags: string[];
  categoryId: string;
  userId: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
}

export type VideoProvider = 
  | 'youtube'
  | 'vimeo'
  | 'xvideos'
  | 'pornhub'
  | 'gdrive'
  | 'dropbox'
  | 'terabox'
  | 'telegram';