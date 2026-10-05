import React from 'react';

export default function ProductMegamenu({ onNavigate }) {
  return (
    <div className="w-full max-w-4xl bg-[#0E1013] p-6 border border-[#22262F] rounded-2xl shadow-2xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1 */}
        <div className="space-y-4">
          <button 
            onClick={() => onNavigate('document-intake')}
            className="text-left group block w-full p-2.5 rounded-xl hover:bg-[#181B20] border border-transparent hover:border-[#22262F] transition-all"
          >
            <h4 className="text-sm font-semibold text-[#F7F8F8] group-hover:text-[#35E6A4] transition-colors">
              Document Intake
            </h4>
            <p className="text-xs text-[#8A8F98] mt-1 leading-relaxed">
              Extract structured tables & bounding boxes from air-gapped PDFs.
            </p>
          </button>

          <button 
            onClick={() => onNavigate('roi-inspector')}
            className="text-left group block w-full p-2.5 rounded-xl hover:bg-[#181B20] border border-transparent hover:border-[#22262F] transition-all"
          >
            <h4 className="text-sm font-semibold text-[#F7F8F8] group-hover:text-[#35E6A4] transition-colors">
              ROI Inspector
            </h4>
            <p className="text-xs text-[#8A8F98] mt-1 leading-relaxed">
              Isolate exact spatial regions with local vision models.
            </p>
          </button>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <button 
            onClick={() => onNavigate('rag-vectors')}
            className="text-left group block w-full p-2.5 rounded-xl hover:bg-[#181B20] border border-transparent hover:border-[#22262F] transition-all"
          >
            <h4 className="text-sm font-semibold text-[#F7F8F8] group-hover:text-[#35E6A4] transition-colors">
              Local RAG Vectors
            </h4>
            <p className="text-xs text-[#8A8F98] mt-1 leading-relaxed">
              Embeddings indexed locally inside ChromaDB with zero network calls.
            </p>
          </button>

          <button 
            onClick={() => onNavigate('wasm-sandbox')}
            className="text-left group block w-full p-2.5 rounded-xl hover:bg-[#181B20] border border-transparent hover:border-[#22262F] transition-all"
          >
            <h4 className="text-sm font-semibold text-[#F7F8F8] group-hover:text-[#35E6A4] transition-colors">
              WASM Sandbox Engine
            </h4>
            <p className="text-xs text-[#8A8F98] mt-1 leading-relaxed">
              Run Python scripts in browser to verify line item calculations.
            </p>
          </button>
        </div>

        {/* Column 3: Architecture Links */}
        <div className="border-l border-[#22262F] pl-6 space-y-3">
          <span className="text-[10px] font-mono tracking-wider text-[#8A8F98] uppercase block">
            Architecture
          </span>
          <ul className="space-y-2.5 text-xs text-[#D0D4DC]">
            <li>
              <button onClick={() => onNavigate('security-whitepaper')} className="hover:text-[#35E6A4] transition-colors text-left">
                Security Whitepaper
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('changelog-benchmarks')} className="hover:text-[#35E6A4] transition-colors text-left">
                Changelog & Benchmarks
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('audit-report')} className="hover:text-[#35E6A4] transition-colors text-left">
                Air-Gap Audit Report
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('onnx-config')} className="hover:text-[#35E6A4] transition-colors text-left">
                ONNX Runtime Config
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Footer Announcement */}
      <div className="pt-4 border-t border-[#22262F] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="bg-[#35E6A4]/10 text-[#35E6A4] px-2 py-0.5 rounded border border-[#35E6A4]/20 font-bold text-[10px]">
            NEW
          </span>
          <span className="text-[#F7F8F8]">Local Vision Engine v2.4 Released</span>
        </div>
        <button onClick={() => onNavigate('explore-docs')} className="text-[#8A8F98] hover:text-[#35E6A4] transition-colors font-mono">
          Explore Docs &rarr;
        </button>
      </div>
    </div>
  );
}