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
  getRandomExercise,
  incrementMapValue,
  resolveDuplicateIds
} from './utils/exerciseHelpers.js';
import './styles.css';

const INITIAL_FILTERS = {
  packId: '',
  materia: '',
  tema: '',
  dificultad: ''
};

const THEME_STORAGE_KEY = 'revision-codigo-theme';

function loadThemePreference() {
  if (typeof window === 'undefined') return 'light';
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === 'dark' ? 'dark' : 'light';
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
  const [sessionStats, setSessionStats] = useState({ answered: 0, correct: 0, incorrect: 0 });
  const [notice, setNotice] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [theme, setTheme] = useState(() => loadThemePreference());

  const filteredExercises = useMemo(() => filterExercises(exercises, filters), [exercises, filters]);
  const globalPercent = calculatePercent(stats.correct, stats.answered);
  const sessionPercent = calculatePercent(sessionStats.correct, sessionStats.answered);

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
      message: 'Se van a borrar el puntaje global, los errores por categoría y el historial de respuestas.',
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

  function startPractice() {
    const pool = filterExercises(exercises, filters);

    if (pool.length === 0) {
      setPracticePool([]);
      setCurrentExercise(null);
      showNotice('No hay ejercicios que coincidan con esos filtros.');
      return;
    }

    setPracticePool(pool);
    setSessionStats({ answered: 0, correct: 0, incorrect: 0 });
    clearAnswerState();

    if (mode === 'random') {
      const randomExercise = getRandomExercise(pool);
      setCurrentExercise(randomExercise);
      setCurrentIndex(pool.findIndex((exercise) => exercise.id === randomExercise.id));
    } else {
      setCurrentIndex(0);
      setCurrentExercise(pool[0]);
    }
  }

  function goToExercise(index, pool = practicePool) {
    if (!pool.length) return;
    const safeIndex = ((index % pool.length) + pool.length) % pool.length;
    setCurrentIndex(safeIndex);
    setCurrentExercise(pool[safeIndex]);
    clearAnswerState();
  }

  function nextExercise() {
    if (!practicePool.length) return;

    if (mode === 'random') {
      randomExercise();
      return;
    }

    goToExercise(currentIndex + 1);
  }

  function randomExercise() {
    const pool = practicePool.length ? practicePool : filteredExercises;
    if (!pool.length) {
      showNotice('No hay ejercicios disponibles para elegir aleatoriamente.');
      return;
    }

    const exercise = getRandomExercise(pool);
    setPracticePool(pool);
    setCurrentExercise(exercise);
    setCurrentIndex(pool.findIndex((item) => item.id === exercise.id));
    clearAnswerState();
  }

  function handleRestartPractice() {
    setPracticePool([]);
    setCurrentIndex(0);
    setCurrentExercise(null);
    setSessionStats({ answered: 0, correct: 0, incorrect: 0 });
    clearAnswerState();
  }

  function requestRestartPractice() {
    if (!currentExercise && practicePool.length === 0 && sessionStats.answered === 0) return;

    askForConfirmation({
      title: 'Reiniciar práctica',
      message: 'Se va a reiniciar la sesión actual de práctica.',
      detail: 'Se borra el ejercicio activo, el progreso de esta sesión y el puntaje de sesión. Las estadísticas globales ya guardadas se conservan.',
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
    const nextResult = {
      isCorrect,
      answeredAt: new Date().toISOString()
    };

    setCorrected(true);
    setResult(nextResult);

    const nextSessionStats = {
      answered: sessionStats.answered + 1,
      correct: sessionStats.correct + (isCorrect ? 1 : 0),
      incorrect: sessionStats.incorrect + (isCorrect ? 0 : 1)
    };
    setSessionStats(nextSessionStats);

    const nextStats = {
      ...stats,
      answered: stats.answered + 1,
      correct: stats.correct + (isCorrect ? 1 : 0),
      incorrect: stats.incorrect + (isCorrect ? 0 : 1),
      errorsByMateria: isCorrect ? stats.errorsByMateria : incrementMapValue(stats.errorsByMateria, currentExercise.materia),
      errorsByTema: isCorrect ? stats.errorsByTema : incrementMapValue(stats.errorsByTema, currentExercise.tema),
      errorsByDificultad: isCorrect ? stats.errorsByDificultad : incrementMapValue(stats.errorsByDificultad, currentExercise.dificultad),
      history: [
        {
          exerciseId: currentExercise.id,
          materia: currentExercise.materia,
          tema: currentExercise.tema,
          dificultad: currentExercise.dificultad,
          selectedLine,
          selectedCodeIsOk,
          correctLine: currentExercise.lineaError,
          isCorrect,
          answeredAt: nextResult.answeredAt
        },
        ...stats.history
      ].slice(0, 30)
    };

    persistStats(nextStats);
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
            onStart={startPractice}
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
                <span>Puntaje</span>
                <strong>{sessionStats.correct}/{sessionStats.answered}</strong>
              </div>
              <div>
                <span>Acierto</span>
                <strong>{sessionPercent}%</strong>
              </div>
            </div>
          </section>
        </section>

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
          onRandomExercise={randomExercise}
          onRestartPractice={requestRestartPractice}
          canUseRandom={exercises.length > 0}
        />

        <ManageExercises
          exercises={exercises}
          packs={packs}
          stats={stats}
          onDeletePack={handleDeletePack}
          onDeleteAllExercises={handleDeleteAllExercises}
          onResetAll={handleResetAll}
        />

        <StatsPanel stats={stats} onResetStats={handleResetStats} />
      </main>

      <ConfirmDialog dialog={confirmDialog} onCancel={closeConfirmDialog} onConfirm={runConfirmedAction} />
    </div>
  );
}

export default App;
