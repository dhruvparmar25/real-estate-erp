import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
export default function FormSection({ title, description, icon, children, className, contentClassName, aside, layout = "default", }) {
    if (layout === "side") {
        return (<section className={cn("bg-(--color-surface) border border-(--color-border) rounded-xl", className)}>
        <div className="flex flex-col lg:flex-row">
          <div className="px-4 sm:px-5 md:px-6 py-4 border-b border-(--color-border) lg:border-b-0 lg:border-r lg:w-64 xl:w-72 lg:flex-shrink-0">
            <div className="flex items-start gap-3">
              {icon && (<span className="w-9 h-9 flex-shrink-0 rounded-lg bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center">
                  <Icon icon={icon} width={18}/>
                </span>)}
              <div className="min-w-0">
                <h2 className="text-h4 font-semibold text-(--color-text-primary) leading-tight">{title}</h2>
                {description && (<p className="text-tiny text-(--color-text-secondary) mt-1 leading-relaxed">{description}</p>)}
              </div>
            </div>
          </div>
          <div className={cn("flex-1 px-4 sm:px-5 md:px-6 py-4 sm:py-5", contentClassName)}>
            {children}
          </div>
        </div>
      </section>);
    }
    return (<section className={cn("bg-(--color-surface) border border-(--color-border) rounded-xl", className)}>
      <header className="px-4 sm:px-5 md:px-6 py-4 border-b border-(--color-border) flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {icon && (<span className="w-9 h-9 flex-shrink-0 rounded-lg bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center">
              <Icon icon={icon} width={18}/>
            </span>)}
          <div className="min-w-0">
            <h2 className="text-h4 font-semibold text-(--color-text-primary) leading-tight break-words">{title}</h2>
            {description && (<p className="text-tiny text-(--color-text-secondary) mt-1 leading-relaxed max-w-2xl">
                {description}
              </p>)}
          </div>
        </div>
        {aside && <div className="flex-shrink-0">{aside}</div>}
      </header>
      <div className={cn("px-4 sm:px-5 md:px-6 py-4 sm:py-5", contentClassName)}>{children}</div>
    </section>);
}
export function FormGrid({ cols = 3, children, className, }) {
    const gridClass = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    }[cols];
    return <div className={cn("grid gap-4 md:gap-5", gridClass, className)}>{children}</div>;
}
