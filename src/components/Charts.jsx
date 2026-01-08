import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Bar, Line, Doughnut, Scatter, PolarArea } from 'react-chartjs-2'
import { calculateAverageByCategory, createHistogramBins } from '../utils/statistics'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
)

function Charts({ bugs }) {
  const histogramData = useMemo(() => {
    if (bugs.length === 0) return null
    const bins = createHistogramBins(bugs, 8)
    return {
      labels: bins.labels,
      datasets: [{
        label: 'Frecuencia',
        data: bins.frequencies,
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 2
      }]
    }
  }, [bugs])

  const bugTypeData = useMemo(() => {
    if (bugs.length === 0) return null
    const data = calculateAverageByCategory(bugs, 'type')
    return {
      labels: data.labels,
      datasets: [{
        label: 'Tiempo Promedio (min)',
        data: data.values,
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(168, 85, 247, 0.7)'
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)'
        ],
        borderWidth: 2
      }]
    }
  }, [bugs])

  const complexityData = useMemo(() => {
    if (bugs.length === 0) return null
    const data = calculateAverageByCategory(bugs, 'complexity')
    return {
      labels: data.labels,
      datasets: [{
        label: 'Tiempo Promedio (min)',
        data: data.values,
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    }
  }, [bugs])

  const documentationData = useMemo(() => {
    if (bugs.length === 0) return null
    const data = calculateAverageByCategory(bugs, 'documentation')
    return {
      labels: data.labels,
      datasets: [{
        label: 'Tiempo Promedio (min)',
        data: data.values,
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2
      }]
    }
  }, [bugs])

  const timeOfDayData = useMemo(() => {
    if (bugs.length === 0) return null
    const data = calculateAverageByCategory(bugs, 'timeOfDay')
    return {
      labels: data.labels,
      datasets: [{
        label: 'Tiempo Promedio (min)',
        data: data.values,
        backgroundColor: [
          'rgba(251, 191, 36, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(139, 92, 246, 0.7)'
        ],
        borderColor: [
          'rgba(251, 191, 36, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(139, 92, 246, 1)'
        ],
        borderWidth: 2
      }]
    }
  }, [bugs])

  const scatterData = useMemo(() => {
    if (bugs.length === 0) return null
    return {
      datasets: [{
        label: 'Bugs',
        data: bugs.map(bug => ({ x: bug.complexity, y: bug.timeMinutes })),
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    }
  }, [bugs])

  const projectData = useMemo(() => {
    if (bugs.length === 0) return null
    const data = calculateAverageByCategory(bugs, 'project')
    return {
      labels: data.labels,
      datasets: [{
        label: 'Tiempo Promedio (min)',
        data: data.values,
        backgroundColor: [
          'rgba(239, 68, 68, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(34, 197, 94, 0.6)',
          'rgba(168, 85, 247, 0.6)'
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)'
        ],
        borderWidth: 2
      }]
    }
  }, [bugs])

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Tiempo Promedio (min)' } }
    }
  }

  if (bugs.length === 0) {
    return (
      <div className="charts-section">
        <h3>📈 Visualizaciones Estadísticas</h3>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          No hay datos para mostrar. Registra algunos bugs para ver los gráficos.
        </p>
      </div>
    )
  }

  return (
    <div className="charts-section">
      <h3>📈 Visualizaciones Estadísticas</h3>
      
      <div className="chart-container">
        <h4>Distribución de Tiempo de Resolución (Histograma)</h4>
        {histogramData && <Bar data={histogramData} options={{
          ...barOptions,
          plugins: { legend: { display: false }, title: { display: true, text: 'Frecuencia de tiempos de resolución' } },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 }, title: { display: true, text: 'Frecuencia' } },
            x: { title: { display: true, text: 'Tiempo de Resolución (min)' } }
          }
        }} />}
      </div>

      <div className="charts-row">
        <div className="chart-container half">
          <h4>Tiempo por Tipo de Bug</h4>
          {bugTypeData && <Bar data={bugTypeData} options={barOptions} />}
        </div>
        <div className="chart-container half">
          <h4>Tiempo por Complejidad</h4>
          {complexityData && <Line data={complexityData} options={{
            ...barOptions,
            scales: {
              y: { beginAtZero: true, title: { display: true, text: 'Tiempo Promedio (min)' } },
              x: { title: { display: true, text: 'Nivel de Complejidad' } }
            }
          }} />}
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-container half">
          <h4>Documentación vs Tiempo</h4>
          {documentationData && <Doughnut data={documentationData} options={{
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'bottom' } }
          }} />}
        </div>
        <div className="chart-container half">
          <h4>Tiempo por Hora del Día</h4>
          {timeOfDayData && <Bar data={timeOfDayData} options={barOptions} />}
        </div>
      </div>

      <div className="chart-container">
        <h4>Dispersión: Complejidad vs Tiempo de Resolución</h4>
        {scatterData && <Scatter data={scatterData} options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { type: 'linear', position: 'bottom', min: 0, max: 6, ticks: { stepSize: 1 }, title: { display: true, text: 'Complejidad Percibida' } },
            y: { beginAtZero: true, title: { display: true, text: 'Tiempo de Resolución (min)' } }
          }
        }} />}
      </div>

      <div className="chart-container">
        <h4>Distribución por Proyecto</h4>
        {projectData && <PolarArea data={projectData} options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: { legend: { position: 'bottom' } }
        }} />}
      </div>
    </div>
  )
}

export default Charts
