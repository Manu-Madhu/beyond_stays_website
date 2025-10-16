// lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind and conditional class names safely
 */
export function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}
