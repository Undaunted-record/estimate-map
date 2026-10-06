export const demoCompanies = {
  "051910": {
    company: { name: "LG화학", ticker: "051910", market: "KOSPI", fiscalYear: 2025, basis: "연결", mode: "DEMO" },
    source: { report: "2025 사업보고서 · 연결재무제표", submitted: "2026년 공시", version: "최신 정정본 확인 필요", demoNotice: "연구계획서의 파일럿 결과를 화면 검증용으로 구조화한 DEMO 데이터입니다. 원문 페이지·접수번호는 LIVE 수집 시 확정됩니다." },
    metrics: [
      { label: "주요 회계추정", value: "8", note: "기업×추정 항목" },
      { label: "정량분석 가능", value: "3", note: "공시 기반 2 · 제한적 1" },
      { label: "전년비교 가능", value: "4", note: "당기·전기 연결 가능" },
      { label: "High Review", value: "3", note: "Materiality 아님" }
    ],
    insights: [
      { id: "i1", tone: "high", title: "석유화학 CGU의 할인율 민감도가 가장 큽니다.", body: "할인율 +0.5%p 시 회수가능액 1.108조원 감소가 직접 공시되어 우선 검토가 필요합니다.", evidenceIds: ["ev-cgu-sensitivity"] },
      { id: "i2", tone: "medium", title: "퇴직급여 가정은 전년 비교 대상입니다.", body: "할인율 산정과 가정 변화의 연결을 우선 확인하되, 검증되지 않은 수치는 표시하지 않았습니다.", evidenceIds: ["ev-retirement"] },
      { id: "i3", tone: "limit", title: "품질보증은 중요하지만 계산하면 안 됩니다.", body: "관련 충당부채는 크지만 세부 충당률과 미래 Claim 발생률이 비공개라 정량 Stress Test를 보류합니다.", evidenceIds: ["ev-warranty"] }
    ],
    estimates: [
      { id: "cgu-petro", priority: "High", category: "자산손상", title: "석유화학 CGU 손상", subject: "석유화학 부문 현금창출단위 집단", amount: "회수가능액 기준", standard: "K-IFRS 1036", assumption: "세전 할인율 · 영구성장률", current: "7.62~8.56% · 1.00%", previous: "전년값 Evidence 연결 대기", yoy: "비교 가능", level: "공시 기반", stress: true, comparability: "높음", type: "ACCOUNTING_ESTIMATE", validation: "핵심 수치 검증", score: 8, scoreReasons: ["정량 민감도 2", "추정불확실성 2", "핵심추정 명시 2", "관련 규모 2"], ai: "회사가 가치사용액의 핵심 가정과 ±0.5%p 민감도를 직접 공시했습니다. 공시 범위를 넘어선 보간은 제공하지 않습니다.", evidenceIds: ["ev-cgu-assumption", "ev-cgu-sensitivity"] },
      { id: "cgu-other", priority: "High", category: "자산손상", title: "기타 CGU 손상", subject: "영업권 및 비금융자산 CGU", amount: "항목별 연결 대기", standard: "K-IFRS 1036", assumption: "할인율 · 성장률 · 사업계획", current: "원문 검증 대기", previous: "원문 검증 대기", yoy: "부분 비교", level: "부분 분석", stress: false, comparability: "중간", type: "ACCOUNTING_ESTIMATE", validation: "컨텍스트 확인", score: 6, scoreReasons: ["관련 규모 2", "추정불확실성 2", "핵심추정 명시 2"], ai: "중요 추정 후보로 식별되지만 개별 CGU별 숫자 연결은 원문 수집 후 확정해야 합니다.", evidenceIds: ["ev-other-cgu"] },
      { id: "retirement", priority: "Medium", category: "종업원급여", title: "퇴직급여", subject: "확정급여채무", amount: "금액 Evidence 연결 대기", standard: "K-IFRS 1019", assumption: "할인율 · 임금상승률", current: "원문 검증 대기", previous: "전년 공시 연결 대기", yoy: "비교 가능", level: "공시 기반", stress: true, comparability: "높음", type: "ACCOUNTING_ESTIMATE", validation: "정성 검증", score: 5, scoreReasons: ["정량 민감도 2", "전년 비교 1", "핵심추정 명시 2"], ai: "퇴직급여 민감도는 회계추정으로 포함되지만 시장금리 위험공시와 혼동하지 않도록 문맥 분류합니다.", evidenceIds: ["ev-retirement"] },
      { id: "warranty", priority: "High", category: "충당부채", title: "품질보증충당부채", subject: "LG에너지솔루션 일반 품질보증", amount: "1,549,908백만원", standard: "K-IFRS 1037", assumption: "보증기간 · 매출액 · 과거 Claim 경험", current: "세부 충당률 비공개", previous: "비교 가능", yoy: "금액 비교", level: "공개정보 한계", stress: false, comparability: "중간", type: "ACCOUNTING_ESTIMATE", validation: "원문 금액 검증", score: 7, scoreReasons: ["관련 규모 2", "내부정보 한계 2", "핵심추정 명시 2", "전년 비교 1"], ai: "금액은 중요하지만 외부 이용자가 충당률을 재구성할 수 없습니다. 숫자를 임의 보완하지 않고 Stress Test를 차단합니다.", evidenceIds: ["ev-warranty"] },
      { id: "lease", priority: "Low", category: "리스", title: "리스 관련 추정", subject: "리스기간 및 증분차입이자율", amount: "원문 검증 대기", standard: "K-IFRS 1116", assumption: "리스기간 · 할인율", current: "원문 검증 대기", previous: "정보 부족", yoy: "제한", level: "부분 분석", stress: false, comparability: "낮음", type: "ACCOUNTING_JUDGMENT", validation: "후보 발견", score: 3, scoreReasons: ["추정불확실성 1", "판단 연계 2"], ai: "리스기간 판단과 할인율은 구분해 추출해야 하며 현재 데모에서는 정량값을 생성하지 않습니다.", evidenceIds: ["ev-lease"] },
      { id: "sharepay", priority: "Low", category: "보상", title: "주식기준보상", subject: "주식선택권 공정가치", amount: "원문 검증 대기", standard: "K-IFRS 1102", assumption: "변동성 · 기대만기", current: "원문 검증 대기", previous: "정보 부족", yoy: "제한", level: "부분 분석", stress: false, comparability: "낮음", type: "ACCOUNTING_ESTIMATE", validation: "후보 발견", score: 3, scoreReasons: ["공정가치 추정 1", "핵심 입력 2"], ai: "평가기법의 입력과 보상비용을 Evidence 단위로 연결할 대상입니다.", evidenceIds: ["ev-sharepay"] },
      { id: "fairvalue", priority: "Medium", category: "공정가치", title: "금융상품 공정가치", subject: "IFRS 13 Level 3 금융상품", amount: "원문 검증 대기", standard: "K-IFRS 1113", assumption: "비관측 투입변수", current: "원문 검증 대기", previous: "비교 가능", yoy: "부분 비교", level: "부분 분석", stress: false, comparability: "중간", type: "ACCOUNTING_ESTIMATE", validation: "Level 분류 확인", score: 5, scoreReasons: ["Level 3 신호 2", "전년 비교 1", "평가불확실성 2"], ai: "‘비관측 투입변수’ 용어는 IFRS 13 Level 3 문맥에서만 사용합니다.", evidenceIds: ["ev-fairvalue"] },
      { id: "provisions", priority: "Low", category: "충당부채", title: "기타 충당부채", subject: "복구 · 소송 등 기타 의무", amount: "원문 검증 대기", standard: "K-IFRS 1037", assumption: "발생가능성 · 최선추정치", current: "내부정보 한계", previous: "정보 부족", yoy: "제한", level: "공개정보 한계", stress: false, comparability: "낮음", type: "ACCOUNTING_ESTIMATE", validation: "판단 보류", score: 2, scoreReasons: ["내부정보 한계 2"], ai: "공시된 입력이 부족한 일반 충당부채에는 ‘비관측 투입변수’라는 표현을 사용하지 않습니다.", evidenceIds: ["ev-provisions"] }
    ],
    evidence: [
      { id: "ev-cgu-assumption", estimateId: "cgu-petro", status: "숫자 검증", source: "2025 연결재무제표", section: "비금융자산의 손상", anchor: "석유화학 부문 CGU 가치사용액", page: "LIVE 수집 시 페이지 결합", text: "석유화학 부문 현금창출단위 집단의 가치사용액 산정에는 세전 할인율 7.62~8.56%와 영구성장률 1.00%가 사용되었습니다.", highlights: ["7.62~8.56%", "1.00%"], caveat: "연구계획서 파일럿을 구조화한 데모 발췌입니다." },
      { id: "ev-cgu-sensitivity", estimateId: "cgu-petro", status: "숫자 검증", source: "2025 연결재무제표", section: "비금융자산의 손상", anchor: "핵심 가정 민감도", page: "LIVE 수집 시 페이지 결합", text: "할인율이 0.5%p 상승하는 경우 회수가능액은 1,108,382백만원 감소하고, 0.5%p 하락하는 경우 1,329,952백만원 증가합니다.", highlights: ["0.5%p 상승", "1,108,382백만원 감소", "0.5%p 하락", "1,329,952백만원 증가"], caveat: "회사 직접 공시 범위만 표시합니다." },
      { id: "ev-warranty", estimateId: "warranty", status: "판단 보류 검증", source: "2025 연결재무제표", section: "충당부채", anchor: "일반 품질보증충당부채", page: "LIVE 수집 시 페이지 결합", text: "일반 품질보증충당부채는 1,549,908백만원이며 평균 보증기간, 매출액 및 과거 Claim 경험 등을 기초로 추정됩니다. 세부 충당률은 공개되지 않았습니다.", highlights: ["1,549,908백만원", "세부 충당률은 공개되지 않았습니다"], caveat: "정량 Stress Test를 생성하지 않는 것이 정답입니다." },
      { id: "ev-retirement", estimateId: "retirement", status: "문맥 검증", source: "2025 연결재무제표", section: "순확정급여부채", anchor: "주요 보험수리적 가정", page: "원문 연결 대기", text: "퇴직급여 할인율과 임금상승률의 당기·전기 값 및 민감도 표를 연결할 후보입니다.", highlights: ["퇴직급여 할인율", "민감도"], caveat: "데모에서는 검증 전 수치를 표시하지 않습니다." },
      { id: "ev-other-cgu", estimateId: "cgu-other", status: "연결 대기", source: "사업보고서", section: "자산손상", anchor: "기타 CGU", page: "원문 연결 대기", text: "기타 CGU별 가정과 장부금액의 연결은 공시 수집 후 확정됩니다.", highlights: ["공시 수집 후 확정"], caveat: "미검증 숫자는 출력하지 않습니다." },
      { id: "ev-lease", estimateId: "lease", status: "연결 대기", source: "사업보고서", section: "리스", anchor: "리스기간 판단", page: "원문 연결 대기", text: "리스기간과 할인율 관련 서술을 판단과 추정으로 나누어 연결합니다.", highlights: ["판단과 추정으로 나누어"], caveat: "후보 상태입니다." },
      { id: "ev-sharepay", estimateId: "sharepay", status: "연결 대기", source: "사업보고서", section: "주식기준보상", anchor: "평가모형", page: "원문 연결 대기", text: "변동성, 기대만기 등 평가모형 입력과 인식금액을 연결할 후보입니다.", highlights: ["평가모형 입력"], caveat: "후보 상태입니다." },
      { id: "ev-fairvalue", estimateId: "fairvalue", status: "문맥 검증", source: "사업보고서", section: "공정가치", anchor: "Level 3", page: "원문 연결 대기", text: "Level 3 공정가치의 평가기법과 비관측 투입변수를 연결합니다.", highlights: ["Level 3", "비관측 투입변수"], caveat: "IFRS 13 문맥에만 적용합니다." },
      { id: "ev-provisions", estimateId: "provisions", status: "판단 보류", source: "사업보고서", section: "충당부채", anchor: "기타 충당부채", page: "원문 연결 대기", text: "핵심 내부 입력이 공개되지 않은 경우 공개정보 한계로 분류합니다.", highlights: ["공개정보 한계"], caveat: "임의 Stress Test 금지." }
    ]
  }
};

export const companyAliases = { "051910": "051910", "lg화학": "051910", "LG화학": "051910", "lg chem": "051910", "LG Chem": "051910" };
