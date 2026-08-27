import { Icon } from "@/components/common/Icon";
export default function EmptyState({ icon = "mdi:database-off-outline", title, description, action }) {
    return (<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-(--color-bg) flex items-center justify-center mb-3">
        <Icon icon={icon} width={28} className="text-(--color-text-secondary)"/>
      </div>
      <p className="text-h4 font-medium text-(--color-text-primary)">{title}</p>
      {description && <p className="text-small text-(--color-text-secondary) mt-1 max-w-md">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>);
}
