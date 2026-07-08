import CodeViewer from './CodeViewer.jsx';
import ResultBox from './ResultBox.jsx';

function HeaderIconButton({ label, icon, onClick, disabled = false }) {
  return (
    <button
      type="button"
      className="icon-button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      data-tooltip={label}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}

export default function ExerciseCard({
  exercise,
  selectedLine,
  selectedCodeIsOk,
  corrected,
  result,
  onSelectLine,
  onSelectCodeIsOk,
  onCorrect,
  onNextExercise,
  onRandomExercise,
  onRestartPractice,
  canUseRandom
}) {
  if (!exercise) {
    return (
      <section className="card empty-state exercise-card">
        <div className="exercise-header">
          <div>
            <p className="eyebrow">Práctica</p>
            <h2>No hay ejercicio seleccionado</h2>
          </div>

          <div className="exercise-header-actions" aria-label="Acciones de práctica">
            <HeaderIconButton label="Ejercicio aleatorio" icon="🎲" onClick={onRandomExercise} disabled={!canUseRandom} />
          </div>
        </div>

        <p>Elegí filtros y tocá “Empezar” para practicar. También podés usar el dado para abrir un ejercicio aleatorio.</p>
      </section>
    );
  }

  const codeIsOkClasses = [
    'secondary-button',
    'code-ok-button',
    selectedCodeIsOk && !corrected ? 'selected-soft' : '',
    corrected && !exercise.tieneError ? 'correct-choice' : '',
    corrected && exercise.tieneError && selectedCodeIsOk ? 'wrong-choice' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className="card exercise-card">
      <div className="exercise-header">
        <div>
          <p className="eyebrow">Ejercicio {exercise.id}</p>
          <h2>{exercise.tema}</h2>
        </div>

        <div className="exercise-header-right">
          <div className="badges">
            <span>{exercise.materia}</span>
            <span>{exercise.dificultad}</span>
            {exercise.packName && <span>{exercise.packName}</span>}
          </div>

          <div className="exercise-header-actions" aria-label="Acciones de práctica">
            <HeaderIconButton label="Ejercicio aleatorio" icon="🎲" onClick={onRandomExercise} disabled={!canUseRandom} />
            <HeaderIconButton label="Reiniciar práctica" icon="↻" onClick={onRestartPractice} />
          </div>
        </div>
      </div>

      <p className="prompt">{exercise.consigna}</p>

      <CodeViewer
        code={exercise.codigo}
        selectedLine={selectedLine}
        corrected={corrected}
        correctLine={exercise.lineaError}
        hasError={exercise.tieneError}
        onSelectLine={onSelectLine}
      />

      <div className="answer-actions answer-actions-spread">
        <div className="answer-main-actions">
          <button type="button" className={codeIsOkClasses} onClick={onSelectCodeIsOk} disabled={corrected}>
            El código está bien
          </button>
          <button type="button" className="primary-button" onClick={onCorrect} disabled={corrected || (!selectedCodeIsOk && selectedLine === null)}>
            Corregir
          </button>
        </div>

        <button type="button" className="secondary-button next-exercise-button" onClick={onNextExercise}>
          Siguiente ejercicio
        </button>
      </div>

      <ResultBox result={result} exercise={exercise} selectedLine={selectedLine} />
    </section>
  );
}
