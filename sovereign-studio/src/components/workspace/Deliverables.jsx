import React from 'react';

export default function Deliverables({ activeDoc, onExportComplete }) {
  const sampleFiles = [
    {
      name: 'Approval_Note_Draft.docx',
      type: 'DOCX',
      size: '142 KB'
    },
    {
      name: 'Field_Audit_Metrics.xlsx',
      type: 'XLSX',
      size: '88 KB'
    }
  ];

  const handleDownload = (fileName) => {
    if (onExportComplete) onExportComplete();

    alert(`Downloading ${fileName} from local storage...`);
  };

  return (
    <div className="h-full min-h-0 flex flex-col bg-[#0B0C0E] text-[#ECECF1] overflow-hidden font-sans text-xs antialiased">

      {/* HEADER BAR */}
      <div className="px-4 py-2.5 border-b border-[#22262F] bg-[#121417] flex items-center justify-between shrink-0">

        <span className="font-semibold text-[#8E8EA0] uppercase text-[10px] tracking-[0.08em] font-mono">
          Generated Deliverables
        </span>

        <span className="px-2.5 py-1 rounded bg-[#35E6A4]/10 text-[#35E6A4] border border-[#35E6A4]/20 text-[9px] font-mono font-medium tracking-[0.05em]">
          READY
        </span>

      </div>

      {/* LIST AREA */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-5 space-y-2.5 custom-scrollbar">

        {sampleFiles.map((file, idx) => (
          <div
            key={idx}
            className="w-full bg-[#121417] border border-[#22262F] hover:border-[#35E6A4]/40 px-4 py-3 rounded-lg flex items-center justify-between transition-all group shrink-0"
          >

            {/* FILE INFO */}
            <div className="flex items-center gap-3 overflow-hidden pr-3 min-w-0">

              <div className="w-7 h-7 rounded-md bg-[#0B0C0E] border border-[#22262F] flex items-center justify-center shrink-0">
                <span className="text-[#35E6A4] text-sm">
                  📄
                </span>
              </div>

              <div className="min-w-0 truncate">

                <p className="text-[#ECECF1] font-medium truncate text-[12px] leading-5 tracking-[-0.005em]">
                  {file.name}
                </p>

                <span className="text-[#8E8EA0] text-[10px] font-mono">
                  {file.size}
                </span>

              </div>

            </div>

            {/* DOWNLOAD BUTTON */}
            <button
              onClick={() => handleDownload(file.name)}
              className="px-3.5 py-1.5 rounded bg-[#35E6A4] hover:bg-[#2FD193] text-[#0B0C0E] font-semibold text-[10px] font-sans transition-colors cursor-pointer shrink-0 shadow-sm"
            >
              Download
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}