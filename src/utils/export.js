export function exportToCSV(bugs) {
  if (bugs.length === 0) {
    alert('No hay datos para exportar')
    return
  }
  
  const headers = ['ID', 'Fecha/Hora', 'Tiempo(min)', 'Tipo', 'Complejidad', 'Documentacion', 'HoraDia', 'Proyecto', 'Descripcion']
  const rows = bugs.map(bug => [
    bug.id,
    bug.timestamp,
    bug.timeMinutes,
    bug.type,
    bug.complexity,
    bug.documentation,
    bug.timeOfDay,
    bug.project,
    `"${(bug.description || '').replace(/"/g, '""')}"`
  ])
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')
  
  downloadFile(csv, 'bugs_estadistica.csv', 'text/csv')
}

export function exportToJSON(bugs) {
  if (bugs.length === 0) {
    alert('No hay datos para exportar')
    return
  }
  
  const json = JSON.stringify(bugs, null, 2)
  downloadFile(json, 'bugs_estadistica.json', 'application/json')
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  alert(`✅ Archivo ${filename} descargado exitosamente!`)
}
