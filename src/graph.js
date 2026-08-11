import { acquireCachedToken } from "./auth.js";

const graphRoot = "https://graph.microsoft.com/v1.0";

export async function graph(path, options = {}) {
  const token = await acquireCachedToken();
  const response = await fetch(`${graphRoot}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Microsoft Graph ${response.status}: ${body}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export function encodeId(value) {
  return encodeURIComponent(value);
}
