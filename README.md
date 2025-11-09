# 📊 Bug Tracking & Statistical Analysis Tool

Una herramienta web diseñada para registrar y analizar estadísticamente el tiempo de resolución de bugs durante el desarrollo de software. Proyecto desarrollado como parte del curso de Estadística y Probabilidad en la Universidad Autónoma del Cauca.

![GitHub](https://img.shields.io/badge/license-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 🎯 Objetivo del Proyecto

Determinar qué factores influyen significativamente en el tiempo de resolución de bugs durante el desarrollo de proyectos de software mediante análisis estadístico descriptivo y visualizaciones interactivas.

## ✨ Características

### 📝 Registro de Datos
- **Cronómetro integrado** con funciones de inicio, pausa y detener
- Captura automática del tiempo de resolución en minutos
- Formulario completo para registrar características de cada bug:
  - Tipo de bug (Frontend, Backend, Lógica, Base de Datos)
  - Complejidad percibida (escala 1-5)
  - Consulta de documentación (Sí/No)
  - Hora del día (Mañana, Tarde, Noche)
  - Proyecto asociado
  - Descripción opcional

### 📈 Análisis Estadístico

La herramienta calcula automáticamente:
- **Media (μ)** - Promedio de tiempos de resolución
- **Mediana** - Valor central de la distribución
- **Moda** - Valor más frecuente
- **Desviación Estándar (σ)** - Medida de dispersión
- **Varianza (σ²)** - Variabilidad de los datos
- **Cuartiles (Q1, Q2, Q3)** - Distribución en cuartos
- **Rango** - Diferencia entre máximo y mínimo
- **Coeficiente de Variación** - Variabilidad relativa

### 📊 Visualizaciones Interactivas

Gráficos generados con Chart.js:
1. **Histograma** - Distribución de frecuencias de tiempos
2. **Gráfico de Barras** - Tiempo promedio por tipo de bug
3. **Gráfico de Línea** - Correlación complejidad vs tiempo
4. **Gráfico Circular** - Comparación documentación Sí/No
5. **Gráfico de Barras** - Productividad por hora del día
6. **Scatter Plot** - Dispersión complejidad-tiempo
7. **Gráfico Polar** - Distribución por proyecto

### 💾 Gestión de Datos
- Almacenamiento local persistente (localStorage)
- Exportación a CSV para análisis en Excel/Python
- Exportación a JSON para procesamiento programático
- Tabla interactiva con todos los registros
- Opción de eliminar registros individuales

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura de la aplicación
- **CSS3** - Diseño profesional estilo GitHub Dark
- **JavaScript (Vanilla)** - Lógica de la aplicación
- **Chart.js** - Librería para visualizaciones
- **LocalStorage API** - Persistencia de datos

## 🚀 Instalación y Uso

### Opción 1: Uso Directo

1. Clona el repositorio:
```bash
git clone https://github.com/juanluligo/Tracking-de-bugs.git
cd Tracking-de-bugs
```

2. Abre `index.html` en tu navegador favorito

### Opción 2: Servidor Local

1. Con Python:
```bash
python -m http.server 8080
```

2. Con Node.js (http-server):
```bash
npx http-server -p 8080
```

3. Accede a `http://localhost:8080`

## 📖 Guía de Uso

### Registrar un Bug

1. **Inicia el cronómetro** cuando comiences a trabajar en un bug
2. **Pausa** si necesitas hacer una pausa (opcional)
3. **Detén** el cronómetro cuando hayas resuelto el bug
4. **Completa el formulario** con las características del bug
5. **Guarda** el registro

### Analizar los Datos

- Las **estadísticas descriptivas** se actualizan automáticamente
- Los **gráficos** se regeneran con cada nuevo registro
- **Exporta los datos** cuando hayas alcanzado la muestra deseada (mínimo 30 registros recomendado)

## 🔬 Metodología Estadística

### Variables de Estudio

**Variable Dependiente:**
- Tiempo de resolución (cuantitativa continua, en minutos)

**Variables Independientes:**
- Tipo de bug (cualitativa nominal)
- Complejidad percibida (cualitativa ordinal)
- Consulta de documentación (cualitativa nominal)
- Hora del día (cualitativa nominal)
- Proyecto (cualitativa nominal)

### Hipótesis

- **H1:** El tipo de bug influye significativamente en el tiempo de resolución
- **H2:** Existe correlación positiva entre complejidad percibida y tiempo de resolución
- **H3:** Consultar documentación reduce el tiempo promedio de resolución
- **H4:** La productividad varía según la hora del día

## 📁 Estructura del Proyecto

```
Tracking-de-bugs/
│
├── index.html              # Estructura HTML principal
├── stylestadistica.css     # Estilos profesionales
├── script.js               # Lógica de la aplicación
└── README.md               # Este archivo
```

## 🎨 Diseño

El diseño está inspirado en GitHub Dark Theme, proporcionando:
- Interfaz moderna y profesional
- Alta legibilidad con contraste adecuado
- Diseño responsive para móviles y tablets
- Animaciones sutiles y transiciones suaves
- Componentes interactivos con feedback visual

## 📊 Análisis Posterior

Los datos exportados pueden ser analizados con:
- **Python** (pandas, numpy, scipy, matplotlib, seaborn)
- **R** (ggplot2, dplyr)
- **Excel** (tablas dinámicas, gráficos)
- **SPSS** o **Minitab** para análisis estadístico avanzado

### Ejemplo de Análisis en Python

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Cargar datos
df = pd.read_csv('bugs_estadistica.csv')

# Análisis básico
print(df.describe())

# Prueba ANOVA
from scipy import stats
groups = [df[df['Tipo'] == tipo]['Tiempo(min)'] for tipo in df['Tipo'].unique()]
f_stat, p_value = stats.f_oneway(*groups)
print(f'ANOVA: F={f_stat}, p={p_value}')

# Visualización
sns.boxplot(data=df, x='Tipo', y='Tiempo(min)')
plt.show()
```

## 👥 Autores

- **Juan Camilo Luligo** - Ingeniería de Software
- **Eduardo Galvis** - Ingeniería de Software

**Universidad Autónoma del Cauca**  
Facultad de Ingeniería Electrónica y Telecomunicaciones  
Programa de Ingeniería de Software  
Curso: Estadística y Probabilidad  
Docente: Valentina Arciniegas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Notas Importantes

- Se recomienda un mínimo de **30 registros** para análisis estadístico confiable
- Los datos se almacenan localmente en tu navegador
- Exporta regularmente tus datos para evitar pérdidas
- La aplicación funciona completamente offline después de la carga inicial

## 🐛 Reporte de Bugs

¿Encontraste un bug? Por favor abre un [issue](https://github.com/juanluligo/Tracking-de-bugs/issues) describiendo:
- El comportamiento esperado
- El comportamiento actual
- Pasos para reproducir el error
- Capturas de pantalla (si aplica)

## 📞 Contacto

Para preguntas o sugerencias, puedes contactarnos a través de:
- GitHub Issues
- Email institucional Universidad Autónoma del Cauca

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!

**Desarrollado con ❤️ para el análisis estadístico de procesos de desarrollo de software**
