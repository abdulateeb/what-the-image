import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Key } from 'lucide-react';

export function ApiKeyModal({ onKeySubmit }: { onKeySubmit: (key: string) => void }) {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) onKeySubmit(apiKey.trim());
  };

  return (
    <Dialog.Root defaultOpen>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 transition-opacity" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-[#161618] border border-white/10 p-8 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,1)] z-50 outline-none">
          <div className="w-12 h-12 bg-white/[0.03] rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-inner">
            <Key size={20} className="text-white" />
          </div>
          <Dialog.Title className="text-xl font-bold tracking-tight text-white mb-2">
            BYOK
          </Dialog.Title>
          <Dialog.Description>
            <p className="text-[#a1a1aa] text-sm leading-relaxed mb-8">
              Bring your own Gemini API key and use it for AI image analysis.
            </p>
          </Dialog.Description>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="password"
              placeholder="AIza..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-black border border-white/10 text-white px-5 py-3.5 text-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 rounded-xl transition-all font-mono placeholder:text-white/20"
              autoFocus
            />
            <button
              type="submit"
              disabled={!apiKey.trim()}
              className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Use Key
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
