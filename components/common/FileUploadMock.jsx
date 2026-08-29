"use client";
import { useRef, useState } from "react";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
import Button from "./Button";
import CameraCaptureModal from "./CameraCaptureModal";
const isImageAccept = (accept) => !accept || accept.startsWith("image/");
function fileToMeta(file, imagePreview, onReady) {
    const meta = { name: file.name, size: file.size, type: file.type };
    if (imagePreview && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
            meta.data_url = reader.result;
            onReady(meta);
        };
        reader.readAsDataURL(file);
    }
    else {
        onReady(meta);
    }
}
export default function FileUploadMock({ label, hint, accept, value, onChange, imagePreview, required, error, allowCamera, disabled, }) {
    const inputRef = useRef(null);
    const [chooserOpen, setChooserOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [localError, setLocalError] = useState(null);
    const showCamera = allowCamera ?? isImageAccept(accept);
    const openDirectFilePicker = () => {
        if (disabled)
            return;
        inputRef.current?.click();
    };
    const handleChoose = () => {
        if (disabled)
            return;
        if (showCamera) {
            setChooserOpen(true);
        }
        else {
            openDirectFilePicker();
        }
    };
    const validateAndSetFile = (file) => {
        setLocalError(null);
        if (accept) {
            if (accept.startsWith("image/") && !file.type.startsWith("image/")) {
                setLocalError("Only image files are allowed.");
                return;
            }
        }
        if (file.size > 5 * 1024 * 1024) {
            setLocalError("File size must be less than 5MB.");
            return;
        }
        fileToMeta(file, imagePreview, onChange);
    };
    const handlePick = (e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file)
            return;
        validateAndSetFile(file);
    };
    const handleCapture = (file) => {
        validateAndSetFile(file);
        setChooserOpen(false);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        if (disabled)
            return;
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled)
            return;
        const file = e.dataTransfer.files?.[0];
        if (file) {
            validateAndSetFile(file);
        }
    };
    const remove = () => {
        setLocalError(null);
        onChange(null);
    };
    const displayError = localError || error;
    return (<div className="flex flex-col gap-1.5">
      {label && (<label className="text-tiny font-medium text-(--color-text-secondary)">
          {label}
          {required && <span className="text-(--color-danger)"> *</span>}
        </label>)}

      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handlePick}/>

      {value ? (<div className="rounded-lg border border-(--color-border) bg-(--color-surface) p-3 flex items-center gap-3">
          {imagePreview && value.data_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.data_url} alt={value.name} className="w-14 h-14 rounded-md object-cover border border-(--color-border) flex-shrink-0"/>) : (<div className="w-14 h-14 rounded-md bg-(--color-bg) flex items-center justify-center text-(--color-text-secondary) flex-shrink-0">
              <Icon icon="mdi:file-document-outline" width={22}/>
            </div>)}
          <div className="min-w-0 flex-1">
            <p className="text-small font-medium truncate">{value.name}</p>
            <p className="text-tiny text-(--color-text-secondary)">
              {(value.size / 1024).toFixed(1)} KB · {value.type || "file"}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button type="button" variant="outline" size="sm" onClick={handleChoose} disabled={disabled} icon={<Icon icon="mdi:swap-horizontal" width={14}/>}>
              Replace
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={remove} disabled={disabled} icon={<Icon icon="mdi:trash-can-outline" width={14}/>} aria-label="Remove">
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        </div>) : (<button type="button" onClick={handleChoose} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} disabled={disabled} className={cn("group w-full rounded-lg border border-dashed px-4 py-5 flex flex-col items-center justify-center gap-2 text-center transition-colors focus:outline-none focus:ring-4 focus:ring-(--color-primary)/15 focus:border-(--color-primary) disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-(--color-border)", isDragging
                ? "border-(--color-primary) bg-(--color-primary)/[0.05]"
                : "border-(--color-border) bg-(--color-surface) hover:border-(--color-primary)/50 hover:bg-(--color-primary)/[0.03]")}>
          <span className="w-12 h-12 rounded-full bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center group-hover:bg-(--color-primary)/15 transition-colors">
            <Icon icon={showCamera ? "mdi:camera-plus-outline" : "mdi:cloud-upload-outline"} width={24}/>
          </span>
          <span>
            <span className="block text-small font-semibold text-(--color-text-primary)">
              {showCamera ? "Add photo" : "Upload file"}
            </span>
            <span className="block text-tiny text-(--color-text-secondary) mt-0.5">
              {showCamera ? "Click to choose — upload from device or use camera" : "Click to pick a file"}
            </span>
            {hint && (<span className="block text-tiny text-(--color-text-tertiary) mt-1">{hint}</span>)}
            <span className="block text-[10px] text-(--color-text-tertiary) mt-1 font-medium tracking-wide">
              Max size: 5MB
            </span>
          </span>
        </button>)}

      {displayError && (<p className="text-tiny text-(--color-danger) flex items-start gap-1">
          <Icon icon="mdi:alert-circle-outline" width={14} className="flex-shrink-0 mt-px"/>
          <span>{displayError}</span>
        </p>)}

      {showCamera && (<CameraCaptureModal open={chooserOpen} onClose={() => setChooserOpen(false)} onCapture={handleCapture} allowUpload title={label ? `Add ${label.toLowerCase()}` : "Add photo"}/>)}
    </div>);
}
