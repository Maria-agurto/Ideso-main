import time
import pandas as pd
import yfinance as yf
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Habilitar CORS para conectar de forma segura con tu frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SIMULACIÓN 3: Middleware para monitoreo de inactividad (Cold Starts) ---
@app.middleware("http")
async def log_startup_latency(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    latency = time.time() - start_time
    if latency > 15.0:
        # Registro crítico ante latencias extremas producidas por el reinicio del contenedor
        print(f"ALERTA: Cold start detectado. Latencia de arranque: {latency:.2f} segundos.")
    return response

@app.get("/")
def read_root():
    return {"status": "healthy", "message": "InvestAI Backend de la Semana 11 está corriendo!"}

# --- SIMULACIÓN 2: API de yfinance para retornar cotizaciones en formato JSON ---
@app.get("/api/mercado/{ticker}")
async def get_market_data(ticker: str):
    # Lista oficial de los 5 tickers de empresas mineras de tu proyecto
    valid_tickers =
    
    ticker_upper = ticker.upper()
    if ticker_upper not in valid_tickers:
        raise HTTPException(status_code=400, detail="Símbolo bursátil no compatible en el SPBI.")
    try:
        # Descarga real de datos históricos desde Yahoo Finance
        data = yf.download(ticker_upper, period="1mo", interval="1d")
        if data.empty:
            raise HTTPException(status_code=404, detail="No se recuperaron datos de Yahoo Finance.")
        
        # Evitar errores de encabezados dobles (MultiIndex) en la versión de yfinance de 2026
        if isinstance(data.columns, pd.MultiIndex):
            data.columns = data.columns.get_level_values(0)
        
        # Formatear el JSON exacto con el contrato de datos requerido por tu frontend
        response_data = {
            "ticker": ticker_upper,
            "dates": [str(d.date()) for d in data.index],
            "close": data['Close'].values.flatten().tolist(),
            "volume": data['Volume'].values.flatten().tolist()
        }
        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fallo en la ingesta: {str(e)}")

# --- ENDPOINT PARA SIMULACIÓN 4: Verificación de salud del servidor ---
@app.get("/api/salud")
def health_check():
    return {"status": "healthy", "platform": "Render"}
