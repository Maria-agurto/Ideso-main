import os
from fastapi import FastAPI, HTTPException

app = FastAPI(title="API de Simulaciones MLOps - Google Cloud Run")

# Simulación 2: Endpoint de predicción SVC
@app.get("/api/svc/{ticker}")
async def run_svc_inference(ticker: str):
    raise HTTPException(
        status_code=503, 
        detail="Modelo predictivo SVC no disponible en el almacenamiento estructural de Cloud Run."
    )

# Simulación 3: Gestión de errores Postgres Adaptativa
@app.get("/api/db-status")
def check_database_connectivity():
    return {
        "status": "contingency_mode",
        "detail": "El motor relacional externo no se encuentra accesible de forma directa en Cloud Run. Simulación completada."
    }
