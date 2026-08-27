"use client";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
/** Default shortcut set. Order matters — most-used first. */
export const FORM_SHORTCUTS = [
    { keys: ["Ctrl", "S"], action: "save" },
    { keys: ["Tab"], action: "next field" },
    { keys: ["Enter"], action: "submit" },
    { keys: ["↑↓"], action: "select" },
    { keys: ["Esc"], action: "cancel" },
];
const PILL_BASE = "group inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 h-7 sm:h-9 rounded-full whitespace-nowrap " +
    "bg-(--color-primary)/[0.06] hover:bg-(--color-primary)/[0.1] " +
    "border border-(--color-primary)/15 hover:border-(--color-primary)/25 " +
    "text-[10px] sm:text-xs text-(--color-text-secondary) " +
    "transition-colors";
const KEY_CHIP = "px-1 sm:px-1.5 min-w-[16px] sm:min-w-[20px] h-5 sm:h-6 rounded text-[9px] sm:text-[11px] font-semibold leading-none " +
    "inline-flex items-center justify-center " +
    "text-(--color-primary) bg-(--color-surface) " +
    "border border-(--color-primary)/20 " +
    "shadow-[0_1px_0_rgba(0,0,0,0.04)]";
/**
 * Compact, single-line keyboard-shortcut hint. Pairs with `<PageHeader
 * keyboardHint />` to sit on the right of the title row. Never wraps —
 * if space is tight, hide it via `className="hidden sm:inline-flex"`.
 */
export default function KeyboardShortcutsGuide({ shortcuts = FORM_SHORTCUTS, className, }) {
    return (<div role="note" aria-label="Keyboard shortcuts" className={cn(PILL_BASE, className)}>
      <Icon icon="mdi:keyboard-outline" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-(--color-primary) flex-shrink-0 transition-transform group-hover:scale-110"/>
      {shortcuts.map((shortcut, idx) => (<ShortcutItem key={shortcut.action} shortcut={shortcut} showDivider={idx > 0}/>))}
    </div>);
}
function ShortcutItem({ shortcut, showDivider, }) {
    return (<span className="inline-flex items-center gap-1">
      {showDivider && (<span aria-hidden className="text-(--color-primary)/30 select-none">·</span>)}
      <span className="inline-flex items-center gap-0.5">
        {shortcut.keys.map((key, idx) => (<span key={idx} className="inline-flex items-center gap-0.5">
            {idx > 0 && <span className="text-(--color-text-tertiary)">+</span>}
            <kbd className={KEY_CHIP}>{key}</kbd>
          </span>))}
      </span>
      <span className="text-(--color-text-primary)/75">{shortcut.action}</span>
    </span>);
}
