import { useMemo } from 'react'
import { calculateStatistics } from '../utils/statistics'

function Statistics({ bugs }) {
  const stats = useMemo(() => calculateStatistics(bugs), [bugs])
  
  const totalBugs = bugs.length
  const avgTime = totalBugs > 0 
    ? (bugs.reduce((sum, bug) => sum + bug.timeMinutes, 0) / totalBugs).toFixed(2) 
    : '0'
  const progress = Math.min((totalBugs / 30) * 100, 100).toFixed(0)

  return (
    <section className="stats-section">
      <div className="stats-header">
        <h2>📊 Estadísticas y Datos Registrados</h2>
        <div className="stats-summary">
          <div className="stat-card">
            <span className="stat-number">{totalBugs}</span>
            <span className="stat-label">Bugs Registrados</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{avgTime}</span>
            <span className="stat-label">Tiempo Promedio (min)</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{progress}%</span>
            <span className="stat-label">Progreso (Meta: 30)</span>
          </div>
        </div>
      </div>

      <div className="analysis-section">
        <h3>📈 Análisis Estadístico Descriptivo</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-title">Media (μ)</span>
            <span className="stat-value">{stats.mean}</span>
          </div>
          <div className="stat-item">
            <span className="stat-title">Mediana</span>
            <span className="stat-value">{stats.median}</span>
          </div>
          <div className="stat-item">
            <span className="stat-title">Moda</span>
            <span className="stat-value">{stats.mode}</span>
          </div>
          <div className="stat-item">
            <span className="stat-title">Desv. Estándar (σ)</span>
            <span className="stat-value">{stats.stdDev}</span>
          </div>
          <div className="stat-item">
            <span className="stat-title">Varianza (σ²)</span>
            <span className="stat-value">{stats.variance}</span>
          </div>
          <div className="stat-item">
            <span className="stat-title">Rango</span>
            <span className="stat-value">{stats.range}</span>
          </div>
          <div className="stat-item">
            <span className="stat-title">Mínimo</span>
            <span className="stat-value">{stats.min}</span>
          </div>
          <div className="stat-item">
            <span className="stat-title">Máximo</span>
            <span className="stat-value">{stats.max}</span>
          </div>
          <div className="stat-item">
            <span className="stat-title">Q1 (Cuartil 1)</span>
            <span className="stat-value">{stats.q1}</span>
          </div>
          <div className="stat-item">
            <span className="stat-title">Q2 (Cuartil 2)</span>
            <span className="stat-value">{stats.q2}</span>
          </div>
          <div className="stat-item">
            <span className="stat-title">Q3 (Cuartil 3)</span>
            <span className="stat-value">{stats.q3}</span>
          </div>
          <div className="stat-item">
            <span className="stat-title">Coef. Variación</span>
            <span className="stat-value">{stats.cv}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Statistics
