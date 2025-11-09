// Estado de la aplicación
let timerInterval = null;
let startTime = 0;
let elapsedTime = 0;
let isPaused = false;
let bugs = [];

// Charts
let charts = {
    histogram: null,
    bugType: null,
    complexity: null,
    documentation: null,
    timeOfDay: null,
    scatter: null,
    project: null
};

// Elementos DOM
const timeDisplay = document.getElementById('timeDisplay');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const timerStatus = document.getElementById('timerStatus');
const formSection = document.getElementById('formSection');
const bugForm = document.getElementById('bugForm');
const cancelBtn = document.getElementById('cancelBtn');
const resolutionTimeInput = document.getElementById('resolutionTime');
const tableBody = document.getElementById('tableBody');
const totalBugsSpan = document.getElementById('totalBugs');
const avgTimeSpan = document.getElementById('avgTime');
const progressSpan = document.getElementById('progress');
const exportCSVBtn = document.getElementById('exportCSV');
const exportJSONBtn = document.getElementById('exportJSON');
const clearDataBtn = document.getElementById('clearData');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadBugsFromStorage();
    updateStats();
    updateStatisticalAnalysis();
    renderTable();
    renderCharts();
});

// CRONÓMETRO 

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
stopBtn.addEventListener('click', stopTimer);

function startTimer() {
    if (!timerInterval) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 10);
        
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        stopBtn.disabled = false;
        
        isPaused = false;
        timerStatus.textContent = '🔴 Estado: Grabando...';
        timeDisplay.classList.add('recording');
    }
}

function pauseTimer() {
    if (timerInterval && !isPaused) {
        clearInterval(timerInterval);
        timerInterval = null;
        isPaused = true;
        
        pauseBtn.textContent = '▶️ Reanudar';
        timerStatus.textContent = '⏸️ Estado: Pausado';
        timeDisplay.classList.remove('recording');
    } else if (isPaused) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 10);
        isPaused = false;
        
        pauseBtn.textContent = '⏸️ Pausar';
        timerStatus.textContent = '🔴 Estado: Grabando...';
        timeDisplay.classList.add('recording');
    }
}

function stopTimer() {
    if (timerInterval || isPaused) {
        clearInterval(timerInterval);
        timerInterval = null;
        
        // Mostrar formulario con el tiempo registrado
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        resolutionTimeInput.value = `${minutes} min ${seconds} seg (${(elapsedTime / 60000).toFixed(2)} minutos)`;
        
        formSection.style.display = 'block';
        formSection.scrollIntoView({ behavior: 'smooth' });
        
        // Deshabilitar cronómetro hasta que se guarde o cancele
        startBtn.disabled = true;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
        
        timerStatus.textContent = '⏹️ Estado: Detenido - Complete el formulario';
        timeDisplay.classList.remove('recording');
    }
}

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    
    const hours = Math.floor(elapsedTime / 3600000);
    const minutes = Math.floor((elapsedTime % 3600000) / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const milliseconds = Math.floor((elapsedTime % 1000) / 10);
    
    timeDisplay.textContent = 
        `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

function resetTimer() {
    elapsedTime = 0;
    isPaused = false;
    timeDisplay.textContent = '00:00:00';
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    stopBtn.disabled = true;
    pauseBtn.textContent = '⏸️ Pausar';
    
    timerStatus.textContent = 'Estado: Detenido';
    timeDisplay.classList.remove('recording');
}

// FORMULARIO 

bugForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveBug();
});

cancelBtn.addEventListener('click', () => {
    if (confirm('¿Está seguro de cancelar? Se perderá el tiempo registrado.')) {
        formSection.style.display = 'none';
        bugForm.reset();
        resetTimer();
    }
});

function saveBug() {
    const bug = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        timeMinutes: parseFloat((elapsedTime / 60000).toFixed(2)),
        timeFormatted: resolutionTimeInput.value,
        type: document.getElementById('bugType').value,
        complexity: parseInt(document.getElementById('complexity').value),
        documentation: document.getElementById('documentation').value,
        timeOfDay: document.getElementById('timeOfDay').value,
        project: document.getElementById('project').value,
        description: document.getElementById('description').value.trim()
    };
    
    bugs.push(bug);
    saveBugsToStorage();
    
    // Resetear formulario y cronómetro
    bugForm.reset();
    formSection.style.display = 'none';
    resetTimer();
    
    // Actualizar vista
    updateStats();
    renderTable();
    updateStatisticalAnalysis();
    renderCharts();
    
    // Notificación
    alert(`✅ Bug #${bugs.length} registrado exitosamente!\n\nTiempo: ${bug.timeFormatted}\nTipo: ${bug.type}\nComplejidad: ${bug.complexity}/5`);
}

// ==================== ALMACENAMIENTO ====================

function saveBugsToStorage() {
    localStorage.setItem('bugs_estadistica', JSON.stringify(bugs));
}

function loadBugsFromStorage() {
    const stored = localStorage.getItem('bugs_estadistica');
    if (stored) {
        bugs = JSON.parse(stored);
    }
}

// ==================== ESTADÍSTICAS ====================

function updateStats() {
    const total = bugs.length;
    totalBugsSpan.textContent = total;
    
    if (total > 0) {
        const avgMinutes = bugs.reduce((sum, bug) => sum + bug.timeMinutes, 0) / total;
        avgTimeSpan.textContent = avgMinutes.toFixed(2);
    } else {
        avgTimeSpan.textContent = '0';
    }
    
    const progress = Math.min((total / 30) * 100, 100);
    progressSpan.textContent = `${progress.toFixed(0)}%`;
}

// ==================== TABLA ====================

function renderTable() {
    if (bugs.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-state">
                <td colspan="9">No hay bugs registrados aún. ¡Inicia el cronómetro para registrar tu primer bug!</td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = bugs.map((bug, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${formatDate(bug.timestamp)}</td>
            <td><strong>${bug.timeMinutes}</strong></td>
            <td>${bug.type}</td>
            <td>${bug.complexity}/5</td>
            <td>${bug.documentation}</td>
            <td>${bug.timeOfDay}</td>
            <td>${bug.project}</td>
            <td>
                <button class="delete-btn" onclick="deleteBug(${bug.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function formatDate(isoString) {
    const date = new Date(isoString);
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function deleteBug(id) {
    if (confirm('¿Está seguro de eliminar este registro?')) {
        bugs = bugs.filter(bug => bug.id !== id);
        saveBugsToStorage();
        updateStats();
        updateStatisticalAnalysis();
        renderTable();
        renderCharts();
    }
}

// ==================== ANÁLISIS ESTADÍSTICO ====================

function updateStatisticalAnalysis() {
    if (bugs.length === 0) {
        // Limpiar todos los valores
        const statElements = ['mean', 'median', 'mode', 'stdDev', 'variance', 'range', 'min', 'max', 'q1', 'q2', 'q3', 'cv'];
        statElements.forEach(id => {
            document.getElementById(id).textContent = '-';
        });
        return;
    }

    const times = bugs.map(b => b.timeMinutes).sort((a, b) => a - b);
    
    // Media
    const mean = times.reduce((a, b) => a + b, 0) / times.length;
    document.getElementById('mean').textContent = mean.toFixed(2) + ' min';
    
    // Mediana
    const median = calculateMedian(times);
    document.getElementById('median').textContent = median.toFixed(2) + ' min';
    
    // Moda
    const mode = calculateMode(times);
    document.getElementById('mode').textContent = mode;
    
    // Desviación Estándar
    const variance = times.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / times.length;
    const stdDev = Math.sqrt(variance);
    document.getElementById('stdDev').textContent = stdDev.toFixed(2) + ' min';
    
    // Varianza
    document.getElementById('variance').textContent = variance.toFixed(2);
    
    // Rango
    const range = times[times.length - 1] - times[0];
    document.getElementById('range').textContent = range.toFixed(2) + ' min';
    
    // Mínimo y Máximo
    document.getElementById('min').textContent = times[0].toFixed(2) + ' min';
    document.getElementById('max').textContent = times[times.length - 1].toFixed(2) + ' min';
    
    // Cuartiles
    const q1 = calculatePercentile(times, 25);
    const q2 = calculatePercentile(times, 50);
    const q3 = calculatePercentile(times, 75);
    document.getElementById('q1').textContent = q1.toFixed(2) + ' min';
    document.getElementById('q2').textContent = q2.toFixed(2) + ' min';
    document.getElementById('q3').textContent = q3.toFixed(2) + ' min';
    
    // Coeficiente de Variación
    const cv = (stdDev / mean) * 100;
    document.getElementById('cv').textContent = cv.toFixed(2) + '%';
}

function calculateMedian(sortedArray) {
    const mid = Math.floor(sortedArray.length / 2);
    return sortedArray.length % 2 !== 0 
        ? sortedArray[mid] 
        : (sortedArray[mid - 1] + sortedArray[mid]) / 2;
}

function calculateMode(array) {
    const frequency = {};
    let maxFreq = 0;
    let modes = [];
    
    array.forEach(val => {
        const rounded = Math.round(val * 10) / 10; // Redondear a 1 decimal
        frequency[rounded] = (frequency[rounded] || 0) + 1;
        if (frequency[rounded] > maxFreq) {
            maxFreq = frequency[rounded];
        }
    });
    
    for (let key in frequency) {
        if (frequency[key] === maxFreq) {
            modes.push(parseFloat(key));
        }
    }
    
    if (modes.length === array.length) {
        return 'Sin moda';
    }
    
    return modes.map(m => m.toFixed(1)).join(', ') + ' min';
}

function calculatePercentile(sortedArray, percentile) {
    const index = (percentile / 100) * (sortedArray.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    
    if (lower === upper) {
        return sortedArray[lower];
    }
    
    return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
}

// GRÁFICOS 

function renderCharts() {
    if (bugs.length === 0) {
        // Destruir gráficos existentes
        Object.values(charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        return;
    }

    renderHistogram();
    renderBugTypeChart();
    renderComplexityChart();
    renderDocumentationChart();
    renderTimeOfDayChart();
    renderScatterChart();
    renderProjectChart();
}

function renderHistogram() {
    const ctx = document.getElementById('histogramChart');
    if (charts.histogram) charts.histogram.destroy();
    
    const times = bugs.map(b => b.timeMinutes);
    const bins = createHistogramBins(times, 8);
    
    charts.histogram = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: bins.labels,
            datasets: [{
                label: 'Frecuencia',
                data: bins.frequencies,
                backgroundColor: 'rgba(37, 99, 235, 0.7)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Frecuencia de tiempos de resolución'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: 'Frecuencia'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tiempo de Resolución (min)'
                    }
                }
            }
        }
    });
}

function createHistogramBins(data, numBins) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / numBins;
    
    const bins = Array(numBins).fill(0);
    const labels = [];
    
    for (let i = 0; i < numBins; i++) {
        const binStart = min + (i * binWidth);
        const binEnd = min + ((i + 1) * binWidth);
        labels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
    }
    
    data.forEach(value => {
        let binIndex = Math.floor((value - min) / binWidth);
        if (binIndex >= numBins) binIndex = numBins - 1;
        bins[binIndex]++;
    });
    
    return { labels, frequencies: bins };
}

function renderBugTypeChart() {
    const ctx = document.getElementById('bugTypeChart');
    if (charts.bugType) charts.bugType.destroy();
    
    const typeData = calculateAverageByCategory('type');
    
    charts.bugType = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: typeData.labels,
            datasets: [{
                label: 'Tiempo Promedio (min)',
                data: typeData.values,
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
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Tiempo Promedio (min)'
                    }
                }
            }
        }
    });
}

function renderComplexityChart() {
    const ctx = document.getElementById('complexityChart');
    if (charts.complexity) charts.complexity.destroy();
    
    const complexityData = calculateAverageByCategory('complexity');
    
    charts.complexity = new Chart(ctx, {
        type: 'line',
        data: {
            labels: complexityData.labels,
            datasets: [{
                label: 'Tiempo Promedio (min)',
                data: complexityData.values,
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                borderColor: 'rgba(245, 158, 11, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Tiempo Promedio (min)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Nivel de Complejidad'
                    }
                }
            }
        }
    });
}

function renderDocumentationChart() {
    const ctx = document.getElementById('documentationChart');
    if (charts.documentation) charts.documentation.destroy();
    
    const docData = calculateAverageByCategory('documentation');
    
    charts.documentation = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: docData.labels,
            datasets: [{
                label: 'Tiempo Promedio (min)',
                data: docData.values,
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
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function renderTimeOfDayChart() {
    const ctx = document.getElementById('timeOfDayChart');
    if (charts.timeOfDay) charts.timeOfDay.destroy();
    
    const timeData = calculateAverageByCategory('timeOfDay');
    
    charts.timeOfDay = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: timeData.labels,
            datasets: [{
                label: 'Tiempo Promedio (min)',
                data: timeData.values,
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
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Tiempo Promedio (min)'
                    }
                }
            }
        }
    });
}

function renderScatterChart() {
    const ctx = document.getElementById('scatterChart');
    if (charts.scatter) charts.scatter.destroy();
    
    const scatterData = bugs.map(bug => ({
        x: bug.complexity,
        y: bug.timeMinutes
    }));
    
    charts.scatter = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Bugs',
                data: scatterData,
                backgroundColor: 'rgba(139, 92, 246, 0.6)',
                borderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Complejidad: ${context.parsed.x}, Tiempo: ${context.parsed.y.toFixed(2)} min`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: 6,
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: 'Complejidad Percibida'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Tiempo de Resolución (min)'
                    }
                }
            }
        }
    });
}

function renderProjectChart() {
    const ctx = document.getElementById('projectChart');
    if (charts.project) charts.project.destroy();
    
    const projectData = calculateAverageByCategory('project');
    
    charts.project = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: projectData.labels,
            datasets: [{
                label: 'Tiempo Promedio (min)',
                data: projectData.values,
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
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function calculateAverageByCategory(category) {
    const grouped = {};
    
    bugs.forEach(bug => {
        const key = bug[category];
        if (!grouped[key]) {
            grouped[key] = { sum: 0, count: 0 };
        }
        grouped[key].sum += bug.timeMinutes;
        grouped[key].count++;
    });
    
    const labels = Object.keys(grouped);
    const values = labels.map(label => grouped[label].sum / grouped[label].count);
    
    return { labels, values };
}

// EXPORTACIÓN DATOS REGISRADOS 

exportCSVBtn.addEventListener('click', exportToCSV);
exportJSONBtn.addEventListener('click', exportToJSON);
clearDataBtn.addEventListener('click', clearAllData);

function exportToCSV() {
    if (bugs.length === 0) {
        alert('No hay datos para exportar');
        return;
    }
    
    const headers = ['ID', 'Fecha/Hora', 'Tiempo(min)', 'Tipo', 'Complejidad', 'Documentacion', 'HoraDia', 'Proyecto', 'Descripcion'];
    const rows = bugs.map(bug => [
        bug.id,
        bug.timestamp,
        bug.timeMinutes,
        bug.type,
        bug.complexity,
        bug.documentation,
        bug.timeOfDay,
        bug.project,
        `"${bug.description.replace(/"/g, '""')}"`
    ]);
    
    const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
    
    downloadFile(csv, 'bugs_estadistica.csv', 'text/csv');
}

function exportToJSON() {
    if (bugs.length === 0) {
        alert('No hay datos para exportar');
        return;
    }
    
    const json = JSON.stringify(bugs, null, 2);
    downloadFile(json, 'bugs_estadistica.json', 'application/json');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`✅ Archivo ${filename} descargado exitosamente!`);
}

function clearAllData() {
    if (confirm('⚠️ ¿Está seguro de eliminar TODOS los datos?\n\nEsta acción no se puede deshacer.')) {
        if (confirm('Confirmación final: Se eliminarán ' + bugs.length + ' registros.')) {
            bugs = [];
            saveBugsToStorage();
            updateStats();
            updateStatisticalAnalysis();
            renderTable();
            renderCharts();
            alert('Todos los datos han sido eliminados');
        }
    }
}

// Auto-detectar hora del día al cargar
document.getElementById('timeOfDay').addEventListener('focus', function() {
    if (this.value === '') {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) {
            this.value = 'Mañana';
        } else if (hour >= 12 && hour < 18) {
            this.value = 'Tarde';
        } else {
            this.value = 'Noche';
        }
    }
});
