function Timer({ timer, onStart, onPause, onStop, showForm }) {
  const getStatus = () => {
    if (showForm) return '⏹️ Estado: Detenido - Complete el formulario'
    if (timer.isPaused) return '⏸️ Estado: Pausado'
    if (timer.isRunning) return '🔴 Estado: Grabando...'
    return 'Estado: Detenido'
  }

  return (
    <section className="timer-section">
      <div className="timer-display">
        <h2>⏱ Cronómetro</h2>
        <div className={`time ${timer.isRunning && !timer.isPaused ? 'recording' : ''}`}>
          {timer.formatTime()}
        </div>
        <div className="timer-controls">
          <button 
            className="btn btn-success" 
            onClick={onStart}
            disabled={timer.isRunning || showForm}
          >
            ▶ Iniciar
          </button>
          <button 
            className="btn btn-warning" 
            onClick={onPause}
            disabled={!timer.isRunning || showForm}
          >
            {timer.isPaused ? '▶ Reanudar' : '⏸ Pausar'}
          </button>
          <button 
            className="btn btn-danger" 
            onClick={onStop}
            disabled={!timer.isRunning || showForm}
          >
            ⏹️ Detener y Registrar
          </button>
        </div>
        <div className="timer-info">
          <span>{getStatus()}</span>
        </div>
      </div>
    </section>
  )
}

export default Timer
