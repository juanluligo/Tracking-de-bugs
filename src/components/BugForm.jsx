import { useState, useEffect } from 'react'

function BugForm({ resolutionTime, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    type: '',
    complexity: '',
    documentation: '',
    timeOfDay: '',
    project: '',
    description: ''
  })

  useEffect(() => {
    // Auto-detectar hora del día
    const hour = new Date().getHours()
    let timeOfDay = 'Noche'
    if (hour >= 6 && hour < 12) timeOfDay = 'Mañana'
    else if (hour >= 12 && hour < 18) timeOfDay = 'Tarde'
    
    setFormData(prev => ({ ...prev, timeOfDay }))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      type: formData.type,
      complexity: parseInt(formData.complexity),
      documentation: formData.documentation,
      timeOfDay: formData.timeOfDay,
      project: formData.project,
      description: formData.description.trim()
    })
  }

  return (
    <section className="form-section">
      <h2>📝 Registro de Bug</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group full-width">
            <label>⏱ Tiempo de Resolución</label>
            <input type="text" value={resolutionTime} readOnly className="readonly-input" />
          </div>

          <div className="form-group">
            <label htmlFor="type">🐛 Tipo de Bug *</label>
            <select name="type" value={formData.type} onChange={handleChange} required>
              <option value="">Seleccionar...</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Logica">Lógica</option>
              <option value="BaseDatos">Base de Datos</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="complexity">📊 Complejidad Percibida (1-5) *</label>
            <select name="complexity" value={formData.complexity} onChange={handleChange} required>
              <option value="">Seleccionar...</option>
              <option value="1">1 - Muy Fácil</option>
              <option value="2">2 - Fácil</option>
              <option value="3">3 - Moderado</option>
              <option value="4">4 - Difícil</option>
              <option value="5">5 - Muy Difícil</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="documentation">📚 ¿Consultó Documentación? *</label>
            <select name="documentation" value={formData.documentation} onChange={handleChange} required>
              <option value="">Seleccionar...</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="timeOfDay">🕐 Hora del Día *</label>
            <select name="timeOfDay" value={formData.timeOfDay} onChange={handleChange} required>
              <option value="">Seleccionar...</option>
              <option value="Mañana">Mañana (6:00 - 11:59)</option>
              <option value="Tarde">Tarde (12:00 - 17:59)</option>
              <option value="Noche">Noche (18:00 - 5:59)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="project">💻 Proyecto *</label>
            <select name="project" value={formData.project} onChange={handleChange} required>
              <option value="">Seleccionar...</option>
              <option value="amigo-secreto">amigo-secreto</option>
              <option value="sistema-registro">sistema-registro</option>
              <option value="VozSegura">VozSegura</option>
              <option value="tareadiarias">tareadiarias</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">📝 Descripción del Bug (Opcional)</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              rows="3" 
              placeholder="Breve descripción del problema encontrado..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">💾 Guardar Bug</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>❌ Cancelar</button>
        </div>
      </form>
    </section>
  )
}

export default BugForm
