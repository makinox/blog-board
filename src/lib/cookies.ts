import { createJSONStorage } from "zustand/middleware";
import { safeWindow } from "./utils";

export const getBaseDomain = () => {
  const win = safeWindow();
  if (!win) return "";

  const hostname = win?.location.hostname;
  if (!hostname) return "";

  const parts = hostname.split(".");
  
  if (parts.length <= 2 || hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname) || hostname.includes("localhost")) {
    return hostname;
  }
  
  return "." + parts.slice(-2).join(".");
};

export const setCookie = (name: string, value: string, days: number = 30) => {
  const baseDomain = getBaseDomain();
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  
  const cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/; domain=${baseDomain}; SameSite=Lax`;
  document.cookie = cookieString;
};

export const deleteCookie = (name: string) => {
  const baseDomain = getBaseDomain();
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${baseDomain}`;
};

export const cookieStorage = createJSONStorage(() => ({
  getItem: (name: string): string | null => {
    return getCookie(name);
  },
  setItem: (name: string, value: string): void => {
    setCookie(name, value);
  },
  removeItem: (name: string): void => {
    deleteCookie(name);
  },
}));

export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  
  const cookieName = `${name}=`;
  const cookies = document.cookie.split(";");
  
  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.startsWith(cookieName)) {
      return trimmedCookie.substring(cookieName.length);
    }
  }
  
  return null;
};