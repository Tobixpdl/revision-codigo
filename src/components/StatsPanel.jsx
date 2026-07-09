import { calculatePercent } from '../utils/exerciseHelpers.js';

function ErrorTable({ title, data }) {
  const entries = Object.entries(data || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div className="stats-table">
      <h3>{title}</h3>
      {entries.length === 0 ? (
        <p className="muted">Sin errores registrados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Grupo</th>
              <th>Errores</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function getPackName(packId, packs) {
  if (!packId) return 'Todos';
  return packs.find((pack) => pack.id === packId)?.packName || `Pack ${packId}`;
}

function formatFilterSummary(filters = {}, packs = []) {
  return [
    `Pack: ${getPackName(filters.packId, packs)}`,
    `Materia: ${filters.materia || 'Todas'}`,
    `Tema: ${filters.tema || 'Todos'}`,
    `Dificultad: ${filters.dificultad || 'Todas'}`
  ].join(' · ');
}

export default function StatsPanel({ stats, packs = [], onResetStats, onLoadRoundFilters }) {
  const percent = calculatePercent(stats.correct, stats.answered);
  const rounds = Array.isArray(stats.rounds) ? stats.rounds : [];

  return (
    <section className="card stats-card" id="estadisticas">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Rendimiento</p>
          <h2>Estadísticas</h2>
        </div>
        <button type="button" className="secondary-button" onClick={onResetStats} disabled={stats.answered === 0 && rounds.length === 0}>
          Resetear estadísticas
        </button>
      </div>

      <div className="stat-grid">
        <div className="stat-tile">
          <span>Respondidos</span>
          <strong>{stats.answered}</strong>
        </div>
        <div className="stat-tile">
          <span>Correctas</span>
          <strong>{stats.correct}</strong>
        </div>
        <div className="stat-tile">
          <span>Incorrectas</span>
          <strong>{stats.incorrect}</strong>
        </div>
        <div className="stat-tile">
          <span>Acierto</span>
          <strong>{percent}%</strong>
        </div>
      </div>

      <div className="stats-columns">
        <ErrorTable title="Errores por materia" data={stats.errorsByMateria} />
        <ErrorTable title="Errores por tema" data={stats.errorsByTema} />
        <ErrorTable title="Errores por dificultad" data={stats.errorsByDificultad} />
      </div>

      <div className="history-box">
        <h3>Rondas guardadas</h3>
        {rounds.length === 0 ? (
          <p className="muted">Todavía no hay rondas guardadas. Al terminar una práctica, aparece acá.</p>
        ) : (
          <ul>
            {rounds.slice(0, 10).map((round) => (
              <li key={round.id}>
                <strong>
                  {round.correct}/{round.total} correctas · {round.percent}%
                </strong>{' '}
                · {round.incorrect} incorrectas · {new Date(round.savedAt).toLocaleString('es-AR')}
                <br />
                <span className="muted small-text">{formatFilterSummary(round.filters, packs)}</span>
                <div className="button-row">
                  <button type="button" className="secondary-button" onClick={() => onLoadRoundFilters(round)}>
                    Practicar otra vez con estos filtros
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="history-box">
        <h3>Últimos ejercicios respondidos</h3>
        {stats.history.length === 0 ? (
          <p className="muted">Todavía no hay historial.</p>
        ) : (
          <ul>
            {stats.history.slice(0, 10).map((item) => (
              <li key={`${item.exerciseId}-${item.answeredAt}`}>
                <strong>{item.isCorrect ? 'Correcto' : 'Incorrecto'}</strong> · {item.exerciseId} · {item.materia} · {item.tema} ·{' '}
                {new Date(item.answeredAt).toLocaleString('es-AR')}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
