# GimDog - Sistema de Registro y Panel de Socios

Aplicación web interactiva desarrollada para la gestión de inscripciones en un centro especializado para mascotas ("GimDog"). Este proyecto forma parte de un portafolio de desarrollo frontend, enfocado en interfaces limpias, experiencia de usuario fluida, diseño responsivo y herramientas reales de exportación de datos.

---

## Características Principales

* **Formulario de Inscripción Dinámico**: Interfaz intuitiva para capturar datos detallados de la mascota (nombre, tamaño, rango etario, nivel de energía, objetivos de entrenamiento, estatus de vacunación, notas médicas) y datos de contacto del tutor.
* **Panel de Administración Protegido (Data View)**: Vista de gestión de registros con acceso restringido mediante credenciales de administrador.
* **Exportación Real a Excel (`.xlsx`)**: Integración con la librería SheetJS para descargar la base de datos activa directamente a una hoja de cálculo profesional.
* **Reporte PDF Optimizado**: Hojas de estilos personalizadas (`@media print`) que fuerzan automáticamente la orientación horizontal (*landscape*), eliminan elementos visuales innecesarios y ajustan celdas largas (como correos electrónicos con saltos de línea automáticos) para garantizar reportes ejecutivos limpios en una sola página.
* **Experiencia Interactiva (Gamificación)**: Animaciones de celebración, efectos de confeti mediante canvas y efectos de sonido al completar con éxito una inscripción.

---

## Stack Tecnológico

* **HTML5**: Estructuración semántica de formularios y tablas de datos.
* **CSS3**: Diseño modular con variables personalizadas (`:root`), Grid/Flexbox y reglas avanzadas para impresión y medios responsivos.
* **JavaScript (Vanilla)**: Lógica de negocio, gestión de estado en memoria volátil y controladores de eventos.
* **Librerías Externas**: 
  * [SheetJS (xlsx)](https://sheetjs.com/) para la exportación de tablas a archivos Excel.

---

## Credenciales de Acceso al Panel de Administración

Para probar las funciones de administración y visualización de datos en el *Data View*:

* **Usuario:** `admin1`
* **Contraseña:** `admin1234`

---

## Estructura del Proyecto

```text
00-GimDog/
│
├── index.html       # Estructura principal, pantallas (Formulario y Data View) y modales
├── styles.css       # Estilos visuales, sistema de colores, animaciones y optimización @media print
└── app.js           # Lógica de validación, registros por defecto, autenticación y exportación SheetJS