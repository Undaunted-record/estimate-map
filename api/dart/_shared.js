import AdmZip from "adm-zip";

const DART_BASE = "https://opendart.fss.or.kr/api";
let companyIndexPromise;

export function sendJson(response, status, payload) {
  response.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

export function requireApiKey() {
  const apiKey = process.env.DART_API_KEY?.trim();
  if (!apiKey) {
    const error = new Error("DART_API_KEY is not configured on the server.");
    error.code = "DART_KEY_MISSING";
    throw error;
  }
  return apiKey;
}

function decodeXml(value = "") {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function tag(block, name) {
  return decodeXml(block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1]?.trim() || "");
}

async function loadCompanyIndex(apiKey) {
  if (!companyIndexPromise) {
    companyIndexPromise = (async () => {
      const response = await fetch(`${DART_BASE}/corpCode.xml?crtfc_key=${encodeURIComponent(apiKey)}`);
      if (!response.ok) throw new Error(`DART corpCode request failed (${response.status}).`);
      const zip = new AdmZip(Buffer.from(await response.arrayBuffer()));
      const entry = zip.getEntries().find((item) => item.entryName.toLowerCase().endsWith(".xml"));
      if (!entry) throw new Error("DART corpCode archive did not contain XML.");
      const xml = entry.getData().toString("utf8");
      return [...xml.matchAll(/<list>([\\s\\S]*?)<\/list>/g)].map((match) => ({
        corpCode: tag(match[1], "corp_code"),
        companyName: tag(match[1], "corp_name"),
        ticker: tag(match[1], "stock_code"),
        modifiedAt: tag(match[1], "modify_date")
      })).filter((company) => company.corpCode && company.companyName);
    })().catch((error) => {
      companyIndexPromise = undefined;
      throw error;
    });
  }
  return companyIndexPromise;
}

export async function resolveCompany(query, apiKey = requireApiKey()) {
  const normalized = String(query || "").trim();
  if (!normalized) throw new Error("기업명 또는 종목코드를 입력하세요.");
  const companies = await loadCompanyIndex(apiKey);
  const compact = normalized.replaceAll(" ", "").toLowerCase();
  const exact = companies.find((company) => company.ticker === normalized.padStart(6, "0"))
    || companies.find((company) => company.companyName.replaceAll(" ", "").toLowerCase() === compact);
  const company = exact || companies.find((item) => item.companyName.replaceAll(" ", "").toLowerCase().includes(compact));
  if (!company) {
    const error = new Error(`DART에서 '${normalized}' 기업을 찾지 못했습니다.`);
    error.code = "COMPANY_NOT_FOUND";
    throw error;
  }
  return company;
}

export async function fetchCompanyProfile(corpCode, apiKey = requireApiKey()) {
  const url = `${DART_BASE}/company.json?crtfc_key=${encodeURIComponent(apiKey)}&corp_code=${encodeURIComponent(corpCode)}`;
  const response = await fetch(url);
  const payload = await response.json();
  if (!response.ok || payload.status !== "000") throw new Error(payload.message || "DART 기업개황 조회에 실패했습니다.");
  return payload;
}

export async function fetchAnnualFilings(corpCode, apiKey = requireApiKey()) {
  const now = new Date();
  const end = now.toISOString().slice(0, 10).replaceAll("-", "");
  const start = `${now.getUTCFullYear() - 3}0101`;
  const params = new URLSearchParams({
    crtfc_key: apiKey,
    corp_code: corpCode,
    bgn_de: start,
    end_de: end,
    pblntf_ty: "A",
    page_count: "100"
  });
  const response = await fetch(`${DART_BASE}/list.json?${params}`);
  const payload = await response.json();
  if (payload.status === "013") return [];
  if (!response.ok || payload.status !== "000") throw new Error(payload.message || "DART 공시목록 조회에 실패했습니다.");
  return payload.list
    .filter((filing) => /사업보고서/.test(filing.report_nm))
    .sort((a, b) => b.rcept_dt.localeCompare(a.rcept_dt));
}

export function publicCompany(company, profile) {
  return {
    corpCode: company.corpCode,
    companyName: profile.corp_name || company.companyName,
    ticker: profile.stock_code || company.ticker,
    market: profile.corp_cls,
    fiscalMonth: profile.acc_mt,
    homepage: profile.hm_url || null,
    modifiedAt: company.modifiedAt
  };
}
