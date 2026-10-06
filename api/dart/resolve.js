import { fetchAnnualFilings, fetchCompanyProfile, publicCompany, resolveCompany, sendJson } from "./_shared.js";

export default async function handler(request, response) {
  if (request.method !== "GET") return sendJson(response, 405, { error: "METHOD_NOT_ALLOWED" });
  try {
    const query = request.query?.q;
    const resolved = await resolveCompany(query);
    const [profile, filings] = await Promise.all([
      fetchCompanyProfile(resolved.corpCode),
      fetchAnnualFilings(resolved.corpCode)
    ]);
    return sendJson(response, 200, {
      mode: "LIVE",
      company: publicCompany(resolved, profile),
      filings: filings.slice(0, 6).map((filing) => ({
        receiptNumber: filing.rcept_no,
        reportName: filing.report_nm,
        submittedAt: filing.rcept_dt,
        filerName: filing.flr_nm,
        correction: /정정/.test(filing.report_nm)
      })),
      analysis: {
        status: "COLLECTED",
        nextStage: "ESTIMATE_DISCOVERY",
        quantitativeResultsReady: false
      }
    });
  } catch (error) {
    const status = error.code === "COMPANY_NOT_FOUND" ? 404 : error.code === "DART_KEY_MISSING" ? 503 : 502;
    return sendJson(response, status, { mode: "DEMO", error: error.code || "DART_REQUEST_FAILED", message: error.message });
  }
}
