# 🌱 Clasificador de Cultivos — FastAPI + ML

Aplicación web para recomendar cultivos a partir de condiciones agronómicas del suelo, usando modelos de Machine Learning entrenados con el **Crop Recommendation Dataset**.

## Modelos disponibles

| Modelo | Archivo |
|---|---|
| Maquina de Soporte Vectorial | `models/modelCropSVM.pkl` |
| Bosque Aleatorio | `models/modelCRopRF.pkl` |

## Características de entrada

| Variable | Descripción |
|---|---|
| N | Nitrógeno en el suelo |
| P | Fósforo en el suelo |
| K | Potasio en el suelo |
| temperature | Temperatura (°C) |
| humidity | Humedad relativa (%) |
| ph | pH del suelo |
| rainfall | Precipitación (mm) |

## Estructura del proyecto

```
ClasificadorWeb/
├── main.py          # API FastAPI
├── .gitignore
├── README.md
└── routers/
    └── ClasificadorWeb_router.py
└── schemas/
    └── ClasificadorWeb_schema.py
└── static/
    ├── index.html   # Interfaz web
    ├── style.css
    └── script.js
└── models/
    ├── modelCropSVM.pkl
    └── modelCropRF.pkl
```

## Instalación y uso

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd <nombre-del-repo>

# 2. Crear entorno virtual
python -m venv venv
conda create -n entornoNombre # Linux / Mac
venv\Scripts\activate         # Windows

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Levantar el servidor
uvicorn main:app --reload
```

Abrir en el navegador: [http://localhost:8000](http://localhost:8000)
