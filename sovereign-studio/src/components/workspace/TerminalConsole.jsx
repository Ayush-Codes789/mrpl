import React from 'react';

export default function TerminalConsole() {
  return (
    <div className="flex flex-col h-full bg-[#0B0C0E] font-mono text-xs overflow-hidden rounded-lg border border-[#22262F]">
      
      {/* 1. Terminal Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#121417] border-b border-[#22262F] shrink-0 text-[11px] text-[#8A8F98]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#35E6A4]/20 border border-[#35E6A4] flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-[#35E6A4] animate-pulse"></span>
          </span>
          <span className="text-[#F7F8F8] font-medium">Terminal Console</span>
        </div>
        <span className="text-[10px] text-[#6E737D] font-mono">v2.4.0-offline</span>
      </div>

      {/* 2. Expanded Terminal Logs Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2 text-[#8A8F98] text-[11px] leading-relaxed custom-scrollbar min-h-[280px]">
        <div className="flex items-start gap-2">
          <span className="text-[#35E6A4] font-semibold shrink-0">[SYS]</span>
          <span className="text-[#D0D4DC]">Sovereign local runtime initialized.</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-[#3B82F6] font-semibold shrink-0">[OCR]</span>
          <span className="text-[#D0D4DC]">Tesseract Engine mounted. Vision model Qwen3-VL ready.</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-[#E5A93C] font-semibold shrink-0">[SEC]</span>
          <span className="text-[#D0D4DC]">Network interfaces blocked. Air-Gap verified.</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-[#A855F7] font-semibold shrink-0">[RAG]</span>
          <span className="text-[#D0D4DC]">Local SQLite Vector Index loaded.</span>
        </div>
        
        <div className="text-[#F7F8F8] animate-pulse pt-2 flex items-center gap-1">
          <span className="text-[#35E6A4]">&gt;</span> Awaiting document or prompt instruction...
        </div>
      </div>

      {/* 3. Simple Clean Bottom Status */}
      <div className="px-3 py-1.5 bg-[#121417] border-t border-[#22262F] shrink-0 text-[10px] text-[#6E737D] flex items-center justify-between">
        <span className="text-[#35E6A4] font-medium">● Local Runtime Active</span>
        <span>Air-Gapped Compliant</span>
      </div>

    </div>
  );
}