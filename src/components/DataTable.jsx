import { exportToCSV, exportToJSON } from '../utils/export'

function DataTable({ bugs, onDelete, onClear, onGenerateTestData }) {
  const formatDate = (isoString) => {
    const date = new Date(isoString)
    const pad = (n) => String(n).padStart(2, '0')
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  const handleDelete = (id) => {
    if (confirm('¿Está seguro de eliminar este registro?')) {
      onDelete(id)
    }
  }

  return (
    <div className="table-container">
      <h3>📋 Tabla de Datos Registrados</h3>
      <div className="table-actions">
        <button className="btn btn-success" onClick={onGenerateTestData}>
            Generar Datos de Prueba
        </button>
        <button className="btn btn-export" onClick={() => exportToCSV(bugs)}>
            Exportar CSV
        </button>
        <button className="btn btn-export" onClick={() => exportToJSON(bugs)}>
            Exportar JSON
        </button>
        <button className="btn btn-danger" onClick={onClear}>
            Limpiar Datos
        </button>
      </div>
      
      <table id="dataTable">
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha/Hora</th>
            <th>Tiempo (min)</th>
            <th>Tipo</th>
            <th>Complejidad</th>
            <th>Documentación</th>
            <th>Hora del Día</th>
            <th>Proyecto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {bugs.length === 0 ? (
            <tr className="empty-state">
              <td colSpan="9">No hay bugs registrados aún. ¡Inicia el cronómetro para registrar tu primer bug!</td>
            </tr>
          ) : (
            bugs.map((bug, index) => (
              <tr key={bug.id}>
                <td>{index + 1}</td>
                <td>{formatDate(bug.timestamp)}</td>
                <td><strong>{bug.timeMinutes}</strong></td>
                <td>{bug.type}</td>
                <td>{bug.complexity}/5</td>
                <td>{bug.documentation}</td>
                <td>{bug.timeOfDay}</td>
                <td>{bug.project}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(bug.id)}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
