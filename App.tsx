import React, { useState, useCallback } from 'react';
import { UploadZone } from './components/UploadZone';
import { StyleSelector, PREDEFINED_STYLES } from './components/StyleSelector';
import { fileToBase64, validateImageFile } from './utils/fileHelpers';
import { generateEditedImage } from './services/geminiService';
import { ImageFile, HeadshotStyle, GenerationStatus } from './types';

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<ImageFile | null>(null);
  const [generatedImageBase64, setGeneratedImageBase64] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<HeadshotStyle | null>(PREDEFINED_STYLES[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = useCallback(async (file: File) => {
    if (!validateImageFile(file)) {
      setError("Invalid file type. Please upload an image.");
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setSourceImage({
        file,
        previewUrl: URL.createObjectURL(file),
        base64,
        mimeType: file.type
      });
      // Reset generated state when new image is uploaded
      setGeneratedImageBase64(null);
      setError(null);
      setStatus(GenerationStatus.IDLE);
    } catch (e) {
      setError("Failed to process image file.");
    }
  }, []);

  const handleGenerate = async () => {
    if (!sourceImage) return;
    if (!selectedStyle && !customPrompt.trim()) {
      setError("Please select a style or enter a prompt.");
      return;
    }

    setStatus(GenerationStatus.LOADING);
    setError(null);

    try {
      // Combine predefined style prompt with user's custom instructions
      let finalPrompt = "";
      if (selectedStyle) {
        finalPrompt += selectedStyle.promptFragment;
      }
      if (customPrompt.trim()) {
        finalPrompt += ` Additional instructions: ${customPrompt.trim()}`;
      }

      // Call the Gemini Service
      const resultBase64 = await generateEditedImage(
        sourceImage.base64,
        sourceImage.mimeType,
        finalPrompt
      );

      setGeneratedImageBase64(resultBase64);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during generation.");
      setStatus(GenerationStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (!generatedImageBase64) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${generatedImageBase64}`;
    link.download = `proshot-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">ProShot AI</span>
          </div>
          <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Documentation</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Professional Headshots from <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Any Selfie</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload a casual photo and let Gemini 2.5 Flash transform it into a studio-quality professional headshot instantly.
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mt-0.5 flex-shrink-0">
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H5.045c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input & Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="bg-slate-100 text-slate-600 w-6 h-6 rounded-full inline-flex items-center justify-center text-sm">1</span>
                Upload Source Image
              </h2>
              <UploadZone 
                onFileSelected={handleFileSelected} 
                currentImage={sourceImage?.previewUrl || null}
              />
            </div>

            {sourceImage && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-fade-in">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="bg-slate-100 text-slate-600 w-6 h-6 rounded-full inline-flex items-center justify-center text-sm">2</span>
                  Customize & Generate
                </h2>
                
                <label className="block text-sm font-medium text-slate-700 mb-3">Select Style</label>
                <div className="max-h-64 overflow-y-auto pr-2 -mr-2 mb-4">
                    <StyleSelector 
                        selectedStyleId={selectedStyle?.id || null} 
                        onSelect={setSelectedStyle} 
                    />
                </div>

                <div className="mb-6">
                  <label htmlFor="customPrompt" className="block text-sm font-medium text-slate-700 mb-1">
                    Additional Instructions (Optional)
                  </label>
                  <textarea
                    id="customPrompt"
                    rows={3}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. 'Make me smile slightly', 'Remove glasses', 'Make the background darker'"
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow text-sm resize-none"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={status === GenerationStatus.LOADING}
                  className={`
                    w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0
                    flex items-center justify-center gap-2
                    ${status === GenerationStatus.LOADING 
                      ? 'bg-indigo-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-200'}
                  `}
                >
                  {status === GenerationStatus.LOADING ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436h.008c.366.031.73.04 1.09.04 1.075 0 2.126-.082 3.15-.24a.75.75 0 01.625.927 14.19 14.19 0 01-1.57 3.063 3.833 3.833 0 01-5.302.657l-3.282-2.462a4.001 4.001 0 00-3.602-.612 2.002 2.002 0 01-2.56-2.56c.235-.956.025-1.97-.612-3.602L1.846 6.616a3.833 3.833 0 01.657-5.302 14.19 14.19 0 013.063-1.57.75.75 0 01.927.626c.158 1.024.24 2.075.24 3.15 0 .36-.009.724-.04 1.09v.008z" clipRule="evenodd" />
                      </svg>
                      Generate Headshot
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 mt-3">Powered by Gemini 2.5 Flash Image (Nano Banana)</p>
              </div>
            )}
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full min-h-[500px] flex flex-col">
               <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="bg-slate-100 text-slate-600 w-6 h-6 rounded-full inline-flex items-center justify-center text-sm">3</span>
                Results
              </h2>
              
              <div className="flex-1 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 relative overflow-hidden flex items-center justify-center">
                
                {status === GenerationStatus.LOADING && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-20 backdrop-blur-sm">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-indigo-600 font-semibold animate-pulse">Enhancing image...</p>
                    <p className="text-slate-500 text-sm mt-2">This typically takes 5-10 seconds</p>
                  </div>
                )}

                {generatedImageBase64 ? (
                   <img 
                    src={`data:image/png;base64,${generatedImageBase64}`} 
                    alt="Generated Headshot" 
                    className="max-w-full max-h-[600px] object-contain shadow-lg rounded-lg"
                  />
                ) : (
                  <div className="text-center text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-3 opacity-50">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <p>Your professional headshot will appear here</p>
                  </div>
                )}
              </div>

              {generatedImageBase64 && (
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleDownload}
                    className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download Image
                  </button>
                  <button 
                    onClick={() => {
                      setGeneratedImageBase64(null);
                      // Optional: Scroll back to top or input
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 py-3 px-4 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-medium shadow-sm transition-colors"
                  >
                    Generate Another
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;