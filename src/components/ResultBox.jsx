export default function ResultBox({ result, exercise, selectedLine }) {
  if (!result) return null;

  const answerText = exercise.tieneError
    ? `La línea correcta era la ${exercise.lineaError}.`
    : 'La respuesta correcta era: “El código está bien”.';

  const selectedText =
    selectedLine !== null && selectedLine !== undefined
      ? `Elegiste la línea ${selectedLine}.`
      : 'Elegiste que el código estaba bien.';

  return (
    <section className={`result-box ${result.isCorrect ? 'result-correct' : 'result-wrong'}`} aria-live="polite">
      <h3>{result.isCorrect ? 'Correcto' : 'Incorrecto'}</h3>
      <p>
        <strong>{selectedText}</strong> {answerText}
      </p>

      {exercise.tipoError && (
        <p>
          <strong>Tipo de error:</strong> {exercise.tipoError}
        </p>
      )}

      <p>
        <strong>Explicación:</strong> {exercise.explicacion}
      </p>

      {exercise.correccionSugerida && (
        <div className="suggested-fix">
          <strong>Corrección sugerida:</strong>
          <pre>{exercise.correccionSugerida}</pre>
        </div>
      )}
    </section>
  );
}
