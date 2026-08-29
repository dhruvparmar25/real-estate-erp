import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import { stashNavId } from "@/utils/entity-nav";
export default function Breadcrumb({ items }) {
    return (<nav className="flex items-center gap-1.5 text-tiny text-(--color-text-secondary) flex-wrap">
      {items.map((c, i) => {
            const last = i === items.length - 1;
            return (<span key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <Icon icon="mdi:chevron-right" width={14}/>}
            {c.href && !last ? (<Link href={c.href} onClick={c.stashId ? () => stashNavId(c.stashId) : undefined} className="hover:text-(--color-primary)">
                {c.label}
              </Link>) : (<span className={last ? "text-(--color-text-primary) font-medium" : undefined}>{c.label}</span>)}
          </span>);
        })}
    </nav>);
}
