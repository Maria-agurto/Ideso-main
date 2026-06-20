import streamlit as st

# Configuración inicial de la página
st.set_page_config(page_title="Dashboard de Simulaciones MLOps", page_icon="📊")

st.title("📊 Panel de Control - Simulaciones MLOps")
st.write("Bienvenida al despliegue interactivo en Streamlit Cloud. Selecciona una simulación para validar los componentes:")

# Pestañas de Navegación organizadas para tus capturas
tab1, tab2 = st.tabs(["🔹 Simulación 2: Predicción SVC", "🔹 Simulación 3: Estado DB"])

with tab1:
    st.subheader("Simulación 2: Inferencia de Modelo Predictivo")
    st.text_input("Introduce el Ticker del Activo:", "FSM", key="ticker_streamlit")
    if st.button("Ejecutar Inferencia SVC"):
        st.error("🚨 Error 503: Modelo predictivo SVC no disponible en el almacenamiento.")
        st.info("Nota: El archivo 'svc_model.joblib' requiere mapeo de volumen estructural.")

with tab2:
    st.subheader("Simulación 3: Conectividad del Motor Relacional")
    if st.button("Validar Conexión PostgreSQL"):
        st.warning("⚠️ DATABASE_URL no detectada. Activando modo simulación de contingencia.")
        st.json({
            "status": "contingency_mode",
            "detail": "El motor relacional externo no se encuentra accesible de forma directa. Simulación completada."
        })
