import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Terminal, Shield, Cpu, Database, FileText, Lock } from 'lucide-react';

const FEATURE_DATA = {
  'document-intake': {
    title: 'Document Intake Engine',
    category: 'Extraction & Processing',
    icon: FileText,
    description: 'Local PDF & scanned document extraction engine with zero external network connectivity.',
    specs: ['Air-Gapped Processing', 'OCR & Layout Parsing', 'Table Structural Extraction', 'Bounding Box Tagging']
  },
  'roi-inspector': {
    title: 'ROI Spatial Inspector',
    category: 'Visual Intelligence',
    icon: Cpu,
    description: 'Precise bounding box selection to crop and isolate regions for Qwen3-VL analysis.',
    specs: ['Canvas Bounding Box', 'Interactive ROI Crop', 'Dynamic Context Isolation', 'Zero Token Overhead']
  },
  'local-rag': {
    title: 'Local RAG Vectors',
    category: 'Local Search & Indexing',
    icon: Database,
    description: 'ChromaDB vector embedding pipeline running entirely inside local client memory.',
    specs: ['ChromaDB Local Vector DB', 'BM25 Hybrid Search', 'Zero Cloud Leakage', 'Instant Local Query']
  },
  'wasm-sandbox': {
    title: 'WASM Sandbox Engine',
    category: 'Execution Safety',
    icon: Terminal,
    description: 'Browser-isolated Python execution environment for data calculation and schema audits.',
    specs: ['Pyodide/WASM Container', 'Isolated Process Memory', 'CSV & JSON Data Audit', 'Zero Outbound Traffic']
  },
  'audit-ledger': {
    title: 'Audit Ledger Engine',
    category: 'Security & Verification',
    icon: Lock,
    description: 'Cryptographic tamper-proof logging system to track all local AI operations and model execution verification.',
    specs: ['Cryptographic Audit Trail', 'Zero Outbound Verification', 'Tamper-Proof Session Logs', 'Local Chain Validation']
  }
};

export default function ProductDetail() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'document-intake';
  const data = FEATURE_DATA[tab] || FEATURE_DATA['document-intake'];
  const Icon = data.icon;

  return (
    <div className="flex-1 bg-[#0B0C0E] text-[#F7F8F8] p-8 md:p-12 max-w-5xl mx-auto w-full">
      <Link to="/workbench" className="inline-flex items-center gap-2 text-xs font-mono text-[#35E6A4] hover:underline mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Studio Workbench
      </Link>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#121417] border border-[#22262F] rounded-xl text-[#35E6A4]">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-[#35E6A4] uppercase tracking-wider">{data.category}</span>
            <h1 className="text-3xl font-bold tracking-tight text-[#F7F8F8]">{data.title}</h1>
          </div>
        </div>

        <p className="text-base text-[#8A8F98] max-w-2xl leading-relaxed">{data.description}</p>

        <div className="pt-6 border-t border-[#22262F]">
          <h3 className="text-sm font-semibold text-[#F7F8F8] mb-4">Core Architecture Specifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.specs.map((spec, idx) => (
              <div key={idx} className="p-3 bg-[#121417] border border-[#22262F] rounded-lg text-xs font-mono text-[#D0D4DC] flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#35E6A4]" /> {spec}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}