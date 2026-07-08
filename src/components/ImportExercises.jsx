import { useState } from 'react';
import { buildImportSummary, cleanExercise, parseImportedJson, validateImportedData } from '../utils/exerciseValidation.js';
import { SAMPLE_PACK } from '../utils/exerciseHelpers.js';

const EXAMPLE_JSON = JSON.stringify(SAMPLE_PACK, null, 2);

function SummaryList({ title, data }) {
  const entries = Object.entries(data || {});
  if (!entries.length) return null;

  return (
    <div className="summary-list">
      <strong>{title}</strong>
      <ul>
        {entries.map(([key, value]) => (
          <li key={key}>
            {key}: {value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ImportExercises({ onImport }) {
  const [rawText, setRawText] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [validatedPack, setValidatedPack] = useState(null);
  const [summary, setSummary] = useState(null);
  const [fileName, setFileName] = useState('');

  function resetValidation() {
    setValidationErrors([]);
    setValidatedPack(null);
    setSummary(null);
  }

  function handleTextChange(value) {
    setRawText(value);
    resetValidation();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    resetValidation();

    if (!file) return;

    setFileName(file.name);

    if (!file.name.toLowerCase().endsWith('.json')) {
      setValidationErrors(['El archivo debe tener extensión .json.']);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setRawText(String(reader.result || ''));
    };
    reader.onerror = () => {
      setValidationErrors(['No se pudo leer el archivo seleccionado.']);
    };
    reader.readAsText(file);
  }

  function handleValidate() {
    resetValidation();

    if (!rawText.trim()) {
      setValidationErrors(['Pegá un JSON o subí un archivo .json antes de validar.']);
      return;
    }

    const parsed = parseImportedJson(rawText);
    if (!parsed.ok) {
      setValidationErrors(parsed.errors);
      return;
    }

    const validation = validateImportedData(parsed.data);
    if (!validation.ok) {
      setValidationErrors(validation.errors);
      return;
    }

    const exercises = validation.normalized.exercises.map(cleanExercise);
    const pack = {
      metadata: validation.normalized.metadata,
      exercises
    };

    setValidatedPack(pack);
    setSummary(buildImportSummary(pack.metadata, exercises));
  }

  function handleConfirmImport() {
    if (!validatedPack) return;

    onImport(validatedPack.metadata, validatedPack.exercises);
    setRawText('');
    setValidationErrors([]);
    setValidatedPack(null);
    setSummary(null);
    setFileName('');
  }

  return (
    <section className="card import-card" id="importar">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Importación</p>
          <h2>Importar ejercicios</h2>
        </div>
        {fileName && <span className="file-pill">Archivo: {fileName}</span>}
      </div>

      <div className="import-grid">
        <label className="file-upload">
          Subir archivo .json
          <input type="file" accept=".json,application/json" onChange={handleFileChange} />
        </label>

        <label className="textarea-label">
          Pegar JSON manualmente
          <textarea
            value={rawText}
            onChange={(event) => handleTextChange(event.target.value)}
            placeholder="Pegá acá el JSON del pack o un array de ejercicios..."
            spellCheck="false"
          />
        </label>
      </div>

      <div className="button-row">
        <button type="button" className="secondary-button" onClick={() => handleTextChange(EXAMPLE_JSON)}>
          Cargar ejemplo Python
        </button>
        <button type="button" className="secondary-button" onClick={handleValidate}>
          Validar JSON
        </button>
        <button type="button" className="primary-button" onClick={handleConfirmImport} disabled={!validatedPack}>
          Confirmar importación
        </button>
      </div>

      {validationErrors.length > 0 && (
        <div className="validation-errors" role="alert">
          <h3>No se puede importar todavía</h3>
          <ul>
            {validationErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {summary && (
        <div className="import-summary" role="status">
          <h3>JSON válido</h3>
          <div className="summary-grid">
            <div>
              <strong>Pack:</strong> {summary.packName || 'Sin nombre'}
            </div>
            <div>
              <strong>Lenguaje:</strong> {summary.language || 'No indicado'}
            </div>
            <div>
              <strong>Ejercicios detectados:</strong> {summary.total}
            </div>
            <div>
              <strong>Con error:</strong> {summary.withError}
            </div>
            <div>
              <strong>Sin error:</strong> {summary.withoutError}
            </div>
          </div>
          <SummaryList title="Cantidad por materia" data={summary.byMateria} />
          <SummaryList title="Cantidad por dificultad" data={summary.byDificultad} />
        </div>
      )}
    </section>
  );
}
