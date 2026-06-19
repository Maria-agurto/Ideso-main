import time
import random
import datetime
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

# Precios base reales promedio para la simulación de contingencia si Yahoo bloquea la IP
BASE_PRICES = {
    "FSM": 6.50,
    "VOLCABC1.LM": 0.22,
    "ABX.TO": 22.00,
    "BVN": 15.40,
    "BHP": 55.00
}

# --- SIMULACIÓN 3: Middleware para monitoreo de inactividad (Cold Starts) ---
@app.middleware("http")
async def log_startup_latency(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    latency = time.time() - start_time
    if latency > 15.0:
        print(f"ALERTA: Cold start detectado. Latencia de arranque: {latency:.2f} segundos.")
    return response

@app.get("/")
def read_root():
    return {"status": "healthy", "message": "InvestAI Backend de la Semana 11 está corriendo!"}

# --- SIMULACIÓN 2: API de yfinance con fallback inteligente ---
@app.get("/api/mercado/{ticker}")
async def get_market_data(ticker: str):
    # Lista oficial de los 5 tickers de tu proyecto
    valid_tickers = ("FSM", "VOLCABC1.LM", "ABX.TO", "BVN", "BHP")
    
    ticker_upper = ticker.upper()
    if ticker_upper not in valid_tickers:
        raise HTTPException(status_code=400, detail="Símbolo bursátil no compatible en el SPBI.")
    try:
        # Crear una sesión de solicitudes simulando un navegador real para evitar bloqueos
        session = requests.Session()
        session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        
        # Descarga con soporte de contingencia de parámetros de versión
        try:
            data = yf.download(
                ticker_upper, 
                period="1mo", 
                interval="1d", 
                session=session, 
                multi_level_index=False
            )
        except TypeError:
            data = yf.download(
                ticker_upper, 
                period="1mo", 
                interval="1d", 
                session=session
            )
            
        # Si la descarga real funcionó y tiene datos, procesarla
        if not data.empty:
            if isinstance(data.columns, pd.MultiIndex):
                data.columns = data.columns.get_level_values(0)
            
            data.columns = [str(col).lower() for col in data.columns]
            
            # Devolver los datos reales del mercado
            return {
                "ticker": ticker_upper,
                "dates": [str(d.date()) for d in data.index],
                "close": data['close'].values.flatten().tolist(),
                "volume": data['volume'].values.flatten().tolist()
            }
            
    except Exception as e:
        print(f"La descarga real falló. Detalle: {e}. Activando contingencia de datos...")

    # 2. SISTEMA DE CONTINGENCIA: Generación de datos simulados realistas si Yahoo bloquea la IP
    print(f"Yahoo Finance limitó la conexión para {ticker_upper}. Generando datos realistas de contingencia...")
    
    dates = list()
    close_prices = list()
    volumes = list()
    
    base_price = BASE_PRICES.get(ticker_upper, 15.0)
    current_date = datetime.date.today() - datetime.timedelta(days=45)
    price = base_price
    
    # Semilla fija para que los gráficos mantengan consistencia al recargar
    random.seed(hash(ticker_upper))
    
    while len(dates) < 30:
        # Excluir los fines de semana para emular días de transacciones reales
        if current_date.weekday() < 5:
            dates.append(str(current_date))
            pct_change = random.normalvariate(0.001, 0.015)  # Variación diaria realista
            price = round(price * (1 + pct_change), 2)
            close_prices.append(price)
            volumes.append(random.randint(400000, 2500000))
        current_date += datetime.timedelta(days=1)
        
    return {
        "ticker": ticker_upper,
        "dates": dates,
        "close": close_prices,
        "volume": volumes
    }

# --- ENDPOINT PARA SIMULACIÓN 4: Verificación de salud del servidor ---
@app.get("/api/salud")
def health_check():
    return {"status": "healthy", "platform": "Render"}
