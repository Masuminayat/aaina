/**
 * ImageUpload — Drop zone for uploading person or product images.
 * Supports drag-drop, file picker, and clipboard paste.
 */
import { useCallback, useRef, useState } from 'react';
import { Upload, Camera, Image as ImageIcon } from 'lucide-react';

interface Props {
  label: string;
  hint: string;
  accept?: string;
  maxSizeMb?: number;
  currentImageUrl: string | null;
  onImageSelected: (blob: Blob) => void;
  onClear: () => void;
  id: string;
}

export function ImageUpload({
  label,
  hint,
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeMb = 10,
  currentImageUrl,
  onImageSelected,
  onClear,
  id,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndSet = useCallback(
    (file: File) => {
      setError(null);
      if (file.size > maxSizeMb * 1024 * 1024) {
        setError(`File too large. Maximum ${maxSizeMb} MB.`);
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPEG, PNG, or WebP).');
        return;
      }
      onImageSelected(file);
    },
    [maxSizeMb, onImageSelected],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndSet(file);
    },
    [validateAndSet],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            validateAndSet(file);
            return;
          }
        }
      }
    },
    [validateAndSet],
  );

  if (currentImageUrl) {
    return (
      <div className="relative group" id={id}>
        <div className="rounded-xl overflow-hidden border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]">
          <img
            src={currentImageUrl}
            alt={label}
            className="w-full h-64 sm:h-80 object-contain bg-black/30"
          />
          <div className="p-3 flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)] font-medium">{label}</span>
            <button
              onClick={onClear}
              className="text-xs px-3 py-1.5 rounded-lg bg-[var(--color-surface-overlay)] hover:bg-red-500/20 text-[var(--color-text-secondary)] hover:text-red-400 transition-colors cursor-pointer"
              aria-label={`Remove ${label}`}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id={id}>
      <div
        className={`
          relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-[var(--color-accent)] bg-[var(--color-accent-muted)]'
            : 'border-[var(--color-border-default)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-muted)]'
          }
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onPaste={handlePaste}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) validateAndSet(file);
            e.target.value = '';
          }}
          aria-hidden="true"
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[var(--color-surface-overlay)] flex items-center justify-center">
            {label.toLowerCase().includes('you') ? (
              <Camera className="w-6 h-6 text-[var(--color-accent)]" />
            ) : (
              <ImageIcon className="w-6 h-6 text-[var(--color-accent)]" />
            )}
          </div>
          <div>
            <p className="font-semibold text-[var(--color-text-primary)]">{label}</p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">{hint}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <Upload className="w-3.5 h-3.5" />
            <span>Drop, paste, or click to upload</span>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-400" role="alert">{error}</p>
      )}
    </div>
  );
}
