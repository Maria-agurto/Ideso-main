# Usar una imagen oficial de Python ligera
FROM python:3.10-slim

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar el archivo de requisitos e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto que usa Cloud Run de manera dinámica
ENV PORT=8080
EXPOSE 8080

# Comando para arrancar FastAPI con Uvicorn escuchando en todas las interfaces
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
