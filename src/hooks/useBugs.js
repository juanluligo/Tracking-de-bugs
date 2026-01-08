import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'bugs_estadistica'

export function useBugs() {
  const [bugs, setBugs] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setBugs(JSON.parse(stored))
    }
  }, [])

  const saveBugs = useCallback((newBugs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBugs))
    setBugs(newBugs)
  }, [])

  const addBug = useCallback((bug) => {
    const newBugs = [...bugs, { ...bug, id: Date.now() }]
    saveBugs(newBugs)
  }, [bugs, saveBugs])

  const deleteBug = useCallback((id) => {
    const newBugs = bugs.filter(bug => bug.id !== id)
    saveBugs(newBugs)
  }, [bugs, saveBugs])

  const clearBugs = useCallback(() => {
    saveBugs([])
  }, [saveBugs])

  const addTestData = useCallback((count) => {
    const bugTypes = ['Frontend', 'Backend', 'Logica', 'BaseDatos']
    const documentationOptions = ['Si', 'No']
    const timeOfDayOptions = ['Mañana', 'Tarde', 'Noche']
    const projects = ['amigo-secreto', 'sistema-registro', 'VozSegura', 'tareadiarias']
    
    const bugDescriptions = {
      'Frontend': [
        'Error en el renderizado del componente modal',
        'Los estilos CSS no se aplican correctamente en mobile',
        'Botón de submit no responde al primer click',
        'Problema con el scroll infinito en la tabla',
        'Icono no se muestra correctamente en Safari'
      ],
      'Backend': [
        'API endpoint retorna 500 cuando el payload está vacío',
        'Error en la autenticación con JWT expirado',
        'Query a la base de datos tarda más de 5 segundos',
        'Middleware de validación rechaza datos válidos',
        'Error al procesar archivos mayores a 10MB'
      ],
      'Logica': [
        'Algoritmo de ordenamiento no maneja casos edge',
        'Cálculo de porcentaje da resultado incorrecto',
        'Validación de formulario permite datos inválidos',
        'Loop infinito cuando el array está vacío',
        'Condición if-else no cubre todos los casos'
      ],
      'BaseDatos': [
        'Foreign key constraint violation al eliminar',
        'Query con JOIN retorna duplicados',
        'Índice faltante causa consultas lentas',
        'Migración falla por tipo de dato incompatible',
        'Transacción no hace rollback correctamente'
      ]
    }

    const randomFloat = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2))
    const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)]
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

    const generatedBugs = []
    const now = Date.now()

    for (let i = 0; i < count; i++) {
      let complexity
      const rand = Math.random()
      if (rand < 0.1) complexity = 1
      else if (rand < 0.35) complexity = 2
      else if (rand < 0.65) complexity = 3
      else if (rand < 0.85) complexity = 4
      else complexity = 5

      let baseTime
      switch(complexity) {
        case 1: baseTime = randomFloat(5, 15); break
        case 2: baseTime = randomFloat(10, 25); break
        case 3: baseTime = randomFloat(20, 45); break
        case 4: baseTime = randomFloat(35, 70); break
        case 5: baseTime = randomFloat(60, 120); break
      }

      const type = randomElement(bugTypes)
      const documentation = Math.random() < 0.6 ? 'Si' : 'No'
      const docFactor = documentation === 'Si' ? randomFloat(0.80, 0.95) : randomFloat(1.0, 1.15)
      const timeMinutes = parseFloat((baseTime * docFactor).toFixed(2))

      const daysAgo = randomInt(0, 30)
      const hoursAgo = randomInt(0, 23)
      const minutesAgo = randomInt(0, 59)
      const timestamp = new Date(now - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000) - (minutesAgo * 60 * 1000))

      generatedBugs.push({
        id: now + i,
        timestamp: timestamp.toISOString(),
        timeMinutes,
        timeFormatted: `${Math.floor(timeMinutes)} min ${Math.round((timeMinutes % 1) * 60)} seg`,
        type,
        complexity,
        documentation,
        timeOfDay: randomElement(timeOfDayOptions),
        project: randomElement(projects),
        description: randomElement(bugDescriptions[type])
      })
    }

    saveBugs([...bugs, ...generatedBugs])
  }, [bugs, saveBugs])

  return { bugs, addBug, deleteBug, clearBugs, addTestData }
}
