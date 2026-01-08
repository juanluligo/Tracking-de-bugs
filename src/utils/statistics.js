export function calculateStatistics(bugs) {
  if (bugs.length === 0) {
    return {
      mean: '-',
      median: '-',
      mode: '-',
      stdDev: '-',
      variance: '-',
      range: '-',
      min: '-',
      max: '-',
      q1: '-',
      q2: '-',
      q3: '-',
      cv: '-'
    }
  }

  const times = bugs.map(b => b.timeMinutes).sort((a, b) => a - b)
  
  // Media
  const mean = times.reduce((a, b) => a + b, 0) / times.length
  
  // Mediana
  const mid = Math.floor(times.length / 2)
  const median = times.length % 2 !== 0 
    ? times[mid] 
    : (times[mid - 1] + times[mid]) / 2
  
  // Moda
  const frequency = {}
  let maxFreq = 0
  times.forEach(val => {
    const rounded = Math.round(val * 10) / 10
    frequency[rounded] = (frequency[rounded] || 0) + 1
    if (frequency[rounded] > maxFreq) maxFreq = frequency[rounded]
  })
  
  const modes = Object.keys(frequency).filter(key => frequency[key] === maxFreq).map(parseFloat)
  const mode = modes.length === times.length ? 'Sin moda' : modes.map(m => m.toFixed(1)).join(', ') + ' min'
  
  // Varianza y Desviación Estándar
  const variance = times.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / times.length
  const stdDev = Math.sqrt(variance)
  
  // Rango
  const range = times[times.length - 1] - times[0]
  
  // Cuartiles
  const calculatePercentile = (arr, percentile) => {
    const index = (percentile / 100) * (arr.length - 1)
    const lower = Math.floor(index)
    const upper = Math.ceil(index)
    const weight = index % 1
    if (lower === upper) return arr[lower]
    return arr[lower] * (1 - weight) + arr[upper] * weight
  }
  
  const q1 = calculatePercentile(times, 25)
  const q2 = calculatePercentile(times, 50)
  const q3 = calculatePercentile(times, 75)
  
  // Coeficiente de Variación
  const cv = (stdDev / mean) * 100

  return {
    mean: mean.toFixed(2) + ' min',
    median: median.toFixed(2) + ' min',
    mode,
    stdDev: stdDev.toFixed(2) + ' min',
    variance: variance.toFixed(2),
    range: range.toFixed(2) + ' min',
    min: times[0].toFixed(2) + ' min',
    max: times[times.length - 1].toFixed(2) + ' min',
    q1: q1.toFixed(2) + ' min',
    q2: q2.toFixed(2) + ' min',
    q3: q3.toFixed(2) + ' min',
    cv: cv.toFixed(2) + '%'
  }
}

export function calculateAverageByCategory(bugs, category) {
  const grouped = {}
  
  bugs.forEach(bug => {
    const key = bug[category]
    if (!grouped[key]) {
      grouped[key] = { sum: 0, count: 0 }
    }
    grouped[key].sum += bug.timeMinutes
    grouped[key].count++
  })
  
  const labels = Object.keys(grouped)
  const values = labels.map(label => grouped[label].sum / grouped[label].count)
  
  return { labels, values }
}

export function createHistogramBins(bugs, numBins = 8) {
  if (bugs.length === 0) return { labels: [], frequencies: [] }
  
  const times = bugs.map(b => b.timeMinutes)
  const min = Math.min(...times)
  const max = Math.max(...times)
  const binWidth = (max - min) / numBins || 1
  
  const bins = Array(numBins).fill(0)
  const labels = []
  
  for (let i = 0; i < numBins; i++) {
    const binStart = min + (i * binWidth)
    const binEnd = min + ((i + 1) * binWidth)
    labels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`)
  }
  
  times.forEach(value => {
    let binIndex = Math.floor((value - min) / binWidth)
    if (binIndex >= numBins) binIndex = numBins - 1
    bins[binIndex]++
  })
  
  return { labels, frequencies: bins }
}
