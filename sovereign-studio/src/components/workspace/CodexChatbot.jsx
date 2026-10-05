import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  X,
  Bot,
  FileCheck,
  Download,
  ShieldCheck,
  Terminal,
  Loader2
} from 'lucide-react';
import { apiService } from '../../services/api';

// Resolve just the filename from a full path string
function basename(p) {
  return String(p).split(/[/\\]/).pop() || String(p);
}

export default function CodexChatbot({
  activeDoc,
  onClearActiveDoc,
  onSelectDocument
}) {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentSteps, setAgentSteps] = useState([]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      type: 'text',
      text: 'Hello! Sovereign AI Co-Pilot ready. Upload a photo or document, then ask me to read, extract, or analyse it.',
      timestamp: 'Just now'
    }
  ]);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const docName =
    typeof activeDoc === 'string'
      ? activeDoc
      : activeDoc?.name;

  // Scroll to bottom on new messages / steps
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, agentSteps]);

  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    // Upload to backend so agent gets a server-side path
    try {
      const uploaded = await apiService.uploadDocument(file, 'general');
      if (onSelectDocument) onSelectDocument(uploaded);
    } catch {
      // Fall back: just pass the File object so the canvas can preview it
      if (onSelectDocument) onSelectDocument(file);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userText = input.trim();

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      type: 'text',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);
    setAgentSteps([]);

    // Placeholder streaming message
    const streamingId = Date.now() + 1;
    const streamingMsg = {
      id: streamingId,
      sender: 'ai',
      type: 'streaming',
      text: '',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setMessages((prev) => [...prev, streamingMsg]);

    // Resolve the server-side path for the active document
    const attachedFile = activeDoc?.path || activeDoc?.url || null;

    const nodeLabels = {
      route: '🎯 Routing query to best model...',
      plan: '📋 Planning subtask DAG...',
      execute: '⚙️  Executing subtask tool...',
      evaluate: '🔍 Evaluating confidence score...',
      synthesize: '📝 Synthesising final answer...',
      deliver: '📦 Packaging deliverables...'
    };

    let finalReceived = false;

    try {
      await apiService.streamAgentQuery(
        userText,
        { attached_file: attachedFile, department: 'general' },
        // onEvent
        (nodeName, data) => {
          if (nodeName === 'final' || nodeName === 'error') {
            finalReceived = true;
            setIsProcessing(false);
            setAgentSteps([]);

            const answer =
              nodeName === 'error'
                ? `⚠️ ${data.detail || 'Unknown error from backend.'}`
                : data.final_answer || '*(No answer returned.)*';

            const deliverables = Array.isArray(data.deliverables)
              ? data.deliverables
              : [];

            setMessages((prev) =>
              prev.map((m) =>
                m.id === streamingId
                  ? {
                    ...m,
                    type: 'text',
                    text: answer,
                    deliverables,
                    meta: {
                      task_type: data.task_type,
                      model_tag: data.model_tag,
                      iterations: data.iteration_count,
                      audit_valid: data.audit_valid
                    }
                  }
                  : m
              )
            );
          } else {
            // Intermediate node — update live step indicator
            const label = nodeLabels[nodeName] || `⚡ ${nodeName}...`;
            setAgentSteps((prev) => {
              const next = [...prev];
              if (!next.includes(label)) next.push(label);
              return next;
            });
          }
        },
        // onError
        (err) => {
          finalReceived = true;
          setIsProcessing(false);
          setAgentSteps([]);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === streamingId
                ? { ...m, type: 'text', text: `⚠️ ${err.message}` }
                : m
            )
          );
        }
      );

      // Stream ended without a final node (shouldn't happen, but guard it)
      if (!finalReceived) {
        setIsProcessing(false);
        setAgentSteps([]);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingId
              ? { ...m, type: 'text', text: '*(Stream ended without result.)*' }
              : m
          )
        );
      }
    } catch (err) {
      setIsProcessing(false);
      setAgentSteps([]);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === streamingId
            ? {
              ...m,
              type: 'text',
              text: `⚠️ Could not reach backend: ${err.message}. Make sure the FastAPI server is running (python run.py).`
            }
            : m
        )
      );
    }
  };

  return (
    <div
      className="flex flex-col h-full w-full bg-[#08090A] overflow-hidden select-none text-slate-200"
      style={{
        fontFamily:
          'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >

      {/* ── CHAT AREA ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3.5 space-y-4 min-h-0 scrollbar-thin scrollbar-thumb-[#1E222A] scrollbar-track-transparent">

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 text-[13px] ${msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
          >

            {/* AI avatar */}
            {msg.sender === 'ai' && (
              <div className="w-6 h-6 rounded-md bg-[#121417] border border-[#1E222A] flex items-center justify-center text-[#10B981] shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[86%] space-y-1.5 flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
            >

              {/* Message bubble */}
              <div
                className={`text-[13px] leading-[1.65] tracking-[-0.006em] whitespace-pre-wrap break-words ${msg.sender === 'user'
                    ? 'px-3.5 py-2.5 bg-[#10B981] text-[#08090A] font-medium rounded-xl rounded-tr-md'
                    : 'px-1 py-0.5 bg-transparent text-[#d4d7dc] font-normal'
                  }`}
              >
                {msg.text || (msg.type === 'streaming' && (
                  <span className="text-[#10B981] animate-pulse font-mono text-[11px]">
                    Agent thinking…
                  </span>
                ))}
              </div>

              {/* Deliverables list */}
              {msg.deliverables && msg.deliverables.length > 0 && (
                <div className="w-full mt-1 p-2.5 bg-[#0D0F12] border border-[#1E222A] rounded-lg space-y-1.5">
                  <p className="text-[10px] font-mono text-[#8f969f] uppercase tracking-wider">
                    Generated Deliverables
                  </p>
                  {msg.deliverables.map((d, i) => {
                    const name = basename(d);
                    return (
                      <a
                        key={i}
                        href={apiService.getDownloadUrl(name)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded bg-[#121417] border border-[#1E222A] hover:border-[#10B981]/50 text-[#34D399] text-[11px] font-mono transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate text-[#c5cad1]">{name}</span>
                      </a>
                    );
                  })}
                </div>
              )}

              {/* Agent meta summary (task type, model, etc.) */}
              {msg.meta && (
                <div className="w-full grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                  {[
                    ['Task', msg.meta.task_type],
                    ['Model', msg.meta.model_tag],
                    ['Iterations', msg.meta.iterations],
                    ['Audit', msg.meta.audit_valid ? '✅ Verified' : '❌ Failed']
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="bg-[#0D0F12] border border-[#1E222A] rounded px-2 py-1"
                    >
                      <span className="text-[#555b64] block text-[9px] uppercase">{label}</span>
                      <span className="text-[#b8bec7]">{value ?? '—'}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Timestamp */}
              <span className="text-[9px] text-[#555b64] px-1 font-mono tracking-[0.01em]">
                {msg.timestamp}
              </span>

            </div>
          </div>
        ))}

        {/* ── LIVE PIPELINE STEPS ── */}
        {isProcessing && (
          <div className="flex gap-2.5 text-[12px] justify-start">
            <div className="w-6 h-6 rounded-md bg-[#121417] border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shrink-0 mt-0.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="max-w-[86%] bg-[#0D0F12] border border-[#1E222A] rounded-lg p-3 font-mono text-[10.5px] space-y-2 shadow-sm">
              <div className="flex items-center gap-1.5 text-[#8f969f] pb-2 border-b border-[#1E222A]/70">
                <Terminal className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-[9px] font-semibold tracking-[0.08em] uppercase text-[#aeb4bc]">
                  Agentic Task Pipeline
                </span>
              </div>
              <div className="space-y-1.5">
                {agentSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[#9fa7b1]">
                    <span className="text-[#10B981] text-[12px]">›</span>
                    <span className="leading-[1.4]">{step}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 text-[#646b75] animate-pulse pt-0.5">
                  <span className="text-[#10B981] text-[12px]">›</span>
                  <span>Executing step…</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── INPUT AREA ───────────────────────────────────── */}
      <div className="p-2.5 bg-[#0D0F12] border-t border-[#1E222A] shrink-0 space-y-2">

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.txt,.csv,.json,.docx"
        />

        {/* Active document pill */}
        {docName && (
          <div className="flex items-center justify-between bg-[#121417] border border-[#10B981]/30 px-2.5 py-1.5 rounded-md text-xs text-[#34D399]">
            <div className="flex items-center gap-2 truncate">
              <FileCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
              <span className="truncate font-mono text-[10px] tracking-[-0.002em]">
                <strong className="text-[#8f969f] font-normal">Active:</strong>{' '}
                <span className="text-[#c5cad1]">{docName}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={onClearActiveDoc}
              className="p-0.5 rounded hover:bg-[#1E222A] text-slate-500 hover:text-red-400 transition-colors"
              title="Deselect File"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Text + send */}
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 bg-[#08090A] border border-[#1E222A] focus-within:border-[#10B981]/50 rounded-lg px-2.5 py-1.5 transition-colors"
        >
          <button
            type="button"
            onClick={handlePaperclipClick}
            disabled={isProcessing}
            className="text-slate-500 hover:text-[#10B981] p-1 shrink-0 transition-colors disabled:opacity-50"
            title="Upload Document / Photo"
          >
            <Paperclip className="w-3.5 h-3.5" />
          </button>

          <input
            type="text"
            value={input}
            disabled={isProcessing}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isProcessing
                ? 'Agent executing workflow…'
                : docName
                  ? `Ask AI Agent about "${docName}"…`
                  : 'Instruction for Agent Co-Pilot…'
            }
            className="flex-1 bg-transparent text-[12px] leading-5 text-[#d7d9dd] placeholder-[#626872] focus:outline-none disabled:opacity-50 font-normal tracking-[-0.005em]"
          />

          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="w-6 h-6 rounded-md bg-[#121417] border border-[#1E222A] text-[#10B981] hover:bg-[#10B981] hover:text-[#08090A] flex items-center justify-center shrink-0 transition-colors disabled:opacity-40"
          >
            {isProcessing
              ? <Loader2 className="w-3 h-3 animate-spin" />
              : <Send className="w-3 h-3" />
            }
          </button>
        </form>

        {/* Hint when no doc is active */}
        {!docName && (
          <p className="text-[9px] text-[#555b64] font-mono text-center tracking-[0.01em]">
            <ShieldCheck className="inline w-3 h-3 text-[#10B981] mr-1" />
            All inference runs locally — no data leaves the machine.
          </p>
        )}

      </div>
    </div>
  );
}