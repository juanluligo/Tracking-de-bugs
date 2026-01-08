import { useState } from 'react'
import Header from './components/Header'
import Timer from './components/Timer'
import BugForm from './components/BugForm'
import Statistics from './components/Statistics'
import Charts from './components/Charts'
import DataTable from './components/DataTable'
import Footer from './components/Footer'
import { useBugs } from './hooks/useBugs'
import { useTimer } from './hooks/useTimer'

function App() {
  const [showForm, setShowForm] = useState(false)
  const { bugs, addBug, deleteBug, clearBugs, addTestData } = useBugs()
  const timer = useTimer()

  const handleStopTimer = () => {
    const time = timer.stop()
    if (time > 0) {
      setShowForm(true)
    }
  }

  const handleSaveBug = (bugData) => {
    addBug({
      ...bugData,
      timestamp: new Date().toISOString(),
      timeMinutes: timer.getMinutes(),
      timeFormatted: timer.getFormattedResolution()
    })
    setShowForm(false)
    timer.reset()
    alert(`✅ Bug #${bugs.length + 1} registrado exitosamente!`)
  }

  const handleCancelForm = () => {
    if (confirm('¿Está seguro de cancelar? Se perderá el tiempo registrado.')) {
      setShowForm(false)
      timer.reset()
    }
  }

  const handleGenerateTestData = () => {
    const count = prompt('¿Cuántos bugs de prueba deseas generar? (Recomendado: 30-50)', '35')
    if (count === null) return
    
    const numBugs = parseInt(count)
    if (isNaN(numBugs) || numBugs <= 0) {
      alert('Por favor ingresa un número válido mayor a 0')
      return
    }
    if (numBugs > 100) {
      alert('El máximo recomendado es 100 bugs')
      return
    }
    if (confirm(`Se generarán ${numBugs} bugs de prueba. ¿Continuar?`)) {
      addTestData(numBugs)
      alert(`✅ Se generaron ${numBugs} bugs de prueba!`)
    }
  }

  const handleClearData = () => {
    if (confirm('¿Está seguro de eliminar TODOS los datos?')) {
      if (confirm(`Confirmación final: Se eliminarán ${bugs.length} registros.`)) {
        clearBugs()
        alert('Todos los datos han sido eliminados')
      }
    }
  }

  return (
    <div className="container">
      <Header />
      
      <Timer 
        timer={timer}
        onStart={timer.start}
        onPause={timer.pause}
        onStop={handleStopTimer}
        showForm={showForm}
      />

      {showForm && (
        <BugForm 
          resolutionTime={timer.getFormattedResolution()}
          onSave={handleSaveBug}
          onCancel={handleCancelForm}
        />
      )}

      <Statistics bugs={bugs} />
      
      <Charts bugs={bugs} />
      
      <DataTable 
        bugs={bugs}
        onDelete={deleteBug}
        onClear={handleClearData}
        onGenerateTestData={handleGenerateTestData}
      />

      <Footer />
    </div>
  )
}

export default App
