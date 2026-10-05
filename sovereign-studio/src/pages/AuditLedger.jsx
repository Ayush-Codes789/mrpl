import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  Cpu,
  FileCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Search,
  Key
} from 'lucide-react';

const mockLogs = [
  {
    id: 'LOG-9842-X1',
    timestamp: '2026-09-18 01:42:19.004 UTC',
    agent: 'Qwen3-VL-VisionCore',
    action: 'DOCUMENT_ROI_OCR_EXTRACT',
    document: 'aadhaar_sample_09.pdf',
    hash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    latency: '142ms',
    confidence: '99.4%',
    status: 'VERIFIED',
    mode: 'Air-Gapped Local'
  },
  {
    id: 'LOG-9841-X8',
    timestamp: '2026-09-18 01:40:02.811 UTC',
    agent: 'Agent-02-Sanitizer',
    action: 'PII_REDACTION_ENFORCED',
    document: 'financial_record_2026.png',
    hash: 'sha256:8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    latency: '89ms',
    confidence: '100%',
    status: 'VERIFIED',
    mode: 'Air-Gapped Local'
  },
  {
    id: 'LOG-9840-X4',
    timestamp: '2026-09-18 01:35:44.220 UTC',
    agent: 'CrossCheck-Validator',
    action: 'DB_SCHEMA_ALIGNMENT',
    document: 'invoice_batch_12.json',
    hash: 'sha256:7d855728d7507c56a31d3a774c4c2e4b85723ee705f007bbd235c08f9659dc6b',
    latency: '210ms',
    confidence: '94.8%',
    status: 'FLAGGED_REVIEW',
    mode: 'Cloud Burst'
  }
];

export default function AuditLedger() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-[#08090A] text-[#ECECF1] font-sans antialiased selection:bg-[#10B981]/20">

      <div className="max-w-[1500px] mx-auto px-6 lg:px-8 py-7">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b border-[#1E222A]">

          <div className="space-y-2">

            <div className="flex items-center gap-2.5">

              <ShieldCheck className="w-5 h-5 text-[#35E6A4]" />

              <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#A7AFBA]">
                Audit Ledger
              </span>

              <span className="h-1 w-1 rounded-full bg-[#35E6A4]" />

              <span className="text-[10px] font-bold font-mono text-[#7F8996]">
                SHA-256
              </span>

            </div>

            <h1 className="text-[26px] leading-tight font-bold tracking-[-0.025em] text-white">
              Cryptographic Audit Trail
            </h1>

            <p className="text-[12px] leading-5 font-medium text-[#8D96A3] max-w-[620px]">
              Immutable verification records for local agent execution and
              air-gapped document processing.
            </p>

          </div>

          <button
            className="
              self-start
              md:self-auto
              inline-flex
              items-center
              gap-2
              bg-[#121417]
              hover:bg-[#181B20]
              border
              border-[#252A32]
              hover:border-[#35E6A4]/40
              text-[#E5E7EB]
              text-[11px]
              font-semibold
              px-3.5
              py-2
              rounded-md
              transition-all
            "
          >
            <Download className="w-3.5 h-3.5 text-[#35E6A4]" />
            Export Certificate
          </button>

        </header>


        {/* SYSTEM SUMMARY */}
        <div className="mt-5 mb-6 border-y border-[#1E222A]">

          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#1E222A]">

            <SystemMetric
              icon={<Lock />}
              label="Hash Standard"
              value="SHA-256 Strict"
              detail="Zero-Knowledge"
            />

            <SystemMetric
              icon={<Cpu />}
              label="Execution"
              value="Air-Gapped Local"
              detail="Zero External Egress"
            />

            <SystemMetric
              icon={<Clock />}
              label="Avg. Latency"
              value="147 ms"
              detail="OCR Pipeline"
            />

            <SystemMetric
              icon={<FileCheck />}
              label="Verification"
              value="99.82%"
              detail="Agent Validation"
            />

          </div>

        </div>


        {/* AUDIT SECTION */}
        <section>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">

            <div>

              <h2 className="text-sm font-bold text-[#F1F3F5]">
                Verification Events
              </h2>

              <p className="text-[10px] font-medium text-[#7F8996] mt-0.5">
                Local execution history
              </p>

            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#7F8996]">

              <span className="w-1.5 h-1.5 rounded-full bg-[#35E6A4] animate-pulse" />

              Ledger stream active

            </div>

          </div>


          {/* TABLE */}
          <div className="border border-[#1E222A] rounded-lg overflow-hidden bg-[#0D0F12]">

            {/* TOOLBAR */}
            <div className="px-3.5 py-2.5 border-b border-[#1E222A] flex items-center justify-between bg-[#0B0C0E]">

              <div className="relative w-full max-w-[320px]">

                <Search className="w-3.5 h-3.5 text-[#6F7885] absolute left-3 top-1/2 -translate-y-1/2" />

                <input
                  type="text"
                  placeholder="Search logs, hashes or agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                    w-full
                    bg-[#08090A]
                    border border-[#1E222A]
                    focus:border-[#35E6A4]/50
                    text-[11px]
                    font-medium
                    text-[#E2E5E9]
                    placeholder:text-[#68717D]
                    pl-8
                    pr-3
                    py-2
                    rounded-md
                    focus:outline-none
                    transition-colors
                  "
                />

              </div>

            </div>


            {/* TABLE */}
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px] text-left border-collapse">

                <thead>

                  <tr className="border-b border-[#1E222A] bg-[#0B0C0E]">

                    <TableHeader>Entry</TableHeader>
                    <TableHeader>Agent</TableHeader>
                    <TableHeader>Action</TableHeader>
                    <TableHeader>Hash</TableHeader>
                    <TableHeader>Confidence</TableHeader>
                    <TableHeader>Status</TableHeader>

                  </tr>

                </thead>


                <tbody>

                  {mockLogs.map((log) => (

                    <tr
                      key={log.id}
                      className="
                        border-b
                        border-[#1E222A]/70
                        last:border-b-0
                        hover:bg-[#35E6A4]/[0.025]
                        transition-colors
                      "
                    >

                      {/* ENTRY */}
                      <td className="px-3.5 py-3.5">

                        <div className="font-mono text-[11px] font-bold text-[#E5E7EB]">
                          {log.id}
                        </div>

                        <div className="font-mono text-[9px] font-medium text-[#737D89] mt-1 whitespace-nowrap">
                          {log.timestamp}
                        </div>

                      </td>


                      {/* AGENT */}
                      <td className="px-3.5 py-3.5">

                        <div className="flex items-center gap-2">

                          <Cpu className="w-3.5 h-3.5 text-[#35E6A4] shrink-0" />

                          <span className="text-[11px] font-semibold text-[#C5CBD3] whitespace-nowrap">
                            {log.agent}
                          </span>

                        </div>

                      </td>


                      {/* ACTION */}
                      <td className="px-3.5 py-3.5">

                        <div className="font-mono text-[10px] font-bold text-[#E0E4E8] whitespace-nowrap">
                          {log.action}
                        </div>

                        <div className="text-[9px] font-medium text-[#737D89] mt-1">
                          {log.document}
                        </div>

                      </td>


                      {/* HASH */}
                      <td className="px-3.5 py-3.5">

                        <div className="flex items-center gap-1.5">

                          <Key className="w-3 h-3 text-[#35E6A4] shrink-0" />

                          <span className="font-mono text-[10px] font-medium text-[#818B98] whitespace-nowrap">
                            {log.hash.substring(0, 18)}...
                          </span>

                        </div>

                      </td>


                      {/* CONFIDENCE */}
                      <td className="px-3.5 py-3.5">

                        <div className="text-[11px] font-bold text-[#35E6A4]">
                          {log.confidence}
                        </div>

                        <div className="font-mono text-[9px] font-medium text-[#737D89] mt-1">
                          {log.latency}
                        </div>

                      </td>


                      {/* STATUS */}
                      <td className="px-3.5 py-3.5">

                        {log.status === 'VERIFIED' ? (

                          <span className="
                            inline-flex
                            items-center
                            gap-1.5
                            text-[#35E6A4]
                            text-[10px]
                            font-bold
                          ">

                            <CheckCircle2 className="w-3.5 h-3.5" />

                            Verified

                          </span>

                        ) : (

                          <span className="
                            inline-flex
                            items-center
                            gap-1.5
                            text-amber-400
                            text-[10px]
                            font-bold
                          ">

                            <AlertTriangle className="w-3.5 h-3.5" />

                            Review

                          </span>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}


/* SYSTEM METRIC */

function SystemMetric({ icon, label, value, detail }) {
  return (
    <div className="px-4 py-3.5">

      <div className="flex items-center gap-1.5 mb-1.5">

        <span className="text-[#35E6A4]">
          {React.cloneElement(icon, {
            className: 'w-3.5 h-3.5'
          })}
        </span>

        <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#737D89]">
          {label}
        </span>

      </div>

      <div className="text-[12px] font-bold text-[#E8EAED]">
        {value}
      </div>

      <div className="text-[9px] font-medium text-[#737D89] mt-0.5">
        {detail}
      </div>

    </div>
  );
}


/* TABLE HEADER */

function TableHeader({ children }) {
  return (
    <th className="
      px-3.5
      py-2.5
      text-[9px]
      uppercase
      tracking-[0.08em]
      font-bold
      text-[#737D89]
      whitespace-nowrap
    ">
      {children}
    </th>
  );
}