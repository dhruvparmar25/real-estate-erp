"use client";
import Link from "next/link";
import { stashNavId } from "@/lib/entity-nav";
// Link to a clean detail/edit route (e.g. /employees/view) while stashing the
// target id in per-tab sessionStorage instead of putting it in the URL.
export default function EntityLink({ href, entityId, onClick, children, ...rest }) {
    return (<Link href={href} onClick={(e) => {
            stashNavId(entityId);
            onClick?.(e);
        }} {...rest}>
      {children}
    </Link>);
}
