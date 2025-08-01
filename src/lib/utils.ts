import { useBlogStore } from "@stores/blogStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat("es-MX", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(date);
}

export function readingTime(html: string) {
  const textOnly = html.replace(/<[^>]+>/g, "");
  const wordCount = textOnly.split(/\s+/).length;
  const readingTimeMinutes = ((wordCount / 200) + 1).toFixed();
  return `${readingTimeMinutes} minutos de lectura`;
}

export function dateRange(startDate: Date, endDate?: Date | string): string {
  const startMonth = startDate.toLocaleString("default", { month: "short" });
  const startYear = startDate.getFullYear().toString();
  let endMonth;
  let endYear;

  if (endDate) {
    if (typeof endDate === "string") {
      endMonth = "";
      endYear = endDate;
    } else {
      endMonth = endDate.toLocaleString("default", { month: "short" });
      endYear = endDate.getFullYear().toString();
    }
  }

  return `${startMonth}${startYear} - ${endMonth}${endYear}`;
}

export const formatTag = (tag: string) => tag.toLowerCase().replace(/ /g, "-");

export const safeWindow = () => {
  if (typeof window === "undefined") return null;
  return window as Window;
};

const cleanParamsFromString = (str: string) => str.split("?")[0];

const cleanHashesFromString = (str: string) => str.split("#")[0];

const getCurrentPageUrlFromWindow = () => {
  const win = safeWindow();
  const resultantUrl = win?.location.href.charAt(win?.location.href.length - 1) === "/" ? win?.location.href.split("/").at(-2) : win?.location.href.split("/").pop();
  return cleanHashesFromString(cleanParamsFromString(resultantUrl || ""));
};

const getCurrentPageUrlFromStore = () => cleanHashesFromString(cleanParamsFromString(useBlogStore.getState().blogs[0]?.page_url || ""));

export const getCurrentBlogUrl = () => getCurrentPageUrlFromStore() || getCurrentPageUrlFromWindow();

const generateUniqueVisitorId = () => {
  const generateFingerprint = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx!.textBaseline = "top";
    ctx!.font = "14px Arial";
    ctx!.fillText("Browser fingerprint 🎨", 2, 2);
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + "x" + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || "unknown",
      ("deviceMemory" in navigator ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory : "unknown"),
      canvas.toDataURL()
    ].join("|");
    
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  };

  const storageKey = "visitor_id";
  let visitorId = localStorage.getItem(storageKey);
  
  if (!visitorId) {
    visitorId = generateFingerprint();
    localStorage.setItem(storageKey, visitorId);
  }
  
  return visitorId;
};

export const getVisitorId = (): string | null => {
  if (typeof window === "undefined") return null;
  
  try {
    return generateUniqueVisitorId();
  } catch (error) {
    console.warn("Error generating visitor ID:", error);
    return null;
  }
};
