Papa.parse("datosfinales.csv", {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data;
      // Aquí puedes manipular los datos y poblar el dropdown de zonas
      let zonaSelect = document.getElementById('Zona');
      data.forEach(row => {
        let option = document.createElement('option');
        option.value = row.ZONA;
        option.text = row.ZONA;
        zonaSelect.appendChild(option);
      });
    }
  });
  