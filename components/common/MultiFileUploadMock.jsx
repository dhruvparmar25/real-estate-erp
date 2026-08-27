"use client";
import { useRef, useState } from "react";
import { Icon } from "@/components/common/Icon";
import Button from "./Button";
export default function MultiFileUploadMock({ label, hint, accept, maxSizeMB = 10, value = [], onChange, required, error, }) {
    const inputRef = useRef(null);
    const [localError, setLocalError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const processFiles = (newFiles) => {
        setLocalError(null);
        if (!newFiles.length)
            return;
        const validFiles = [];
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        for (const file of newFiles) {
            if (file.size > maxSizeBytes) {
                setLocalError(`File ${file.name} exceeds ${maxSizeMB}MB.`);
                continue;
            }
            if (accept) {
                const acceptList = accept.split(",").map(a => a.trim().toLowerCase());
                const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
                const fileType = file.type.toLowerCase();
                const isValid = acceptList.some(a => {
                    if (a.startsWith("."))
                        return a === fileExt;
                    if (a.endsWith("/*"))
                        return fileType.startsWith(a.replace("/*", ""));
                    return a === fileType;
                });
                if (!isValid) {
                    setLocalError(`File ${file.name} is not an allowed type.`);
                    continue;
                }
            }
            validFiles.push({
                id: Math.random().toString(36).substring(7),
                name: file.name,
                size: file.size,
                type: file.type,
                file: file,
            });
        }
        if (validFiles.length > 0) {
            onChange([...value, ...validFiles]);
        }
    };
    const handlePick = (e) => {
        const newFiles = Array.from(e.target.files || []);
        e.target.value = ""; // reset
        processFiles(newFiles);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files);
            processFiles(newFiles);
        }
    };
    const removeFile = (idToRemove) => {
        onChange(value.filter((f) => f.id !== idToRemove));
    };
    return (<div className="flex flex-col gap-1.5">
      {label && (<label className="text-sm font-medium text-(--color-text-primary) flex items-center gap-1.5 mb-1">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>)}

      <input ref={inputRef} type="file" accept={accept} multiple className="hidden" onChange={handlePick}/>

      <button type="button" onClick={() => inputRef.current?.click()} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`group w-full rounded-xl border-2 border-dashed px-4 py-6 flex flex-col items-center justify-center gap-2 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 
          ${isDragging
            ? 'border-(--color-primary) bg-(--color-primary)/10'
            : 'border-(--color-border) bg-(--color-surface) hover:border-(--color-primary)/50 hover:bg-(--color-primary)/5'}`}>
        <span className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-(--color-primary) text-white' : 'bg-(--color-primary)/10 text-(--color-primary) group-hover:bg-(--color-primary)/20'}`}>
          <Icon icon="mdi:cloud-upload-outline" width={24}/>
        </span>
        <span>
          <span className="block text-sm font-semibold text-(--color-text-primary)">
            {isDragging ? 'Drop files here' : 'Click or drag files to upload'}
          </span>
          {hint && (<span className="block text-xs text-(--color-text-tertiary) mt-1">{hint}</span>)}
        </span>
      </button>

      {(error || localError) && (<p className="text-sm text-red-500 mt-1">{error || localError}</p>)}

      {value.length > 0 && (<ul className="flex flex-col gap-2 mt-3">
          {value.map((file) => (<li key={file.id} className="rounded-lg border border-(--color-border) bg-(--color-surface) p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-(--color-bg) flex items-center justify-center text-(--color-text-secondary) flex-shrink-0">
                <Icon icon="mdi:file-document-outline" width={20}/>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-(--color-text-primary) truncate">{file.name}</p>
                <p className="text-xs text-(--color-text-secondary)">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(file.id)} icon={<Icon icon="mdi:close" width={16}/>} aria-label="Remove file"/>
            </li>))}
        </ul>)}
    </div>);
}
