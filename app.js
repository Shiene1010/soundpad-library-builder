const SETTINGS_KEY = "soundchunk-settings-v1";
const USER_KEY = "soundchunk-user-v1";
const DEMO_APPROVED_KEY = "soundchunk-demo-approved-v1";
const REQUESTS_KEY = "soundchunk-expression-requests-v1";

const defaultUser = {
  email: "",
  status: "pending",
  canRequestExpression: false,
  lastSeenLibraryVersion: "",
};

const fallbackManifest = {
  updated: "2026-11-08",
  latestVersion: "2026.11.08",
  libraries: [
    {
      id: "sample-daily-20261108",
      title: "Daily Chunk Pack",
      version: "2026.11.08",
      count: 0,
      addedCount: 0,
      summary: "배포 준비 중인 샘플 라이브러리입니다.",
      path: "libraries/operator/chunk-library-20261108.clib.json",
    },
  ],
};

const state = {
  user: normalizeUser(loadJson(USER_KEY, defaultUser)),
  settings: loadJson(SETTINGS_KEY, { notificationsEnabled: true }),
  requests: loadArray(REQUESTS_KEY),
  manifest: fallbackManifest,
  manifestStatus: "idle",
};

const $ = (id) => document.getElementById(id);

function loadJson(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return parsed && typeof parsed === "object" ? { ...fallback, ...parsed } : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadArray(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeUser(user) {
  const demoApproved = localStorage.getItem(DEMO_APPROVED_KEY) === "true";
  const legacyDemoUser = user.email === "pending@example.com";
  if (!demoApproved && (legacyDemoUser || user.status === "approved")) return { ...defaultUser };
  return { ...defaultUser, ...user };
}

function loadDemoUser() {
  const demoApproved = localStorage.getItem(DEMO_APPROVED_KEY) === "true";
  if (!demoApproved || state.user.status !== "pending") return;
  state.user = {
    ...state.user,
    status: "approved",
    canRequestExpression: true,
  };
}

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  window.setTimeout(() => el.classList.remove("show"), 1800);
}

function showView(name) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("hidden", view.id !== `view-${name}`);
  });
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.view === name);
  });
}

function renderUser() {
  const approved = state.user.status === "approved";
  $("user-status").textContent = approved ? "승인됨" : "승인 대기";
  $("request-permission").textContent = state.user.canRequestExpression ? "요청 가능" : "요청 꺼짐";
  $("request-form").querySelector("button").disabled = !approved || !state.user.canRequestExpression;
  $("request-setting-text").textContent = state.user.canRequestExpression
    ? "현재 운영자가 표현 요청 기능을 켜두었습니다."
    : "현재 운영자가 표현 요청 기능을 꺼두었습니다.";
}

function renderLibraries() {
  const list = $("library-list");
  list.innerHTML = "";
  if (state.manifestStatus === "failed") {
    const warning = document.createElement("article");
    warning.className = "panel library-card";
    warning.innerHTML = `
      <h3>최신 정보 확인 실패</h3>
      <p>네트워크 또는 manifest 설정을 확인하세요. 아래에는 데모용 기본 정보가 표시됩니다.</p>
    `;
    list.append(warning);
  }
  for (const item of state.manifest.libraries || []) {
    const card = document.createElement("article");
    card.className = "panel library-card";
    card.innerHTML = `
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary || "업데이트 설명이 없습니다.")}</p>
      <div class="meta">
        <span>버전 ${escapeHtml(item.version)}</span>
        <span>${Number(item.count || 0)}개 표현</span>
        <span>신규 ${Number(item.addedCount || 0)}개</span>
      </div>
    `;
    list.append(card);
  }
}

function renderRequests() {
  const list = $("request-list");
  list.innerHTML = "";
  if (state.requests.length === 0) {
    const empty = document.createElement("article");
    empty.className = "panel library-card";
    empty.innerHTML = "<h3>요청 없음</h3><p>요청 권한이 켜진 사용자가 표현을 올리면 여기에 쌓입니다.</p>";
    list.append(empty);
    return;
  }
  for (const request of state.requests) {
    const card = document.createElement("article");
    card.className = "panel library-card";
    card.innerHTML = `
      <h3>${escapeHtml(request.text)}</h3>
      <p>${escapeHtml(request.context || "상황 설명 없음")}</p>
      <div class="meta">
        <span>${escapeHtml(request.status)}</span>
        <span>${escapeHtml(new Date(request.createdAt).toLocaleString())}</span>
      </div>
      <div class="action-row">
        <button class="mini-button" data-request-action="reviewing" data-request-id="${escapeHtml(request.id)}" type="button">검토중</button>
        <button class="mini-button" data-request-action="approved" data-request-id="${escapeHtml(request.id)}" type="button">승인</button>
        <button class="mini-button" data-request-action="rejected" data-request-id="${escapeHtml(request.id)}" type="button">거절</button>
        <button class="mini-button" data-request-action="draft" data-request-id="${escapeHtml(request.id)}" type="button">수동초안</button>
        <button class="mini-button" data-request-action="gemini" data-request-id="${escapeHtml(request.id)}" type="button">Gemini</button>
      </div>
      ${request.validation ? renderValidation(request.validation) : ""}
      ${request.draft ? `<pre class="draft-preview">${escapeHtml(JSON.stringify(request.draft, null, 2))}</pre>` : ""}
    `;
    list.append(card);
  }
}

function saveRequests() {
  saveJson(REQUESTS_KEY, state.requests);
}

function updateRequest(id, patch) {
  state.requests = state.requests.map((request) => (
    request.id === id ? { ...request, ...patch, updatedAt: new Date().toISOString() } : request
  ));
  saveRequests();
  renderRequests();
}

function buildDraft(request) {
  const slug = request.text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "expression";
  return {
    id: `expr-${slug}`,
    text: request.text,
    chunks: [
      { text: request.text, hint: "운영자가 Gemini 초안으로 쪼갤 표현" },
    ],
    tones: [],
    ccq: [],
    sourceRequestId: request.id,
  };
}

function validateDraft(draft) {
  const issues = [];
  if (!draft || typeof draft !== "object") issues.push("초안 JSON이 객체가 아닙니다.");
  if (!draft?.id) issues.push("id가 없습니다.");
  if (!draft?.text) issues.push("text가 없습니다.");
  if (!Array.isArray(draft?.chunks) || draft.chunks.length < 1) issues.push("chunk가 1개 이상 필요합니다.");
  if (!Array.isArray(draft?.tones) || draft.tones.length < 3) issues.push("tone은 최소 3개 필요합니다.");
  if (!Array.isArray(draft?.ccq) || draft.ccq.length < 2) issues.push("ccq는 최소 2개 필요합니다.");
  for (const [index, chunk] of (draft?.chunks || []).entries()) {
    if (!chunk.text || !chunk.hint) issues.push(`chunk ${index + 1}에 text/hint가 필요합니다.`);
  }
  for (const [index, tone] of (draft?.tones || []).entries()) {
    if (!tone.key || !tone.label || !tone.text) issues.push(`tone ${index + 1}에 key/label/text가 필요합니다.`);
  }
  for (const [index, ccq] of (draft?.ccq || []).entries()) {
    if (!["yes", "no"].includes(String(ccq.answer || "").toLowerCase())) {
      issues.push(`ccq ${index + 1} answer는 yes/no여야 합니다.`);
    }
    if (!ccq.question) issues.push(`ccq ${index + 1}에 question이 필요합니다.`);
  }
  return {
    ok: issues.length === 0,
    issues,
  };
}

function renderValidation(validation) {
  const items = validation.issues.length
    ? validation.issues.map((issue) => `<li>${escapeHtml(issue)}</li>`).join("")
    : "<li>검증 통과</li>";
  return `<div class="validation ${validation.ok ? "is-ok" : "is-warn"}"><strong>${validation.ok ? "검증 통과" : "검증 필요"}</strong><ul>${items}</ul></div>`;
}

function buildLibraryExport() {
  const expressions = state.requests
    .filter((request) => request.draft)
    .map((request) => request.draft);
  return {
    type: "sound-chunk-library",
    version: "0.1.0",
    updated: new Date().toISOString(),
    count: expressions.length,
    expressions,
  };
}

function buildManifestPreview(library) {
  const date = new Date().toISOString().slice(0, 10);
  const compactDate = date.replaceAll("-", "");
  return {
    updated: date,
    latestVersion: date.replaceAll("-", "."),
    libraries: [
      {
        id: `operator-${compactDate}`,
        title: `Operator Chunk Pack ${date}`,
        version: date.replaceAll("-", "."),
        path: `libraries/operator/chunk-library-${compactDate}.clib.json`,
        count: library.count,
        addedCount: library.count,
        summary: `${library.count}개 표현 초안 업데이트`,
        publishedAt: new Date().toISOString(),
      },
    ],
  };
}

function buildLibraryPath() {
  const compactDate = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `libraries/operator/chunk-library-${compactDate}.clib.json`;
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function publishLibrary() {
  const library = buildLibraryExport();
  const manifest = buildManifestPreview(library);
  if (library.count === 0) throw new Error("empty_library");
  const res = await fetch("/api/publish-library", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      library,
      manifest,
      libraryPath: buildLibraryPath(),
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "publish_failed");
  return data;
}

async function buildGeminiDraft(request) {
  const res = await fetch("/api/gemini-draft", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      requestId: request.id,
      text: request.text,
      context: request.context,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "gemini_failed");
  return data.draft;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

async function checkUpdates() {
  try {
    const res = await fetch("./libraries/manifest.json", { cache: "no-store" });
    if (!res.ok) throw new Error("manifest_fetch_failed");
    state.manifest = await res.json();
    state.manifestStatus = "loaded";
  } catch {
    state.manifest = fallbackManifest;
    state.manifestStatus = "failed";
  }
  renderLibraries();
  if (state.manifestStatus === "failed") {
    toast("최신 라이브러리 정보를 확인하지 못했습니다.");
    return;
  }
  if (!state.settings.notificationsEnabled) {
    toast("알림이 꺼져 있어요.");
    return;
  }
  if (state.manifest.latestVersion && state.manifest.latestVersion !== state.user.lastSeenLibraryVersion) {
    state.user.lastSeenLibraryVersion = state.manifest.latestVersion;
    saveJson(USER_KEY, state.user);
    toast(`새 라이브러리 ${state.manifest.latestVersion} 버전이 있어요.`);
  } else {
    toast("최신 상태입니다.");
  }
}

async function submitFeedback(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const payload = {
    title: $("feedback-title").value.trim(),
    body: $("feedback-body").value.trim(),
  };
  if (!payload.title || !payload.body) return;
  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("feedback_failed");
    form.reset();
    toast("GitHub Discussions에 피드백을 올렸습니다.");
  } catch {
    const encoded = encodeURIComponent(`${payload.title}\n\n${payload.body}`);
    window.open(`https://github.com/${window.SOUNDCHUNK_REPO || "OWNER/REPO"}/discussions/new?body=${encoded}`, "_blank", "noopener");
    toast("자동 제출이 안 되어 GitHub Discussions 작성 화면을 열었습니다.");
  }
}

function enableDemoApprovalShortcut() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("demo") !== "approved") return;
  localStorage.setItem(DEMO_APPROVED_KEY, "true");
  state.user = {
    ...state.user,
    status: "approved",
    canRequestExpression: true,
  };
  saveJson(USER_KEY, state.user);
}

function bindEvents() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => showView(tab.dataset.view));
  });
  $("notify-toggle").checked = state.settings.notificationsEnabled;
  $("notify-toggle").addEventListener("change", (event) => {
    state.settings.notificationsEnabled = event.target.checked;
    saveJson(SETTINGS_KEY, state.settings);
    toast(event.target.checked ? "알림을 켰습니다." : "알림을 껐습니다.");
  });
  $("check-updates").addEventListener("click", () => void checkUpdates());
  $("request-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!state.user.canRequestExpression) {
      toast("운영자가 표현 요청 기능을 꺼두었습니다.");
      return;
    }
    const text = $("request-text").value.trim();
    const context = $("request-context").value.trim();
    if (!text) return;
    state.requests.unshift({
      id: `req-${Date.now()}`,
      text,
      context,
      status: "new",
      createdAt: new Date().toISOString(),
    });
    saveRequests();
    renderRequests();
    event.currentTarget.reset();
    toast("표현 요청을 로컬 큐에 저장했습니다.");
  });
  $("feedback-form").addEventListener("submit", (event) => void submitFeedback(event));
  $("operator-demo").addEventListener("click", () => {
    $("operator-summary").classList.toggle("hidden");
  });
  $("clear-requests").addEventListener("click", () => {
    state.requests = [];
    saveRequests();
    renderRequests();
    toast("로컬 요청 큐를 비웠습니다.");
  });
  $("export-library").addEventListener("click", () => {
    const library = buildLibraryExport();
    $("export-preview").textContent = JSON.stringify(library, null, 2);
    $("export-preview").classList.remove("hidden");
    const manifest = buildManifestPreview(library);
    $("manifest-preview").textContent = JSON.stringify(manifest, null, 2);
    $("manifest-preview").classList.remove("hidden");
    if (library.count === 0) {
      toast("내보낼 초안이 없습니다.");
      return;
    }
    downloadJson(`chunk-library-${new Date().toISOString().slice(0, 10)}.clib.json`, library);
    toast("라이브러리 JSON을 내보냈습니다.");
  });
  $("publish-library").addEventListener("click", () => {
    toast("GitHub 배포를 시작합니다.");
    publishLibrary()
      .then(() => toast("GitHub libraries 폴더에 배포했습니다."))
      .catch((error) => toast(error.message === "empty_library" ? "배포할 초안이 없습니다." : "GitHub 배포에 실패했습니다."));
  });
  $("request-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-request-action]");
    if (!button) return;
    const id = button.dataset.requestId;
    const action = button.dataset.requestAction;
    const request = state.requests.find((item) => item.id === id);
    if (!request) return;
    if (action === "draft") {
      const draft = buildDraft(request);
      updateRequest(id, { status: "draft", draft, validation: validateDraft(draft) });
      toast("라이브러리 초안을 만들었습니다.");
      return;
    }
    if (action === "gemini") {
      toast("Gemini 초안을 요청합니다.");
      buildGeminiDraft(request)
        .then((draft) => {
          updateRequest(id, { status: "draft", draft, validation: validateDraft(draft) });
          toast("Gemini 초안을 만들었습니다.");
        })
        .catch((error) => {
          const fallback = buildDraft(request);
          const draft = { ...fallback, note: error.message };
          updateRequest(id, { status: "draft", draft, validation: validateDraft(draft) });
          toast("Gemini 설정 전이라 수동 초안을 만들었습니다.");
        });
      return;
    }
    updateRequest(id, { status: action });
    toast(`요청 상태를 ${action}로 바꿨습니다.`);
  });
}

loadDemoUser();
enableDemoApprovalShortcut();
bindEvents();
renderUser();
renderLibraries();
renderRequests();
void checkUpdates();
