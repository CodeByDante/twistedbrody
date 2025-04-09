import { VideoProvider } from '../types';

export const getVideoProvider = (url: string): VideoProvider | null => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('vimeo.com')) return 'vimeo';
  if (url.includes('xvideos.com')) return 'xvideos';
  if (url.includes('pornhub.com')) return 'pornhub';
  if (url.includes('drive.google.com')) return 'gdrive';
  if (url.includes('dropbox.com')) return 'dropbox';
  if (url.includes('terabox.com')) return 'terabox';
  if (url.includes('t.me/') || url.includes('telegram.me/')) return 'telegram';
  return null;
};

export const extractVideoId = (url: string, provider: VideoProvider): string | null => {
  switch (provider) {
    case 'youtube': {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
      return match ? match[1] : null;
    }
    case 'vimeo': {
      const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      return match ? match[1] : null;
    }
    // Add other provider extractors as needed
    default:
      return null;
  }
};

export const generateEmbedUrl = (url: string, provider: VideoProvider, videoId: string | null): string => {
  if (!videoId) return '';

  switch (provider) {
    case 'youtube':
      return `https://www.youtube.com/embed/${videoId}`;
    case 'vimeo':
      return `https://player.vimeo.com/video/${videoId}`;
    // Add other provider embed URLs as needed
    default:
      return url;
  }
};