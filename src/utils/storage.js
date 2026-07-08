const STORAGE_KEYS = {
  exercises: 'revisionCodigo.exercises',
  packs: 'revisionCodigo.packs',
  stats: 'revisionCodigo.stats'
};

export const EMPTY_STATS = {
  answered: 0,
  correct: 0,
  incorrect: 0,
  errorsByMateria: {},
  errorsByTema: {},
  errorsByDificultad: {},
  history: []
};

function safeParse(value, fallback) {
  try {
    if (!value) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function read(key, fallback) {
  return safeParse(localStorage.getItem(key), fallback);
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadExercises() {
  const exercises = read(STORAGE_KEYS.exercises, []);
  return Array.isArray(exercises) ? exercises : [];
}

export function saveExercises(exercises) {
  write(STORAGE_KEYS.exercises, Array.isArray(exercises) ? exercises : []);
}

export function loadPacks() {
  const packs = read(STORAGE_KEYS.packs, []);
  return Array.isArray(packs) ? packs : [];
}

export function savePacks(packs) {
  write(STORAGE_KEYS.packs, Array.isArray(packs) ? packs : []);
}

export function loadStats() {
  const stats = read(STORAGE_KEYS.stats, EMPTY_STATS);
  return {
    ...EMPTY_STATS,
    ...stats,
    errorsByMateria: stats?.errorsByMateria || {},
    errorsByTema: stats?.errorsByTema || {},
    errorsByDificultad: stats?.errorsByDificultad || {},
    history: Array.isArray(stats?.history) ? stats.history : []
  };
}

export function saveStats(stats) {
  write(STORAGE_KEYS.stats, {
    ...EMPTY_STATS,
    ...stats,
    history: Array.isArray(stats?.history) ? stats.history.slice(0, 30) : []
  });
}

export function clearAllStorage() {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

export function resetStatsStorage() {
  saveStats(EMPTY_STATS);
}
