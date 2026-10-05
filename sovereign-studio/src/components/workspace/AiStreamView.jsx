import React, { useState } from 'react';

export default function AiStreamView({ activeDoc }) {
  const [isCopying, setIsCopying] = useState(false);

  const extractedText = activeDoc ? `
[SOVEREIGN VISION OCR ENGINE v3.2]
Target Document: ${activeDoc.name || 'sop_pressure_relief_valve.txt'}
------------------------------------------------------------------

1. EQUIPMENT SPECIFICATIONS:
   - Valve ID: PRV-2026-X8
   - Operational Pressure: 15.4 Bar
   - Max Tolerance: 18.2 Bar
   - Status: OPERATIONAL / AUDITED

2. VERIFICATION LOGS:
   - Visual Inspection: PASSED
   - Pressure Testing: PASSED (Delta: 0.02)
   - Calibration Date: 2026-08-15

3. AI CONFIDENCE METRICS:
   - OCR Text Accuracy: 98.7%
   - Table Detection Score: 99.1%
  ` : null;

  const handleCopy = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    }
  };

  if (!activeDoc) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-[#0B0C0E] font-sans antialiased">
        <div className="w-10 h-10 bg-[#121417] border border-[#22262F] rounded-xl flex items-center justify-center mx-auto mb-3 text-[#35E6A4] text-sm">
          ⚡
        </div>
        <h3 className="text-[13px] font-semibold text-[#ECECF1] mb-1">Where should we begin?</h3>
        <p className="text-[12px] text-[#8E8EA0] max-w-xs leading-relaxed">
          Select a document and draw an ROI box in the canvas tab to view AI OCR insights and extracted text here.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0B0C0E] text-[#ECECF1] overflow-hidden font-sans antialiased text-xs">
      {/* Control Bar */}
      <div className="bg-[#121417] border-b border-[#22262F] px-3.5 py-2.5 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2.5 font-mono text-[10px]">
          <span className="w-2 h-2 rounded-full bg-[#35E6A4] animate-pulse" />
          <span className="text-[#ECECF1] font-semibold tracking-tight uppercase">Streaming Output</span>
          <span className="text-[#22262F]">|</span>
          <span className="text-[#35E6A4]">Tokens: 142/s</span>
        </div>

        <button
          onClick={handleCopy}
          className="px-2.5 py-1 bg-[#181B20] hover:bg-[#22262F] text-[#C5C5D2] rounded font-sans text-[11px] font-medium border border-[#22262F] transition-colors cursor-pointer"
        >
          {isCopying ? '✓ Copied' : '📋 Copy Plain Text'}
        </button>
      </div>

      {/* Stream View Body */}
      <div className="flex-1 p-3.5 overflow-y-auto text-xs leading-relaxed space-y-3 custom-scrollbar">
        {/* Raw Code / Log Output Box */}
        <div className="border border-[#22262F] bg-[#0D0E11] rounded-lg p-3.5 font-mono">
          <pre className="text-[#35E6A4] whitespace-pre-wrap text-[11px] leading-relaxed selection:bg-[#35E6A4]/20">
            {extractedText}
          </pre>
        </div>

        {/* Structured Summary Cards */}
        <div className="border border-[#22262F] rounded-lg p-3.5 bg-[#121417]/80">
          <h4 className="text-[10px] font-semibold text-[#8E8EA0] uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-mono">
            <span>🏷️</span> Key-Value Extraction Summary
          </h4>
          <div className="grid grid-cols-2 gap-2 text-[12px]">
            <div className="bg-[#0B0C0E] p-2.5 rounded-md border border-[#22262F]">
              <span className="text-[#8E8EA0] block text-[9px] font-mono uppercase tracking-wide">EQUIPMENT TYPE</span>
              <span className="font-medium text-[#ECECF1] mt-0.5 block">Pressure Relief Valve</span>
            </div>
            <div className="bg-[#0B0C0E] p-2.5 rounded-md border border-[#22262F]">
              <span className="text-[#8E8EA0] block text-[9px] font-mono uppercase tracking-wide">AUDIT STATUS</span>
              <span className="font-medium text-[#35E6A4] mt-0.5 block">Verified & Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}