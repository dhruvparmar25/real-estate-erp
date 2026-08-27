"use client";
import { Icon } from "@/components/common/Icon";
import Modal from "./Modal";
import Button from "./Button";
export default function ConfirmDialog({ open, title, message, description, confirmLabel = "Confirm", cancelLabel = "Cancel", tone = "danger", icon, onConfirm, onCancel, loading, }) {
    const effectiveIcon = icon ?? (tone === "danger" ? "mdi:alert-circle-outline" : "mdi:help-circle-outline");
    const effectiveTitle = title ?? (tone === "danger" ? "Delete?" : "Confirm");
    const iconColor = tone === "danger" ? "text-(--color-danger)" : "text-(--color-primary)";
    const iconBg = tone === "danger" ? "bg-(--color-danger)/10" : "bg-(--color-primary)/10";
    return (<Modal open={open} onClose={onCancel} title={effectiveTitle} size="sm" footer={<>
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={tone === "danger" ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>}>
      <div className="flex items-start gap-3">
        <span className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`} aria-hidden="true">
          <Icon icon={effectiveIcon} width={22}/>
        </span>
        <div className="min-w-0 flex flex-col gap-1.5 pt-1">
          <div className="text-small text-(--color-text-primary) leading-relaxed break-words">
            {message}
          </div>
          {description && (<div className="text-tiny text-(--color-text-secondary) leading-relaxed break-words">
              {description}
            </div>)}
        </div>
      </div>
    </Modal>);
}
