const REQUIRED_FIELDS = [
  'id',
  'materia',
  'tema',
  'dificultad',
  'consigna',
  'codigo',
  'tieneError',
  'lineaError',
  'explicacion'
];

const VALID_DIFFICULTIES = ['fácil', 'media', 'difícil'];

export function parseImportedJson(rawText) {
  try {
    return {
      ok: true,
      data: JSON.parse(rawText)
    };
  } catch (error) {
    return {
      ok: false,
      errors: [`JSON inválido: ${error.message}`]
    };
  }
}

export function normalizeImportedData(data) {
  if (Array.isArray(data)) {
    return {
      metadata: {
        schemaVersion: 1,
        packName: 'Pack importado',
        language: '',
        description: ''
      },
      exercises: data
    };
  }

  if (data && typeof data === 'object' && Array.isArray(data.exercises)) {
    return {
      metadata: {
        schemaVersion: data.schemaVersion ?? 1,
        packName: typeof data.packName === 'string' && data.packName.trim() ? data.packName.trim() : 'Pack importado',
        language: typeof data.language === 'string' ? data.language.trim() : '',
        description: typeof data.description === 'string' ? data.description.trim() : ''
      },
      exercises: data.exercises
    };
  }

  return {
    metadata: null,
    exercises: null,
    formatError: 'El JSON debe ser un objeto con la propiedad exercises o directamente un array de ejercicios.'
  };
}

function labelForExercise(exercise, index) {
  const visibleIndex = index + 1;
  if (exercise && typeof exercise.id === 'string' && exercise.id.trim()) {
    return `Ejercicio ${visibleIndex} (${exercise.id})`;
  }
  return `Ejercicio ${visibleIndex}`;
}

function isStringOrNull(value) {
  return typeof value === 'string' || value === null || value === undefined;
}

export function validateExercise(exercise, index) {
  const errors = [];
  const label = labelForExercise(exercise, index);

  if (!exercise || typeof exercise !== 'object' || Array.isArray(exercise)) {
    return [`${label}: debe ser un objeto.`];
  }

  REQUIRED_FIELDS.forEach((field) => {
    if (!(field in exercise)) {
      errors.push(`${label}: falta el campo obligatorio "${field}".`);
    }
  });

  if ('id' in exercise && typeof exercise.id !== 'string') {
    errors.push(`${label}: el campo "id" debe ser string.`);
  }

  if ('materia' in exercise && typeof exercise.materia !== 'string') {
    errors.push(`${label}: el campo "materia" debe ser string.`);
  }

  if ('tema' in exercise && typeof exercise.tema !== 'string') {
    errors.push(`${label}: el campo "tema" debe ser string.`);
  }

  if ('dificultad' in exercise) {
    if (typeof exercise.dificultad !== 'string') {
      errors.push(`${label}: el campo "dificultad" debe ser string.`);
    } else if (!VALID_DIFFICULTIES.includes(exercise.dificultad.trim().toLowerCase())) {
      errors.push(`${label}: la dificultad debe ser "fácil", "media" o "difícil".`);
    }
  }

  if ('consigna' in exercise && typeof exercise.consigna !== 'string') {
    errors.push(`${label}: el campo "consigna" debe ser string.`);
  }

  if ('codigo' in exercise) {
    if (!Array.isArray(exercise.codigo)) {
      errors.push(`${label}: el campo "codigo" debe ser un array de strings.`);
    } else if (!exercise.codigo.every((line) => typeof line === 'string')) {
      errors.push(`${label}: todas las líneas de "codigo" deben ser strings.`);
    } else if (exercise.codigo.length === 0) {
      errors.push(`${label}: el campo "codigo" debe tener al menos una línea.`);
    }
  }

  if ('tieneError' in exercise && typeof exercise.tieneError !== 'boolean') {
    errors.push(`${label}: el campo "tieneError" debe ser boolean.`);
  }

  if ('tieneError' in exercise && 'lineaError' in exercise && Array.isArray(exercise.codigo)) {
    if (exercise.tieneError === true) {
      if (!Number.isInteger(exercise.lineaError)) {
        errors.push(`${label}: si "tieneError" es true, "lineaError" debe ser un número entero.`);
      } else if (exercise.lineaError < 1 || exercise.lineaError > exercise.codigo.length) {
        errors.push(`${label}: "lineaError" debe estar entre 1 y ${exercise.codigo.length}.`);
      }
    }

    if (exercise.tieneError === false && exercise.lineaError !== null) {
      errors.push(`${label}: si "tieneError" es false, "lineaError" debe ser null.`);
    }
  }

  if ('tipoError' in exercise && !isStringOrNull(exercise.tipoError)) {
    errors.push(`${label}: el campo "tipoError" puede ser string o null.`);
  }

  if ('explicacion' in exercise && typeof exercise.explicacion !== 'string') {
    errors.push(`${label}: el campo "explicacion" debe ser string.`);
  }

  if ('correccionSugerida' in exercise && !isStringOrNull(exercise.correccionSugerida)) {
    errors.push(`${label}: el campo "correccionSugerida" puede ser string o null.`);
  }

  return errors;
}

export function validateImportedData(data) {
  const normalized = normalizeImportedData(data);

  if (normalized.formatError) {
    return {
      ok: false,
      errors: [normalized.formatError],
      normalized: null
    };
  }

  const errors = [];

  if (!Array.isArray(normalized.exercises)) {
    errors.push('No se detectó un array de ejercicios válido.');
  } else if (normalized.exercises.length === 0) {
    errors.push('El JSON no contiene ejercicios.');
  } else {
    normalized.exercises.forEach((exercise, index) => {
      errors.push(...validateExercise(exercise, index));
    });
  }

  return {
    ok: errors.length === 0,
    errors,
    normalized: errors.length === 0 ? normalized : null
  };
}

export function cleanExercise(exercise) {
  return {
    id: exercise.id.trim(),
    materia: exercise.materia.trim(),
    tema: exercise.tema.trim(),
    dificultad: exercise.dificultad.trim().toLowerCase(),
    consigna: exercise.consigna.trim(),
    codigo: exercise.codigo.map((line) => String(line)),
    tieneError: exercise.tieneError,
    lineaError: exercise.tieneError ? exercise.lineaError : null,
    tipoError: typeof exercise.tipoError === 'string' && exercise.tipoError.trim() ? exercise.tipoError.trim() : null,
    explicacion: exercise.explicacion.trim(),
    correccionSugerida:
      typeof exercise.correccionSugerida === 'string' && exercise.correccionSugerida.trim()
        ? exercise.correccionSugerida.trim()
        : null
  };
}

export function buildImportSummary(metadata, exercises) {
  const byMateria = {};
  const byDificultad = {};
  let withError = 0;
  let withoutError = 0;

  exercises.forEach((exercise) => {
    byMateria[exercise.materia] = (byMateria[exercise.materia] || 0) + 1;
    byDificultad[exercise.dificultad] = (byDificultad[exercise.dificultad] || 0) + 1;
    if (exercise.tieneError) withError += 1;
    else withoutError += 1;
  });

  return {
    packName: metadata.packName,
    language: metadata.language,
    description: metadata.description,
    total: exercises.length,
    byMateria,
    byDificultad,
    withError,
    withoutError
  };
}
