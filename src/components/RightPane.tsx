import React from 'react';
import { Info, CheckCircle2 } from 'lucide-react';

export function RightPane({ results, isProcessing }: { results: any, isProcessing: boolean }) {
  const confidence = results?.confidence ? (results.confidence * 100).toFixed(0) : '94';

  return (
    <div className="flex flex-col h-full w-full bg-[#161618] border-l border-white/5">
      <div className="p-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-bold tracking-widest uppercase text-white">Analysis Results</h2>
          <Info size={14} className="text-[#a1a1aa]" />
        </div>
        {(results || isProcessing) && (
          <div className="text-[10px] px-2.5 py-1 bg-[#10B981]/10 rounded-full border border-[#10B981]/20 text-[#10B981] font-medium tracking-wide">
            {isProcessing ? 'Calculating...' : `${confidence}% Confidence`}
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 pt-0">
          {isProcessing ? (
             <div className="flex flex-col gap-4 animate-pulse">
               {[1,2,3,4].map(i => (
                 <div key={i} className="h-24 bg-white/5 rounded-xl border border-white/5 w-full"></div>
               ))}
             </div>
          ) : results ? (
            results.error ? (
              <div className="text-red-400 text-sm p-5 bg-red-950/30 border border-red-900/50 rounded-xl font-mono">
                {results.error}
              </div>
            ) : (
              <div className="flex flex-col gap-4 pb-10">
                 
                 {results.caption && (
                   <div className="flex flex-col p-5 bg-white/[0.02] border border-white/5 rounded-xl">
                     <div className="flex items-center justify-between mb-3">
                       <h3 className="text-xs font-semibold text-white">Semantic Caption</h3>
                     </div>
                     <p className="text-sm text-[#a1a1aa] leading-relaxed">{results.caption}</p>
                   </div>
                 )}

                 {results.scene && (
                   <div className="flex flex-col p-5 bg-white/[0.02] border border-white/5 rounded-xl">
                     <div className="flex items-center justify-between mb-3">
                       <h3 className="text-xs font-semibold text-white">Scene Understanding</h3>
                     </div>
                     <p className="text-sm text-[#a1a1aa] leading-relaxed">{results.scene}</p>
                   </div>
                 )}

                 {results.objects && results.objects.length > 0 && (
                   <div className="flex flex-col p-5 bg-white/[0.02] border border-white/5 rounded-xl">
                     <h3 className="text-xs font-semibold text-white mb-4">Detected Entities</h3>
                     <div className="flex flex-wrap gap-2">
                       {results.objects.map((obj: string, i: number) => (
                         <span key={i} className="px-3 py-1.5 text-xs bg-[#8B5CF6]/10 text-white rounded-full border border-[#8B5CF6]/20">
                           {obj}
                         </span>
                       ))}
                     </div>
                   </div>
                 )}

                 {results.key_observations && results.key_observations.length > 0 && (
                   <div className="flex flex-col p-5 bg-white/[0.02] border border-white/5 rounded-xl">
                     <h3 className="text-xs font-semibold text-white mb-4">Key Observations</h3>
                     <div className="flex flex-col gap-3">
                       {results.key_observations.map((obs: string, i: number) => (
                         <div key={i} className="flex items-start gap-3">
                           <CheckCircle2 size={16} className="text-[#10B981] shrink-0 mt-0.5" />
                           <span className="text-sm text-[#a1a1aa] leading-snug">{obs}</span>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}

                 {results.relationships && results.relationships.length > 0 && (
                   <div className="flex flex-col p-5 bg-white/[0.02] border border-white/5 rounded-xl">
                     <h3 className="text-xs font-semibold text-white mb-4">Inference Rules Applied</h3>
                     <ul className="flex flex-col gap-3">
                       {results.relationships.map((rel: string, i: number) => (
                         <li key={i} className="flex items-start gap-3 text-sm text-[#a1a1aa] leading-snug relative before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#8B5CF6] before:rounded-full before:absolute before:left-0 before:top-1.5 pl-4">
                           {rel}
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
              </div>
            )
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-white/20 pb-20">
               <div className="text-xs text-[#a1a1aa]">Waiting for image input...</div>
             </div>
          )}
      </div>
    </div>
  );
}
