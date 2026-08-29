"use client";
import Link from "next/link";
import { stashNavId } from "@/utils/entity-nav";

// Entity id lives in sessionStorage, not the URL.
export default function EntityLink({ href, entityId, onClick, children, ...rest }) {
    return (<Link href={href} onClick={(e) => {
            stashNavId(entityId);
            onClick?.(e);
        }} {...rest}>
      {children}
    </Link>);
}
