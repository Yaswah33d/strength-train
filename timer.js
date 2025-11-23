// === REST TIMER ===
const LS_REST_DURATION_KEY = 'sa_rest_duration_seconds';

let timerDuration = 60;
let timerRemaining = 60;
let timerInterval = null;
let timerRunning = false;

// DOM elements
const timerFab = document.getElementById('timerFab');
const timerFabText = document.getElementById('timerFabText');
const timerModalBackdrop = document.getElementById('timerModalBackdrop');
const timerCloseBtn = document.getElementById('timerCloseBtn');
const timerDisplay = document.getElementById('timerDisplay');
const timerPills = document.getElementById('timerPills');
const timerStartBtn = document.getElementById('timerStartBtn');
const timerPauseBtn = document.getElementById('timerPauseBtn');
const timerResetBtn = document.getElementById('timerResetBtn');

function loadRestDuration() {
  const stored = localStorage.getItem(LS_REST_DURATION_KEY);
  if (stored) {
    const val = parseInt(stored, 10);
    if (!isNaN(val) && val > 0) {
      timerDuration = val;
      timerRemaining = val;
    }
  }
}

function saveRestDuration(seconds) {
  localStorage.setItem(LS_REST_DURATION_KEY, String(seconds));
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(timerRemaining);
  if (timerRunning) {
    timerFabText.textContent = `⏱\n${formatTime(timerRemaining)}`;
  } else {
    timerFabText.textContent = '⏱';
  }
}

function openTimerModal() {
  timerModalBackdrop.style.display = 'flex';
}

function closeTimerModal() {
  timerModalBackdrop.style.display = 'none';
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerRunning = true;
  timerInterval = setInterval(() => {
    timerRemaining--;
    if (timerRemaining <= 0) {
      timerRemaining = 0;
      timerRunning = false;
      clearInterval(timerInterval);
      timerInterval = null;
      if (navigator.vibrate) {
        navigator.vibrate(300);
      }
      alert('Rest over – next set.');
    }
    updateTimerDisplay();
  }, 1000);
  updateTimerDisplay();
}

function pauseTimer() {
  timerRunning = false;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  updateTimerDisplay();
}

function resetTimer() {
  timerRunning = false;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerRemaining = timerDuration;
  updateTimerDisplay();
}

// Called from app.js after a set is saved
function startRecommendedRest(seconds, label) {
  const restSeconds = Number(seconds) > 0 ? Number(seconds) : (timerDuration || 60);

  timerDuration = restSeconds;
  timerRemaining = restSeconds;
  saveRestDuration(restSeconds);
  updateTimerDisplay();

  const noteEl = document.querySelector('.timer-note');
  if (noteEl && label) {
    noteEl.textContent = `Rest: ${label} (${restSeconds}s). Timer will buzz when it’s time to go.`;
  }

  openTimerModal();
  startTimer();
}

function initTimer() {
  loadRestDuration();

  // Initialise pills
  const pills = timerPills.querySelectorAll('button');
  pills.forEach(btn => {
    const sec = Number(btn.dataset.seconds);
    if (sec === timerDuration) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
    btn.addEventListener('click', () => {
      pills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      timerDuration = sec;
      timerRemaining = sec;
      saveRestDuration(sec);
      resetTimer();
    });
  });

  updateTimerDisplay();

  // Events
  timerFab.addEventListener('click', openTimerModal);
  timerCloseBtn.addEventListener('click', closeTimerModal);

  timerStartBtn.addEventListener('click', () => {
    if (!timerRunning) {
      if (timerRemaining <= 0) {
        timerRemaining = timerDuration;
      }
      startTimer();
    }
  });

  timerPauseBtn.addEventListener('click', () => {
    if (timerRunning) {
      pauseTimer();
    } else if (timerRemaining > 0 && timerRemaining < timerDuration) {
      startTimer(); // resume
    }
  });

  timerResetBtn.addEventListener('click', resetTimer);
}

// Initialise immediately (DOM is loaded because script is at bottom)
initTimer();
