import React, { useRef, useState } from 'react';
import {
  FileText,
  Upload,
  Trash2,
  Cpu,
  Plus,
  ChevronDown,
  Clock,
  Loader2
} from 'lucide-react';
import { apiService } from '../../services/api';

export default function DocumentSidebar({
  activeDoc,
  onSelectDocument,
  selectedModel,
  setSelectedModel
}) {
  const fileInputRef = useRef(null);

  // Sample Documents List
  const sampleDocs = [
    {
      id: 's1',
      name: 'sop_approval_note_format.txt',
      size: '12 KB',
      type: 'Sample'
    },
    {
      id: 's2',
      name: 'sop_pressure_relief_valve.txt',
      size: '48 KB',
      type: 'Sample'
    }
  ];

  // Uploaded Files State
  const [uploadedHistory, setUploadedHistory] = useState([]);

  // Upload loading state
  const [isUploading, setIsUploading] = useState(false);

  // ============================================================
  // UPLOAD DOCUMENT
  // ============================================================
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];

    // Reset input so the same file can be selected again
    e.target.value = '';

    if (!file) return;

    setIsUploading(true);

    try {
      console.log('[DocumentSidebar] Uploading:', file.name);

      // Send file to backend
      const uploaded = await apiService.uploadDocument(
        file,
        'general'
      );

      console.log(
        '[DocumentSidebar] Backend response:',
        uploaded
      );

      // IMPORTANT:
      // Keep BOTH:
      // 1. The original browser File
      // 2. Backend information
      const newFileObj = {
        id: uploaded.file_id || Date.now().toString(),

        name: uploaded.name || file.name,

        size:
          uploaded.size ||
          `${(file.size / 1024).toFixed(1)} KB`,

        // IMPORTANT
        // Keep the actual browser File.
        // The document viewer can use this.
        fileObj: file,

        // Backend information
        file_id: uploaded.file_id || null,
        path: uploaded.path || null,

        // Upload/ingestion information
        chunks_ingested: uploaded.chunks_ingested || 0,
        ingest_error: uploaded.ingest_error || null,

        type: 'Uploaded Document'
      };

      console.log(
        '[DocumentSidebar] New document:',
        newFileObj
      );

      // Add to history
      setUploadedHistory((prev) => [
        newFileObj,
        ...prev
      ]);

      // Select uploaded document
      if (onSelectDocument) {
        onSelectDocument(newFileObj);
      }

    } catch (err) {
      console.error(
        '[DocumentSidebar] Upload failed:',
        err
      );

      // Fallback:
      // Even if backend upload fails, keep the browser file
      // so local preview can still work.
      const fallbackDoc = {
        id: Date.now().toString(),

        name: file.name,

        size: `${(file.size / 1024).toFixed(1)} KB`,

        fileObj: file,

        file_id: null,

        path: null,

        chunks_ingested: 0,

        ingest_error: err?.message || 'Upload failed',

        type: 'Uploaded Document'
      };

      setUploadedHistory((prev) => [
        fallbackDoc,
        ...prev
      ]);

      if (onSelectDocument) {
        onSelectDocument(fallbackDoc);
      }

    } finally {
      setIsUploading(false);
    }
  };

  // ============================================================
  // REMOVE DOCUMENT FROM HISTORY
  // ============================================================
  const handleRemoveHistoryItem = (e, id) => {
    e.stopPropagation();

    setUploadedHistory((prev) =>
      prev.filter((item) => item.id !== id)
    );

    if (activeDoc?.id === id) {
      if (onSelectDocument) {
        onSelectDocument(null);
      }
    }
  };

  // ============================================================
  // SELECT UPLOADED DOCUMENT
  // ============================================================
  const handleSelectUploadedDocument = (doc) => {
    console.log(
      '[DocumentSidebar] Selecting uploaded document:',
      doc
    );

    if (onSelectDocument) {
      // Send the COMPLETE object
      onSelectDocument(doc);
    }
  };

  // ============================================================
  // SELECT SAMPLE DOCUMENT
  // ============================================================
  const handleSelectSampleDocument = (doc) => {
    console.log(
      '[DocumentSidebar] Selecting sample document:',
      doc
    );

    if (onSelectDocument) {
      onSelectDocument(doc);
    }
  };

  return (
    <div
      className="
        flex flex-col
        h-full
        bg-[#171717]
        text-slate-300
        w-full
        select-none
        text-xs
        font-sans
        border-r
        border-[#212121]
      "
    >

      {/* ========================================================
          1. TOP SECTION
      ======================================================== */}
      <div
        className="
          p-3
          border-b
          border-[#212121]/60
          flex
          flex-col
          gap-2
        "
      >

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf,.png,.jpg,.jpeg,.txt,.docx"
          className="hidden"
        />

        {/* Upload button */}
        <button
          onClick={() =>
            !isUploading &&
            fileInputRef.current?.click()
          }
          disabled={isUploading}
          className="
            w-full
            flex
            items-center
            justify-between
            px-3
            py-2.5
            rounded-lg
            bg-[#212121]
            hover:bg-[#2F2F2F]
            text-slate-100
            font-medium
            transition-all
            group
            border
            border-white/5
            shadow-sm
            disabled:opacity-60
          "
        >
          <div className="flex items-center gap-2.5">

            {isUploading ? (
              <Loader2
                className="
                  w-4 h-4
                  text-emerald-400
                  animate-spin
                "
              />
            ) : (
              <Plus
                className="
                  w-4 h-4
                  text-slate-400
                  group-hover:text-white
                  transition-colors
                "
              />
            )}

            <span className="text-xs">
              {isUploading
                ? 'Uploading…'
                : 'Upload Document'}
            </span>

          </div>

          <Upload
            className="
              w-3.5
              h-3.5
              text-slate-400
              group-hover:text-emerald-400
              transition-colors
            "
          />
        </button>

        {/* ======================================================
            VISION ENGINE
        ====================================================== */}
        <div className="relative mt-1">

          <div
            className="
              flex
              items-center
              gap-1.5
              px-2
              py-1
              text-[10px]
              text-slate-500
              uppercase
              tracking-wider
              font-mono
            "
          >
            <Cpu className="w-3 h-3" />

            <span>
              Vision Engine
            </span>
          </div>

          <div className="relative flex items-center">

            <select
              value={
                selectedModel || 'tesseract-ocr'
              }
              onChange={(e) =>
                setSelectedModel &&
                setSelectedModel(e.target.value)
              }
              className="
                w-full
                appearance-none
                bg-[#0D0D0D]
                border
                border-[#262626]
                rounded-md
                px-2.5
                py-1.5
                pr-7
                text-slate-300
                text-[11px]
                focus:outline-none
                focus:border-slate-500
                cursor-pointer
                transition-colors
              "
            >

              <option value="tesseract-ocr">
                Tesseract Local OCR (Fast)
              </option>

              <option value="qwen3-vision">
                Qwen3-VL 8B (Vision LLM)
              </option>

              <option value="easyocr-gpu">
                EasyOCR WebGPU (Tables)
              </option>

            </select>

            <ChevronDown
              className="
                w-3 h-3
                text-slate-500
                absolute
                right-2.5
                pointer-events-none
              "
            />

          </div>
        </div>
      </div>

      {/* ========================================================
          2. DOCUMENT LIST
      ======================================================== */}
      <div
        className="
          flex-1
          overflow-y-auto
          p-2
          space-y-4
          custom-scrollbar
        "
      >

        {/* ======================================================
            UPLOADED HISTORY
        ====================================================== */}
        {uploadedHistory.length > 0 && (

          <div className="space-y-1">

            <div
              className="
                px-2
                py-1
                text-[10px]
                font-medium
                text-slate-500
                tracking-wider
                flex
                items-center
                gap-1.5
              "
            >
              <Clock className="w-3 h-3" />

              <span>
                Uploaded History
              </span>
            </div>

            {uploadedHistory.map((doc) => {

              const isSelected =
                activeDoc?.id === doc.id ||
                activeDoc?.name === doc.name;

              return (

                <div
                  key={doc.id}
                  onClick={() =>
                    handleSelectUploadedDocument(doc)
                  }
                  className={`
                    group
                    relative
                    flex
                    items-center
                    justify-between
                    px-2.5
                    py-2
                    rounded-lg
                    cursor-pointer
                    transition-all

                    ${isSelected
                      ? `
                          bg-[#212121]
                          text-white
                          font-medium
                        `
                      : `
                          hover:bg-[#212121]/50
                          text-slate-400
                          hover:text-slate-200
                        `
                    }
                  `}
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-2.5
                      overflow-hidden
                      pr-6
                    "
                  >

                    <FileText
                      className={`
                        w-3.5
                        h-3.5
                        shrink-0

                        ${isSelected
                          ? 'text-emerald-400'
                          : 'text-slate-500'
                        }
                      `}
                    />

                    <span
                      className="
                        truncate
                        text-[12px]
                      "
                    >
                      {doc.name}
                    </span>

                  </div>

                  {/* Delete */}
                  <button
                    onClick={(e) =>
                      handleRemoveHistoryItem(
                        e,
                        doc.id
                      )
                    }
                    className="
                      opacity-0
                      group-hover:opacity-100
                      p-1
                      hover:text-red-400
                      text-slate-500
                      transition-opacity
                      rounded
                      absolute
                      right-2
                      bg-[#212121]
                    "
                    title="Remove from history"
                  >
                    <Trash2
                      className="
                        w-3.5
                        h-3.5
                      "
                    />
                  </button>

                </div>
              );
            })}

          </div>
        )}

        {/* ======================================================
            SAMPLE DOCUMENTS
        ====================================================== */}
        <div className="space-y-1">

          <div
            className="
              px-2
              py-1
              text-[10px]
              font-medium
              text-slate-500
              tracking-wider
            "
          >
            Sample Documents
          </div>

          {sampleDocs.map((doc) => {

            const isSelected =
              activeDoc?.id === doc.id ||
              activeDoc?.name === doc.name;

            return (

              <div
                key={doc.id}
                onClick={() =>
                  handleSelectSampleDocument(doc)
                }
                className={`
                  flex
                  items-center
                  justify-between
                  px-2.5
                  py-2
                  rounded-lg
                  cursor-pointer
                  transition-all

                  ${isSelected
                    ? `
                        bg-[#212121]
                        text-white
                        font-medium
                      `
                    : `
                        hover:bg-[#212121]/50
                        text-slate-400
                        hover:text-slate-200
                      `
                  }
                `}
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2.5
                    overflow-hidden
                  "
                >

                  <FileText
                    className={`
                      w-3.5
                      h-3.5
                      shrink-0

                      ${isSelected
                        ? 'text-emerald-400'
                        : 'text-slate-500'
                      }
                    `}
                  />

                  <span
                    className="
                      truncate
                      text-[12px]
                    "
                  >
                    {doc.name}
                  </span>

                </div>

                <span
                  className="
                    text-[10px]
                    text-slate-600
                    font-mono
                  "
                >
                  {doc.size}
                </span>

              </div>
            );
          })}

        </div>
      </div>

      {/* ========================================================
          FOOTER
      ======================================================== */}
      <div
        className="
          p-2.5
          border-t
          border-[#212121]
          text-[10px]
          font-mono
          text-slate-600
          text-center
        "
      >
        Air-Gapped Workspace Active
      </div>

    </div>
  );
}