import { useEffect, useMemo, useState } from 'react';
import ExerciseCard from './components/ExerciseCard.jsx';
import Filters from './components/Filters.jsx';
import ImportExercises from './components/ImportExercises.jsx';
import ManageExercises from './components/ManageExercises.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import {
  EMPTY_STATS,
  clearAllStorage,
  loadExercises,
  loadPacks,
  loadStats,
  resetStatsStorage,
  saveExercises,
  savePacks,
  saveStats
} from './utils/storage.js';
import {
  SAMPLE_PACK,
  calculatePercent,
  createPackId,
  filterExercises,
  incrementMapValue,
  resolveDuplicateIds,
  shuffleExercises
} from './utils/exerciseHelpers.js';
import './styles.css';

const INITIAL_FILTERS = {
  packId: '',
  materia: '',
  tema: '',
  dificultad: ''
};

const EMPTY_ROUND = {
  status: 'idle',
  filters: INITIAL_FILTERS,
  mode: 'sequential',
  total: 0,
  answered: 0,
  correct: 0,
  incorrect: 0,
  wrongIds: [],
  resultsById: {},
  attempts: [],
  startedAt: null,
  completedAt: null,
  passNumber: 0,
  isRetry: false
};

const THEME_STORAGE_KEY = 'revision-codigo-theme';

function loadThemePreference() {
  if (typeof window === 'undefined') return 'light';
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === 'dark' ? 'dark' : 'light';
}

function cloneFilters(nextFilters) {
  return {
    ...INITIAL_FILTERS,
    ...(nextFilters || {})
  };
}

function buildOrderedPool(pool, selectedMode) {
  return selectedMode === 'random' ? shuffleExercises(pool) : [...pool];
}

function ConfirmDialog({ dialog, onCancel, onConfirm }) {
  if (!dialog) return null;

  return (
    <div className="confirm-backdrop" role="presentation" onMouseDown={onCancel}>
      <section
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="confirm-icon" aria-hidden="true">
          !
        </div>
        <div className="confirm-content">
          <p className="eyebrow">Confirmación</p>
          <h2 id="confirm-title">{dialog.title}</h2>
          <p id="confirm-message">{dialog.message}</p>
          {dialog.detail && <p className="confirm-detail">{dialog.detail}</p>}
        </div>
        <div className="confirm-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className="danger-button solid" onClick={onConfirm}>
            {dialog.confirmText || 'Confirmar'}
          </button>
        </div>
      </section>
    </div>
  );
}

function RoundSummary({ round, onRetryWrong, onFinishRound }) {
  const percent = calculatePercent(round.correct, round.total);
  const hasWrongAnswers = round.incorrect > 0;

  return (
    <section className="card exercise-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Ronda finalizada</p>
          <h2>Resultado de la práctica</h2>
        </div>
      </div>

      <p>
        Te equivocaste en <strong>{round.incorrect}</strong> de <strong>{round.total}</strong> ejercicio(s). Tu acierto actual es{' '}
        <strong>{percent}%</strong>.
      </p>

      <div className="stat-grid">
        <div className="stat-tile">
          <span>Total de la ronda</span>
          <strong>{round.total}</strong>
        </div>
        <div className="stat-tile">
          <span>Correctas</span>
          <strong>{round.correct}</strong>
        </div>
        <div className="stat-tile">
          <span>Erradas</span>
          <strong>{round.incorrect}</strong>
        </div>
        <div className="stat-tile">
          <span>Acierto</span>
          <strong>{percent}%</strong>
        </div>
      </div>

      {hasWrongAnswers ? (
        <p className="muted">Podés repetir solamente los ejercicios errados o terminar y guardar este resultado en estadísticas.</p>
      ) : (
        <p className="muted">No quedan ejercicios errados para repetir. Podés terminar y guardar la ronda.</p>
      )}

      <div className="button-row">
        <button type="button" className="secondary-button" onClick={onRetryWrong} disabled={!hasWrongAnswers}>
          Repetir errados
        </button>
        <button type="button" className="primary-button" onClick={onFinishRound}>
          Terminar y guardar estadísticas
        </button>
      </div>
    </section>
  );
}

function App() {
  const [exercises, setExercises] = useState(() => loadExercises());
  const [packs, setPacks] = useState(() => loadPacks());
  const [stats, setStats] = useState(() => loadStats());
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [mode, setMode] = useState('sequential');
  const [practicePool, setPracticePool] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedCodeIsOk, setSelectedCodeIsOk] = useState(false);
  const [corrected, setCorrected] = useState(false);
  const [result, setResult] = useState(null);
  const [practiceRound, setPracticeRound] = useState(EMPTY_ROUND);
  const [notice, setNotice] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [theme, setTheme] = useState(() => loadThemePreference());

  const filteredExercises = useMemo(() => filterExercises(exercises, filters), [exercises, filters]);
  const globalPercent = calculatePercent(stats.correct, stats.answered);
  const roundPercent = calculatePercent(practiceRound.correct, practiceRound.total || practiceRound.answered);
  const currentPassFinished = practicePool.length > 0 && currentIndex + 1 >= practicePool.length;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const isDarkMode = theme === 'dark';

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  }

  function persistExercises(nextExercises) {
    setExercises(nextExercises);
    saveExercises(nextExercises);
  }

  function persistPacks(nextPacks) {
    setPacks(nextPacks);
    savePacks(nextPacks);
  }

  function persistStats(nextStats) {
    setStats(nextStats);
    saveStats(nextStats);
  }

  function clearAnswerState() {
    setSelectedLine(null);
    setSelectedCodeIsOk(false);
    setCorrected(false);
    setResult(null);
  }

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 4500);
  }

  function askForConfirmation(config) {
    setConfirmDialog(config);
  }

  function closeConfirmDialog() {
    setConfirmDialog(null);
  }

  function runConfirmedAction() {
    const action = confirmDialog?.onConfirm;
    setConfirmDialog(null);
    if (action) action();
  }

  function handleImport(metadata, incomingExercises) {
    const packId = createPackId();
    const importedAt = new Date().toISOString();
    const { exercises: renamedExercises, renamedCount } = resolveDuplicateIds(incomingExercises, exercises);

    const exercisesWithPack = renamedExercises.map((exercise) => ({
      ...exercise,
      packId,
      packName: metadata.packName,
      importedAt
    }));

    const newPack = {
      id: packId,
      packName: metadata.packName,
      language: metadata.language,
      description: metadata.description,
      importedAt,
      exerciseCount: exercisesWithPack.length
    };

    persistExercises([...exercises, ...exercisesWithPack]);
    persistPacks([...packs, newPack]);

    const renameMessage = renamedCount > 0 ? ` ${renamedCount} ID(s) duplicado(s) fueron renombrados automáticamente.` : '';
    showNotice(`Se importaron ${exercisesWithPack.length} ejercicios del pack “${metadata.packName}”.${renameMessage}`);
  }

  function handleLoadSamplePack() {
    handleImport(
      {
        packName: SAMPLE_PACK.packName,
        language: SAMPLE_PACK.language,
        description: SAMPLE_PACK.description
      },
      SAMPLE_PACK.exercises
    );
  }

  function handleDeletePack(packId) {
    const pack = packs.find((item) => item.id === packId);

    askForConfirmation({
      title: 'Eliminar pack',
      message: `Se va a eliminar el pack “${pack?.packName || 'seleccionado'}” y todos sus ejercicios.`,
      detail: 'Esta acción no se puede deshacer desde la app. Podés descargar un backup antes si querés conservarlo.',
      confirmText: 'Eliminar pack',
      onConfirm: () => {
        const nextExercises = exercises.filter((exercise) => exercise.packId !== packId);
        const nextPacks = packs.filter((item) => item.id !== packId);

        persistExercises(nextExercises);
        persistPacks(nextPacks);
        handleRestartPractice();
        showNotice('Pack eliminado correctamente.');
      }
    });
  }

  function handleDeleteAllExercises() {
    askForConfirmation({
      title: 'Eliminar todos los ejercicios',
      message: 'Se van a borrar todos los ejercicios y todos los packs importados.',
      detail: 'Las estadísticas se conservan. Para guardar una copia, usá “Descargar backup JSON” antes de confirmar.',
      confirmText: 'Eliminar ejercicios',
      onConfirm: () => {
        persistExercises([]);
        persistPacks([]);
        setFilters(INITIAL_FILTERS);
        handleRestartPractice();
        showNotice('Se eliminaron todos los ejercicios.');
      }
    });
  }

  function handleResetStats() {
    askForConfirmation({
      title: 'Resetear estadísticas',
      message: 'Se van a borrar el puntaje global, los errores por categoría, las rondas guardadas y el historial de respuestas.',
      detail: 'Los ejercicios importados no se eliminan.',
      confirmText: 'Resetear estadísticas',
      onConfirm: () => {
        persistStats(EMPTY_STATS);
        resetStatsStorage();
        showNotice('Estadísticas reseteadas.');
      }
    });
  }

  function handleResetAll() {
    askForConfirmation({
      title: 'Resetear todo',
      message: 'Se van a borrar ejercicios, packs, progreso de práctica y estadísticas.',
      detail: 'Es la acción más fuerte de limpieza. No se puede deshacer desde la app.',
      confirmText: 'Resetear todo',
      onConfirm: () => {
        clearAllStorage();
        setExercises([]);
        setPacks([]);
        setStats(EMPTY_STATS);
        setFilters(INITIAL_FILTERS);
        handleRestartPractice();
        showNotice('La app quedó reseteada.');
      }
    });
  }

  function startPractice(nextFilters = filters, nextMode = mode) {
    const roundFilters = cloneFilters(nextFilters);
    const pool = filterExercises(exercises, roundFilters);

    if (pool.length === 0) {
      setPracticePool([]);
      setCurrentExercise(null);
      setPracticeRound(EMPTY_ROUND);
      showNotice('No hay ejercicios que coincidan con esos filtros.');
      return;
    }

    const orderedPool = buildOrderedPool(pool, nextMode);
    const startedAt = new Date().toISOString();

    setPracticePool(orderedPool);
    setCurrentIndex(0);
    setCurrentExercise(orderedPool[0]);
    setPracticeRound({
      ...EMPTY_ROUND,
      status: 'active',
      filters: roundFilters,
      mode: nextMode,
      total: orderedPool.length,
      startedAt,
      passNumber: 1
    });
    clearAnswerState();
    showNotice(`Ronda iniciada con ${orderedPool.length} ejercicio(s).`);
  }

  function requestStartRandomPractice() {
    const launchRandomRound = () => {
      setMode('random');
      startPractice(filters, 'random');
    };

    if (currentExercise || practiceRound.status === 'summary') {
      askForConfirmation({
        title: 'Empezar ronda aleatoria',
        message: 'Se va a reemplazar la práctica actual por una nueva ronda aleatoria con los filtros seleccionados.',
        detail: 'La ronda actual no se guardará si todavía no tocaste “Terminar y guardar estadísticas”.',
        confirmText: 'Empezar ronda',
        onConfirm: launchRandomRound
      });
      return;
    }

    launchRandomRound();
  }

  function goToExercise(index, pool = practicePool) {
    if (!pool.length) return;
    if (index < 0 || index >= pool.length) return;

    setCurrentIndex(index);
    setCurrentExercise(pool[index]);
    clearAnswerState();
  }

  function showRoundSummary() {
    setCurrentExercise(null);
    setPracticePool([]);
    setCurrentIndex(0);
    clearAnswerState();
    setPracticeRound((currentRound) => ({
      ...currentRound,
      status: 'summary',
      completedAt: new Date().toISOString()
    }));
  }

  function nextExercise() {
    if (!practicePool.length) return;

    if (!corrected) {
      showNotice('Primero corregí el ejercicio actual para avanzar.');
      return;
    }

    if (currentPassFinished) {
      showRoundSummary();
      return;
    }

    goToExercise(currentIndex + 1);
  }

  function handleRepeatWrong() {
    const wrongIds = practiceRound.wrongIds || [];

    if (wrongIds.length === 0) {
      showNotice('No quedan ejercicios errados para repetir.');
      return;
    }

    const wrongPool = wrongIds
      .map((exerciseId) => exercises.find((exercise) => exercise.id === exerciseId))
      .filter(Boolean);

    if (wrongPool.length === 0) {
      showNotice('No se encontraron los ejercicios errados. Quizás fueron eliminados.');
      return;
    }

    const orderedPool = buildOrderedPool(wrongPool, practiceRound.mode);

    setPracticePool(orderedPool);
    setCurrentIndex(0);
    setCurrentExercise(orderedPool[0]);
    setPracticeRound((currentRound) => ({
      ...currentRound,
      status: 'active',
      isRetry: true,
      passNumber: currentRound.passNumber + 1,
      completedAt: null
    }));
    clearAnswerState();
    showNotice(`Repetición iniciada con ${orderedPool.length} ejercicio(s) errado(s).`);
  }

  function handleRestartPractice() {
    setPracticePool([]);
    setCurrentIndex(0);
    setCurrentExercise(null);
    setPracticeRound(EMPTY_ROUND);
    clearAnswerState();
  }

  function requestRestartPractice() {
    if (!currentExercise && practiceRound.status === 'idle') return;

    askForConfirmation({
      title: 'Reiniciar práctica',
      message: 'Se va a reiniciar la sesión actual de práctica.',
      detail: 'Se borra el ejercicio activo y el progreso de esta ronda. Las estadísticas ya guardadas se conservan.',
      confirmText: 'Reiniciar práctica',
      onConfirm: () => {
        handleRestartPractice();
        showNotice('Práctica reiniciada.');
      }
    });
  }

  function handleSelectLine(lineNumber) {
    if (corrected) return;
    setSelectedLine(lineNumber);
    setSelectedCodeIsOk(false);
  }

  function handleSelectCodeIsOk() {
    if (corrected) return;
    setSelectedLine(null);
    setSelectedCodeIsOk(true);
  }

  function handleCorrect() {
    if (!currentExercise || corrected) return;

    const isCorrect = currentExercise.tieneError ? selectedLine === currentExercise.lineaError : selectedCodeIsOk;
    const answeredAt = new Date().toISOString();
    const nextResult = {
      isCorrect,
      answeredAt
    };

    const attempt = {
      exerciseId: currentExercise.id,
      materia: currentExercise.materia,
      tema: currentExercise.tema,
      dificultad: currentExercise.dificultad,
      selectedLine,
      selectedCodeIsOk,
      correctLine: currentExercise.lineaError,
      isCorrect,
      answeredAt,
      passNumber: practiceRound.passNumber,
      isRetry: practiceRound.isRetry
    };

    setCorrected(true);
    setResult(nextResult);

    setPracticeRound((currentRound) => {
      const nextResultsById = {
        ...currentRound.resultsById,
        [currentExercise.id]: attempt
      };
      const wrongIds = new Set(currentRound.wrongIds);

      if (isCorrect) wrongIds.delete(currentExercise.id);
      else wrongIds.add(currentExercise.id);

      const latestResults = Object.values(nextResultsById);
      const correct = latestResults.filter((item) => item.isCorrect).length;
      const incorrect = latestResults.filter((item) => !item.isCorrect).length;

      return {
        ...currentRound,
        resultsById: nextResultsById,
        wrongIds: Array.from(wrongIds),
        attempts: [attempt, ...currentRound.attempts],
        answered: latestResults.length,
        correct,
        incorrect
      };
    });
  }

  function handleFinishRound() {
    if (practiceRound.status !== 'summary' || practiceRound.total === 0) return;

    const savedAt = new Date().toISOString();
    const percent = calculatePercent(practiceRound.correct, practiceRound.total);
    const latestWrongResults = Object.values(practiceRound.resultsById || {}).filter((item) => !item.isCorrect);

    let errorsByMateria = stats.errorsByMateria;
    let errorsByTema = stats.errorsByTema;
    let errorsByDificultad = stats.errorsByDificultad;

    latestWrongResults.forEach((item) => {
      errorsByMateria = incrementMapValue(errorsByMateria, item.materia);
      errorsByTema = incrementMapValue(errorsByTema, item.tema);
      errorsByDificultad = incrementMapValue(errorsByDificultad, item.dificultad);
    });

    const roundRecord = {
      id: `round-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      savedAt,
      startedAt: practiceRound.startedAt,
      completedAt: practiceRound.completedAt || savedAt,
      filters: cloneFilters(practiceRound.filters),
      mode: practiceRound.mode,
      total: practiceRound.total,
      correct: practiceRound.correct,
      incorrect: practiceRound.incorrect,
      percent
    };

    const nextStats = {
      ...stats,
      answered: stats.answered + practiceRound.total,
      correct: stats.correct + practiceRound.correct,
      incorrect: stats.incorrect + practiceRound.incorrect,
      errorsByMateria,
      errorsByTema,
      errorsByDificultad,
      rounds: [roundRecord, ...(stats.rounds || [])].slice(0, 50),
      history: practiceRound.attempts
        .map((item) => ({
          ...item,
          savedRoundId: roundRecord.id
        }))
        .concat(stats.history || [])
        .slice(0, 30)
    };

    persistStats(nextStats);
    handleRestartPractice();
    showNotice(`Ronda guardada: ${practiceRound.correct}/${practiceRound.total} correctas (${percent}%).`);
  }

  function handleLoadRoundFilters(round) {
    const nextFilters = cloneFilters(round.filters);
    const nextMode = round.mode || 'sequential';

    setFilters(nextFilters);
    setMode(nextMode);
    startPractice(nextFilters, nextMode);

    window.setTimeout(() => {
      document.getElementById('practicar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <nav className="top-nav" aria-label="Navegación principal">
          <a href="#importar">Importar</a>
          <a href="#practicar">Practicar</a>
          <a href="#mis-ejercicios">Mis ejercicios</a>
          <a href="#estadisticas">Estadísticas</a>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            <span aria-hidden="true">{isDarkMode ? '☀️' : '🌙'}</span>
            {isDarkMode ? 'Modo claro' : 'Modo oscuro'}
          </button>
        </nav>

        <div className="hero-content">
          <div>
            <p className="eyebrow">Mini web para estudiar</p>
            <h1>Práctica de revisión de código</h1>
            <p>
              Importá ejercicios en JSON, marcá líneas con posibles errores y revisá explicaciones como práctica para parciales universitarios.
            </p>
          </div>
          <div className="hero-stats" aria-label="Resumen general">
            <div>
              <span>Ejercicios</span>
              <strong>{exercises.length}</strong>
            </div>
            <div>
              <span>Acierto global</span>
              <strong>{globalPercent}%</strong>
            </div>
            <div>
              <span>Packs</span>
              <strong>{packs.length}</strong>
            </div>
          </div>
        </div>
      </header>

      {notice && <div className="notice" role="status">{notice}</div>}

      {exercises.length === 0 && (
        <section className="card empty-state initial-state">
          <h2>Todavía no hay ejercicios cargados.</h2>
          <p>
            La app no usa backend ni ejercicios fijos como fuente principal. Para empezar, importá un JSON con un pack de ejercicios o cargá el ejemplo Python incluido.
          </p>
          <div className="button-row">
            <a className="primary-link" href="#importar">
              Importar JSON
            </a>
            <button type="button" className="secondary-button" onClick={handleLoadSamplePack}>
              Cargar ejemplo Python
            </button>
          </div>
          <details className="example-details">
            <summary>Ver formato esperado</summary>
            <pre>{`{
  "schemaVersion": 1,
  "packName": "Programación - Parcial 1",
  "language": "C++",
  "description": "Ejercicios de revisión de código.",
  "exercises": [
    {
      "id": "ej-001",
      "materia": "Programación",
      "tema": "Funciones",
      "dificultad": "fácil",
      "consigna": "Revisá el código y marcá la línea donde está el error.",
      "codigo": ["int suma(int a, int b) {", "    return a - b;", "}"],
      "tieneError": true,
      "lineaError": 2,
      "tipoError": "operador incorrecto",
      "explicacion": "La función debería sumar, pero está restando.",
      "correccionSugerida": "return a + b;"
    }
  ]
}`}</pre>
          </details>
        </section>
      )}

      <main>
        <ImportExercises onImport={handleImport} />

        <section className="practice-layout" id="practicar">
          <Filters
            exercises={exercises}
            packs={packs}
            filters={filters}
            mode={mode}
            onChangeFilters={setFilters}
            onChangeMode={setMode}
            onStart={() => startPractice(filters, mode)}
            disabled={exercises.length === 0}
          />

          <section className="card session-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Sesión actual</p>
                <h2>Progreso</h2>
              </div>
            </div>
            <div className="session-grid">
              <div>
                <span>Filtrados</span>
                <strong>{filteredExercises.length}</strong>
              </div>
              <div>
                <span>Actual</span>
                <strong>{currentExercise && practicePool.length ? `${currentIndex + 1}/${practicePool.length}` : '0/0'}</strong>
              </div>
              <div>
                <span>Puntaje ronda</span>
                <strong>{practiceRound.correct}/{practiceRound.total || 0}</strong>
              </div>
              <div>
                <span>Acierto ronda</span>
                <strong>{roundPercent}%</strong>
              </div>
            </div>
          </section>
        </section>

        {practiceRound.status === 'summary' ? (
          <RoundSummary round={practiceRound} onRetryWrong={handleRepeatWrong} onFinishRound={handleFinishRound} />
        ) : (
          <ExerciseCard
            exercise={currentExercise}
            selectedLine={selectedLine}
            selectedCodeIsOk={selectedCodeIsOk}
            corrected={corrected}
            result={result}
            onSelectLine={handleSelectLine}
            onSelectCodeIsOk={handleSelectCodeIsOk}
            onCorrect={handleCorrect}
            onNextExercise={nextExercise}
            onRandomExercise={requestStartRandomPractice}
            onRestartPractice={requestRestartPractice}
            canUseRandom={exercises.length > 0}
            canGoNext={corrected}
            nextButtonText={currentPassFinished ? 'Ver resumen' : 'Siguiente ejercicio'}
          />
        )}

        <ManageExercises
          exercises={exercises}
          packs={packs}
          stats={stats}
          onDeletePack={handleDeletePack}
          onDeleteAllExercises={handleDeleteAllExercises}
          onResetAll={handleResetAll}
        />

        <StatsPanel stats={stats} packs={packs} onResetStats={handleResetStats} onLoadRoundFilters={handleLoadRoundFilters} />
      </main>

      <ConfirmDialog dialog={confirmDialog} onCancel={closeConfirmDialog} onConfirm={runConfirmedAction} />
    </div>
  );
}

export default App;
