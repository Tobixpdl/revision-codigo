import { buildBackupPayload, downloadJson } from '../utils/exerciseHelpers.js';

export default function ManageExercises({ exercises, packs, stats, onDeletePack, onDeleteAllExercises, onResetAll }) {
  const totalExercises = exercises.length;

  function handleBackup() {
    const payload = buildBackupPayload(exercises, packs, stats);
    downloadJson(`revision-codigo-backup-${new Date().toISOString().slice(0, 10)}.json`, payload);
  }

  return (
    <section className="card manage-card" id="mis-ejercicios">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Biblioteca local</p>
          <h2>Mis ejercicios</h2>
        </div>
        <span className="big-number">{totalExercises}</span>
      </div>

      <p className="muted">Los ejercicios y packs se guardan en localStorage de este navegador.</p>

      {packs.length === 0 ? (
        <div className="empty-inline">Todavía no hay packs importados.</div>
      ) : (
        <div className="packs-list">
          {packs.map((pack) => (
            <article key={pack.id} className="pack-item">
              <div>
                <h3>{pack.packName}</h3>
                <p>
                  {pack.language || 'Lenguaje no indicado'} · {pack.exerciseCount} ejercicios · Importado el{' '}
                  {new Date(pack.importedAt).toLocaleString('es-AR')}
                </p>
                {pack.description && <p className="muted small-text">{pack.description}</p>}
              </div>
              <button type="button" className="danger-button" onClick={() => onDeletePack(pack.id)}>
                Eliminar pack
              </button>
            </article>
          ))}
        </div>
      )}

      <div className="button-row manage-actions">
        <button type="button" className="secondary-button" onClick={handleBackup} disabled={totalExercises === 0 && packs.length === 0}>
          Descargar backup JSON
        </button>
        <button type="button" className="danger-button" onClick={onDeleteAllExercises} disabled={totalExercises === 0 && packs.length === 0}>
          Eliminar todos los ejercicios
        </button>
        <button type="button" className="danger-button solid" onClick={onResetAll}>
          Resetear todo
        </button>
      </div>
    </section>
  );
}
