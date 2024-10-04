// 1. Cargar y procesar el archivo CSV
const csvFilePath = 'datosfinales.csv';
let parsedData = [];

// Cargar el archivo CSV
fetch(csvFilePath)
    .then(response => response.text())
    .then(data => {
        parsedData = Papa.parse(data, { header: true }).data;
        console.log('Datos CSV cargados:', parsedData);
        
        // Obtener las zonas únicas y llenar el select
        const zonas = [...new Set(parsedData.map(item => item.ZONA))]; // Obtener zonas únicas
        llenarSelectZonas(zonas); // Llamar a la función para llenar el select
    })
    .catch(error => {
        console.error('Error al cargar el CSV:', error);
    });

// 2. Función para llenar el select de zonas
function llenarSelectZonas(zonas) {
    const zonaSelect = document.getElementById('zona'); // Asegúrate de que el ID sea correcto
    zonaSelect.innerHTML = ''; // Limpiar opciones anteriores
    
    zonas.forEach(zona => {
        const option = document.createElement('option');
        option.value = zona; // Valor que se envía al seleccionar
        option.textContent = zona; // Texto que se muestra en el select
        zonaSelect.appendChild(option);
    });
}

// 3. Funciones auxiliares para los cálculos
function convertir_float(valor) {
    if (typeof valor === 'string') {
        valor = valor.replace(',', '.');
    }
    try {
        return parseFloat(valor);
    } catch (error) {
        return null;
    }
}

// 4. Función principal de cálculo
function calcular(zona, metros_terreno) {
    const data_zona = parsedData.find(row => row['ZONA'] === zona);
    if (!data_zona) {
        return 'Zona no encontrada';
    }

    const fos_pb = convertir_float(data_zona['FOS PB']);
    const planta_baja = fos_pb !== null ? metros_terreno * fos_pb : 'no info';

    const fos_pa = convertir_float(data_zona['FOS Planta Alta']);
    const planta_alta = fos_pa !== null ? metros_terreno * fos_pa : 'no info';

    const fot_max = convertir_float(data_zona['FOT max total']);
    const construccion_total = fot_max !== null ? metros_terreno * fot_max : 'no info';

    const tue_c_sc = convertir_float(data_zona['TUE C/sc cada X mts2 de terreno ']);
    const unidades_cloacal = tue_c_sc !== null ? metros_terreno / tue_c_sc : 'no info';

    const tue_s_sc = convertir_float(data_zona['TUE S/sc cada X mts2 de terreno']);
    const unidades_sin_cloacal = tue_s_sc !== null ? metros_terreno / tue_s_sc : 'no info';

    const altura_maxima = data_zona['Altura máxima (m)'];
    const altura_retiro = data_zona['Altura máxima con retiro voluntario de frente (m)'] || 'no info';
    const plano_limite = data_zona['Plano Límite (m)'];
    const plano_retiro = data_zona['Plano límite con retiro voluntario de frente (m)'] || 'no info';

    const resultados = {
        'Planta baja (m²)': planta_baja,
        'Planta alta (m²)': planta_alta,
        'Construcción total (m²)': construccion_total,
        'Unidades con servicio cloacal': unidades_cloacal,
        'Unidades sin servicio cloacal': unidades_sin_cloacal,
        'Altura máxima permitida (m)': altura_maxima,
        'Altura máxima con retiro voluntario (m)': altura_retiro,
        'Plano límite (m)': plano_limite,
        'Plano límite con retiro voluntario (m)': plano_retiro
    };

    return resultados;
}
// 5. Función crear PDF

function crear_pdf(resultadosGlobales, zona, metros) {
    const { jsPDF } = window.jspdf; // Asegúrate de haber incluido la biblioteca jsPDF en tu HTML
    const doc = new jsPDF();

    doc.text(`Resultados para la zona: ${zona}`, 10, 10);
    doc.text(`Metros cuadrados: ${metros}`, 10, 20);

    let y = 30; // Posición inicial en el eje Y

    // Usar la variable resultadosGlobales para obtener los resultados
    for (const clave in resultadosGlobales) {
        if (resultadosGlobales.hasOwnProperty(clave)) {
            doc.text(`${clave}: ${resultadosGlobales[clave]}`, 10, y);
            y += 10; // Espaciado entre líneas
        }
    }

    // Descarga el PDF
    doc.save(`resultados_zona_${zona}.pdf`);
}


// Variable global para almacenar resultados
let resultadosGlobales = {}; // Variable para almacenar resultados globales

// 5. Interfaz interactiva
function initApp() {
    const zonaSelect = document.getElementById('zona');
    const metrosInput = document.getElementById('metros');
    const calcularBtn = document.getElementById('calcular');
    const resultadosDiv = document.getElementById('resultados');
    const descargarPdfBtn = document.getElementById('descargar-pdf');

    calcularBtn.addEventListener('click', () => {
        const zona = zonaSelect.value;
        const metros = parseFloat(metrosInput.value);
        event.preventDefault(); // Previene el envío del formulario
        // Calcular los resultados y almacenarlos en resultadosGlobales
        resultadosGlobales = calcular(zona, metros);
        console.log('Resultados:', resultadosGlobales);

        // Mostrar resultados en pantalla
        resultadosDiv.innerHTML = '';
        for (const clave in resultadosGlobales) {
            if (resultadosGlobales.hasOwnProperty(clave)) {
                resultadosDiv.innerHTML += `<p><strong>${clave}:</strong> ${resultadosGlobales[clave]}</p>`;
            }
        }
    });

    // Función para descargar PDF
    descargarPdfBtn.addEventListener('click', () => {
        if (Object.keys(resultadosGlobales).length > 0) {
            crear_pdf(resultadosGlobales, zonaSelect.value, metrosInput.value);
        } else {
            alert('Por favor, primero realiza un cálculo.');
        }
    });
}


// Inicializar la app cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);
