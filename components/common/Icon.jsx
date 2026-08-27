import { ICONS } from "@/icons-bundle";
// Inline-SVG icon. No CDN fetch, no runtime registration — every icon is
// bundled at build time via `icons-bundle.js`. Using `dangerouslySetInnerHTML`
// is safe here because the icon bodies are static SVG markup from
// `@iconify-icons/mdi` / `@iconify-icons/mingcute` packages.
export function Icon({ icon, width = 24, height, className, ...rest }) {
    const data = ICONS[icon];
    if (!data) {
        if (process.env.NODE_ENV !== "production") {
            console.warn(`[Icon] Missing icon: ${icon}. Add it to icons-bundle.js.`);
        }
        return null;
    }
    const w = data.width ?? 24;
    const h = data.height ?? 24;
    const finalHeight = height ?? width;
    return (<svg xmlns="http://www.w3.org/2000/svg" width={width} height={finalHeight} viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: data.body }} {...rest}/>);
}
