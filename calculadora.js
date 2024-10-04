// Función para convertir strings a float (equivalente a convertir_float en Python)
function convertirFloat(valor) {
    if (typeof valor === 'string') {
      valor = valor.replace(',', '.');
    }
    let result = parseFloat(valor);
    return isNaN(result) ? null : result;
  }
  
  // Función para realizar los cálculos (equivalente a calcular en Python)
  function calcular(zona, metrosTerreno, data) {
    let dataZona = data.filter(row => row.ZONA === zona);
    if (dataZona.length === 0) {
      return "Zona no encontrada";
    }
  
    let fos_pb = convertirFloat(dataZona[0]["FOS PB"]);
    let plantaBaja = fos_pb ? metrosTerreno * fos_pb : "no info";
  
    let fos_pa = convertirFloat(dataZona[0]["FOS Planta Alta"]);
    let plantaAlta = fos_pa ? metrosTerreno * fos_pa : "no info";
  
    let fot_max = convertirFloat(dataZona[0]["FOT max total"]);
    let construccionTotal = fot_max ? metrosTerreno * fot_max : "no info";
  
    let tue_c_sc = convertirFloat(dataZona[0]["TUE C/sc cada X mts2 de terreno "]);
    let unidadesCloacal = tue_c_sc ? metrosTerreno / tue_c_sc : "no info";
  
    let tue_s_sc = convertirFloat(dataZona[0]["TUE S/sc cada X mts2 de terreno"]);
    let unidadesSinCloacal = tue_s_sc ? metrosTerreno / tue_s_sc : "no info";
  
    let alturaMaxima = dataZona[0]["Altura máxima (m)"];
    let alturaRetiro = dataZona[0]["Altura máxima con retiro voluntario de frente (m)"] || "no info";
    let planoLimite = dataZona[0]["Plano Límite (m)"];
    let planoRetiro = dataZona[0]["Plano límite con retiro voluntario de frente (m)"] || "no info";
  
    return {
      'Planta baja (m²)': plantaBaja,
      'Planta alta (m²)': plantaAlta,
      'Construcción total (m²)': construccionTotal,
      'Unidades con servicio cloacal': unidadesCloacal,
      'Unidades sin servicio cloacal': unidadesSinCloacal,
      'Altura máxima permitida (m)': alturaMaxima,
      'Altura máxima con retiro voluntario (m)': alturaRetiro,
      'Plano límite (m)': planoLimite,
      'Plano límite con retiro voluntario (m)': planoRetiro
    };
  }
  