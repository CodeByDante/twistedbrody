import type { VideoProvider } from '../types';

export function getVideoThumbnail(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // YouTube
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId = '';
      if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      } else if (urlObj.searchParams.has('v')) {
        videoId = urlObj.searchParams.get('v') || '';
      }
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }

    // Vimeo
    if (urlObj.hostname.includes('vimeo.com')) {
      const videoId = urlObj.pathname.split('/').pop();
      if (videoId) {
        return `https://vumbnail.com/${videoId}.jpg`;
      }
    }

    // For other providers, return a default placeholder
    return 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3';
    
  } catch (error) {
    console.error('Error getting video thumbnail:', error);
    return null;
  }
}

export function getVideoProvider(url: string): VideoProvider | null {
  try {
    const urlObj = new URL(url);
    
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      return 'youtube';
    }
    if (urlObj.hostname.includes('vimeo.com')) {
      return 'vimeo';
    }
    if (urlObj.hostname.includes('xvideos.com')) {
      return 'xvideos';
    }
    if (urlObj.hostname.includes('pornhub.com')) {
      return 'pornhub';
    }
    if (urlObj.hostname.includes('drive.google.com')) {
      return 'gdrive';
    }
    if (urlObj.hostname.includes('dropbox.com')) {
      return 'dropbox';
    }
    if (urlObj.hostname.includes('terabox.com')) {
      return 'terabox';
    }
    if (urlObj.hostname.includes('t.me')) {
      return 'telegram';
    }
    
    return null;
  } catch {
    return null;
  }
}