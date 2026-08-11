import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 || 12;
  return `${displayH}:${minutes} ${ampm}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getDayName(date: Date = new Date()): string {
  return date.toLocaleDateString("en-IN", { weekday: "long" });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export const resourceTypeLabels: Record<string, string> = {
  DETAILED_NOTES: "Detailed Notes",
  SHORT_NOTES: "Short Notes",
  PDF: "PDF Document",
  PPT: "Presentation",
  VIDEO: "Video Lecture",
  REVISION_NOTES: "Revision Notes",
  IMPORTANT_QUESTIONS: "Important Questions",
  OTHER: "Other Resource",
};

export const accessLevelLabels: Record<string, string> = {
  PUBLIC: "Public",
  LOGGED_IN: "Logged-in Students",
  SPECIFIC_BATCH: "Specific Batch",
  MULTIPLE_BATCHES: "Multiple Batches",
  PREMIUM: "Premium/Enrolled",
};
