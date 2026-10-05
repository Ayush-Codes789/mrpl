import React, { useState, useEffect, useCallback } from 'react';

// Layout Components
import MetaSEO from '../components/layout/MetaSEO';
import Header from '../components/layout/Header';
import AuditFooter from '../components/layout/AuditFooter';

// Workspace Components
import DocumentSidebar from '../components/workspace/DocumentSidebar';
import RoiCanvas from '../components/workspace/RoiCanvas';
import TerminalConsole from '../components/workspace/TerminalConsole';
import Deliverables from '../components/workspace/Deliverables';
import CodexChatbot from '../components/workspace/CodexChatbot';

// Icons
import { 
  Folder, 
  Terminal, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  Activity,
  Layers,
  CheckCircle2,
  X
} from 'lucide-react';

export default function Workbench() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isBottomDockOpen, setIsBottomDockOpen] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState('terminal'); // 'terminal' | 'deliverables'

  const [currentStep, setCurrentStep] = useState(1);
  const [activeDoc, setActiveDoc] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    const timer = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectDocument = useCallback((doc) => {
    setActiveDoc(doc);
    setCurrentStep(2);
    showToast(`Loaded Document: ${doc?.name || 'Selected File'}`);
  }, [showToast]);

  const handleClearDocument = useCallback(() => {
    setActiveDoc(null);
    setCurrentStep(1);
    showToast('Document deselected');
  }, [showToast]);

  const handleRoiCaptured = useCallback((roiData) => {
    if (roiData) {
      setCurrentStep(4);
      showToast(`Captured ROI (${Math.round(roiData.width)}x${Math.round(roiData.height)}). Routing to ${roiData.selectedTool || 'Agent'}...`);
    }
  }, [showToast]);

  // Phase 4: Global Hotkeys & Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle Terminal Dock
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setIsBottomDockOpen((prev) => !prev);
      }
      // Toggle Left Explorer
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
      // Quick Escape
      if (e.key === 'Escape') {
        setIsBottomDockOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <MetaSEO title="Sovereign AI Agentic Workbench" />

      {/* Font configuration applied via standard Inter + JetBrains Mono style classes */}
      <div className="h-screen max-h-screen w-full flex flex-col bg-[#08090A] overflow-hidden font-sans antialiased select-none text-[#ECEED2] relative">
        
        {/* Floating Toast Notification Overlay */}
        {toastMessage && (
          <div className="absolute top-12 right-6 bg-[#121417]/95 border border-[#10B981]/40 text-[#F1F5F9] text-xs px-3.5 py-2.5 rounded-lg shadow-2xl backdrop-blur-md flex items-center gap-2.5 z-50 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span className="font-medium tracking-tight text-slate-200">{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {Header && <Header />}

        {/* Workflow Stepper Header */}
        <div className="bg-[#0D0F12] border-b border-[#1E222A] px-4 py-2 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-tight">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <strong className="text-slate-200 font-medium uppercase tracking-wider text-[15px]"><h2>WORKFLOW:</h2></strong>
            </div>

            <div className="hidden md:flex items-center gap-2 font-mono text-[11px]">
              <span className={`px-2.5 py-0.5 rounded border transition-colors ${currentStep >= 1 ? 'border-[#10B981]/30 bg-[#10B981]/10 text-[#34D399] font-medium' : 'border-[#1E222A] bg-[#121417] text-slate-500'}`}>
                1. Add Documents
              </span>
              <span className="text-slate-600">→</span>
              <span className={`px-2.5 py-0.5 rounded border transition-colors ${currentStep >= 2 ? 'border-[#10B981]/30 bg-[#10B981]/10 text-[#34D399] font-medium' : 'border-[#1E222A] bg-[#121417] text-slate-500'}`}>
                2. Understand & Search
              </span>
              <span className="text-slate-600">→</span>
              <span className={`px-2.5 py-0.5 rounded border transition-colors ${currentStep >= 3 ? 'border-[#10B981]/30 bg-[#10B981]/10 text-[#34D399] font-medium' : 'border-[#1E222A] bg-[#121417] text-slate-500'}`}>
                3. Plan Actions
              </span>
              <span className="text-slate-600">→</span>
              <span className={`px-2.5 py-0.5 rounded border transition-colors ${currentStep >= 4 ? 'border-[#10B981]/30 bg-[#10B981]/10 text-[#34D399] font-medium' : 'border-[#1E222A] bg-[#121417] text-slate-500'}`}>
                4. Run Tasks
              </span>
              <span className="text-slate-600">→</span>
              <span className={`px-2.5 py-0.5 rounded border transition-colors ${currentStep >= 5 ? 'border-[#10B981]/30 bg-[#10B981]/10 text-[#34D399] font-medium' : 'border-[#1E222A] bg-[#121417] text-slate-500'}`}>
                5. Deliverables
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono text-slate-500">
            <span className="hidden lg:inline">
              <kbd className="px-1.5 py-0.5 bg-[#16191E] text-slate-300 rounded border border-[#232730] text-[10px]">Ctrl+B</kbd> Sidebar <span className="mx-1 text-slate-600">|</span> <kbd className="px-1.5 py-0.5 bg-[#16191E] text-slate-300 rounded border border-[#232730] text-[10px]">Ctrl+`</kbd> Terminal
            </span>
          </div>
        </div>

        {/* Dual Pane Main Area */}
        <div className="flex-1 flex overflow-hidden min-h-0 bg-[#08090A] p-2 gap-2 relative">
          
          <aside className={`bg-[#0D0F12] border border-[#1E222A] rounded-lg flex flex-col transition-all duration-200 relative z-20 ${isSidebarOpen ? 'w-64' : 'w-12 items-center'}`}>
            <div className="p-2.5 border-b border-[#1E222A] flex items-center justify-between shrink-0 w-full">
              {isSidebarOpen ? (
                <>
                  <h2 className="text-xs font-semibold text-slate-200 tracking-tight flex items-center gap-2">
                    <Folder className="w-3.5 h-3.5 text-[#10B981]" /> Workspace Intake
                  </h2>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-1 text-slate-400 hover:text-white hover:bg-[#16191E] rounded transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button onClick={() => setIsSidebarOpen(true)} className="p-1 text-slate-400 hover:text-[#10B981] hover:bg-[#16191E] rounded transition-colors mx-auto">
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto w-full min-h-0">
              {isSidebarOpen ? (
                <DocumentSidebar activeDoc={activeDoc} onSelectDocument={handleSelectDocument} />
              ) : (
                <div className="flex flex-col items-center py-4 gap-4 text-slate-500">
                  <Layers className="w-4 h-4 hover:text-[#10B981] transition-colors cursor-pointer" onClick={() => setIsSidebarOpen(true)} />
                </div>
              )}
            </div>
          </aside>

          <main className="flex-1 grid grid-cols-12 gap-2 min-h-0 overflow-hidden">
            <section className="col-span-12 lg:col-span-6 bg-[#0D0F12] border border-[#1E222A] rounded-lg flex flex-col overflow-hidden">
              <div className="px-3.5 py-2 border-b border-[#1E222A] bg-[#121417]/60 flex items-center justify-between shrink-0">
                <span className="text-xs font-medium text-slate-200 tracking-tight flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Document Workspace
                </span>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">Crop & Scan Active</span>
              </div>
              <div className="flex-1 overflow-hidden relative min-h-0">
                <RoiCanvas activeDoc={activeDoc} onSelectFile={handleSelectDocument} onRoiCaptured={handleRoiCaptured} />
              </div>
            </section>

            <section className="col-span-12 lg:col-span-6 bg-[#0D0F12] border border-[#1E222A] rounded-lg flex flex-col overflow-hidden">
              <div className="px-3.5 py-2 border-b border-[#1E222A] bg-[#121417]/60 flex items-center justify-between shrink-0">
                <span className="text-xs font-medium text-slate-200 tracking-tight flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-[#10B981]" /> AI Co-Pilot
                </span>
                <span className="text-[10px] bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/20 px-2 py-0.5 rounded font-mono font-medium">
                  LangGraph Connected
                </span>
              </div>
              <div className="flex-1 overflow-hidden relative min-h-0">
                <CodexChatbot activeDoc={activeDoc} onClearActiveDoc={handleClearDocument} />
              </div>
            </section>
          </main>
        </div>

        {/* Collapsible Execution Dock */}
        <div className={`bg-[#0D0F12] border-t border-[#1E222A] transition-all duration-200 flex flex-col shrink-0 ${isBottomDockOpen ? 'h-52' : 'h-8'}`}>
          <div className="px-3 py-1 bg-[#08090A] border-b border-[#1E222A] flex items-center justify-between shrink-0 text-xs">
            <div className="flex items-center gap-2 font-medium">
              <button 
                onClick={() => { setIsBottomDockOpen(true); setActiveBottomTab('terminal'); }}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] transition-colors ${activeBottomTab === 'terminal' && isBottomDockOpen ? 'bg-[#1A1D24] text-[#34D399] font-medium' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Terminal className="w-3.5 h-3.5" /> Terminal & Audit Log
              </button>
              <button 
                onClick={() => { setIsBottomDockOpen(true); setActiveBottomTab('deliverables'); }}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] transition-colors ${activeBottomTab === 'deliverables' && isBottomDockOpen ? 'bg-[#1A1D24] text-[#34D399] font-medium' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Download className="w-3.5 h-3.5" /> Generated Deliverables
              </button>
            </div>

            <button onClick={() => setIsBottomDockOpen((prev) => !prev)} className="p-1 text-slate-400 hover:text-white transition-colors">
              {isBottomDockOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>

          {isBottomDockOpen && (
            <div className="flex-1 overflow-hidden p-2 min-h-0">
              {activeBottomTab === 'terminal' ? (
                <TerminalConsole />
              ) : (
                <Deliverables activeDoc={activeDoc} onExportComplete={() => setCurrentStep(5)} />
              )}
            </div>
          )}
        </div>

        {AuditFooter && <AuditFooter />}
      </div>
    </>
  );
}