import { getUniqueValues } from '../utils/exerciseHelpers.js';

export default function Filters({ exercises, packs, filters, mode, onChangeFilters, onChangeMode, onStart, disabled }) {
  const materias = getUniqueValues(exercises, 'materia');
  const temas = getUniqueValues(
    filters.materia ? exercises.filter((exercise) => exercise.materia === filters.materia) : exercises,
    'tema'
  );
  const dificultades = ['fácil', 'media', 'difícil'];

  function updateFilter(name, value) {
    onChangeFilters({
      ...filters,
      [name]: value,
      ...(name === 'materia' ? { tema: '' } : {})
    });
  }

  return (
    <section className="card filters-card">
      <div>
        <p className="eyebrow">Práctica</p>
        <h2>Configurar sesión</h2>
      </div>

      <div className="filters-grid">
        <label>
          Pack
          <select value={filters.packId} onChange={(event) => updateFilter('packId', event.target.value)}>
            <option value="">Todos</option>
            {packs.map((pack) => (
              <option key={pack.id} value={pack.id}>
                {pack.packName} ({pack.exerciseCount})
              </option>
            ))}
          </select>
        </label>

        <label>
          Materia
          <select value={filters.materia} onChange={(event) => updateFilter('materia', event.target.value)}>
            <option value="">Todas</option>
            {materias.map((materia) => (
              <option key={materia} value={materia}>
                {materia}
              </option>
            ))}
          </select>
        </label>

        <label>
          Tema
          <select value={filters.tema} onChange={(event) => updateFilter('tema', event.target.value)}>
            <option value="">Todos</option>
            {temas.map((tema) => (
              <option key={tema} value={tema}>
                {tema}
              </option>
            ))}
          </select>
        </label>

        <label>
          Dificultad
          <select value={filters.dificultad} onChange={(event) => updateFilter('dificultad', event.target.value)}>
            <option value="">Todas</option>
            {dificultades.map((dificultad) => (
              <option key={dificultad} value={dificultad}>
                {dificultad}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mode-row" role="radiogroup" aria-label="Modo de práctica">
        <label className="radio-card">
          <input type="radio" name="practice-mode" value="sequential" checked={mode === 'sequential'} onChange={() => onChangeMode('sequential')} />
          Modo secuencial
        </label>
        <label className="radio-card">
          <input type="radio" name="practice-mode" value="random" checked={mode === 'random'} onChange={() => onChangeMode('random')} />
          Modo aleatorio
        </label>
      </div>

      <button type="button" className="primary-button start-practice-button" onClick={onStart} disabled={disabled}>
        Empezar
      </button>
    </section>
  );
}
