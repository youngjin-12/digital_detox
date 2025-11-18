// ======================
// 테마 변경
// ======================
const themeSelect = document.getElementById("themeSelect");
const body = document.body;

themeSelect.addEventListener("change", () => {
  const val = themeSelect.value;
  if (val === "dark") {
    body.setAttribute("data-theme", "dark");
  } else if (val === "cool") {
    body.setAttribute("data-theme", "cool");
  } else {
    body.setAttribute("data-theme", "warm");
  }
});

// ======================
// 모드 탭 전환
// ======================
const modeButtons = document.querySelectorAll(".mode-btn");
const modeSections = {
  fire: document.getElementById("mode-fire"),
  timer: document.getElementById("mode-timer"),
  stopwatch: document.getElementById("mode-stopwatch"),
};

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.mode;
    // 버튼 스타일
    modeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    // 섹션 토글
    Object.keys(modeSections).forEach((m) => {
      modeSections[m].classList.toggle("active", m === mode);
    });
  });
});

// ======================
// Web Audio 간단 알람
// ======================
function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    osc.start();
    osc.stop(ctx.currentTime + 0.65);
  } catch (e) {
    console.warn("알람 재생 실패:", e);
  }
}

// ======================
// 타이머 로직
// ======================
const timerDisplay = document.getElementById("timerDisplay");
const timerMinInput = document.getElementById("timerMin");
const timerSecInput = document.getElementById("timerSec");
const timerStartBtn = document.getElementById("timerStart");
const timerPauseBtn = document.getElementById("timerPause");
const timerResetBtn = document.getElementById("timerReset");

let timerInterval = null;
let timerRemainingMs = 0;
let timerRunning = false;

function formatTimer(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatTimer(timerRemainingMs);
}

function startTimer() {
  if (!timerRunning) {
    // 처음 시작: 입력값에서 시간 읽기
    if (timerRemainingMs <= 0) {
      const m = parseInt(timerMinInput.value || "0", 10);
      const s = parseInt(timerSecInput.value || "0", 10);
      const total = (m * 60 + s) * 1000;
      if (total <= 0) {
        alert("분/초를 입력한 뒤 시작을 눌러주세요.");
        return;
      }
      timerRemainingMs = total;
      updateTimerDisplay();
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
        playBeep();
        alert("타이머가 종료되었습니다!");
      } else {
        updateTimerDisplay();
      }
    }, 100);
  }
}

function pauseTimer() {
  if (timerRunning) {
    timerRunning = false;
    clearInterval(timerInterval);
  }
}

function resetTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  timerRemainingMs = 0;
  updateTimerDisplay();
}

timerStartBtn.addEventListener("click", startTimer);
timerPauseBtn.addEventListener("click", pauseTimer);
timerResetBtn.addEventListener("click", resetTimer);
updateTimerDisplay();

// ======================
// 스톱워치 로직
// ======================
const swDisplay = document.getElementById("swDisplay");
const swStartBtn = document.getElementById("swStart");
const swPauseBtn = document.getElementById("swPause");
const swResetBtn = document.getElementById("swReset");
const swLapBtn = document.getElementById("swLap");
const swLaps = document.getElementById("swLaps");

let swInterval = null;
let swRunning = false;
let swElapsedMs = 0;
let swStartTime = 0;
let swLapCount = 0;

function formatStopwatch(ms) {
  const totalMs = Math.max(0, ms);
  const totalSeconds = Math.floor(totalMs / 1000);
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  const tenths = String(Math.floor((totalMs % 1000) / 100));
  return `${mins}:${secs}.${tenths}`;
}

function updateStopwatchDisplay() {
  swDisplay.textContent = formatStopwatch(swElapsedMs);
}

function startStopwatch() {
  if (!swRunning) {
    swRunning = true;
    swStartTime = Date.now() - swElapsedMs;
    if (swInterval) clearInterval(swInterval);
    swInterval = setInterval(() => {
      swElapsedMs = Date.now() - swStartTime;
      updateStopwatchDisplay();
    }, 60);
  }
}

function pauseStopwatch() {
  if (swRunning) {
    swRunning = false;
    clearInterval(swInterval);
  }
}

function resetStopwatch() {
  swRunning = false;
  clearInterval(swInterval);
  swElapsedMs = 0;
  swLapCount = 0;
  swLaps.innerHTML = "";
  updateStopwatchDisplay();
}

function addLap() {
  if (!swRunning) return;
  swLapCount += 1;
  const div = document.createElement("div");
  div.className = "lap-line";
  div.innerHTML = `<span>랩 ${swLapCount}</span><span>${formatStopwatch(
    swElapsedMs
  )}</span>`;
  swLaps.prepend(div);
}

swStartBtn.addEventListener("click", startStopwatch);
swPauseBtn.addEventListener("click", pauseStopwatch);
swResetBtn.addEventListener("click", resetStopwatch);
swLapBtn.addEventListener("click", addLap);
updateStopwatchDisplay();
