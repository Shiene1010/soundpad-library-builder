const SETTINGS_KEY = "soundchunk-settings-v1";
const USER_KEY = "soundchunk-user-v1";
const DEMO_APPROVED_KEY = "soundchunk-demo-approved-v1";

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
    event.currentTarget.reset();
    toast("표현 요청 초안을 저장했습니다.");
  });
  $("feedback-form").addEventListener("submit", (event) => void submitFeedback(event));
}

loadDemoUser();
enableDemoApprovalShortcut();
bindEvents();
renderUser();
renderLibraries();
void checkUpdates();
