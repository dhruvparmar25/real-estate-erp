import { cn } from "@/utils/cn";
export default function LoadingSkeleton({ className }) {
    return (<div className={cn("animate-pulse rounded-md bg-(--color-border)/60", className)}/>);
}
