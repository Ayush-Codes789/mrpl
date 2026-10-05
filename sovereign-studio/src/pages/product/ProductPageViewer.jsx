import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function ProductPageViewer({ pageKey, onBack }) {
  const contentMap = {
    'document-intake': {
      title: 'Document Intake Engine',
      subtitle: 'Air-gapped table & bounding box extraction pipeline.',
      details: 'This module processes local PDFs and extracts structural layout data with zero external network connectivity.'
    },
    'roi-inspector': {
      title: 'ROI Inspector',
      subtitle: 'Precision spatial region isolation.',
      details: 'Inspect bounding coordinates and crop exact regions to feed directly into Qwen3-VL models.'
    },
    'rag-vectors': {
      title: 'Local RAG Vectors',
      subtitle: 'ChromaDB Local Vector Indexing.',
      details: 'Fully private vector storage running on client browser storage or local FastAPI instance.'
    },
    'wasm-sandbox': {
      title: 'WASM Sandbox Engine',
      subtitle: 'In-browser isolated Python execution environment.',
      details: 'Run custom scripts and mathematical validations securely within WebAssembly boundaries.'
    },
    'security-whitepaper': {
      title: 'Security Whitepaper',
      subtitle: 'Air-gapped verification & Zero-leakage standards.',
      details: 'Comprehensive breakdown of end-to-end data safety protocols.'
    }
  };

  const current = contentMap[pageKey] || {
    title: pageKey?.replace('-', ' ').toUpperCase(),
    subtitle: 'Documentation & Specifications',
    details: 'Detailed documentation content goes here.'
  };

  return (
    <div className="flex-1 h-full bg-[#0B0C0E] text-[#F7F8F8] p-8 overflow-y-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-mono text-[#35E6A4] hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{current.title}</h1>
        <p className="text-base text-[#35E6A4] font-medium">{current.subtitle}</p>
        <div className="p-6 bg-[#121417] border border-[#22262F] rounded-2xl text-sm text-[#8A8F98] leading-relaxed">
          {current.details}
        </div>
      </div>
    </div>
  );
}