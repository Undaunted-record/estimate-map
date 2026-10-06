import { demoCompanies, companyAliases } from "./data.js";

export class CompanyResolver {
  resolve(input) {
    const normalized = String(input || "").trim();
    const key = companyAliases[normalized] || companyAliases[normalized.toLowerCase()];
    return key ? { status: "resolved", ticker: key } : { status: "unresolved", input: normalized };
  }
}

export class DartClient {
  constructor({ apiKey = "", mode = "DEMO" } = {}) { this.apiKey = apiKey; this.mode = mode; }
  async fetchCompany(ticker) {
    if (this.mode === "LIVE" && !this.apiKey) throw new Error("DART_API_KEY가 설정되지 않았습니다.");
    const payload = demoCompanies[ticker];
    if (!payload) throw new Error("현재 데모 데이터가 없는 기업입니다. LIVE MODE 연결 후 임의 상장기업 분석이 가능합니다.");
    return structuredClone(payload);
  }
}

export class FilingCollector { collect(companyPayload) { return { ...companyPayload, collectedAt: new Date().toISOString() }; } }
export class EstimateDiscovery { discover(filing) { return filing.estimates.filter(x => x.type !== "FINANCIAL_RISK" && x.type !== "OTHER"); } }
export class ContextLinker { link(estimates, evidence) { return estimates.map(x => ({ ...x, evidence: evidence.filter(e => x.evidenceIds.includes(e.id)) })); } }
export class NumericValidator {
  validate(estimates) { return estimates.map(x => ({ ...x, numericGuard: x.validation.includes("숫자") ? "SOURCE_BOUND" : "NO_GENERATION" })); }
}
export class AnalysisLevelClassifier { classify(estimates) { return estimates.map(x => ({ ...x, stress: x.level === "공개정보 한계" ? false : x.stress })); } }
export class EvidenceMapper { map(data, estimates) { return { ...data, estimates, evidenceById: Object.fromEntries(data.evidence.map(e => [e.id, e])) }; } }
export class DashboardRenderer { render(model) { return model; } }

export async function detectRuntimeMode() {
  try {
    const response = await fetch("/api/dart/health", { headers: { Accept: "application/json" } });
    const payload = await response.json();
    return payload.connected ? "LIVE" : "DEMO";
  } catch { return "DEMO"; }
}

export async function runEstimateMap(input, { mode = "DEMO", apiKey = "" } = {}) {
  const resolver = new CompanyResolver();
  const resolved = resolver.resolve(input);
  if (resolved.status !== "resolved") throw new Error("기업을 찾지 못했습니다. 데모에서는 LG화학 또는 051910을 입력해 주세요.");
  const client = new DartClient({ apiKey, mode });
  const collected = new FilingCollector().collect(await client.fetchCompany(resolved.ticker));
  const discovered = new EstimateDiscovery().discover(collected);
  const linked = new ContextLinker().link(discovered, collected.evidence);
  const validated = new NumericValidator().validate(linked);
  const classified = new AnalysisLevelClassifier().classify(validated);
  return new DashboardRenderer().render(new EvidenceMapper().map(collected, classified));
}
