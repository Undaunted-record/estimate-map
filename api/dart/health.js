import { requireApiKey, sendJson } from "./_shared.js";

export default async function handler(request, response) {
  if (request.method !== "GET") return sendJson(response, 405, { error: "METHOD_NOT_ALLOWED" });
  try {
    requireApiKey();
    return sendJson(response, 200, { connected: true, mode: "LIVE", provider: "OpenDART" });
  } catch {
    return sendJson(response, 200, { connected: false, mode: "DEMO", provider: "OpenDART" });
  }
}
