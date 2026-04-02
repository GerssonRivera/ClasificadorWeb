from schemas.ClasificadorWeb_schemas import PeticionPredecir, RespuestaPredecir

from fastapi import APIRouter, HTTPException
from pathlib import Path
import pandas as pd
import pickle


router = APIRouter()

# Definir directorio de los modelos
MODELS_DIR = Path(__file__).parent.parent / "models"


# Funcion para cargar los binarios(ReadBinary) de los modelos, con la biblioteca pickle
def cargarModelo(nombreArchivo: str):
    path = MODELS_DIR / nombreArchivo
    if not path.exists():
        raise FileNotFoundError(f"Modelo no encontrado: {path}")
    with open(path, "rb") as f:
        return pickle.load(f)


modelos = {
    "svm": cargarModelo("modelCropSVM.pkl"),
    "random_forest": cargarModelo("modelCropRF.pkl"),
}

nombresCaracteristicas = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]


# Definir el comportamiento al hacer POST en API_URL/predecir
@router.post("/predecir", response_model=RespuestaPredecir)
async def predecir(req: PeticionPredecir):

    # Condicionales para el manejo de excepciones
    # Por ejemplo, si en la peticion, el modelo pasado no existe en modelos
    if req.modelo not in modelos:
        raise HTTPException(
            status_code=400,
            detail=f"El Modelo '{req.modelo}', no existe. Opciones: {list(modelos.keys())}",
        )

    # O si en la peticion se pasan mas de las 7 caracteristicas esperadas
    if len(req.caracteristicas) != 7:
        raise HTTPException(
            status_code=422,
            detail=f"Se esperan 7 características, se recibieron {len(req.caracteristicas)}",
        )

    # Pasar el modelo elegido y los datos requeridos en el formulario
    clasificador = modelos[req.modelo]

    if req.modelo == "svm":
        vectorEntradas = [req.caracteristicas]
    else:
        vectorEntradas = pd.DataFrame(
            [req.caracteristicas], columns=nombresCaracteristicas
        )

    # Almacenar la salida de la prediccion
    prediccion = clasificador.predict(vectorEntradas)[0]

    return RespuestaPredecir(
        modelo=req.modelo,
        prediccion=prediccion,
    )
