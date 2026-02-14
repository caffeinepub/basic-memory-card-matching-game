import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'memory-game-card-back';
const DEFAULT_CARD_BACK = '/assets/generated/card-back.dim_1024x1024.png';

interface UseCardBackImageReturn {
  cardBackSrc: string;
  previewSrc: string | null;
  error: string | null;
  handleFileSelect: (file: File | null) => void;
  applyCustomImage: () => void;
  resetToDefault: () => void;
}

export function useCardBackImage(): UseCardBackImageReturn {
  const [cardBackSrc, setCardBackSrc] = useState<string>(DEFAULT_CARD_BACK);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load persisted card back on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // Validate that the stored data is a valid data URL
        if (stored.startsWith('data:image/')) {
          setCardBackSrc(stored);
        } else {
          // Invalid data, clear it
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (err) {
      console.error('Failed to load persisted card back:', err);
      // Fallback to default on any error
      setCardBackSrc(DEFAULT_CARD_BACK);
    }
  }, []);

  const handleFileSelect = useCallback((file: File | null) => {
    setError(null);

    if (!file) {
      setPreviewSrc(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, GIF, etc.)');
      setPreviewSrc(null);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewSrc(result);
    };
    reader.onerror = () => {
      setError('Failed to read the image file. Please try another file.');
      setPreviewSrc(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const applyCustomImage = useCallback(() => {
    if (!previewSrc) return;

    try {
      // Persist to localStorage
      localStorage.setItem(STORAGE_KEY, previewSrc);
      // Update active card back
      setCardBackSrc(previewSrc);
      setError(null);
    } catch (err) {
      console.error('Failed to persist card back:', err);
      setError('Failed to save the custom image. It may be too large.');
    }
  }, [previewSrc]);

  const resetToDefault = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setCardBackSrc(DEFAULT_CARD_BACK);
      setPreviewSrc(null);
      setError(null);
    } catch (err) {
      console.error('Failed to reset card back:', err);
    }
  }, []);

  return {
    cardBackSrc,
    previewSrc,
    error,
    handleFileSelect,
    applyCustomImage,
    resetToDefault,
  };
}
