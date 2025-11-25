/* =========================
   디지털 시계
   ========================= */
function updateClock() {
  const el = document.getElementById("digitalClock");
  if (!el) return;
  const now = new Date();
  el.textContent =
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0") +
    ":" +
    String(now.getSeconds()).padStart(2, "0");
}
setInterval(updateClock, 1000);
updateClock();

/* =========================
   테마 정보
   ========================= */
var themeInfo = {
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

var sceneEmoji = document.getElementById("currentThemeEmoji");
var sceneName = document.getElementById("currentThemeName");
var sceneSub = document.getElementById("currentThemeSubtitle");
var sceneCanvas = document.getElementById("sceneCanvas");

/* =========================
   페이지 전환 (선택 / 세션)
   ========================= */
var pageSelect = document.getElementById("page-select");
var pageSession = document.getElementById("page-session");
var backToSelectBtn = document.getElementById("backToSelect");

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

if (backToSelectBtn) {
  backToSelectBtn.addEventListener("click", function () {
    showPage("select");
  });
}

/* =========================
   테마 적용 함수
   ========================= */
function applyThemeByKey(key) {
  var t = themeInfo[key];
  if (!t || !sceneCanvas || !sceneEmoji || !sceneName || !sceneSub) return;

  sceneEmoji.textContent = t.emoji;
  sceneName.textContent = t.name;
  sceneSub.textContent = t.subtitle;
  sceneCanvas.style.background = t.bg;

  var chips = document.querySelectorAll(".theme-chip");
  for (var i = 0; i < chips.length; i++) {
    var chip = chips[i];
    chip.classList.toggle("active", chip.getAttribute("data-key") === key);
  }

  var cards = document.querySelectorAll(".select-card");
  for (var j = 0; j < cards.length; j++) {
    var card = cards[j];
    card.classList.toggle("active", card.getAttribute("data-key") === key);
  }
}

/* =========================
   페이지 1 : 선택 그리드 (큰 카드 3개씩)
   ========================= */
var SELECT_ORDER = ["fire", "water", "rain", "bubble", "snow", "leaf", "frost"];
var SELECT_PAGE_SIZE = 3;
var selectStart = 0;

var selectPrevBtn = document.getElementById("selectPrevBtn");
var selectNextBtn = document.getElementById("selectNextBtn");
var selectCards = document.querySelectorAll(".select-card");

function updateSelectGrid() {
  if (!selectCards.length) return;

  for (var i = 0; i < selectCards.length; i++) {
    var card = selectCards[i];
    var visible = i >= selectStart && i < selectStart + SELECT_PAGE_SIZE;
    card.style.display = visible ? "flex" : "none";
  }

  if (selectPrevBtn) {
    selectPrevBtn.disabled = selectStart === 0;
  }
  if (selectNextBtn) {
    selectNextBtn.disabled =
      selectStart + SELECT_PAGE_SIZE >= SELECT_ORDER.length;
  }
}

if (selectPrevBtn) {
  selectPrevBtn.addEventListener("click", function () {
    if (selectStart > 0) {
      selectStart -= SELECT_PAGE_SIZE;
      if (selectStart < 0) selectStart = 0;
      updateSelectGrid();
    }
  });
}

if (selectNextBtn) {
  selectNextBtn.addEventListener("click", function () {
    if (selectStart + SELECT_PAGE_SIZE < SELECT_ORDER.length) {
      selectStart += SELECT_PAGE_SIZE;
      updateSelectGrid();
    }
  });
}

for (var k = 0; k < selectCards.length; k++) {
  (function (card) {
    card.addEventListener("click", function () {
      var key = card.getAttribute("data-key");
      applyThemeByKey(key);
      showPage("session");
    });
  })(selectCards[k]);
}

/* =========================
   페이지 2 : 하단 테마 스트립 (작은 칩들)
   ========================= */
var THEME_ORDER = ["fire", "water", "rain", "bubble", "snow", "leaf", "frost"];
var PAGE_SIZE = 3;
var themePageStart = 0;

var prevThemeBtn = document.getElementById("prevThemeBtn");
var nextThemeBtn = document.getElementById("nextThemeBtn");

function updateThemeStrip() {
  var chips = document.querySelectorAll(".theme-chip");
  if (!chips.length) return;

  for (var i = 0; i < chips.length; i++) {
    var chip = chips[i];
    var visible = i >= themePageStart && i < themePageStart + PAGE_SIZE;
    chip.style.display = visible ? "flex" : "none";
  }

  if (prevThemeBtn) {
    prevThemeBtn.disabled = themePageStart === 0;
  }
  if (nextThemeBtn) {
    nextThemeBtn.disabled = themePageStart + PAGE_SIZE >= THEME_ORDER.length;
  }
}

if (prevThemeBtn) {
  prevThemeBtn.addEventListener("click", function () {
    if (themePageStart > 0) {
      themePageStart -= PAGE_SIZE;
      if (themePageStart < 0) themePageStart = 0;
      updateThemeStrip();
    }
  });
}

if (nextThemeBtn) {
  nextThemeBtn.addEventListener("click", function () {
    if (themePageStart + PAGE_SIZE < THEME_ORDER.length) {
      themePageStart += PAGE_SIZE;
      updateThemeStrip();
    }
  });
}

var themeChips = document.querySelectorAll(".theme-chip");
for (var c = 0; c < themeChips.length; c++) {
  (function (btn) {
    btn.addEventListener("click", function () {
      applyThemeByKey(btn.getAttribute("data-key"));
    });
  })(themeChips[c]);
}

/* =========================
   타이머 로직
   ========================= */
var timerMinInput = document.getElementById("timerMin");
var timerSecInput = document.getElementById("timerSec");
var timerDisplay = document.getElementById("timerDisplay");

var timerStartBtn = document.getElementById("timerStartBtn");
var timerPauseBtn = document.getElementById("timerPauseBtn");
var timerResetBtn = document.getElementById("timerResetBtn");

var timerInterval = null;
var timerRemainingMs = 0;
var timerRunning = false;

var startBtnIcon = null;
var startBtnLabel = null;
if (timerStartBtn) {
  startBtnIcon = timerStartBtn.querySelector("i");
  startBtnLabel = timerStartBtn.querySelector("span");
}

function setStartBtnState(isRunning) {
  if (!startBtnIcon) return;
  if (isRunning) {
    startBtnIcon.classList.remove("fa-play");
    startBtnIcon.classList.add("fa-pause");
    if (startBtnLabel) startBtnLabel.textContent = "진행 중";
  } else {
    startBtnIcon.classList.remove("fa-pause");
    startBtnIcon.classList.add("fa-play");
    if (startBtnLabel) startBtnLabel.textContent = "시작";
  }
}

var detoxSessionActive = false;

function formatTimer(ms) {
  var totalSeconds = Math.max(0, Math.floor(ms / 1000));
  var m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  var s = String(totalSeconds % 60).padStart(2, "0");
  return m + ":" + s;
}

function updateTimerDisplay() {
  if (timerDisplay) {
    timerDisplay.textContent = formatTimer(timerRemainingMs);
  }
}

function readTimerFromInput() {
  if (!timerMinInput || !timerSecInput) return 0;
  var m = parseInt(timerMinInput.value || "0", 10);
  var s = parseInt(timerSecInput.value || "0", 10);
  var total = (m * 60 + s) * 1000;
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
  setStartBtnState(true);

  var startTime = Date.now();
  var startRemaining = timerRemainingMs;

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(function () {
    var elapsed = Date.now() - startTime;
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
  setStartBtnState(false);
}

function resetTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  timerRemainingMs = 0;
  updateTimerDisplay();
  detoxSessionActive = false;
  updateLockStatus("상태: 대기 중");
  setStartBtnState(false);
}

if (timerStartBtn) {
  timerStartBtn.addEventListener("click", function () {
    detoxSessionActive = false;
    updateLockStatus("상태: 대기 중");
    startTimer();
  });
}
if (timerPauseBtn) {
  timerPauseBtn.addEventListener("click", pauseTimer);
}
if (timerResetBtn) {
  timerResetBtn.addEventListener("click", resetTimer);
}

updateTimerDisplay();

/* =========================
   디톡스 세션(알림만) 로직
   ========================= */
var detoxLockBtn = document.getElementById("detoxLockBtn");
var lockStatus = document.getElementById("lockStatus");

function updateLockStatus(text) {
  if (lockStatus) {
    lockStatus.textContent = text;
  }
}

function onTimerFinished() {
  setStartBtnState(false);

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
  detoxLockBtn.addEventListener("click", function () {
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
setStartBtnState(false);

/* =========================
   배경 소리 로직 (옵션)
   ========================= */
var bgSound = document.getElementById("bgSound");
var soundButtons = document.querySelectorAll(".sound-btn");

var soundFiles = {
  none: "",
  calm: "sounds/calm.mp3",
  bright: "sounds/bright.mp3",
};

function setBackgroundSound(key) {
  if (!bgSound) return;

  for (var i = 0; i < soundButtons.length; i++) {
    var btn = soundButtons[i];
    btn.classList.toggle("active", btn.getAttribute("data-sound") === key);
  }

  var src = soundFiles[key] || "";
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
  bgSound.play()["catch"](function () {});
}

for (var i2 = 0; i2 < soundButtons.length; i2++) {
  (function (btn) {
    btn.addEventListener("click", function () {
      setBackgroundSound(btn.getAttribute("data-sound"));
    });
  })(soundButtons[i2]);
}

setBackgroundSound("none");
