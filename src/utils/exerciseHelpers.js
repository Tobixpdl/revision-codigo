export const SAMPLE_PACK = {
  "schemaVersion": 1,
  "packName": "Python - Revisión de código",
  "language": "Python",
  "description": "Pack de 20 ejercicios de revisión de código en Python.",
  "exercises": [
    {
      "id": "py-rev-001",
      "materia": "Programación para IA",
      "tema": "Funciones y operadores",
      "dificultad": "fácil",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "def sumar(a, b):",
        "    return a - b"
      ],
      "tieneError": true,
      "lineaError": 2,
      "tipoError": "operador incorrecto",
      "explicacion": "La función se llama sumar y debería devolver la suma de los dos parámetros. En la línea 2 se usa el operador de resta, por eso el resultado sería incorrecto.",
      "correccionSugerida": "return a + b"
    },
    {
      "id": "py-rev-002",
      "materia": "Programación para IA",
      "tema": "Condicionales y validaciones",
      "dificultad": "fácil",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "def calcular_descuento(monto):",
        "    if monto <= 5000:",
        "        return 0",
        "    elif monto <= 10000:",
        "        return 10",
        "    return 15"
      ],
      "tieneError": true,
      "lineaError": 2,
      "tipoError": "condición incorrecta",
      "explicacion": "Según el criterio del ejercicio, solo las compras menores a 5000 no tienen descuento. Con <= 5000, una compra de exactamente 5000 queda mal clasificada.",
      "correccionSugerida": "if monto < 5000:"
    },
    {
      "id": "py-rev-003",
      "materia": "Programación para IA",
      "tema": "Bucles y contador",
      "dificultad": "fácil",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "def contar_pares(numeros):",
        "    contador = 0",
        "    for n in numeros:",
        "        if n % 2 == 1:",
        "            contador += 1",
        "    return contador"
      ],
      "tieneError": true,
      "lineaError": 4,
      "tipoError": "condición incorrecta",
      "explicacion": "Para contar números pares se debe verificar que el resto de dividir por 2 sea 0. La línea 4 está contando impares.",
      "correccionSugerida": "if n % 2 == 0:"
    },
    {
      "id": "py-rev-004",
      "materia": "Programación para IA",
      "tema": "Listas e índices",
      "dificultad": "fácil",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "def mostrar_elementos(lista):",
        "    for i in range(len(lista) + 1):",
        "        print(lista[i])"
      ],
      "tieneError": true,
      "lineaError": 2,
      "tipoError": "índice fuera de rango",
      "explicacion": "range(len(lista) + 1) genera un índice extra que no existe. Para una lista de tamaño n, los índices válidos van de 0 a n - 1.",
      "correccionSugerida": "for i in range(len(lista)):"
    },
    {
      "id": "py-rev-005",
      "materia": "Algoritmos",
      "tema": "Pilas / Stack / LIFO",
      "dificultad": "fácil",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "def desapilar(pila):",
        "    if len(pila) > 0:",
        "        return pila.pop(0)",
        "    return None"
      ],
      "tieneError": true,
      "lineaError": 3,
      "tipoError": "error lógico con pilas",
      "explicacion": "Una pila debe respetar LIFO: el último elemento en entrar es el primero en salir. pop(0) retira el primer elemento, comportamiento propio de una cola.",
      "correccionSugerida": "return pila.pop()"
    },
    {
      "id": "py-rev-006",
      "materia": "Algoritmos",
      "tema": "Búsqueda lineal",
      "dificultad": "fácil",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "def buscar(lista, objetivo):",
        "    for i in range(len(lista)):",
        "        if lista[i] == objetivo:",
        "            return i",
        "    return -1"
      ],
      "tieneError": false,
      "lineaError": null,
      "tipoError": null,
      "explicacion": "El código está bien. Recorre la lista desde la primera posición hasta la última, devuelve el índice si encuentra el objetivo y devuelve -1 si no aparece.",
      "correccionSugerida": null
    },
    {
      "id": "py-rev-007",
      "materia": "Algoritmos",
      "tema": "Colas / Queue / FIFO",
      "dificultad": "fácil",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "def desencolar(cola):",
        "    if len(cola) > 0:",
        "        return cola.pop()",
        "    return None"
      ],
      "tieneError": true,
      "lineaError": 3,
      "tipoError": "error lógico con colas",
      "explicacion": "Una cola debe respetar FIFO: el primer elemento en entrar es el primero en salir. pop() retira el último elemento, comportamiento propio de una pila.",
      "correccionSugerida": "return cola.pop(0)"
    },
    {
      "id": "py-rev-008",
      "materia": "Programación para IA",
      "tema": "Clases, **init** y atributos",
      "dificultad": "media",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "class Perro:",
        "    def **init**(self, nombre, raza):",
        "        nombre = nombre",
        "        self.raza = raza",
        "",
        "    def describir(self):",
        "        return f'{self.nombre} es de raza {self.raza}'"
      ],
      "tieneError": true,
      "lineaError": 3,
      "tipoError": "atributo mal definido",
      "explicacion": "En el constructor, nombre = nombre solo reasigna el parámetro local y no crea el atributo del objeto. Luego self.nombre no existe cuando se llama a describir.",
      "correccionSugerida": "self.nombre = nombre"
    },
    {
      "id": "py-rev-009",
      "materia": "Programación para IA",
      "tema": "Métodos y self",
      "dificultad": "media",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "class Estudiante:",
        "    def **init**(self, nombre, promedio):",
        "        self.nombre = nombre",
        "        self.promedio = promedio",
        "",
        "    def esta_aprobado(self):",
        "        return promedio >= 60"
      ],
      "tieneError": true,
      "lineaError": 7,
      "tipoError": "variable mal usada",
      "explicacion": "promedio es un atributo del objeto y debe accederse mediante self. Sin self, Python busca una variable local llamada promedio que no existe en ese método.",
      "correccionSugerida": "return self.promedio >= 60"
    },
    {
      "id": "py-rev-010",
      "materia": "Programación para IA",
      "tema": "Encapsulamiento",
      "dificultad": "media",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "class Cuenta:",
        "    def **init**(self, saldo):",
        "        self.__saldo = saldo",
        "",
        "    def retirar(self, monto):",
        "        if monto <= self.__saldo:",
        "            self.__saldo += monto",
        "            return True",
        "        return False"
      ],
      "tieneError": true,
      "lineaError": 7,
      "tipoError": "acumulador mal actualizado",
      "explicacion": "Al retirar dinero, el saldo debe disminuir. La línea 7 suma el monto al saldo, produciendo el efecto contrario al esperado.",
      "correccionSugerida": "self.__saldo -= monto"
    },
    {
      "id": "py-rev-011",
      "materia": "Programación para IA",
      "tema": "Herencia y polimorfismo",
      "dificultad": "media",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "class Animal:",
        "    def **init**(self, nombre):",
        "        self.nombre = nombre",
        "",
        "    def hablar(self):",
        "        return 'sonido genérico'",
        "",
        "class Perro(Animal):",
        "    def hablar(self):",
        "        return 'miau'"
      ],
      "tieneError": true,
      "lineaError": 10,
      "tipoError": "retorno incorrecto",
      "explicacion": "La subclase Perro redefine el método hablar, pero devuelve un sonido que corresponde a otro animal. Para aplicar polimorfismo correctamente, cada clase debe responder de acuerdo con su comportamiento.",
      "correccionSugerida": "return 'guau'"
    },
    {
      "id": "py-rev-012",
      "materia": "Programación para IA",
      "tema": "Diccionarios y agrupación",
      "dificultad": "media",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "def agrupar_por_categoria(productos):",
        "    grupos = {}",
        "    for nombre, categoria, precio in productos:",
        "        if categoria not in grupos:",
        "            grupos[categoria] = []",
        "        grupos[nombre].append(categoria)",
        "    return grupos"
      ],
      "tieneError": true,
      "lineaError": 6,
      "tipoError": "variable mal usada",
      "explicacion": "El diccionario usa la categoría como clave. En la línea 6 se intenta acceder usando el nombre del producto como clave, lo que rompe la agrupación y puede producir KeyError.",
      "correccionSugerida": "grupos[categoria].append(nombre)"
    },
    {
      "id": "py-rev-013",
      "materia": "Algoritmos",
      "tema": "Pilas y validación de paréntesis",
      "dificultad": "media",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "def parentesis_balanceados(expresion):",
        "    pila = []",
        "    for caracter in expresion:",
        "        if caracter == '(':",
        "            pila.append(caracter)",
        "        elif caracter == ')':",
        "            if len(pila) == 0:",
        "                return False",
        "            pila.append(caracter)",
        "    return len(pila) == 0"
      ],
      "tieneError": true,
      "lineaError": 9,
      "tipoError": "error lógico con pilas",
      "explicacion": "Cuando aparece un paréntesis de cierre, debe quitarse de la pila el paréntesis de apertura correspondiente. La línea 9 agrega el cierre y deja la pila con elementos de más.",
      "correccionSugerida": "pila.pop()"
    },
    {
      "id": "py-rev-014",
      "materia": "Algoritmos",
      "tema": "Colas y procesamiento FIFO",
      "dificultad": "media",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "def procesar_trabajos(cola):",
        "    procesados = []",
        "    while len(cola) > 0:",
        "        trabajo = cola.pop(0)",
        "        procesados.append(trabajo)",
        "        cola.append(trabajo)",
        "    return procesados"
      ],
      "tieneError": true,
      "lineaError": 6,
      "tipoError": "error en ciclo while",
      "explicacion": "La línea 6 vuelve a agregar a la cola el trabajo ya procesado. Como la cola nunca se vacía, el while puede convertirse en un ciclo infinito.",
      "correccionSugerida": "Eliminar la línea 6."
    },
    {
      "id": "py-rev-015",
      "materia": "Algoritmos",
      "tema": "Grafos y BFS",
      "dificultad": "media",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "def bfs(grafo, inicio):",
        "    cola = [inicio]",
        "    visitados = set()",
        "    recorrido = []",
        "    while len(cola) > 0:",
        "        nodo = cola.pop(0)",
        "        recorrido.append(nodo)",
        "        for vecino in grafo[nodo]:",
        "            if vecino not in visitados:",
        "                visitados.add(vecino)",
        "                cola.append(vecino)",
        "    return recorrido"
      ],
      "tieneError": true,
      "lineaError": 3,
      "tipoError": "visitados en grafos",
      "explicacion": "El nodo inicial debe marcarse como visitado antes de comenzar. Si el grafo tiene ciclos, el inicio puede volver a entrar en la cola y aparecer repetido en el recorrido.",
      "correccionSugerida": "visitados = {inicio}"
    },
    {
      "id": "py-rev-016",
      "materia": "Algoritmos",
      "tema": "BST e inorden",
      "dificultad": "difícil",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "class Nodo:",
        "    def **init**(self, valor):",
        "        self.valor = valor",
        "        self.izquierda = None",
        "        self.derecha = None",
        "",
        "def inorden(nodo):",
        "    if nodo is None:",
        "        return []",
        "    return inorden(nodo.izquierda) + [nodo.valor] + inorden(nodo.derecha)"
      ],
      "tieneError": false,
      "lineaError": null,
      "tipoError": null,
      "explicacion": "El código está bien. Define un nodo de árbol binario y realiza un recorrido inorden correcto: primero subárbol izquierdo, luego raíz y finalmente subárbol derecho.",
      "correccionSugerida": null
    },
    {
      "id": "py-rev-017",
      "materia": "Algoritmos",
      "tema": "Búsqueda en BST",
      "dificultad": "difícil",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "def buscar_bst(raiz, valor):",
        "    actual = raiz",
        "    while actual is not None:",
        "        if actual.valor == valor:",
        "            return True",
        "        elif valor < actual.valor:",
        "            actual = actual.derecha",
        "        else:",
        "            actual = actual.izquierda",
        "    return False"
      ],
      "tieneError": true,
      "lineaError": 7,
      "tipoError": "error en búsqueda",
      "explicacion": "En un BST, los valores menores que el nodo actual se buscan por el subárbol izquierdo. La línea 7 envía la búsqueda hacia la derecha, invirtiendo la lógica del árbol.",
      "correccionSugerida": "actual = actual.izquierda"
    },
    {
      "id": "py-rev-018",
      "materia": "Algoritmos",
      "tema": "Inserción en BST",
      "dificultad": "difícil",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "def insertar(raiz, valor):",
        "    if raiz is None:",
        "        return Nodo(valor)",
        "    if valor < raiz.valor:",
        "        raiz.izquierda = insertar(raiz.izquierda, valor)",
        "    elif valor > raiz.valor:",
        "        raiz.izquierda = insertar(raiz.derecha, valor)",
        "    return raiz"
      ],
      "tieneError": true,
      "lineaError": 7,
      "tipoError": "error lógico en árboles",
      "explicacion": "Cuando el valor es mayor que la raíz, debe insertarse en el subárbol derecho. La línea 7 asigna el resultado al hijo izquierdo, rompiendo la estructura del BST.",
      "correccionSugerida": "raiz.derecha = insertar(raiz.derecha, valor)"
    },
    {
      "id": "py-rev-019",
      "materia": "Algoritmos",
      "tema": "Recursividad y recorridos de árboles",
      "dificultad": "difícil",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "def postorden(nodo):",
        "    if nodo is None:",
        "        return []",
        "    return [nodo.valor] + postorden(nodo.izquierda) + postorden(nodo.derecha)"
      ],
      "tieneError": true,
      "lineaError": 4,
      "tipoError": "retorno incorrecto",
      "explicacion": "El postorden debe visitar primero el subárbol izquierdo, luego el derecho y al final la raíz. La línea 4 coloca la raíz al principio, lo que corresponde a preorden.",
      "correccionSugerida": "return postorden(nodo.izquierda) + postorden(nodo.derecha) + [nodo.valor]"
    },
    {
      "id": "py-rev-020",
      "materia": "Algoritmos",
      "tema": "DFS y visitados en grafos",
      "dificultad": "difícil",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "def dfs(grafo, nodo, visitados=None):",
        "    if visitados is None:",
        "        visitados = set()",
        "    visitados.add(vecino)",
        "    recorrido = [nodo]",
        "    for vecino in grafo[nodo]:",
        "        if vecino not in visitados:",
        "            recorrido += dfs(grafo, vecino, visitados)",
        "    return recorrido"
      ],
      "tieneError": true,
      "lineaError": 4,
      "tipoError": "variable sin inicializar",
      "explicacion": "En DFS se debe marcar como visitado el nodo actual antes de recorrer sus vecinos. La línea 4 usa vecino antes de que exista, porque vecino recién se define dentro del for.",
      "correccionSugerida": "visitados.add(nodo)"
    }
  ]
};

export function createPackId() {
  return `pack-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export function normalizeForComparison(value) {
  return String(value || '').trim().toLowerCase();
}

export function getUniqueValues(exercises, field) {
  return [...new Set(exercises.map((exercise) => exercise[field]).filter(Boolean))].sort((a, b) =>
    String(a).localeCompare(String(b), 'es')
  );
}

export function filterExercises(exercises, filters) {
  return exercises.filter((exercise) => {
    const byPack = !filters.packId || exercise.packId === filters.packId;
    const byMateria = !filters.materia || exercise.materia === filters.materia;
    const byTema = !filters.tema || exercise.tema === filters.tema;
    const byDificultad = !filters.dificultad || exercise.dificultad === filters.dificultad;
    return byPack && byMateria && byTema && byDificultad;
  });
}

export function getRandomExercise(exercises) {
  if (!exercises.length) return null;
  const index = Math.floor(Math.random() * exercises.length);
  return exercises[index];
}

export function resolveDuplicateIds(incomingExercises, existingExercises) {
  const usedIds = new Set(existingExercises.map((exercise) => exercise.id));
  const counterByOriginalId = {};
  let renamedCount = 0;

  const resolved = incomingExercises.map((exercise) => {
    let newId = exercise.id;

    if (usedIds.has(newId)) {
      renamedCount += 1;
      counterByOriginalId[exercise.id] = counterByOriginalId[exercise.id] || 1;

      do {
        newId = `${exercise.id}-importado-${counterByOriginalId[exercise.id]}`;
        counterByOriginalId[exercise.id] += 1;
      } while (usedIds.has(newId));
    }

    usedIds.add(newId);
    return {
      ...exercise,
      id: newId,
      originalId: newId === exercise.id ? null : exercise.id
    };
  });

  return { exercises: resolved, renamedCount };
}

export function buildBackupPayload(exercises, packs, stats) {
  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    type: 'revision-codigo-backup',
    exercises,
    packs,
    stats
  };
}

export function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function incrementMapValue(map, key) {
  return {
    ...map,
    [key || 'Sin dato']: (map[key || 'Sin dato'] || 0) + 1
  };
}

export function calculatePercent(correct, answered) {
  if (!answered) return 0;
  return Math.round((correct / answered) * 100);
}
