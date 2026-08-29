"use client";
import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import StatusBadge from "@/components/common/StatusBadge";
import { initialsOf, formatDate } from "@/utils/format";
import { stashNavId } from "@/utils/entity-nav";
import { cn } from "@/utils/cn";
export function avatarColumn({ key = "name", header = "Name", minWidth = "18rem", title, sub, href, stashId, avatarUrl, initials, avatarIcon, square, }) {
    return {
        key,
        header,
        minWidth,
        wrap: true,
        render: (row) => {
            const img = avatarUrl?.(row);
            const inits = initials?.(row);
            const avatarShape = square ? "rounded-lg" : "rounded-full";
            const inner = (<div className="flex items-center gap-3 min-w-0">
          {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt={title(row)} className={`w-9 h-9 ${avatarShape} object-cover border border-(--color-border) flex-shrink-0`}/>) : (<div className={`w-9 h-9 ${avatarShape} bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center text-tiny font-semibold flex-shrink-0`}>
              {inits ? inits : avatarIcon ? <Icon icon={avatarIcon} width={18}/> : "·"}
            </div>)}
          <div className="min-w-0">
            <p className="font-medium text-(--color-text-primary) truncate">
              {title(row)}
            </p>
            {sub && (<p className="text-tiny text-(--color-text-secondary) truncate">
                {sub(row)}
              </p>)}
          </div>
        </div>);
            return href ? (<Link href={href(row)} onClick={stashId ? () => stashNavId(stashId(row)) : undefined} className="block min-w-0">
          {inner}
        </Link>) : (inner);
        },
    };
}
export function nameInitials(row) {
    return initialsOf(row.first_name ?? "", row.last_name ?? "");
}
export function badgeColumn({ key, header, label, tone, }) {
    return {
        key,
        header: header ?? key.replace(/_/g, " "),
        render: (row) => (<StatusBadge tone={tone ? tone(row) : "neutral"}>{label(row)}</StatusBadge>),
    };
}
export function activeBadgeColumn(opts = {}) {
    return badgeColumn({
        key: opts.key ?? "is_active",
        header: opts.header ?? "Status",
        label: (r) => (r.is_active ? "Active" : "Inactive"),
        tone: (r) => (r.is_active ? "success" : "neutral"),
    });
}
export function dateColumn({ key, header, date, muted, }) {
    return {
        key,
        header,
        render: (row) => {
            const v = date(row);
            if (!v)
                return "—";
            const text = formatDate(v);
            return muted ? (<span className="text-tiny text-(--color-text-secondary)">{text}</span>) : (text);
        },
    };
}
export function ActionIconLink({ href, icon, label, tone = "primary", stashId, }) {
    return (<div className="relative group/aib inline-flex">
      <Link href={href} aria-label={label} onClick={stashId ? () => stashNavId(stashId) : undefined} className={cn("p-1.5 rounded-md transition-colors text-(--color-text-secondary)", tone === "danger"
            ? "hover:text-(--color-danger) hover:bg-(--color-danger)/10"
            : "hover:text-(--color-primary) hover:bg-(--color-bg)")}>
        <Icon icon={icon} width={18}/>
      </Link>
      <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded-md bg-(--color-surface) border border-(--color-border) text-[10px] font-semibold text-(--color-text-primary) whitespace-nowrap opacity-0 group-hover/aib:opacity-100 transition-opacity z-50 shadow-sm">
        {label}
      </span>
    </div>);
}
export function ActionIconButton({ icon, label, onClick, disabled, tone = "primary", }) {
    return (<div className="relative group/aib inline-flex">
      <button type="button" onClick={onClick} disabled={disabled} aria-label={label} className={cn("p-1.5 rounded-md transition-colors text-(--color-text-secondary)", tone === "danger"
            ? "hover:text-(--color-danger) hover:bg-(--color-danger)/10 disabled:opacity-40 disabled:cursor-not-allowed"
            : tone === "warning"
                ? "hover:text-(--color-warning) hover:bg-(--color-warning)/10 disabled:opacity-40 disabled:cursor-not-allowed"
                : tone === "success"
                    ? "hover:text-(--color-success) hover:bg-(--color-success)/10 disabled:opacity-40 disabled:cursor-not-allowed"
                    : "hover:text-(--color-primary) hover:bg-(--color-bg) disabled:opacity-40 disabled:cursor-not-allowed")}>
        <Icon icon={icon} width={18}/>
      </button>
      {!disabled && (<span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded-md bg-(--color-surface) border border-(--color-border) text-[10px] font-semibold text-(--color-text-primary) whitespace-nowrap opacity-0 group-hover/aib:opacity-100 transition-opacity z-50 shadow-sm">
          {label}
        </span>)}
    </div>);
}
export function actionsColumn({ key = "actions", header = "Actions", view, onView, edit, onEdit, isEditDisabled, onDelete, isDeleteDisabled, deleteDisabledTitle = "Disabled", extras, entityId, }) {
    return {
        key,
        header,
        align: "center",
        width: "1%",
        render: (row) => {
            const deleteDisabled = isDeleteDisabled?.(row) ?? false;
            const editDisabled = isEditDisabled?.(row) ?? false;
            const navId = entityId?.(row);
            return (<div className="flex items-center justify-center gap-1">
          {view && (<ActionIconLink href={view(row)} stashId={navId} icon="mdi:eye-outline" label="View"/>)}
          {onView && !view && (<ActionIconButton icon="mdi:eye-outline" label="View" onClick={() => onView(row)}/>)}
          {edit && (<ActionIconLink href={edit(row)} stashId={navId} icon="mdi:pencil-outline" label="Edit"/>)}
          {onEdit && !edit && (<ActionIconButton icon="mdi:pencil-outline" label="Edit" onClick={() => onEdit(row)} disabled={editDisabled}/>)}
          {extras?.(row)}
          {onDelete && (<ActionIconButton icon="mdi:trash-can-outline" label={deleteDisabled ? deleteDisabledTitle : "Delete"} onClick={() => onDelete(row)} disabled={deleteDisabled} tone="danger"/>)}
        </div>);
        },
    };
}
