import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Upload, Info, Trash2, Plus } from 'lucide-react';

export function LeftPane({ 
  onImageSelect, 
  sourceImage, 
  imageMeta, 
  onClear 
}: { 
  onImageSelect: (file: File | string) => void, 
  sourceImage: string | null,
  imageMeta: any,
  onClear: () => void
}) {
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const webcamRef = useRef<Webcam>(null);

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) onImageSelect(imageSrc);
  }, [webcamRef, onImageSelect]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMode('upload');
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full p-6 w-full bg-[#161618] border-r border-white/5 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[11px] font-bold tracking-widest text-white uppercase">Input</h1>
        <Info size={14} className="text-[#a1a1aa]" />
      </div>

      <div className="flex p-1 bg-white/5 rounded-lg border border-white/5 mb-6">
        <button
          onClick={() => {
            setMode('upload');
            if (sourceImage) onClear();
          }}
          className={`flex-1 text-xs font-semibold py-2 rounded-md transition-all ${mode === 'upload' ? 'bg-white/10 text-white' : 'text-[#a1a1aa] hover:text-white'}`}
        >
          Upload
        </button>
        <button
          onClick={() => {
            setMode('camera');
            if (sourceImage) onClear();
          }}
          className={`flex-1 text-xs font-semibold py-2 rounded-md transition-all ${mode === 'camera' ? 'bg-white/10 text-white' : 'text-[#a1a1aa] hover:text-white'}`}
        >
          Camera
        </button>
      </div>

      {sourceImage ? (
        <div className="flex flex-col gap-4">
          <div className="w-full bg-white rounded-lg p-2 border border-white/10 aspect-square flex items-center justify-center overflow-hidden relative">
            <img src={sourceImage} className="w-full h-full object-contain" alt="Source" />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-lg">
             <div className="flex flex-col gap-1">
               <span className="text-sm text-white font-medium truncate w-40">{imageMeta?.name || 'image.png'}</span>
               <span className="text-xs text-[#a1a1aa]">{imageMeta?.dimensions || '512 x 512 px'} • {imageMeta?.size || '45 KB'}</span>
             </div>
             <button onClick={onClear} className="p-2 hover:bg-white/10 rounded-md transition-colors text-[#a1a1aa] hover:text-white">
               <Trash2 size={16} />
             </button>
          </div>

          <label className="flex items-center justify-center gap-2 w-full py-3 bg-transparent border border-white/10 hover:bg-white/5 rounded-lg text-xs font-medium text-white cursor-pointer transition-colors">
            <Plus size={14} /> Replace Image
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
          </label>

          <div className="mt-8">
            <h2 className="text-[11px] font-bold tracking-widest text-white uppercase mb-4">Image Info</h2>
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex justify-between"><span className="text-[#a1a1aa]">Dimensions</span><span className="text-white">{imageMeta?.dimensions || '512 x 512'}</span></div>
              <div className="flex justify-between"><span className="text-[#a1a1aa]">Format</span><span className="text-white">{imageMeta?.format || 'PNG'}</span></div>
              <div className="flex justify-between"><span className="text-[#a1a1aa]">Size</span><span className="text-white">{imageMeta?.size || '45 KB'}</span></div>
              <div className="flex justify-between"><span className="text-[#a1a1aa]">Color Space</span><span className="text-white">sRGB</span></div>
              <div className="flex justify-between"><span className="text-[#a1a1aa]">Captured</span><span className="text-white">Just now</span></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {mode === 'upload' ? (
            <div className="flex-1 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center p-6 hover:bg-white/[0.02] transition-colors group">
              <Upload size={24} className="text-[#a1a1aa] mb-4 group-hover:text-white transition-colors" />
              <p className="text-xs text-[#a1a1aa] mb-4 text-center">Drag and drop an image, or click to browse</p>
              <label className="bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-4 py-2 rounded-md cursor-pointer transition-colors">
                Select File
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
          ) : (
            <div className="flex-1 rounded-lg overflow-hidden relative border border-white/10">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "environment" }}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <button
                  onClick={handleCapture}
                  className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors"
                >
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Footer */}
      <div className="mt-auto pt-12 flex justify-center w-full shrink-0">
        <span className="text-[10px] text-[#a1a1aa]/50 font-medium tracking-wide">
          © {new Date().getFullYear()} Abdul Ateeb · MIT licensed
        </span>
      </div>
    </div>
  );
}
