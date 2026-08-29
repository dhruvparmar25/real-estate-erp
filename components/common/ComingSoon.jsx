"use client";
import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { ROUTES } from "@/constants/routes.constants";
export default function ComingSoon({ title, description, icon = "mdi:rocket-launch-outline", parentLabel, parentHref, }) {
    return (<div className="flex flex-col gap-4">
      <PageHeader title={title} breadcrumbs={[
            { label: "Dashboard", href: ROUTES.dashboard },
            ...(parentLabel && parentHref ? [{ label: parentLabel, href: parentHref }] : []),
            { label: title },
        ]}/>
      <EmptyState icon={icon} title={`${title} — coming soon`} description={description ??
            "This module is on the roadmap. Data layer is ready; the screen lands in a future phase."} action={<Link href={ROUTES.dashboard} className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-(--color-primary) text-(--color-primary-fg) text-small hover:bg-(--color-primary-hover)">
            <Icon icon="mdi:arrow-left" width={16}/>
            Back to dashboard
          </Link>}/>
    </div>);
}
