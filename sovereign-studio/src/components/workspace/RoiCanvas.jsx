import React, {
  useState,
  useRef,
  useEffect
} from 'react';

import {
  Crop,
  Sparkles,
  Search,
  Code2,
  RotateCcw,
  FileUp,
  Eye,
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function RoiCanvas({
  activeDoc,
  onSelectFile,
  onRoiCaptured
}) {
  const [docSrc, setDocSrc] = useState(null);
  const [docType, setDocType] = useState('image');
  const [textContent, setTextContent] = useState('');

  const [isSelecting, setIsSelecting] = useState(false);
  const [cropBox, setCropBox] = useState(null);
  const [selectionConfirmed, setSelectionConfirmed] =
    useState(false);

  const [activeTool, setActiveTool] = useState(null);

  const containerRef = useRef(null);

  const startPosRef = useRef({
    x: 0,
    y: 0
  });

  // ============================================================
  // LOAD SELECTED DOCUMENT
  // ============================================================
  useEffect(() => {
    // Reset everything when no document is selected
    if (!activeDoc) {
      setDocSrc(null);
      setDocType('image');
      setTextContent('');
      setCropBox(null);
      setSelectionConfirmed(false);
      setActiveTool(null);
      return;
    }

    console.log(
      '[RoiCanvas] Active document:',
      activeDoc
    );

    // ----------------------------------------------------------
    // Get document name
    // ----------------------------------------------------------
    const docName =
      typeof activeDoc === 'string'
        ? activeDoc
        : activeDoc?.name || '';

    const lowerName = docName.toLowerCase();

    // ----------------------------------------------------------
    // Determine document type
    // ----------------------------------------------------------
    const isPdf = lowerName.endsWith('.pdf');
    const isTxt = lowerName.endsWith('.txt');

    if (isPdf) {
      setDocType('pdf');
    } else if (isTxt) {
      setDocType('txt');
    } else {
      // PNG / JPG / JPEG etc.
      setDocType('image');
    }

    // Clear previous preview before loading new document
    setDocSrc(null);
    setTextContent('');
    setCropBox(null);
    setSelectionConfirmed(false);
    setActiveTool(null);

    // ==========================================================
    // CASE 1: activeDoc is already a URL/string
    // ==========================================================
    if (typeof activeDoc === 'string') {
      console.log(
        '[RoiCanvas] Loading string URL:',
        activeDoc
      );

      setDocSrc(activeDoc);

      return;
    }

    // ==========================================================
    // CASE 2: NEW FORMAT
    //
    // activeDoc = {
    //   name: "...",
    //   fileObj: File,
    //   file_id: "...",
    //   path: "..."
    // }
    // ==========================================================
    const file =
      activeDoc?.fileObj instanceof File
        ? activeDoc.fileObj
        : activeDoc instanceof File
          ? activeDoc
          : null;

    if (file) {
      console.log(
        '[RoiCanvas] Browser File detected:',
        file.name,
        file.type,
        file.size
      );

      const url = URL.createObjectURL(file);

      setDocSrc(url);

      // --------------------------------------------------------
      // TXT FILE
      // --------------------------------------------------------
      if (isTxt) {
        const reader = new FileReader();

        reader.onload = (e) => {
          setTextContent(
            e.target?.result || ''
          );
        };

        reader.onerror = (error) => {
          console.error(
            '[RoiCanvas] Failed to read TXT:',
            error
          );

          setTextContent(
            'Unable to read this text file.'
          );
        };

        reader.readAsText(file);
      }

      // --------------------------------------------------------
      // Cleanup object URL
      // --------------------------------------------------------
      return () => {
        URL.revokeObjectURL(url);
      };
    }

    // ==========================================================
    // CASE 3: Backend / remote URL
    // ==========================================================
    if (activeDoc?.url) {
      console.log(
        '[RoiCanvas] Loading remote URL:',
        activeDoc.url
      );

      setDocSrc(activeDoc.url);

      return;
    }

    // ==========================================================
    // CASE 4: No usable source
    // ==========================================================
    console.warn(
      '[RoiCanvas] Document selected but no preview source found:',
      activeDoc
    );

  }, [activeDoc]);

  // ============================================================
  // MOUSE DOWN - START ROI
  // ============================================================
  const handleMouseDown = (e) => {
    if (
      !docSrc ||
      docType !== 'image' ||
      selectionConfirmed
    ) {
      return;
    }

    const rect =
      containerRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const x =
      e.clientX - rect.left;

    const y =
      e.clientY - rect.top;

    startPosRef.current = {
      x,
      y
    };

    setCropBox({
      x,
      y,
      width: 0,
      height: 0
    });

    setIsSelecting(true);
  };

  // ============================================================
  // MOUSE MOVE - UPDATE ROI
  // ============================================================
  const handleMouseMove = (e) => {
    if (
      !isSelecting ||
      !cropBox
    ) {
      return;
    }

    const rect =
      containerRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const currentX = Math.max(
      0,
      Math.min(
        e.clientX - rect.left,
        rect.width
      )
    );

    const currentY = Math.max(
      0,
      Math.min(
        e.clientY - rect.top,
        rect.height
      )
    );

    const x = Math.min(
      startPosRef.current.x,
      currentX
    );

    const y = Math.min(
      startPosRef.current.y,
      currentY
    );

    const width = Math.abs(
      currentX -
      startPosRef.current.x
    );

    const height = Math.abs(
      currentY -
      startPosRef.current.y
    );

    setCropBox({
      x,
      y,
      width,
      height
    });
  };

  // ============================================================
  // MOUSE UP - CONFIRM ROI
  // ============================================================
  const handleMouseUp = () => {
    if (!isSelecting) {
      return;
    }

    setIsSelecting(false);

    if (
      cropBox &&
      cropBox.width > 20 &&
      cropBox.height > 20
    ) {
      setSelectionConfirmed(true);
    } else {
      setCropBox(null);
    }
  };

  // ============================================================
  // RESET ROI
  // ============================================================
  const handleResetCrop = () => {
    setCropBox(null);
    setSelectionConfirmed(false);
    setActiveTool(null);
  };

  // ============================================================
  // TOOL ACTION
  // ============================================================
  const handleTriggerTool = (toolName) => {
    setActiveTool(toolName);

    if (
      onRoiCaptured &&
      cropBox
    ) {
      onRoiCaptured({
        ...cropBox,

        selectedTool: toolName,

        docName:
          activeDoc?.name ||
          'Document'
      });
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div
      className="
        w-full
        h-full
        bg-[#08090A]
        flex
        flex-col
        relative
        overflow-hidden
        select-none
        text-slate-200
      "
      style={{
        fontFamily:
          'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >

      {/* ========================================================
          TOP BAR
      ======================================================== */}
      <div
        className="
          px-3
          py-1.5
          bg-[#0D0F12]
          border-b
          border-[#1E222A]
          flex
          items-center
          justify-between
          shrink-0
          text-xs
          text-slate-400
        "
      >

        <div className="flex items-center gap-2">

          <Eye
            className="
              w-3.5
              h-3.5
              text-[#10B981]
            "
          />

          <span
            className="
              truncate
              max-w-[300px]
              text-[#b8bec7]
              font-mono
              text-[10px]
            "
          >
            {activeDoc?.name ||
              (docSrc
                ? 'Preview Stream'
                : 'No Document Selected')}
          </span>

        </div>

        {cropBox && (
          <button
            onClick={handleResetCrop}
            className="
              flex
              items-center
              gap-1
              text-[10px]
              text-[#8d949e]
              hover:text-red-400
              transition-colors
              bg-[#121417]
              px-2
              py-1
              rounded
              border
              border-[#1E222A]
              font-medium
            "
          >
            <RotateCcw className="w-3 h-3" />

            Reset Target
          </button>
        )}

      </div>

      {/* ========================================================
          MAIN CANVAS
      ======================================================== */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isSelecting) {
            setIsSelecting(false);
          }
        }}
        className="
          flex-1
          relative
          overflow-hidden
          flex
          items-center
          justify-center
          p-4
          cursor-crosshair
          min-h-0
        "
      >

        {/* ======================================================
            DOCUMENT AVAILABLE
        ====================================================== */}
        {docSrc ? (

          <div
            className="
              relative
              w-full
              h-full
              flex
              items-center
              justify-center
            "
          >

            {/* ==================================================
                PDF
            ================================================== */}
            {docType === 'pdf' && (
              <iframe
                src={docSrc}
                className="
                  w-full
                  h-full
                  rounded
                  border
                  border-[#1E222A]
                  bg-white
                "
                title="PDF Document Preview"
              />
            )}

            {/* ==================================================
                TXT
            ================================================== */}
            {docType === 'txt' && (
              <div
                className="
                  w-full
                  h-full
                  p-4
                  bg-[#0D0F12]
                  rounded
                  border
                  border-[#1E222A]
                  overflow-auto
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-[10px]
                    text-[#10B981]
                    font-mono
                    border-b
                    border-[#1E222A]
                    pb-2
                    mb-3
                    uppercase
                  "
                >

                  <FileText className="w-4 h-4" />

                  Plain Text Preview

                </div>

                <pre
                  className="
                    text-[12px]
                    text-[#b9bec6]
                    font-mono
                    whitespace-pre-wrap
                    leading-[1.65]
                  "
                >
                  {textContent ||
                    'Loading document content...'}
                </pre>

              </div>
            )}

            {/* ==================================================
                IMAGE
            ================================================== */}
            {docType === 'image' && (
              <img
                src={docSrc}
                alt={
                  activeDoc?.name ||
                  'Target Document'
                }
                className="
                  max-w-full
                  max-h-[70vh]
                  object-contain
                  rounded
                  border
                  border-[#1E222A]
                  pointer-events-none
                "
              />
            )}

            {/* ==================================================
                ROI BOX
            ================================================== */}
            {docType === 'image' &&
              cropBox && (

                <div
                  style={{
                    left: `${cropBox.x}px`,
                    top: `${cropBox.y}px`,
                    width: `${cropBox.width}px`,
                    height: `${cropBox.height}px`
                  }}
                  className="
                    absolute
                    border
                    border-[#10B981]
                    bg-[#10B981]/10
                    rounded
                    shadow-[0_0_12px_rgba(16,185,129,0.15)]
                    transition-all
                    pointer-events-auto
                  "
                >

                  {/* ROI LABEL */}
                  <div
                    className="
                      absolute
                      -top-5
                      left-0
                      bg-[#10B981]
                      text-[#08090A]
                      text-[9px]
                      font-semibold
                      px-1.5
                      py-0.5
                      rounded-t
                      flex
                      items-center
                      gap-1
                      font-mono
                      uppercase
                    "
                  >

                    <Crop className="w-2.5 h-2.5" />

                    ROI (
                    {Math.round(cropBox.width)}
                    x
                    {Math.round(cropBox.height)}
                    )

                  </div>

                  {/* ==================================================
                      TOOL MENU
                  ================================================== */}
                  {selectionConfirmed && (

                    <div
                      className="
                        absolute
                        top-2
                        left-full
                        ml-3
                        bg-[#0D0F12]
                        border
                        border-[#1E222A]
                        rounded-lg
                        p-1.5
                        shadow-2xl
                        flex
                        flex-col
                        gap-1
                        z-50
                        min-w-[160px]
                      "
                    >

                      <div
                        className="
                          text-[9px]
                          font-mono
                          text-[#686f79]
                          px-2
                          py-1
                          border-b
                          border-[#1E222A]
                          uppercase
                        "
                      >
                        Select Tool Action
                      </div>

                      {/* OCR */}
                      <button
                        onClick={() =>
                          handleTriggerTool(
                            'OCR_VISION'
                          )
                        }
                        className={`
                          flex
                          items-center
                          gap-2
                          px-2
                          py-1.5
                          rounded
                          text-[11px]
                          transition-all

                          ${activeTool ===
                            'OCR_VISION'
                            ? 'bg-[#10B981] text-[#08090A] font-medium'
                            : 'text-[#b9bec6] hover:bg-[#121417] hover:text-[#34D399]'
                          }
                        `}
                      >

                        <Sparkles className="w-3.5 h-3.5" />

                        <span>
                          Qwen3-VL OCR
                        </span>

                      </button>

                      {/* RAG */}
                      <button
                        onClick={() =>
                          handleTriggerTool(
                            'RAG_SEARCH'
                          )
                        }
                        className={`
                          flex
                          items-center
                          gap-2
                          px-2
                          py-1.5
                          rounded
                          text-[11px]
                          transition-all

                          ${activeTool ===
                            'RAG_SEARCH'
                            ? 'bg-[#10B981] text-[#08090A] font-medium'
                            : 'text-[#b9bec6] hover:bg-[#121417] hover:text-[#34D399]'
                          }
                        `}
                      >

                        <Search className="w-3.5 h-3.5" />

                        <span>
                          Hybrid RAG Search
                        </span>

                      </button>

                      {/* CODE */}
                      <button
                        onClick={() =>
                          handleTriggerTool(
                            'CODE_PARSER'
                          )
                        }
                        className={`
                          flex
                          items-center
                          gap-2
                          px-2
                          py-1.5
                          rounded
                          text-[11px]
                          transition-all

                          ${activeTool ===
                            'CODE_PARSER'
                            ? 'bg-[#10B981] text-[#08090A] font-medium'
                            : 'text-[#b9bec6] hover:bg-[#121417] hover:text-[#34D399]'
                          }
                        `}
                      >

                        <Code2 className="w-3.5 h-3.5" />

                        <span>
                          Extract Code / Table
                        </span>

                      </button>

                    </div>
                  )}

                </div>
              )}

          </div>

        ) : (

          /* ====================================================
             NO DOCUMENT
          ==================================================== */
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              p-6
              border
              border-dashed
              border-[#1E222A]
              rounded-xl
              text-center
              max-w-xs
              bg-[#0D0F12]/50
            "
          >

            <FileUp
              className="
                w-8
                h-8
                text-[#10B981]
                mb-2
                opacity-80
              "
            />

            <h3
              className="
                text-[12px]
                font-semibold
                text-[#e2e5e9]
                mb-1
              "
            >
              No Document Selected
            </h3>

            <p
              className="
                text-[11px]
                text-[#858c96]
                leading-[1.55]
              "
            >
              Select a file from the workspace sidebar
              to enable visual ROI analysis.
            </p>

          </div>

        )}

      </div>

      {/* ========================================================
          FOOTER
      ======================================================== */}
      <div
        className="
          p-2
          bg-[#0D0F12]
          border-t
          border-[#1E222A]
          flex
          items-center
          justify-between
          text-[9px]
          text-[#626a74]
          font-mono
        "
      >

        <span>
          {docType === 'image'
            ? 'Draw bounding box on image to capture ROI'
            : 'Interactive Document Viewer Active'}
        </span>

        {activeTool && (

          <span
            className="
              text-[#34D399]
              flex
              items-center
              gap-1
              font-medium
            "
          >

            <CheckCircle2 className="w-3 h-3" />

            Executing {activeTool}...

          </span>

        )}

      </div>

    </div>
  );
}