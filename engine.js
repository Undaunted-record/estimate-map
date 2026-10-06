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

async function runEstimateMapDemo(input, { mode = "DEMO", apiKey = "" } = {}) {
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

async function fetchLiveCompany(input) {
  const response = await fetch(`/api/dart/resolve?q=${encodeURIComponent(String(input || "").trim())}`, {
    headers: { Accept: "application/json" }
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || "DART 기업 식별에 실패했습니다.");
  return payload;
}

function buildCollectionModel(payload) {
  const filings = payload.filings || [];
  const evidence = filings.map((filing, index) => ({
    id: `filing-${index}`,
    estimateId: null,
    status: "LIVE 수집",
    source: filing.reportName,
    section: "DART 공시목록",
    anchor: filing.receiptNumber,
    page: "원문 분석 대기",
    text: `${filing.submittedAt} 제출 · ${filing.filerName}`,
    highlights: [filing.submittedAt, filing.receiptNumber],
    caveat: "사업보고서 원문 수집은 완료됐으며 회계추정 탐색 단계가 아직 실행되지 않았습니다."
  }));
  return {
    company: {
      name: payload.company.companyName,
      ticker: payload.company.ticker || "비상장",
      market: payload.company.market || "DART",
      fiscalYear: new Date().getFullYear() - 1,
      basis: "공시 수집",
      mode: "LIVE"
    },
    source: {
      report: filings[0]?.reportName || "사업보고서 조회 결과 없음",
      submitted: filings[0]?.submittedAt || "-",
      version: filings[0]?.receiptNumber || "-",
      demoNotice: "기업 식별과 공시목록은 OpenDART LIVE 데이터입니다. 회계추정 추출·분류 결과는 아직 생성하지 않았습니다."
    },
    metrics: [
      { label: "수집된 사업보고서", value: String(filings.length), note: "OpenDART LIVE" },
      { label: "회계추정 탐색", value: "대기", note: "Estimate Discovery" },
      { label: "숫자 검증", value: "대기", note: "Numeric Validator" },
      { label: "검토 우선순위", value: "미산정", note: "분석 전" }
    ],
    insights: evidence.length ? [{
      id: "collection-complete",
      tone: "medium",
      title: "DART 기업 식별과 사업보고서 수집이 완료됐습니다.",
      body: `${filings.length}건의 사업보고서를 확인했습니다. 다음 단계에서 주석 원문을 대상으로 회계추정 후보를 탐색합니다.`,
      evidenceIds: [evidence[0].id]
    }] : [],
    estimates: [],
    evidence,
    evidenceById: Object.fromEntries(evidence.map((item) => [item.id, item])),
    analysis: {
      status: "COLLECTED",
      nextStage: "ESTIMATE_DISCOVERY",
      quantitativeResultsReady: false
    },
    collectedAt: new Date().toISOString()
  };
}

export async function runEstimateMap(input, { mode = "AUTO" } = {}) {
  const runtimeMode = mode === "AUTO" ? await detectRuntimeMode() : mode;
  if (runtimeMode === "LIVE") {
    const live = await fetchLiveCompany(input);
    const ticker = live.company?.ticker;
    if (ticker && demoCompanies[ticker]) {
      const demo = await runEstimateMapDemo(ticker);
      demo.company = {
        ...demo.company,
        name: live.company.companyName || demo.company.name,
        ticker,
        market: live.company.market || demo.company.market,
        mode: "LIVE_DART_DEMO_ANALYSIS"
      };
      demo.source = {
        ...demo.source,
        report: live.filings?.[0]?.reportName || demo.source.report,
        submitted: live.filings?.[0]?.submittedAt || demo.source.submitted,
        version: live.filings?.[0]?.receiptNumber || demo.source.version,
        demoNotice: "기업 식별과 공시목록은 OpenDART LIVE 데이터이며, 회계추정 분석 결과는 검증용 DEMO 데이터입니다."
      };
      return demo;
    }
    return buildCollectionModel(live);
  }
  return runEstimateMapDemo(input);
}
