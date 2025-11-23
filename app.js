// === CONFIG ===
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfEvvuQEaWzMyw1D0yw9D5LHXileZVlgoDvI873Q9Et-8p41Lq4voyd5ocF9x0JmND9w/exec';

// Days in week
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// Time windows -> factor & hint
function getTimeFactor(minutes) {
  const m = Number(minutes);
  if (m <= 35) return 0.75;
  if (m <= 45) return 1.0;
  if (m <= 60) return 1.1;
  return 1.2;
}

function getTimeHint(minutes) {
  const m = Number(minutes);
  if (m <= 35) return 'Current target: ~30–40 min session (tighter rest, same work).';
  if (m <= 45) return 'Current target: ~40–45 min session (balanced rest + density).';
  if (m <= 60) return 'Current target: ~45–55 min session (a bit more strength focus).';
  return 'Current target: ~50–65 min session (more rest, heavier or more volume).';
}

// Workout definition – NEW SPLIT
// baseRest in seconds is for 45-min baseline.
// We'll adjust by timeFactor from your "Time Available" choice.
const WORKOUTS = {
  Sunday: [ // PUSH 1
    {
      muscleGroup: 'Chest',
      exercise: 'Incline DB Press',
      sets: 4,
      minReps: 8,
      maxReps: 10,
      baseRest: 90,
      shortCues: [
        'Bench low incline (~25–30°), feet planted.',
        'Elbows ~45° from torso, not flared.',
        'Lower to upper ribs, press over mid-chest.'
      ],
      detailedCues: `Set a low incline. Pinch shoulder blades back and down.
Lower dumbbells with control until they’re around upper ribcage level.
Press up without letting shoulders roll forward. Keep glutes and feet stable.`
    },
    {
      muscleGroup: 'Chest',
      exercise: 'Machine / Cable Fly',
      sets: 3,
      minReps: 12,
      maxReps: 15,
      baseRest: 60,
      shortCues: [
        'Soft bend in elbows – keep it fixed.',
        'Hug a barrel – don’t clap hands together.',
        'Deep stretch, controlled squeeze.'
      ],
      detailedCues: `Use a weight you can control.
Bring handles together in front of your chest in a wide arc.
Pause and squeeze, then open slowly until you feel a stretch across the chest.`
    },
    {
      muscleGroup: 'Shoulders',
      exercise: 'Seated DB Shoulder Press',
      sets: 3,
      minReps: 6,
      maxReps: 8,
      baseRest: 90,
      shortCues: [
        'Bench upright, core tight.',
        'Elbows slightly in front of shoulders.',
        'Press without over-arching lower back.'
      ],
      detailedCues: `Sit with back supported. Start with dumbbells at chin/ear level.
Press up while keeping ribs down and glutes on the pad.
Lower under control for 2–3 seconds each rep.`
    },
    {
      muscleGroup: 'Shoulders',
      exercise: 'DB Lateral Raise',
      sets: 4,
      minReps: 12,
      maxReps: 15,
      baseRest: 60,
      shortCues: [
        'Shoulders down, no shrugging.',
        'Lead with elbows, slight bend in arm.',
        'Raise to shoulder height, slow on the way down.'
      ],
      detailedCues: `Stand tall, dumbbells at sides.
Raise arms out to the side until they’re around shoulder height.
Control the lowering; avoid swinging or using your hips to cheat.`
    },
    {
      muscleGroup: 'Rear Delts',
      exercise: 'Reverse Pec Deck',
      sets: 3,
      minReps: 12,
      maxReps: 15,
      baseRest: 60,
      shortCues: [
        'Chest tall on pad.',
        'Elbows drive out and back.',
        'Squeeze rear delts, not traps.'
      ],
      detailedCues: `Face the pad, chest against it.
With a slight bend in elbows, open arms out wide in a reverse fly.
Aim to feel rear shoulders doing the work, not upper traps.`
    },
    {
      muscleGroup: 'Triceps',
      exercise: 'Rope Pushdown',
      sets: 3,
      minReps: 10,
      maxReps: 12,
      baseRest: 60,
      shortCues: [
        'Elbows pinned to your sides.',
        'Push down then separate rope at bottom.',
        'Control the return – don’t swing torso.'
      ],
      detailedCues: `Stand close to the stack. Grip rope, elbows glued by ribs.
Push down and slightly away, then flare rope ends apart at the bottom.
Pause briefly, then return with elbows fixed in place.`
    },
    {
      muscleGroup: 'Triceps',
      exercise: 'Overhead Cable/DB Extension',
      sets: 3,
      minReps: 12,
      maxReps: 15,
      baseRest: 60,
      shortCues: [
        'Elbows point up, close to head.',
        'Lower with full stretch behind head.',
        'Extend without flaring elbows wide.'
      ],
      detailedCues: `Use a cable or a single dumbbell.
Keep elbows mostly pointing up and near your ears.
Lower until you feel a solid tricep stretch, then press back up under control.`
    }
  ],
  Monday: [ // PULL 1
    {
      muscleGroup: 'Back',
      exercise: 'Lat Pulldown',
      sets: 4,
      minReps: 8,
      maxReps: 12,
      baseRest: 90,
      shortCues: [
        'Slight lean back, chest up.',
        'Pull bar to upper chest.',
        'Drive elbows down and in.'
      ],
      detailedCues: `Grip a bit wider than shoulders.
Pull the bar toward your upper chest, not behind your neck.
Control the bar back up until arms are almost straight.`
    },
    {
      muscleGroup: 'Back',
      exercise: 'Chest-Supported Row',
      sets: 3,
      minReps: 8,
      maxReps: 10,
      baseRest: 75,
      shortCues: [
        'Chest lightly on pad, back neutral.',
        'Row elbows toward hips.',
        'Squeeze mid-back; no shrugging.'
      ],
      detailedCues: `Use a chest-supported machine or incline bench with dumbbells.
Row by pulling elbows toward your pockets.
Pause briefly at the top; lower under control.`
    },
    {
      muscleGroup: 'Back',
      exercise: 'Straight-Arm Pulldown',
      sets: 3,
      minReps: 12,
      maxReps: 15,
      baseRest: 60,
      shortCues: [
        'Soft bend in elbows.',
        'Hinge slightly, pull bar to thighs.',
        'Feel lats, not arms.'
      ],
      detailedCues: `Stand with slight forward lean.
Arms mostly straight, pull bar down in an arc until it reaches upper thighs.
Think about driving elbows toward your pockets.`
    },
    {
      muscleGroup: 'Back',
      exercise: 'Machine Row',
      sets: 3,
      minReps: 10,
      maxReps: 12,
      baseRest: 75,
      shortCues: [
        'Chest to pad, neutral spine.',
        'Pull handles to lower ribs.',
        'Control both directions.'
      ],
      detailedCues: `Set the seat so handles line up with mid-torso.
Row without letting shoulders round forward.
Stay in control; no bouncing off the pad.`
    },
    {
      muscleGroup: 'Biceps',
      exercise: 'Incline DB Curl',
      sets: 3,
      minReps: 10,
      maxReps: 12,
      baseRest: 60,
      shortCues: [
        'Arms hang straight down.',
        'Curl without swinging shoulders.',
        'Full stretch each rep.'
      ],
      detailedCues: `Sit on an incline bench, arms hanging down.
Curl dumbbells up with palms facing you at the top.
Lower slowly until you feel a stretch in the biceps.`
    },
    {
      muscleGroup: 'Biceps / Forearms',
      exercise: 'EZ-Bar Reverse Curl',
      sets: 2,
      minReps: 15,
      maxReps: 15,
      baseRest: 45,
      shortCues: [
        'Overhand grip.',
        'Wrists neutral, no bending.',
        'Slow, burning reps.'
      ],
      detailedCues: `Use an overhand grip on an EZ-bar.
Curl with elbows by your sides, focusing on top of forearms.
Control the lowering and avoid swinging.`
    },
    {
      muscleGroup: 'Biceps',
      exercise: 'Cable Curl',
      sets: 3,
      minReps: 12,
      maxReps: 15,
      baseRest: 45,
      shortCues: [
        'Elbows stay pinned.',
        'Squeeze hard at top.',
        'Slow on the way down.'
      ],
      detailedCues: `Use a straight or EZ cable bar.
Curl up while keeping elbows fixed by your ribs.
Pause at the top, then lower for 2–3 seconds.`
    }
  ],
  Tuesday: null, // Rest / Active Recovery
  Wednesday: [ // Shoulders & Arms (Density)
    {
      muscleGroup: 'Shoulders',
      exercise: 'Machine Shoulder Press',
      sets: 3,
      minReps: 12,
      maxReps: 15,
      baseRest: 75,
      shortCues: [
        'Seat so handles at chin level.',
        'Press without arching lower back.',
        'Use moderate weight, chase a pump.'
      ],
      detailedCues: `Sit with back against pad.
Press handles up under control; don’t lock out hard.
Think smooth reps and constant tension.`
    },
    {
      muscleGroup: 'Shoulders',
      exercise: 'Standing Lateral Raise (Volume)',
      sets: 5,
      minReps: 15,
      maxReps: 15,
      baseRest: 45,
      shortCues: [
        'Light weight, high control.',
        'Shoulders down, elbows lead.',
        'Minimal swing – big pump.'
      ],
      detailedCues: `Same form as regular laterals.
Use lighter weight and focus on smooth, continuous movement and burn.`
    },
    {
      muscleGroup: 'Shoulders',
      exercise: 'DB Front Raise',
      sets: 3,
      minReps: 12,
      maxReps: 12,
      baseRest: 45,
      shortCues: [
        'Raise to shoulder height.',
        'Don’t lean back.',
        'Control up and down.'
      ],
      detailedCues: `Raise dumbbells in front of you to shoulder level with a slight bend in elbows.
Lower under control; avoid jerking or using momentum.`
    },
    {
      muscleGroup: 'Biceps',
      exercise: 'Cable Curl (Pump)',
      sets: 3,
      minReps: 12,
      maxReps: 15,
      baseRest: 45,
      shortCues: [
        'Keep shoulders relaxed.',
        'Squeeze at top for 1s.',
        'Slow negative.'
      ],
      detailedCues: `Use lighter weight, chase the pump.
Focus on feeling the biceps work through full range.`
    },
    {
      muscleGroup: 'Triceps',
      exercise: 'Rope Pushdown (Pump)',
      sets: 3,
      minReps: 12,
      maxReps: 15,
      baseRest: 45,
      shortCues: [
        'Same as earlier, lighter weight.',
        'Constant tension, short rests.',
        'Spread rope hard at bottom.'
      ],
      detailedCues: `Form identical to pushdowns on Sunday.
Use lighter weight, shorter rest, and focus on burn.`
    },
    {
      muscleGroup: 'Triceps',
      exercise: 'Tricep Kickback',
      sets: 2,
      minReps: 15,
      maxReps: 15,
      baseRest: 45,
      shortCues: [
        'Upper arm parallel to floor.',
        'Extend elbow fully, squeeze.',
        'Control back into 90° bend.'
      ],
      detailedCues: `Support with one hand on bench, hinge slightly.
Extend dumbbell back by straightening elbow, then return under control.`
    }
  ],
  Thursday: [ // Chest + Back Hybrid
    {
      muscleGroup: 'Chest',
      exercise: 'Flat DB or Machine Press',
      sets: 4,
      minReps: 5,
      maxReps: 6,
      baseRest: 90,
      shortCues: [
        'Feet planted, slight arch.',
        'Bar/dumbbells over mid-chest.',
        'Controlled lower, strong press.'
      ],
      detailedCues: `Set up like a standard bench press – shoulder blades pinched, feet flat.
Lower to mid-chest and press back up without bouncing.`
    },
    {
      muscleGroup: 'Chest',
      exercise: 'Machine Fly',
      sets: 3,
      minReps: 12,
      maxReps: 15,
      baseRest: 60,
      shortCues: [
        'Arms in hugging arc.',
        'Pause and squeeze.',
        'Slow stretch back.'
      ],
      detailedCues: `Use a machine fly to isolate chest with less shoulder stress.
Control the entire range and don’t let weights slam.`
    },
    {
      muscleGroup: 'Back',
      exercise: 'Pull-Ups or Neutral Pulldown',
      sets: 3,
      minReps: 6,
      maxReps: 8,
      baseRest: 90,
      shortCues: [
        'Chest up, slight lean back.',
        'Drive elbows down.',
        'Full range, no half-reps.'
      ],
      detailedCues: `Use assistance if needed so you can hit the rep range cleanly.
Control the lowering phase and avoid swinging.`
    },
    {
      muscleGroup: 'Back',
      exercise: 'Straight-Arm Pulldown (Light)',
      sets: 3,
      minReps: 12,
      maxReps: 15,
      baseRest: 60,
      shortCues: [
        'Same pattern as Monday.',
        'Focus on lats and breathing.',
        'Use it as a finisher.'
      ],
      detailedCues: `Identical form to earlier in week;
use slightly lighter weight and smooth tempo.`
    },
    {
      muscleGroup: 'Back',
      exercise: 'Chest-Supported DB Row (Light)',
      sets: 3,
      minReps: 10,
      maxReps: 12,
      baseRest: 75,
      shortCues: [
        'Chest on pad, light weight.',
        'Row to lower ribs.',
        'Control, no jerking.'
      ],
      detailedCues: `Same pattern as heavier row, but focus on pump and symmetry instead of max load.`
    },
    {
      muscleGroup: 'Biceps',
      exercise: 'Hammer Curl',
      sets: 2,
      minReps: 12,
      maxReps: 12,
      baseRest: 45,
      shortCues: [
        'Neutral grip (thumbs up).',
        'Elbows tight.',
        'Squeeze at top.'
      ],
      detailedCues: `Curl with palms facing each other, focus on brachialis and forearms.`
    },
    {
      muscleGroup: 'Triceps',
      exercise: 'Rope Pushdown (Short)',
      sets: 2,
      minReps: 12,
      maxReps: 12,
      baseRest: 45,
      shortCues: [
        'Quick pump sets.',
        'No ego weight.',
        'Just burn.'
      ],
      detailedCues: `Short, controlled sets to finish triceps without beating joints up.`
    }
  ],
  Friday: [ // Legs – Back-safe
    {
      muscleGroup: 'Legs',
      exercise: 'Leg Press',
      sets: 4,
      minReps: 10,
      maxReps: 12,
      baseRest: 90,
      shortCues: [
        'Feet shoulder-width, slight turnout.',
        'Lower until knees ~90°.',
        'Drive through mid-foot, don’t lock hard.'
      ],
      detailedCues: `Keep lower back against pad, no bouncing at the bottom.
Control both directions, no ego load.`
    },
    {
      muscleGroup: 'Legs',
      exercise: 'Bulgarian Split Squat',
      sets: 3,
      minReps: 8,
      maxReps: 10,
      baseRest: 75,
      shortCues: [
        'Back foot on bench.',
        'Torso tall, front knee tracks over toes.',
        'Push through front heel.'
      ],
      detailedCues: `Use bodyweight or light dumbbells.
Go slow and stay balanced; great for quads + glutes.`
    },
    {
      muscleGroup: 'Hamstrings',
      exercise: 'Seated Hamstring Curl',
      sets: 3,
      minReps: 12,
      maxReps: 15,
      baseRest: 60,
      shortCues: [
        'Pad just above heels.',
        'Curl to glutes, squeeze.',
        'Slow negative.'
      ],
      detailedCues: `Align knee joint with machine pivot, no swinging or bouncing.`
    },
    {
      muscleGroup: 'Quads',
      exercise: 'Leg Extension',
      sets: 3,
      minReps: 12,
      maxReps: 15,
      baseRest: 60,
      shortCues: [
        'Don’t slam into lockout.',
        'Squeeze top for 1s.',
        'Control down.'
      ],
      detailedCues: `Use a weight that lets you control full range safely.`
    },
    {
      muscleGroup: 'Lower Back',
      exercise: 'Back Extension (Neutral)',
      sets: 3,
      minReps: 12,
      maxReps: 15,
      baseRest: 60,
      shortCues: [
        'Hips on pad, not stomach.',
        'Lower until you feel hamstring stretch.',
        'Come up to neutral, not hyperextended.'
      ],
      detailedCues: `Keep movements slow and avoid going above a straight line with your body.`
    },
    {
      muscleGroup: 'Glutes',
      exercise: 'Hip Thrust / Glute Bridge',
      sets: 3,
      minReps: 12,
      maxReps: 15,
      baseRest: 60,
      shortCues: [
        'Shins vertical at top.',
        'Drive hips with glutes.',
        'Avoid arching low back.'
      ],
      detailedCues: `Focus on squeezing glutes at the top, not overarching.`
    },
    {
      muscleGroup: 'Core / Stability',
      exercise: 'Bird Dog',
      sets: 2,
      minReps: 12,
      maxReps: 12,
      baseRest: 45,
      shortCues: [
        'Opposite arm & leg extend.',
        'Hips stay level.',
        'Move slow, no twisting.'
      ],
      detailedCues: `Great for spinal stability; keep reps controlled and precise.`
    }
  ],
  Saturday: [ // Shoulders / Arms Pump 2
    {
      muscleGroup: 'Shoulders',
      exercise: 'Arnold Press',
      sets: 3,
      minReps: 8,
      maxReps: 10,
      baseRest: 75,
      shortCues: [
        'Start palms toward you.',
        'Rotate palms forward as you press.',
        'Control rotation on the way down.'
      ],
      detailedCues: `Not a max strength lift; focus on smooth motion and shoulder pump.`
    },
    {
      muscleGroup: 'Shoulders',
      exercise: 'Standing Lateral Raise',
      sets: 4,
      minReps: 12,
      maxReps: 15,
      baseRest: 45,
      shortCues: [
        'Same as earlier laterals.',
        'Medium weight.',
        'Chase the burn.'
      ],
      detailedCues: `Keep the form tight and rest short for big cap delts.`
    },
    {
      muscleGroup: 'Biceps',
      exercise: 'Preacher Curl',
      sets: 3,
      minReps: 10,
      maxReps: 10,
      baseRest: 60,
      shortCues: [
        'Upper arm fully on pad.',
        'Full stretch, don’t slam at bottom.',
        'Strict curl – no bouncing.'
      ],
      detailedCues: `Use slow tempo and full range to build dense, peaked biceps.`
    },
    {
      muscleGroup: 'Triceps',
      exercise: 'Skull Crushers',
      sets: 3,
      minReps: 10,
      maxReps: 12,
      baseRest: 60,
      shortCues: [
        'Bar comes to forehead or slightly behind.',
        'Elbows stay mostly fixed.',
        'Extend smooth, no elbow snapping.'
      ],
      detailedCues: `Use comfortable load and protect your elbows; control every rep.`
    },
    {
      muscleGroup: 'Biceps',
      exercise: 'Hammer Curl (Finisher)',
      sets: 2,
      minReps: 12,
      maxReps: 12,
      baseRest: 45,
      shortCues: [
        'Neutral grip, arms by sides.',
        'Controlled pump sets.',
        'Minimal swing.'
      ],
      detailedCues: `Short rest, focused pump to finish arms.`
    },
    {
      muscleGroup: 'Triceps',
      exercise: 'Rope Pushdown (Finisher)',
      sets: 2,
      minReps: 12,
      maxReps: 12,
      baseRest: 45,
      shortCues: [
        'Spread rope hard at bottom.',
        'Keep elbows locked in place.',
        'Back-safe arm finisher.'
      ],
      detailedCues: `Light weight, short rest, maximum tricep burn.`
    }
  ]
};

// === DOM ELEMENTS ===
const daySelect = document.getElementById('daySelect');
const timeSelect = document.getElementById('timeSelect');
const timeHintEl = document.getElementById('timeHint');
const todayLabel = document.getElementById('todayLabel');
const exercisesContainer = document.getElementById('exercisesContainer');

// Timer DOM
const timerFab = document.getElementById('timerFab');
const timerFabText = document.getElementById('timerFabText');
const timerModalBackdrop = document.getElementById('timerModalBackdrop');
const timerCloseBtn = document.getElementById('timerCloseBtn');
const timerDisplay = document.getElementById('timerDisplay');
const timerPills = document.getElementById('timerPills');
const timerStartBtn = document.getElementById('timerStartBtn');
const timerPauseBtn = document.getElementById('timerPauseBtn');
const timerResetBtn = document.getElementById('timerResetBtn');

// Local storage key for rest duration preference
const LS_REST_DURATION_KEY = 'sa_rest_duration_seconds';

// === TIMER STATE ===
let timerDuration = 60;
let timerRemaining = 60;
let timerInterval = null;
let timerRunning = false;

// Global time window
let currentTimeMinutes = 45;
let currentTimeFactor = getTimeFactor(currentTimeMinutes);

// === TIMER FUNCTIONS ===
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

// Called by sets when you hit Save: auto-set duration and start
function startTimerWithDuration(seconds) {
  const sec = Math.max(30, Math.min(150, Math.round(seconds || 60)));
  timerDuration = sec;
  timerRemaining = sec;
  saveRestDuration(sec);
  openTimerModal();
  startTimer();
}

function initTimer() {
  loadRestDuration();
  // init pill states
  const pills = timerPills.querySelectorAll('button');
  pills.forEach(btn => {
    const sec = Number(btn.dataset.seconds);
    if (sec === timerDuration) {
      btn.classList.add('active');
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
      startTimer();
    }
  });
  timerResetBtn.addEventListener('click', resetTimer);
}

// === REST / TIME HELPERS ===
function effectiveRestSeconds(baseRest) {
  const raw = baseRest * currentTimeFactor;
  // clamp between 30s and 150s
  return Math.max(30, Math.min(150, Math.round(raw)));
}

// === RENDERING ===
function initDayAndTimeSelect() {
  // populate days
  DAYS.forEach(day => {
    const opt = document.createElement('option');
    opt.value = day;
    opt.textContent = day;
    daySelect.appendChild(opt);
  });

  // auto-select today
  const todayIndex = new Date().getDay();
  const todayName = DAYS[todayIndex];
  todayLabel.textContent = `Today: ${todayName}`;
  if (DAYS.includes(todayName)) {
    daySelect.value = todayName;
  } else {
    daySelect.value = 'Sunday';
  }

  // time select
  currentTimeMinutes = Number(timeSelect.value);
  currentTimeFactor = getTimeFactor(currentTimeMinutes);
  timeHintEl.textContent = getTimeHint(currentTimeMinutes);

  daySelect.addEventListener('change', () => {
    renderDay(daySelect.value);
  });

  timeSelect.addEventListener('change', () => {
    currentTimeMinutes = Number(timeSelect.value);
    currentTimeFactor = getTimeFactor(currentTimeMinutes);
    timeHintEl.textContent = getTimeHint(currentTimeMinutes);
    // re-render to update recommended rests
    renderDay(daySelect.value);
  });

  renderDay(daySelect.value);
}

function renderDay(day) {
  exercisesContainer.innerHTML = '';

  if (!WORKOUTS[day]) {
    const restCard = document.createElement('div');
    restCard.className = 'card';
    restCard.innerHTML = `
      <div class="card-header">
        <div class="card-header-left">
          <div class="card-title">Rest / Active Recovery</div>
          <div class="card-subtitle">
            Light walking, stretching, and mobility. Keep diet tight and back happy.
          </div>
        </div>
        <div class="chevron">–</div>
      </div>
    `;
    exercisesContainer.appendChild(restCard);
    return;
  }

  const workout = WORKOUTS[day];
  if (!workout || workout.length === 0) {
    const msg = document.createElement('div');
    msg.className = 'small-text';
    msg.textContent = 'No programmed workout for this day.';
    exercisesContainer.appendChild(msg);
    return;
  }

  workout.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    const effectiveRest = effectiveRestSeconds(item.baseRest);

    const header = document.createElement('div');
    header.className = 'card-header';
    header.innerHTML = `
      <div class="card-header-left">
        <div class="card-title">${item.exercise}</div>
        <div class="card-subtitle">
          ${item.muscleGroup} • ${item.sets} set(s) · ${item.minReps}–${item.maxReps} reps
        </div>
        <div class="card-rest">
          Recommended rest: ~${effectiveRest} sec (auto-timer uses this)
        </div>
      </div>
      <div class="chevron">&#9654;</div>
    `;

    const body = document.createElement('div');
    body.className = 'card-body';

    const bodyInner = document.createElement('div');
    bodyInner.className = 'card-body-inner';

    // Short cues
    const cuesShort = document.createElement('div');
    cuesShort.className = 'cues-short';
    const shortList = item.shortCues.map(c => `<li>${c}</li>`).join('');
    cuesShort.innerHTML = `
      <strong>Quick Form Cues:</strong>
      <ul>${shortList}</ul>
    `;

    const cuesToggle = document.createElement('div');
    cuesToggle.className = 'cues-toggle';
    cuesToggle.innerHTML = `<span>Show Full Form</span><span style="font-size:0.7rem;">▼</span>`;

    const cuesDetailed = document.createElement('div');
    cuesDetailed.className = 'cues-detailed';
    cuesDetailed.textContent = item.detailedCues;

    cuesToggle.addEventListener('click', () => {
      const visible = cuesDetailed.style.display === 'block';
      cuesDetailed.style.display = visible ? 'none' : 'block';
      cuesToggle.innerHTML = visible
        ? `<span>Show Full Form</span><span style="font-size:0.7rem;">▼</span>`
        : `<span>Hide Full Form</span><span style="font-size:0.7rem;">▲</span>`;
    });

    // Set table
    const table = document.createElement('table');
    table.className = 'set-table';
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Set</th>
        <th>Weight (lbs)</th>
        <th>Reps</th>
        <th>Notes</th>
        <th>Log</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    for (let s = 1; s <= item.sets; s++) {
      const tr = document.createElement('tr');

      const tdSet = document.createElement('td');
      tdSet.textContent = s;

      const tdW = document.createElement('td');
      const inpW = document.createElement('input');
      inpW.type = 'number';
      inpW.step = '0.5';
      inpW.placeholder = 'lbs';
      tdW.appendChild(inpW);

      const tdR = document.createElement('td');
      const inpR = document.createElement('input');
      inpR.type = 'number';
      inpR.min = '1';
      inpR.placeholder = 'reps';
      tdR.appendChild(inpR);

      const tdN = document.createElement('td');
      const inpN = document.createElement('input');
      inpN.type = 'text';
      inpN.placeholder = 'optional';
      tdN.appendChild(inpN);

      const tdBtn = document.createElement('td');
      const btnSave = document.createElement('button');
      btnSave.type = 'button';
      btnSave.textContent = 'Save';
      tdBtn.appendChild(btnSave);

      tr.appendChild(tdSet);
      tr.appendChild(tdW);
      tr.appendChild(tdR);
      tr.appendChild(tdN);
      tr.appendChild(tdBtn);

      tbody.appendChild(tr);

      // status row under table
      const status = document.createElement('div');
      status.className = 'set-status';

      btnSave.addEventListener('click', async () => {
        const weight = inpW.value.trim();
        const reps = inpR.value.trim();
        const notes = inpN.value.trim();

        if (!weight || !reps) {
          status.textContent = 'Enter weight and reps before saving.';
          status.className = 'set-status error';
          return;
        }

        status.textContent = 'Saving...';
        status.className = 'set-status';

        const payload = {
          day: day,
          muscleGroup: item.muscleGroup,
          exercise: item.exercise,
          set: s,
          weight,
          reps,
          notes
        };

        try {
          await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          status.textContent = 'Saved ✔';
          status.className = 'set-status ok';

          // Change button to Saved state
          btnSave.textContent = 'Saved';
          btnSave.disabled = true;

          // Auto-start timer using effective rest for this exercise
          startTimerWithDuration(effectiveRest);

        } catch (err) {
          console.error(err);
          status.textContent = 'Error saving. Check connection or script URL.';
          status.className = 'set-status error';
        }
      });

      // Insert status directly after the row
      tbody.appendChild(tr);
      tbody.appendChild(document.createElement('tr')).appendChild(document.createElement('td')).colSpan = 5;
      // but easier: we can keep status under table, not per row
    }

    table.appendChild(tbody);

    bodyInner.appendChild(cuesShort);
    bodyInner.appendChild(cuesToggle);
    bodyInner.appendChild(cuesDetailed);
    bodyInner.appendChild(table);

    body.appendChild(bodyInner);

    // Toggle card open/closed
    let open = false;
    header.addEventListener('click', (e) => {
      // Don’t toggle if click originates from inside inputs/buttons
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        return;
      }
      open = !open;
      if (open) {
        body.style.maxHeight = bodyInner.offsetHeight + 24 + 'px';
        header.querySelector('.chevron').innerHTML = '&#9660;';
      } else {
        body.style.maxHeight = '0';
        header.querySelector('.chevron').innerHTML = '&#9654;';
      }
    });

    card.appendChild(header);
    card.appendChild(body);
    exercisesContainer.appendChild(card);
  });
}

// === INIT ===
initTimer();
initDayAndTimeSelect();
