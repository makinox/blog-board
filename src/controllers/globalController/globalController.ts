import { useAuthStore } from "@stores/authStore";

const PUBLIC_API_ORIGIN = import.meta.env.PUBLIC_API_ORIGIN;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalController = async (url: string, method: string, body?: Record<string, any>) => {
  const token = useAuthStore.getState().token;  
  const headers = {
    "Content-Type": "application/json" as const,
  } as Record<string, string>;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${PUBLIC_API_ORIGIN}${url}`, {
    method,
    body: JSON.stringify(body),
    headers
  });

  if (!response.ok) {
    throw new Error("Failed to fetch");
  }

  return response.json();
};