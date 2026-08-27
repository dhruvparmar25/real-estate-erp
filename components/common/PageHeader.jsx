import Breadcrumb from "./Breadcrumb";
import KeyboardShortcutsGuide from "./KeyboardShortcutsGuide";
export default function PageHeader({ title, description, breadcrumbs, actions, keyboardHint, }) {
    const hasRightSlot = Boolean(actions || keyboardHint);
    return (<header className="flex flex-col gap-3 mb-4">
      {breadcrumbs && <Breadcrumb items={breadcrumbs}/>}

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="module-title break-words">{title}</h1>
          {description && (<div className="text-small text-(--color-text-secondary) mt-1 max-w-2xl leading-relaxed">
              {description}
            </div>)}
        </div>

        {hasRightSlot && (<div className="flex items-center gap-2 flex-wrap md:flex-nowrap md:justify-end md:flex-shrink-0">
            {actions && (<div className="flex items-center gap-2 flex-wrap [&>*]:flex-1 sm:[&>*]:flex-none">
                {actions}
              </div>)}
            {keyboardHint && (<KeyboardShortcutsGuide className="inline-flex"/>)}
          </div>)}
      </div>
    </header>);
}
