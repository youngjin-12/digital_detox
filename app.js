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

// 🔥 불멍 탭 활성 여부 (디폴트: 불멍)
let fireActive = true;

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.mode;

    // 불멍 탭인지 여부
    fireActive = mode === "fire";

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

// ======================
// 불멍 (CPU 최적화 버전)
// ======================
(function () {
  const FIRE_WIDTH = 80; // 지금 모습 유지
  const FIRE_HEIGHT = 30; // 지금 모습 유지

  const fireCanvas = document.getElementById("fireCanvas");
  if (!fireCanvas) return;

  // 불 강도 배열 (0 = 없음, 35 = 가장 뜨거움)
  const firePixels = new Array(FIRE_WIDTH * FIRE_HEIGHT).fill(0);
  const PALETTE_CHARS = " .:-=+*#%@";

  // span DOM을 한 번만 만들어두고 재사용
  const cellSpans = [];
  (function buildDomOnce() {
    const frag = document.createDocumentFragment();
    for (let y = 0; y < FIRE_HEIGHT; y++) {
      for (let x = 0; x < FIRE_WIDTH; x++) {
        const span = document.createElement("span");
        span.textContent = " ";
        cellSpans.push(span);
        frag.appendChild(span);
      }
      frag.appendChild(document.createElement("br"));
    }
    fireCanvas.innerHTML = "";
    fireCanvas.appendChild(frag);
  })();

  function initFire() {
    firePixels.fill(0);
    // 맨 아래 줄을 최고 강도로 채움 (장작불)
    for (let x = 0; x < FIRE_WIDTH; x++) {
      firePixels[(FIRE_HEIGHT - 1) * FIRE_WIDTH + x] = 35;
    }
  }

  function updateFire() {
    for (let y = 0; y < FIRE_HEIGHT - 1; y++) {
      for (let x = 0; x < FIRE_WIDTH; x++) {
        const src = (y + 1) * FIRE_WIDTH + x;
        const decay = Math.floor(Math.random() * 4); // 0~3
        let dstX = x - decay;
        if (dstX < 0) dstX = 0;
        const dst = y * FIRE_WIDTH + dstX;

        let newIntensity = firePixels[src] - decay;
        if (newIntensity < 0) newIntensity = 0;
        firePixels[dst] = newIntensity;
      }
    }
  }

  function intensityToChar(intensity) {
    const idx = Math.floor((intensity / 35) * (PALETTE_CHARS.length - 1));
    return PALETTE_CHARS[idx];
  }

  function intensityToColor(intensity) {
    if (intensity === 0) {
      return "#000000";
    } else if (intensity < 10) {
      return "#ffeb3b"; // 노랑
    } else if (intensity < 20) {
      return "#ff5722"; // 빨강
    } else {
      return "#ff9800"; // 밝은 주황
    }
  }

  function renderFire() {
    for (let i = 0; i < firePixels.length; i++) {
      const intensity = firePixels[i];
      const span = cellSpans[i];
      span.textContent = intensityToChar(intensity);
      span.style.color = intensityToColor(intensity);
    }
  }

  function loop() {
    // 불멍 탭이 아닐 때는 계산 안 함 (CPU 절약)
    if (!fireActive) return;
    updateFire();
    renderFire();
  }

  initFire();
  renderFire();

  // 프레임 속도 살짝 줄여서(CPU↓, 불멍 느낌은 유지)
  setInterval(loop, 80); // 80ms ≈ 12.5fps
})();

// ======================
// 디톡스 세션 (풀스크린 모드)
// ======================
const detoxOverlay = document.getElementById("detoxOverlay");
const detoxTimerEl = document.getElementById("detoxTimer");
const detoxEndBtn = document.getElementById("detoxEndBtn");
const detoxStartBtn = document.getElementById("detoxStart");

let detoxInterval = null;
let detoxRemainingMs = 0;
let detoxRunning = false;

function updateDetoxTimerDisplay() {
  detoxTimerEl.textContent = formatTimer(detoxRemainingMs);
}

async function enterFullscreen() {
  const root = document.documentElement;
  if (!document.fullscreenElement) {
    try {
      await root.requestFullscreen();
    } catch (e) {
      console.warn("전체화면 진입 실패:", e);
    }
  }
}

function exitFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
}

function endDetoxSession(force = false) {
  if (!detoxRunning && !force) return;

  clearInterval(detoxInterval);
  detoxInterval = null;
  detoxRunning = false;
  detoxRemainingMs = 0;
  updateDetoxTimerDisplay();

  detoxOverlay.classList.add("detox-hidden");
  exitFullscreen();
}

function startDetoxSession() {
  // 타이머 입력값에서 시간 읽기 (타이머와 동일 로직)
  const m = parseInt(timerMinInput.value || "0", 10);
  const s = parseInt(timerSecInput.value || "0", 10);
  const total = (m * 60 + s) * 1000;
  if (total <= 0) {
    alert("디톡스 세션 시간을 분/초에 입력한 뒤 시작해 주세요.");
    return;
  }

  detoxRemainingMs = total;
  updateDetoxTimerDisplay();

  // 오버레이 표시 + 전체화면 시도
  detoxOverlay.classList.remove("detox-hidden");
  enterFullscreen();

  detoxRunning = true;
  const startTime = Date.now();
  const startRemaining = detoxRemainingMs;

  clearInterval(detoxInterval);
  detoxInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    detoxRemainingMs = startRemaining - elapsed;
    if (detoxRemainingMs <= 0) {
      detoxRemainingMs = 0;
      updateDetoxTimerDisplay();
      clearInterval(detoxInterval);
      detoxRunning = false;
      playBeep();
      alert("디지털 디톡스 세션이 종료되었습니다.");
      detoxOverlay.classList.add("detox-hidden");
      exitFullscreen();
    } else {
      updateDetoxTimerDisplay();
    }
  }, 200);
}

// 버튼 이벤트 연결
if (detoxStartBtn) {
  detoxStartBtn.addEventListener("click", startDetoxSession);
}
if (detoxEndBtn) {
  detoxEndBtn.addEventListener("click", () => {
    if (!detoxRunning) {
      detoxOverlay.classList.add("detox-hidden");
      exitFullscreen();
      return;
    }
    const ok = confirm("정말 세션을 종료할까요?");
    if (ok) {
      endDetoxSession(true);
    }
  });
}

// ======================
// 배경 사운드 컨트롤
// ======================

let currentSoundKey = "none";

async function setBackgroundSound(key) {
  if (!bgSound) return;

  // 버튼 스타일 업데이트
  soundButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.sound === key);
  });

  if (!soundMap[key]) {
    // 끄기
    bgSound.pause();
    bgSound.removeAttribute("src");
    currentSoundKey = "none";
    return;
  }

  if (currentSoundKey === key && !bgSound.paused) {
    // 같은 소리를 다시 누르면 일시정지로 동작하게 하고 싶다면 여기서 처리 가능
    return;
  }

  currentSoundKey = key;
  bgSound.src = soundMap[key];

  try {
    await bgSound.play();
  } catch (e) {
    console.warn("배경음 재생 실패:", e);
  }
}

soundButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.sound;
    setBackgroundSound(key);
  });
});

// ======================
// 배경 사운드 컨트롤 (Web Audio로 생성)
// ======================
const soundButtons = document.querySelectorAll(".sound-btn");

let audioCtx = null;
let noiseBuffer = null;
let currentSource = null;
let currentFilter = null;
let currentGain = null;
let currentSoundType = "none";

// 버튼 active 스타일 토글
function updateSoundButtonState(type) {
  soundButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.sound === type);
  });
}

// 2초짜리 화이트 노이즈 버퍼 생성
function getNoiseBuffer() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (noiseBuffer) return noiseBuffer;

  const duration = 2; // seconds
  const sampleRate = audioCtx.sampleRate;
  const buffer = audioCtx.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1; // -1 ~ 1 : 화이트 노이즈
  }

  noiseBuffer = buffer;
  return noiseBuffer;
}

// 현재 재생 중인 소리 정지
function stopCurrentSound() {
  if (currentSource) {
    try {
      currentSource.stop();
    } catch (e) {}
    currentSource.disconnect();
  }
  if (currentFilter) currentFilter.disconnect();
  if (currentGain) currentGain.disconnect();

  currentSource = null;
  currentFilter = null;
  currentGain = null;
  currentSoundType = "none";
}

// 타입별로 다른 느낌의 백색소음 재생
function playBackgroundNoise(type) {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  stopCurrentSound();
  updateSoundButtonState(type);

  if (type === "none") return;

  const buffer = getNoiseBuffer();
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  if (type === "fire") {
    // 불멍 느낌: 중역대 bandpass
    filter.type = "bandpass";
    filter.frequency.value = 1000;
    filter.Q.value = 1.0;
    gain.gain.value = 0.18;
  } else if (type === "rain") {
    // 빗소리 느낌: 고역 highpass
    filter.type = "highpass";
    filter.frequency.value = 700;
    filter.Q.value = 0.7;
    gain.gain.value = 0.22;
  } else if (type === "forest") {
    // 숲/바람 느낌: 저역 bandpass
    filter.type = "bandpass";
    filter.frequency.value = 400;
    filter.Q.value = 0.9;
    gain.gain.value = 0.16;
  }

  source.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  source.start();

  currentSource = source;
  currentFilter = filter;
  currentGain = gain;
  currentSoundType = type;
}

// 버튼 이벤트 연결
soundButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.sound;
    if (type === currentSoundType) {
      // 같은 소리 버튼 다시 누르면 끄기
      playBackgroundNoise("none");
    } else {
      playBackgroundNoise(type);
    }
  });
});
