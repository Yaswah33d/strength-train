// === LOCAL STORAGE FOR PROGRESSION ===
const LS_EXERCISE_HISTORY_KEY = 'sa_exercise_history_v1';

function loadExerciseHistory() {
  const raw = localStorage.getItem(LS_EXERCISE_HISTORY_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveExerciseHistory(history) {
  localStorage.setItem(LS_EXERCISE_HISTORY_KEY, JSON.stringify(history));
}

function buildHistoryKey(exerciseName) {
  return exerciseName.toLowerCase().replace(/\s+/g, '_');
}

function recordSetToHistory(exerciseName, setNumber, weight, reps) {
  const history = loadExerciseHistory();
  const key = buildHistoryKey(exerciseName);
  const now = new Date().toISOString();

  if (!history[key]) {
    history[key] = {
      lastDate: now,
      sets: []
    };
  }

  history[key].lastDate = now;
  if (!Array.isArray(history[key].sets)) history[key].sets = [];
  history[key].sets[setNumber - 1] = { weight, reps };
  saveExerciseHistory(history);
}

function getExerciseHistory(exerciseName) {
  const history = loadExerciseHistory();
  const key = buildHistoryKey(exerciseName);
  return history[key] || null;
}

function buildRecommendation(history, minReps, maxReps) {
  if (!history || !Array.isArray(history.sets) || history.sets.length === 0) {
    return {
      lastSummary: 'No past data yet – this is your first logged session.',
      recommendation: 'Use a moderate weight and focus on perfect form. We’ll build targets after today.'
    };
  }

  let workingWeight = null;
  let totalReps = 0;
  let setsCount = 0;

  history.sets.forEach(s => {
    if (!s) return;
    const w = Number(s.weight);
    const r = Number(s.reps);
    if (!isNaN(w) && !isNaN(r)) {
      if (workingWeight === null) workingWeight = w;
      totalReps += r;
      setsCount++;
    }
  });

  if (!setsCount || workingWeight === null) {
    return {
      lastSummary: 'Last session: logged but incomplete data.',
      recommendation: 'Today: focus on logging full sets with clear weight and rep numbers.'
    };
  }

  const avgReps = totalReps / setsCount;
  const lastSummary = `Last session: ${workingWeight} lbs across ${setsCount} set(s), total ${totalReps} rep(s).`;

  let recommendation;
  if (avgReps >= maxReps - 0.5) {
    recommendation = `You were near the top of the ${minReps}–${maxReps} rep range. Try adding ~2.5–5 lbs while staying in ${minReps}–${maxReps} reps.`;
  } else if (avgReps >= minReps) {
    recommendation = `Solid middle-of-range work. Keep the same weight and aim for +1–2 total reps across all sets.`;
  } else {
    recommendation = `Reps were below target. Keep the same or slightly lighter weight and focus on clean reps up toward ${minReps}–${maxReps}.`;
  }

  return { lastSummary, recommendation };
}
