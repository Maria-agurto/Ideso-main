import time
import traceback
import pandas as pd
import requests
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
    try:
        response = await call_next(request)
    except Exception as e:
        print("--- ERROR DETECTADO EN EL MIDDLEWARE ---")
        traceback.print_exc()
        raise e
    latency = time.time() - start_time
    if latency > 15.0:
        print(f"ALERTA: Cold start detectado. Latencia de arranque: {latency:.2f} segundos.")
    return response

@app.get("/")
def read_root():
    return {"status": "healthy", "message": "InvestAI Backend de la Semana 11 está corriendo!"}

# --- SIMULACIÓN 2: API de yfinance para retornar cotizaciones en formato JSON ---
@app.get("/api/mercado/{ticker}")
async def get_market_data(ticker: str):
    # Lista oficial de los 5 tickers de tu proyecto
    valid_tickers = ("FSM", "VOLCABC1.LM", "ABX.TO", "BVN", "BHP")
    
    ticker_upper = ticker.upper()
    if ticker_upper not in valid_tickers:
        return {
            "error": "Símbolo bursátil no compatible en el SPBI.",
            "tickers_validos": valid_tickers
        }
        
    try:
        # Crear una sesión de solicitudes simulando un navegador real para evitar bloqueos
        session = requests.Session()
        session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        
        # Descarga de datos con try-except interno para compatibilidad de versiones de yfinance
        try:
            data = yf.download(
                ticker_upper, 
                period="1mo", 
                interval="1d", 
                session=session, 
                multi_level_index=False
            )
        except TypeError:
            # Si la versión de yfinance es antigua y no soporta multi_level_index
            data = yf.download(
                ticker_upper, 
                period="1mo", 
                interval="1d", 
                session=session
            )
        
        if data.empty:
            return {
                "error": "No se recuperaron datos de Yahoo Finance.",
                "detail": "El DataFrame retornado está vacío. Es posible que Yahoo Finance esté bloqueando la IP del servidor."
            }
        
        # --- NORMALIZACIÓN ROBUSTA DE COLUMNAS (A prueba de fallos de MultiIndex) ---
        # 1. Si las columnas son MultiIndex, extraemos solo el nivel de tipo de precio (nivel 0)
        if isinstance(data.columns, pd.MultiIndex):
            data.columns = data.columns.get_level_values(0)
        
        # 2. Convertimos los nombres de las columnas a minúsculas y texto plano para evitar KeyErrors
        data.columns = [str(col).lower() for col in data.columns]
        
        # 3. Validamos la presencia de las columnas necesarias
        if 'close' not in data.columns or 'volume' not in data.columns:
            return {
                "error": "Estructura de columnas inválida en yfinance.",
                "columnas_encontradas": list(data.columns),
                "detail": "No se encontraron las columnas necesarias 'close' o 'volume' tras aplanar el DataFrame."
            }
        
        # Formatear el JSON exacto con el contrato de datos requerido por tu frontend
        response_data = {
            "ticker": ticker_upper,
            "dates": [str(d.date()) for d in data.index],
            "close": data['close'].values.flatten().tolist(),
            "volume": data['volume'].values.flatten().tolist()
        }
        return response_data
        
    except Exception as e:
        # Imprime todo el informe detallado del error en tu consola de logs de Render
        print("--- ERROR DETECTADO EN LA INGESTA DE DATOS ---")
        traceback.print_exc()
        return {
            "error": "Fallo interno en el procesamiento de la ingesta.",
            "detail": str(e)
        }

# --- ENDPOINT PARA SIMULACIÓN 4: Verificación de salud del servidor ---
@app.get("/api/salud")
def health_check():
    return {"status": "healthy", "platform": "Render"}
