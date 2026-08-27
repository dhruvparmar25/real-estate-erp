"use client";
import { useMemo, useState } from "react";
import { notifySuccess } from "@/utils/notify";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";
import { BulkActionButton } from "./SelectionBar";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
const DEFAULT_LABELS = {
    activate: "Activate",
    deactivate: "Deactivate",
    activatePast: "activated",
    deactivatePast: "deactivated",
    activeState: "active",
    inactiveState: "inactive",
    activateMessage: "They will be able to sign in again.",
    deactivateMessage: "They will lose sign-in access until reactivated.",
};
export default function BulkActiveToggle({ selectedIds, isActive, isEligible, onActivate, onDeactivate, onComplete, entityLabel, entityLabelPlural, labels, }) {
    const [mixedOpen, setMixedOpen] = useState(false);
    const [pending, setPending] = useState(null);
    const L = useMemo(() => ({ ...DEFAULT_LABELS, ...labels }), [labels]);
    const plural = entityLabelPlural ?? `${entityLabel}s`;
    const noun = (n) => (n === 1 ? entityLabel : plural);
    const { activeIds, inactiveIds } = useMemo(() => {
        const active = [];
        const inactive = [];
        for (const id of selectedIds) {
            if (isEligible && !isEligible(id))
                continue;
            if (isActive(id))
                active.push(id);
            else
                inactive.push(id);
        }
        return { activeIds: active, inactiveIds: inactive };
    }, [selectedIds, isActive, isEligible]);
    const aCount = activeIds.length;
    const iCount = inactiveIds.length;
    const total = aCount + iCount;
    const mixed = aCount > 0 && iCount > 0;
    const disabled = total === 0;
    let label = `${L.activate}`;
    let icon = "mdi:check-circle-outline";
    let tone = "success";
    if (mixed) {
        label = `Change status (${total})`;
        icon = "mdi:swap-horizontal";
        tone = "primary";
    }
    else if (aCount > 0) {
        label = `${L.deactivate} (${aCount})`;
        icon = "mdi:close-circle-outline";
        tone = "warning";
    }
    else if (iCount > 0) {
        label = `${L.activate} (${iCount})`;
        icon = "mdi:check-circle-outline";
        tone = "success";
    }
    const handleClick = () => {
        if (disabled)
            return;
        if (mixed) {
            setMixedOpen(true);
        }
        else if (aCount > 0) {
            setPending({ kind: "deactivate", ids: activeIds });
        }
        else {
            setPending({ kind: "activate", ids: inactiveIds });
        }
    };
    const runPending = () => {
        if (!pending)
            return;
        const n = pending.kind === "activate"
            ? onActivate(pending.ids)
            : onDeactivate(pending.ids);
        const action = pending.kind === "activate" ? L.activatePast : L.deactivatePast;
        notifySuccess(`${n} ${noun(n)} ${action}`, {
            description: pending.kind === "activate"
                ? `These ${noun(n)} are now active and visible across the platform.`
                : `These ${noun(n)} are hidden from selection lists. Past records stay intact.`,
        });
        setPending(null);
        setMixedOpen(false);
        onComplete();
    };
    const recommended = iCount >= aCount ? "activate" : "deactivate";
    return (<>
      <BulkActionButton icon={icon} label={label} tone={tone} onClick={handleClick} disabled={disabled}/>

      <Modal open={mixedOpen && !pending} onClose={() => setMixedOpen(false)} title="Change status" description={`Your selection mixes ${L.activeState} and ${L.inactiveState} ${plural}. Pick what you'd like to apply.`} size="sm">
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <StatusTile icon="mdi:check-circle" tone="success" count={aCount} label={L.activeState}/>
            <StatusTile icon="mdi:close-circle" tone="warning" count={iCount} label={L.inactiveState}/>
          </div>

          <p className="text-tiny text-(--color-text-secondary) leading-relaxed">
            Recommended:{" "}
            <span className="font-semibold text-(--color-text-primary)">
              {recommended === "activate"
            ? `${L.activate} ${iCount} ${L.inactiveState} ${noun(iCount)}`
            : `${L.deactivate} ${aCount} ${L.activeState} ${noun(aCount)}`}
            </span>{" "}
            (more rows in this group).
          </p>

          <div className="flex flex-col gap-2 pt-1">
            <ChoiceButton icon="mdi:check-circle-outline" tone="success" recommended={recommended === "activate"} disabled={iCount === 0} onClick={() => setPending({ kind: "activate", ids: inactiveIds })}>
              {L.activate} {iCount} {L.inactiveState} {noun(iCount)}
            </ChoiceButton>
            <ChoiceButton icon="mdi:close-circle-outline" tone="danger" recommended={recommended === "deactivate"} disabled={aCount === 0} onClick={() => setPending({ kind: "deactivate", ids: activeIds })}>
              {L.deactivate} {aCount} {L.activeState} {noun(aCount)}
            </ChoiceButton>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={pending != null} title={pending?.kind === "activate"
            ? `${L.activate} ${pending.ids.length} ${noun(pending.ids.length)}?`
            : `${L.deactivate} ${pending?.ids.length ?? 0} ${noun(pending?.ids.length ?? 0)}?`} message={pending?.kind === "activate" ? L.activateMessage : L.deactivateMessage} confirmLabel={pending?.kind === "activate" ? L.activate : L.deactivate} tone={pending?.kind === "activate" ? "primary" : "danger"} onConfirm={runPending} onCancel={() => setPending(null)}/>
    </>);
}
const TONE_BG = {
    success: "bg-(--color-success)/10 text-(--color-success)",
    warning: "bg-(--color-warning)/10 text-(--color-warning)",
};
function StatusTile({ icon, tone, count, label, }) {
    return (<div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg", TONE_BG[tone])}>
      <Icon icon={icon} width={18}/>
      <div className="leading-tight">
        <p className="text-h3 font-bold">{count}</p>
        <p className="text-tiny opacity-80 capitalize">{label}</p>
      </div>
    </div>);
}
const CHOICE_TONE = {
    success: "text-(--color-success) border-(--color-success)/30 hover:bg-(--color-success)/10 hover:border-(--color-success)/60",
    danger: "text-(--color-danger) border-(--color-danger)/30 hover:bg-(--color-danger)/10 hover:border-(--color-danger)/60",
};
function ChoiceButton({ icon, tone, recommended, disabled, onClick, children, }) {
    return (<button type="button" onClick={onClick} disabled={disabled} className={cn("w-full inline-flex items-center gap-3 px-3 py-2.5 rounded-lg border text-small font-semibold capitalize", "bg-(--color-surface) transition-colors text-left", "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-(--color-surface)", CHOICE_TONE[tone], recommended && !disabled && "ring-2 ring-(--color-primary)/30 ring-offset-1 ring-offset-(--color-surface)")}>
      <Icon icon={icon} width={18}/>
      <span className="flex-1">{children}</span>
      {recommended && !disabled && (<span className="text-tiny font-medium px-2 py-0.5 rounded-full bg-(--color-primary)/10 text-(--color-primary)">
          Suggested
        </span>)}
    </button>);
}
