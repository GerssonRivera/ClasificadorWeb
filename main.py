from routers import ClasificadorWeb_router

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import FastAPI
from pathlib import Path

BASE_DIR = Path(__file__).parent


# instancia de FastAPI
app = FastAPI(title="Crop Classifier API")

app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
app.include_router(ClasificadorWeb_router.router)


# Metodo get para mostrar el frontend en la raiz (/)
@app.get("/")
async def index():
    return FileResponse(BASE_DIR / "static" / "index.html")


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://clasificadorweb-frontend.onrender.com",
    ],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)
