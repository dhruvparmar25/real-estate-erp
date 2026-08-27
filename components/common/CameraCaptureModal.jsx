"use client";
import { useEffect, useRef, useState } from "react";
import { notifyError } from "@/utils/notify";
import { Icon } from "@/components/common/Icon";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const formatSize = (mb) => `${mb} MB`;
/**
 * Modal that lets users either take a live photo through `getUserMedia`
 * or pick an image file. Returns a `File` to the parent via `onCapture`.
 */
export default function CameraCaptureModal({ open, onClose, onCapture, allowUpload = true, maxSizeMb = 2, title = "Add photo", }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const streamRef = useRef(null);
    const [mode, setMode] = useState("idle");
    const [previewUrl, setPreviewUrl] = useState(null);
    const [capturedBlob, setCapturedBlob] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const stopStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };
    const closeAndReset = () => {
        stopStream();
        if (previewUrl)
            URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setCapturedBlob(null);
        setErrorMessage("");
        setMode("idle");
        onClose();
    };
    /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps -- reset state when modal closes externally; safe pattern, runs once per close */
    useEffect(() => {
        if (open)
            return;
        stopStream();
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        setCapturedBlob(null);
        setErrorMessage("");
        setMode("idle");
    }, [open]);
    /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
    // Esc closes the modal.
    useEffect(() => {
        if (!open)
            return;
        const handler = (e) => {
            if (e.key === "Escape")
                closeAndReset();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);
    const startCamera = async () => {
        setErrorMessage("");
        setMode("camera");
        if (!navigator.mediaDevices?.getUserMedia) {
            setErrorMessage("Camera not available. The page must be served over HTTPS to use the camera.");
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play().catch(() => { });
            }
        }
        catch (error) {
            const err = error;
            if (err?.name === "NotAllowedError") {
                setErrorMessage("Camera blocked. Allow camera access or use Upload.");
            }
            else if (err?.name === "NotFoundError") {
                setErrorMessage("No camera found on this device. Use Upload instead.");
            }
            else {
                setErrorMessage("Unable to start camera. Use Upload instead.");
            }
            setMode("idle");
        }
    };
    const captureFrame = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas)
            return;
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 480;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        ctx.drawImage(video, 0, 0, width, height);
        canvas.toBlob((blob) => {
            if (!blob) {
                setErrorMessage("Could not capture image. Please retry.");
                return;
            }
            if (blob.size > maxSizeMb * 1024 * 1024) {
                setErrorMessage(`Image too large. Max ${formatSize(maxSizeMb)} allowed.`);
                return;
            }
            const url = URL.createObjectURL(blob);
            if (previewUrl)
                URL.revokeObjectURL(previewUrl);
            setCapturedBlob(blob);
            setPreviewUrl(url);
            setMode("preview");
            stopStream();
        }, "image/jpeg", 0.9);
    };
    const retake = () => {
        if (previewUrl)
            URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setCapturedBlob(null);
        startCamera();
    };
    const confirmCapture = () => {
        if (!capturedBlob)
            return;
        const file = new File([capturedBlob], `capture_${Date.now()}.jpg`, {
            type: "image/jpeg",
        });
        onCapture(file);
        closeAndReset();
    };
    const handleFilePick = (e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file)
            return;
        if (!ALLOWED_TYPES.includes(file.type)) {
            notifyError("Unsupported file type", {
                description: "Choose a JPEG, PNG, or WEBP image and try again.",
            });
            return;
        }
        if (file.size > maxSizeMb * 1024 * 1024) {
            notifyError("Image too large", {
                description: `Choose an image up to ${formatSize(maxSizeMb)}, or compress this one before uploading.`,
            });
            return;
        }
        onCapture(file);
        closeAndReset();
    };
    if (!open)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="camera-modal-title">
      <div className="absolute inset-0" style={{ background: "var(--color-overlay)" }} onClick={closeAndReset}/>

      <div className="relative bg-(--color-surface) border border-(--color-border) rounded-t-2xl sm:rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <header className="flex items-center justify-between px-4 py-3 border-b border-(--color-border)">
          <h3 id="camera-modal-title" className="text-(--color-text-primary) font-semibold text-small">
            {title}
          </h3>
          <button type="button" onClick={closeAndReset} className="text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-bg) w-8 h-8 rounded-md inline-flex items-center justify-center" aria-label="Close">
            <Icon icon="mdi:close" width={18}/>
          </button>
        </header>

        <div className="p-4 flex flex-col gap-3">
          {errorMessage && (<div className="bg-red-50 border border-(--color-danger)/30 text-(--color-danger) text-tiny rounded-lg px-3 py-2 flex items-center gap-2">
              <Icon icon="mdi:alert-circle-outline" width={14} className="flex-shrink-0"/>
              <span>{errorMessage}</span>
            </div>)}

          {mode === "idle" && (<div className="flex flex-col items-center gap-3 py-4">
              <div className="w-20 h-20 rounded-full bg-(--color-primary)/10 flex items-center justify-center">
                <Icon icon="mdi:camera-outline" width={40} className="text-(--color-primary)"/>
              </div>
              <p className="text-tiny text-(--color-text-secondary) text-center leading-relaxed">
                Take a live photo or upload one from your device.
                <br />
                JPEG, PNG or WEBP · Max {formatSize(maxSizeMb)}
              </p>
              <div className="flex gap-2 w-full">
                <button type="button" onClick={startCamera} className="flex-1 inline-flex items-center justify-center gap-2 bg-(--color-primary) text-(--color-primary-fg) text-small font-medium rounded-lg px-3 h-10 hover:bg-(--color-primary-hover) transition-colors">
                  <Icon icon="mdi:camera" width={16}/>
                  Capture
                </button>
                {allowUpload && (<button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 inline-flex items-center justify-center gap-2 border border-(--color-border) text-(--color-text-primary) text-small font-medium rounded-lg px-3 h-10 hover:bg-(--color-bg) transition-colors">
                    <Icon icon="mdi:upload" width={16}/>
                    Upload
                  </button>)}
              </div>
            </div>)}

          {mode === "camera" && (<div className="flex flex-col gap-3">
              <div className="rounded-lg overflow-hidden bg-black aspect-[4/3] flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"/>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={closeAndReset} className="flex-1 border border-(--color-border) text-(--color-text-primary) text-small font-medium rounded-lg px-3 h-10 hover:bg-(--color-bg) transition-colors">
                  Cancel
                </button>
                <button type="button" onClick={captureFrame} className="flex-1 inline-flex items-center justify-center gap-2 bg-(--color-primary) text-(--color-primary-fg) text-small font-medium rounded-lg px-3 h-10 hover:bg-(--color-primary-hover) transition-colors">
                  <Icon icon="mdi:camera-iris" width={16}/>
                  Capture
                </button>
              </div>
            </div>)}

          {mode === "preview" && previewUrl && (<div className="flex flex-col gap-3">
              <div className="rounded-lg overflow-hidden bg-black aspect-[4/3] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Captured preview" className="w-full h-full object-cover"/>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={retake} className="flex-1 border border-(--color-border) text-(--color-text-primary) text-small font-medium rounded-lg px-3 h-10 hover:bg-(--color-bg) transition-colors">
                  Retake
                </button>
                <button type="button" onClick={confirmCapture} className="flex-1 inline-flex items-center justify-center gap-2 bg-(--color-primary) text-(--color-primary-fg) text-small font-medium rounded-lg px-3 h-10 hover:bg-(--color-primary-hover) transition-colors">
                  <Icon icon="mdi:check" width={16}/>
                  Use photo
                </button>
              </div>
            </div>)}

          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFilePick}/>
          <canvas ref={canvasRef} className="hidden"/>
        </div>
      </div>
    </div>);
}
