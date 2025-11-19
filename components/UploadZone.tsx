import React, { useRef, useState } from 'react';

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  currentImage: string | null;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelected, currentImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative w-full aspect-[4/5] md:aspect-square rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden flex flex-col items-center justify-center group
          ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-indigo-400'}
        `}
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleChange}
          accept="image/*"
          className="hidden"
        />

        {currentImage ? (
          <>
            <img 
              src={currentImage} 
              alt="Original Upload" 
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 backdrop-blur-sm">
              <p className="text-white font-medium flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 4.992l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Change Image
              </p>
            </div>
          </>
        ) : (
          <div className="text-center p-6 z-10">
             <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-200 text-slate-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
             </div>
            <p className="text-lg font-semibold text-slate-700 mb-1">Upload a Selfie</p>
            <p className="text-sm text-slate-500">Drag & drop or click to browse</p>
            <p className="text-xs text-slate-400 mt-4">JPG, PNG, WEBP up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
};