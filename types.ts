export interface ImageFile {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}

export interface HeadshotStyle {
  id: string;
  name: string;
  description: string;
  promptFragment: string;
  icon: string; // Emoji or icon name
}

export enum GenerationStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface GenerationError {
  message: string;
  details?: string;
}