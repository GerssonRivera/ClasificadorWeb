from pydantic import BaseModel


class PeticionPredecir(BaseModel):
    modelo: str  # "svm" | "random_forest"
    caracteristicas: list[float]  # 7 valores numéricos


class RespuestaPredecir(BaseModel):
    modelo: str
    prediccion: int | str