import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to cleanly merge Tailwind CSS classes.
 * It resolves conflicts (e.g., merging `p-4` and `p-2` safely)
 * and properly evaluates conditional classes.
 * 
 * @example
 * cn('bg-blue-500', error && 'bg-red-500', 'p-4')
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
