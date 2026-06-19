# InvestAI - Sistema Web Inteligente para Apoyo en Decisiones de Inversión

Este repositorio contiene el diseño y desarrollo de la capa completa de interfaz gráfica de usuario (GUI) y frontend para la plataforma financiera **InvestAI**. El sistema combina investigación aplicada sobre plataformas de IA Generativa y programación asistida por IA para generar código funcional que asiste en decisiones cuantitativas de inversión.

Trabajo desarrollado para el laboratorio de la **Semana 10** del curso **Introducción al Desarrollo de Software (iDeSo)**.

## Institución
* **Universidad**: Universidad Nacional Mayor de San Marcos (UNMSM)
* **Facultad**: Facultad de Ingeniería de Sistemas e Informática (FISI)
* **Semestre**: 2026-I
* **Docente**: Prof. Mg. Ing. Ernesto D. Cancho-Rodríguez, MBA

---

## Integrantes y Roles (Grupo 5)

* **Agurto Chuye María Fernanda** (Código: 25200173)
* **Machaca Ponce Sebastian Emanuel** (Código: 25200159)
* **Porras Cahuana Daniela Alekzya** (Código: 25200161)
* **Cruz Chavez Mariano Abel** (Código: 20200047)
* **Huallpacuna Gutierrez Jean Piero** (Código: 25200049)
* **Cruz Reyes Martín Alejandro** (Código: 25200048)

---

## Estructura del Repositorio y Módulos del Sistema
El frontend está organizado en carpetas independientes para segmentar las funcionalidades del Capítulo 6 del documento normativo:

* ** `modulo-01-autenticacion/`** *(Desarrollado por: María Fernanda Agurto)*
  * [6.1] Interfaz de Autenticación de Usuario: Inicio de sesión, Registro por perfil de inversor, Recuperación de contraseña y Verificación 2FA.
* ** `modulo-02-datos-mercado/`** *(Desarrollado por: Sebastian Emanuel Machaca)*
  * [6.2] Panel de Visualización de Datos del Mercado bursátil y criptográfico mediante gráficos interactivos de velas y volumen.
* ** `modulo-03-predicciones-core/`** *(Desarrollado por: Daniela Alekzya Porras)*
  * [6.3] Predicción de tendencias y subidas con modelos SVM (Semáforos e indicadores BUY/SELL/HOLD).
  * [6.4] Pronóstico de Precios con Redes LSTM (Líneas reales vs. predicción y métricas RMSE).
* ** `modulo-04-nlp-operaciones/`** *(Desarrollado por: Mariano Abel Cruz)*
  * [6.5] Análisis de Noticias Financieras con NLP VADER (Feed con colores de sentimiento).
  * [6.8] Panel de Envío de Señales y colocación de órdenes de compra/venta al Broker.
* ** `modulo-05-estrategias-portafolio/`** *(Desarrollado por: Jean Piero Huallpacuna)*
  * [6.6] Generación de Estrategias de Inversión y diagramas de payoff interactivos para opciones.
  * [6.7] Interfaz de Gestión de Portafolio con distribución de activos (gráfico de dona).
* ** `modulo-06-dashboard-maestro/`** *(Desarrollado por: Martín Alejandro Cruz)*
  * [6.9] Visualización de Resultados - Dashboard Completo integrado (CSS Grid Layout).
  * [6.10] Consola de Control y parametrización de los 16 Modelos de IA del Core.
  * [6.11] Reportes estadísticos de Backtesting cuantitativo con VectorBT.

---

##  Stack Tecnológico Preferido
Las interfaces web se construyeron utilizando el ecosistema nativo recomendado en el Capítulo 7:
* **HTML5 Semántico**: Estructuración limpia de formularios, modales y layouts.
* **CSS3 / Tailwind CSS**: Diseño responsivo adaptado a computadoras y dispositivos móviles.
* **JavaScript (Vanilla)**: Manipulación dinámica del DOM, navegación fluida de pantalla única (SPA) y validación del cliente.
* **Plotly.js / Chart.js**: Despliegue de gráficos financieros e indicadores técnicos interactivos.

---

##  Instrucciones de Ejecución
Al ser una implementación enfocada puramente en la capa frontend nativa (HTML + JS), la visualización del software no requiere dependencias de servidores locales backend:

1. **Clonar** este repositorio Git o descargar el archivo `.zip` del proyecto.
2. Acceder a la rama (*branch*) correspondiente de cada integrante o revisar la recopilación final unificada en la rama `main`.
3. Navegar hacia la carpeta del módulo que desea inspeccionar.
4. Ejecutar el archivo haciendo **doble clic sobre el documento `.html`** para abrir la interfaz en cualquier navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge o Safari).
5. Para verificar la adaptabilidad en entornos móviles, presione la tecla `F12` en el navegador y active la **Herramienta de Inspección de Dispositivo Móvil** (Dimensiones sugeridas: 375x812).
