from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "healthy", "message": "InvestAI Backend de la Semana 11 está corriendo!"}

@app.get("/api/salud")
def health_check():
    return {"status": "healthy", "platform": "Render"}