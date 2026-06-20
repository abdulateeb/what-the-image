import { useState } from 'react';
import { ApiKeyModal } from './components/ApiKeyModal';
import { LeftPane } from './components/LeftPane';
import { CenterPane } from './components/CenterPane';
import { RightPane } from './components/RightPane';
import { Layers, Image as ImageIcon, Binary } from 'lucide-react';

function App() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [mobileTab, setMobileTab] = useState<'input' | 'viz' | 'data'>('input');

  const handleImageSelect = (fileOrStr: File | string) => {
    if (typeof fileOrStr === 'string') {
      setSourceImage(fileOrStr);
      setImageMeta({ name: 'camera_capture.jpg', size: '1.2 MB', dimensions: '1280 x 720', format: 'JPEG' });
    } else {
      const url = URL.createObjectURL(fileOrStr);
      const img = new Image();
      img.onload = () => {
        setImageMeta({ 
          name: fileOrStr.name, 
          size: (fileOrStr.size / 1024).toFixed(0) + ' KB', 
          dimensions: `${img.width} x ${img.height}`, 
          format: fileOrStr.type.split('/')[1].toUpperCase() 
        });
      };
      img.src = url;

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const resultStr = e.target.result as string;
          setSourceImage(resultStr);
        }
      };
      reader.readAsDataURL(fileOrStr);
    }
  };

  const handleClear = () => {
    setSourceImage(null);
    setImageMeta(null);
    setResults(null);
  };

  const handleAnalyze = () => {
    if (sourceImage) processImage(sourceImage);
  };

  const processImage = async (base64Image: string) => {
    if (!apiKey) return;
    setIsProcessing(true);
    setResults(null);
    setMobileTab('viz');

    await new Promise(r => setTimeout(r, 1500)); 

    try {
      const base64Data = base64Image.split(',')[1];
      const mimeType = base64Image.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)?.[0] || 'image/jpeg';

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {text: `Analyze this image strictly. Output only raw JSON: "objects" (strings), "scene" (string), "text_detected" (string), "relationships" (strings mapping inference rules), "key_observations" (strings), "caption" (string), "confidence" (number 0-1).`},
              { inline_data: { mime_type: mimeType, data: base64Data } }
            ]
          }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });

      if (!response.ok) throw new Error(`API Error ${response.status}`);
      const data = await response.json();
      const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsed = JSON.parse(textOutput.trim().replace(/^```json/, '').replace(/```$/, ''));
      setResults(parsed);
    } catch (error: any) {
      setResults({ error: error.message || "Pipeline failure." });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setMobileTab('data'), 800); 
    }
  };

  if (!apiKey) {
    return (
      <div className="h-screen w-screen bg-[#161618] flex items-center justify-center font-sans text-white">
        <ApiKeyModal onKeySubmit={setApiKey} />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] w-screen overflow-hidden text-white bg-[#161618] font-sans selection:bg-white/20">
      
      <div className="flex lg:hidden border-b border-white/10 bg-[#161618] shrink-0 z-50 shadow-md">
        <button 
          onClick={() => setMobileTab('input')} 
          className={`flex-1 py-3.5 text-[10px] uppercase tracking-widest font-semibold transition-colors flex flex-col items-center gap-1.5 ${mobileTab === 'input' ? 'text-white border-b-2 border-white bg-white/5' : 'text-[#a1a1aa] hover:text-white hover:bg-white/5 border-b-2 border-transparent'}`}
        >
          <ImageIcon size={14} /> Take Shot
        </button>
        <button 
          onClick={() => setMobileTab('viz')} 
          className={`flex-1 py-3.5 text-[10px] uppercase tracking-widest font-semibold transition-colors flex flex-col items-center gap-1.5 ${mobileTab === 'viz' ? 'text-white border-b-2 border-white bg-white/5' : 'text-[#a1a1aa] hover:text-white hover:bg-white/5 border-b-2 border-transparent'}`}
        >
          <Layers size={14} /> Pipeline
        </button>
        <button 
          onClick={() => setMobileTab('data')} 
          className={`flex-1 py-3.5 text-[10px] uppercase tracking-widest font-semibold transition-colors flex flex-col items-center gap-1.5 ${mobileTab === 'data' ? 'text-white border-b-2 border-white bg-white/5' : 'text-[#a1a1aa] hover:text-white hover:bg-white/5 border-b-2 border-transparent'}`}
        >
          <Binary size={14} /> AI Analysis
        </button>
      </div>

      <div className={`${mobileTab === 'input' ? 'flex' : 'hidden'} lg:flex h-full w-full lg:w-[340px] shrink-0 z-10`}>
        <LeftPane onImageSelect={handleImageSelect} sourceImage={sourceImage} imageMeta={imageMeta} onClear={handleClear} onAnalyze={handleAnalyze} />
      </div>

      <div className={`${mobileTab === 'viz' ? 'flex' : 'hidden'} lg:flex flex-1 relative z-0 h-full overflow-hidden`}>
        <CenterPane sourceImage={sourceImage} />
      </div>

      <div className={`${mobileTab === 'data' ? 'flex' : 'hidden'} lg:flex h-full w-full lg:w-[420px] shrink-0 z-10`}>
        <RightPane results={results} isProcessing={isProcessing} />
      </div>
    </div>
  );
}
export default App;
