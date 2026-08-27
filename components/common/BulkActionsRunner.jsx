"use client";
import { useState, useMemo } from "react";
import { notifySuccess } from "@/utils/notify";
import ConfirmDialog from "./ConfirmDialog";
import { BulkActionButton } from "./SelectionBar";
export default function BulkActionsRunner({ actions, selectedIds, onComplete }) {
    const [pending, setPending] = useState(null);
    const pendingAction = useMemo(() => actions.find((a) => a.id === pending) ?? null, [pending, actions]);
    const pendingEligible = useMemo(() => {
        if (!pendingAction)
            return [];
        return pendingAction.eligibleIds
            ? pendingAction.eligibleIds(selectedIds)
            : selectedIds;
    }, [pendingAction, selectedIds]);
    const handleConfirm = () => {
        if (!pendingAction)
            return;
        const n = pendingAction.run(pendingEligible);
        notifySuccess(pendingAction.successMessage(n), {
            description: `Action "${pendingAction.label}" applied to ${n} ${n === 1 ? "item" : "items"}.`,
        });
        setPending(null);
        onComplete();
    };
    return (<>
      {actions.map((a) => {
            const eligible = a.eligibleIds ? a.eligibleIds(selectedIds) : selectedIds;
            return (<BulkActionButton key={a.id} icon={a.icon} label={a.label} tone={a.tone ?? "primary"} onClick={() => setPending(a.id)} disabled={eligible.length === 0}/>);
        })}

      <ConfirmDialog open={pendingAction != null} title={pendingAction?.confirm.title(pendingEligible.length) ?? ""} message={pendingAction?.confirm.message(pendingEligible.length) ?? ""} confirmLabel={pendingAction?.confirm.confirmLabel ?? "Confirm"} tone={pendingAction?.confirm.tone ?? (pendingAction?.tone === "danger" ? "danger" : "primary")} onConfirm={handleConfirm} onCancel={() => setPending(null)}/>
    </>);
}
