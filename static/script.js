
const API_URL = 'https://clasificadorweb-backend.onrender.com';

// Mapeo de clases
const CROP_LABELS = {
    0: 'Manzana',
    1: 'Plátano',
    2: 'Frijol negro',
    3: 'Garbanzo',
    4: 'Coco',
    5: 'Café',
    6: 'Algodón',
    7: 'Uva',
    8: 'Yute',
    9: 'Frijol rojo',
    10: 'Lenteja',
    11: 'Maíz',
    12: 'Mango',
    13: 'Frijol polilla',
    14: 'Frijol mungo',
    15: 'Melón',
    16: 'Naranja',
    17: 'Papaya',
    18: 'Guandul',
    19: 'Granada',
    20: 'Arroz',
    21: 'Sandía',
};

// Definiion de las características
const FEATURES = [
    { id: 'N', label: 'Nitrógeno (N)', placeholder: 'ej: 90' },
    { id: 'P', label: 'Fósforo (P)', placeholder: 'ej: 42' },
    { id: 'K', label: 'Potasio (K)', placeholder: 'ej: 43' },
    { id: 'temperatura', label: 'Temperatura (°C)', placeholder: 'ej: 20.8' },
    { id: 'humedad', label: 'Humedad (%)', placeholder: 'ej: 82.0' },
    { id: 'ph', label: 'pH del suelo', placeholder: 'ej: 6.5' },
    { id: 'lluvia', label: 'Lluvia (mm)', placeholder: 'ej: 202.9' },
];

// Recibir las Entradas de los formularios
const grid = document.getElementById('features-grid');
// Y en cada una de ellas mostrar su informacion, un id, una etiqueta y un ejemplo
FEATURES.forEach((f, i) => {
    grid.innerHTML += `
        <div class="field">
          <label for="${f.id}"><span class="feat-num">F${i + 1}</span>${f.label}</label>
          <input type="number" id="${f.id}" name="${f.id}"
                 placeholder="${f.placeholder}" step="any" required/>
        </div>`;
});

const btnSvm = document.getElementById('btn-svm');
const btnRf = document.getElementById('btn-rf');

//Cambiar de modelo
[btnSvm, btnRf].forEach(btn => {
    btn.addEventListener('click', () => {
        btnSvm.classList.toggle('active', btn === btnSvm);
        btnRf.classList.toggle('active', btn === btnRf);
    });
});

//Elementos HTML en variables para hacerlos dinamicos
const predecirBtn = document.getElementById('btn-predict');
const etiquetaBtn = document.getElementById('btn-label');
const panelResultado = document.getElementById('result-panel');
const claseResultado = document.getElementById('result-class');
const spinner = document.getElementById('spinner');
const resultMeta = document.getElementById('result-meta');

//Evento Boton Predecir
predecirBtn.addEventListener('click', async () => {

    // Mapeando y parseando a Flotante cada elemento del formulario
    const caracteristicas = FEATURES.map(f => {
        const v = document.getElementById(f.id).value;
        return v === '' ? null : parseFloat(v);
    });

    //En caso de no pasar algun dato
    if (caracteristicas.some(v => v === null || isNaN(v))) {
        showError('Completa todos los campos antes de predecir.');
        return;
    }

    // Almaceno el modelo seleccionado
    const modelo = document.querySelector('input[name="model"]:checked').value;

    // Para mostrar animacion de Cargando...
    animacionCargando(true);
    panelResultado.style.display = 'none';

    //Hago POST al backend(LA API) con los datos del formulario
    try {
        const respuesta = await fetch(`${API_URL}/predecir`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ modelo, caracteristicas }),
        });

        //Almaceno la respuesta en la variable datos
        const datos = await respuesta.json();

        //Si la respuesta no devuelve ok
        if (!respuesta.ok) {
            throw new Error(datos.detail || 'Error en el servidor');
        }

        resultadoPrediccion(datos);

    } catch (err) {
        showError(err.message);
    } finally {
        animacionCargando(false);
    }
});

//Para mostrar mientras el backend procesa
function animacionCargando(on) {
    predecirBtn.disabled = on;
    spinner.style.display = on ? 'block' : 'none';
    etiquetaBtn.textContent = on ? 'Procesando...' : 'Ejecutar Predicción →';
}

//Para mostrar el resultado de la Prediccion
function resultadoPrediccion(datos) {
    panelResultado.className = 'success';
    const label = CROP_LABELS[datos.prediccion] ?? `Clase ${datos.prediccion}`;
    claseResultado.textContent = label;

    const modelLabel = datos.modelo === 'svm' ? 'SVM' : 'Random Forest';
    let meta = `Modelo: <strong>${modelLabel}</strong> &nbsp;·&nbsp; Clase: <strong>#${datos.prediccion}</strong>`;

    resultMeta.innerHTML = meta;
    panelResultado.style.display = 'block';
}

//Para mostrar error
function showError(msg) {
    panelResultado.className = 'error';
    claseResultado.textContent = 'Error';
    resultMeta.innerHTML = msg;
    panelResultado.style.display = 'block';
}