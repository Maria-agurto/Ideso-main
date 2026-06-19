from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Habilitar CORS para que tus archivos HTML puedan hacer consultas de forma segura
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "healthy", "message": "InvestAI Backend de la Semana 11 está corriendo!"}

@app.get("/api/salud")
def health_check():
    return {"status": "healthy", "platform": "Render"}
