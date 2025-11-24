/* =========================
   디지털 시계
   ========================= */
function updateClock() {
  const el = document.getElementById("digitalClock");
  if (!el) return;
  const now = new Date();
  el.textContent = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
}
setInterval(updateClock, 1000);
updateClock();

/* =========================
   테마 정보
   ========================= */
const themeInfo = {
  fire: {
    emoji: "🔥",
    name: "불멍",
    subtitle: "장작불 앞에서 조용히 호흡만 느껴보세요.",
    bg: "radial-gradient(circle at bottom, #ffb347 0%, #ff7a3c 20%, #0d1117 70%)",
  },
  water: {
    emoji: "💧",
    name: "물멍",
    subtitle: "잔잔한 물결과 수면 파동을 상상해 보세요.",
    bg: "radial-gradient(circle at bottom, #5bbcff 0%, #2f6ddb 30%, #0d1117 75%)",
  },
  rain: {
    emoji: "🌧",
    name: "빗소리",
    subtitle: "창 밖으로 떨어지는 빗방울만 바라보는 시간.",
    bg: "radial-gradient(circle at bottom, #9bb5c9 0%, #4c6d8f 30%, #0d1117 70%)",
  },
  bubble: {
    emoji: "🫧",
    name: "버블",
    subtitle: "위로 둥둥 떠오르는 기포를 따라가 보세요.",
    bg: "radial-gradient(circle at bottom, #d7b1ff 0%, #8a55d6 26%, #0d1117 70%)",
  },
  snow: {
    emoji: "❄️",
    name: "눈",
    subtitle: "천천히 내리는 눈송이 사이로 생각을 흘려보내세요.",
    bg: "radial-gradient(circle at bottom, #f1f6ff 0%, #96b7f8 22%, #0d1117 75%)",
  },
  leaf: {
    emoji: "🍂",
    name: "낙엽",
    subtitle: "가을 바람에 흩날리는 낙엽처럼 내려놓는 연습.",
    bg: "radial-gradient(circle at bottom, #ffca85 0%, #b8763a 25%, #0d1117 75%)",
  },
  frost: {
    emoji: "🧊",
    name: "성에",
    subtitle: "서리 낀 창문 사이로 들어오는 차분한 빛.",
    bg: "radial-gradient(circle at bottom, #d1edff 0%, #5da8d6 24%, #0d1117 75%)",
  },
};

const sceneEmoji = document.getElementById("currentThemeEmoji");
const sceneName = document.getElementById("currentThemeName");
const sceneSub = document.getElementById("currentThemeSubtitle");
const sceneCanvas = document.getElementById("sceneCanvas");

/* =========================
   페이지 전환 (선택 / 세션)
   ========================= */
const pageSelect = document.getElementById("page-select");
const pageSession = document.getElementById("page-session");
const backToSelectBtn = document.getElementById("backToSelect");

function showPage(name) {
  if (!pageSelect || !pageSession) return;
  if (name === "select") {
    pageSelect.classList.add("active");
    pageSession.classList.remove("active");
  } else {
    pageSelect.classList.remove("active");
    pageSession.classList.add("active");
  }
}

// 세션 페이지 → 선택 페이지로 돌아가기
if (backToSelectBtn) {
  backToSelectBtn.addEventListener("click", () => {
    showPage("select");
  });
}

/* =========================
   테마 적용 함수
   ========================= */
function applyThemeByKey(key) {
  const t = themeInfo[key];
  if (!t || !sceneCanvas || !sceneEmoji || !sceneName || !sceneSub) return;

  sceneEmoji.textContent = t.emoji;
  sceneName.textContent = t.name;
  sceneSub.textContent = t.subtitle;
  sceneCanvas.style.background = t.bg;

  // 세션 페이지 아래 작은 칩들 active 처리
  document.querySelectorAll(".theme-chip").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.key === key);
  });

  // 선택 페이지의 큰 카드 active 처리
  document.querySelectorAll(".select-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.key === key);
  });
}

/* =========================
   페이지 1 : 선택 그리드 (큰 카드 3개씩)
   ========================= */
const SELECT_ORDER = [
  "fire",
  "water",
  "rain",
  "bubble",
  "snow",
  "leaf",
  "frost",
];
const SELECT_PAGE_SIZE = 3;
let selectStart = 0;

const selectPrevBtn = document.getElementById("selectPrevBtn");
const selectNextBtn = document.getElementById("selectNextBtn");
const selectCards = document.querySelectorAll(".select-card");

function updateSelectGrid() {
  if (!selectCards.length) return;
  selectCards.forEach((card, idx) => {
    const visible = idx >= selectStart && idx < selectStart + SELECT_PAGE_SIZE;
    card.style.display = visible ? "flex" : "none";
  });

  if (selectPrevBtn) {
    selectPrevBtn.disabled = selectStart === 0;
  }
  if (selectNextBtn) {
    selectNextBtn.disabled =
      selectStart + SELECT_PAGE_SIZE >= SELECT_ORDER.length;
  }
}

if (selectPrevBtn) {
  selectPrevBtn.addEventListener("click", () => {
    if (selectStart > 0) {
      selectStart -= SELECT_PAGE_SIZE;
      if (selectStart < 0) selectStart = 0;
      updateSelectGrid();
    }
  });
}

if (selectNextBtn) {
  selectNextBtn.addEventListener("click", () => {
    if (selectStart + SELECT_PAGE_SIZE < SELECT_ORDER.length) {
      selectStart += SELECT_PAGE_SIZE;
      updateSelectGrid();
    }
  });
}

// 큰 카드 클릭 → 테마 적용 + 세션 페이지로 이동
selectCards.forEach((card) => {
  card.addEventListener("click", () => {
    const key = card.dataset.key;
    applyThemeByKey(key);
    showPage("session");
  });
});

/* =========================
   페이지 2 : 하단 테마 스트립 (작은 칩들)
   ========================= */
const THEME_ORDER = [
  "fire",
  "water",
  "rain",
  "bubble",
  "snow",
  "leaf",
  "frost",
];
const PAGE_SIZE = 3;
let themePageStart = 0;

const prevThemeBtn = document.getElementById("prevThemeBtn");
const nextThemeBtn = document.getElementById("nextThemeBtn");

function updateThemeStrip() {
  const chips = document.querySelectorAll(".theme-chip");
  if (!chips.length) return;

  chips.forEach((chip, idx) => {
    const visible = idx >= themePageStart && idx < themePageStart + PAGE_SIZE;
    chip.style.display = visible ? "flex" : "none";
  });

  if (prevThemeBtn) {
    prevThemeBtn.disabled = themePageStart === 0;
  }
  if (nextThemeBtn) {
    nextThemeBtn.disabled = themePageStart + PAGE_SIZE >= THEME_ORDER.length;
  }
}

document.querySelectorAll(".theme-chip").forEach((btn) => {
  btn.addEventListener("click", () => {
    applyThemeByKey(btn.dataset.key);
  });
});

if (prevThemeBtn) {
  prevThemeBtn.addEventListener("click", () => {
    if (themePageStart > 0) {
      themePageStart -= PAGE_SIZE;
      if (themePageStart < 0) themePageStart = 0;
      updateThemeStrip();
    }
  });
}

if (nextThemeBtn) {
  nextThemeBtn.addEventListener("click", () => {
    if (themePageStart + PAGE_SIZE < THEME_ORDER.length) {
      themePageStart += PAGE_SIZE;
      updateThemeStrip();
    }
  });
}

/* =========================
   타이머 로직
   ========================= */
const timerMinInput = document.getElementById("timerMin");
const timerSecInput = document.getElementById("timerSec");
const timerDisplay = document.getElementById("timerDisplay");

const timerStartBtn = document.getElementById("timerStartBtn");
const timerPauseBtn = document.getElementById("timerPauseBtn");
const timerResetBtn = document.getElementById("timerResetBtn");

let timerInterval = null;
let timerRemainingMs = 0;
let timerRunning = false;

// 디톡스 세션 여부
let detoxSessionActive = false;

function formatTimer(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function updateTimerDisplay() {
  if (timerDisplay) {
    timerDisplay.textContent = formatTimer(timerRemainingMs);
  }
}

function readTimerFromInput() {
  if (!timerMinInput || !timerSecInput) return 0;
  const m = parseInt(timerMinInput.value || "0", 10);
  const s = parseInt(timerSecInput.value || "0", 10);
  const total = (m * 60 + s) * 1000;
  return isNaN(total) ? 0 : total;
}

function startTimer() {
  if (timerRunning) return;

  if (timerRemainingMs <= 0) {
    timerRemainingMs = readTimerFromInput();
    if (timerRemainingMs <= 0) {
      alert("분/초를 입력한 뒤 시작을 눌러주세요.");
      return;
    }
  }

  timerRunning = true;
  const startTime = Date.now();
  const startRemaining = timerRemainingMs;

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    timerRemainingMs = startRemaining - elapsed;

    if (timerRemainingMs <= 0) {
      timerRemainingMs = 0;
      updateTimerDisplay();
      clearInterval(timerInterval);
      timerRunning = false;
      onTimerFinished();
    } else {
      updateTimerDisplay();
    }
  }, 200);

  updateTimerDisplay();
}

function pauseTimer() {
  if (!timerRunning) return;
  timerRunning = false;
  clearInterval(timerInterval);
}

function resetTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  timerRemainingMs = 0;
  updateTimerDisplay();
  detoxSessionActive = false;
  updateLockStatus("상태: 대기 중");
}

if (timerStartBtn) {
  timerStartBtn.addEventListener("click", () => {
    detoxSessionActive = false;
    updateLockStatus("상태: 대기 중");
    startTimer();
  });
}
if (timerPauseBtn) timerPauseBtn.addEventListener("click", pauseTimer);
if (timerResetBtn) timerResetBtn.addEventListener("click", resetTimer);

updateTimerDisplay();

/* =========================
   디톡스 세션(알림만) 로직
   ========================= */
const detoxLockBtn = document.getElementById("detoxLockBtn");
const lockStatus = document.getElementById("lockStatus");

function updateLockStatus(text) {
  if (lockStatus) {
    lockStatus.textContent = text;
  }
}

function onTimerFinished() {
  if (detoxSessionActive) {
    detoxSessionActive = false;
    updateLockStatus("상태: 완료 (디톡스 세션 종료)");
    alert(
      "디지털 디톡스 세션이 종료되었습니다.\n천천히 눈을 뜨고, 몸을 가볍게 풀어주세요."
    );
  } else {
    alert("타이머가 종료되었습니다!");
  }
}

if (detoxLockBtn) {
  detoxLockBtn.addEventListener("click", () => {
    if (!timerRunning && timerRemainingMs <= 0) {
      timerRemainingMs = readTimerFromInput();
      if (timerRemainingMs <= 0) {
        alert("디톡스 세션 전에 타이머 시간을 먼저 설정해 주세요.");
        return;
      }
    }

    detoxSessionActive = true;
    updateLockStatus("상태: 진행 중 (디지털 디톡스 세션)");

    if (!timerRunning) {
      startTimer();
    } else {
      alert(
        "이미 타이머가 실행 중입니다. 현재 타이머가 디톡스 세션으로 사용됩니다."
      );
    }
  });
}

/* =========================
   초기 상태 세팅
   ========================= */
updateThemeStrip();
updateSelectGrid();
applyThemeByKey("fire");
showPage("select");

/* =========================
   배경 소리 로직 (옵션)
   ========================= */
const bgSound = document.getElementById("bgSound");
const soundButtons = document.querySelectorAll(".sound-btn");

// 각 키에 맞는 음원 경로
const soundFiles = {
  none: "", // 끄기
  calm: "sounds/calm.mp3", // 잔잔하게
  bright: "sounds/bright.mp3", // 경쾌하게
};

function setBackgroundSound(key) {
  if (!bgSound) return;

  // 버튼 active 스타일
  soundButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.sound === key);
  });

  const src = soundFiles[key] || "";
  if (!src) {
    bgSound.pause();
    bgSound.removeAttribute("src");
    bgSound.load();
    return;
  }

  if (bgSound.getAttribute("data-current") === key) return;

  bgSound.setAttribute("data-current", key);
  bgSound.src = src;
  bgSound.currentTime = 0;
  bgSound.play().catch(() => {
    // 모바일에서 첫 터치 전에 play가 막힐 수 있으니 무시
  });
}

// 버튼 클릭 이벤트
soundButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.sound;
    setBackgroundSound(key);
  });
});

// 기본값: 끄기
setBackgroundSound("none");
