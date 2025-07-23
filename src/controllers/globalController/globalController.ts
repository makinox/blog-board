const PUBLIC_API_ORIGIN = import.meta.env.PUBLIC_API_ORIGIN;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalController = async (url: string, method: string, body?: Record<string, any>) => {
  const response = await fetch(`${PUBLIC_API_ORIGIN}${url}`, {
    method,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch");
  }

  return response.json();
};