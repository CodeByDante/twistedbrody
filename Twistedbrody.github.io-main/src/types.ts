export interface Video {
  id?: string;
  url: string;
  title: string;
  description: string;
  hashtags: string[];
  category?: string;
  publisher: string;
  createdAt: Date;
  updatedAt?: Date;
}