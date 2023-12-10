let gastos = [];

// Función para generar opciones del select mes
function generarOpcionesSelectMes() {
    let selectMes = document.getElementById("mes");

    meses.forEach(mes => {
        let option = document.createElement("option");
        option.value = mes;
        option.textContent = mes.charAt(0).toUpperCase() + mes.slice(1);

        selectMes.appendChild(option);
    });
}

// Función para generar opciones del select concepto
function generarOpcionesSelectConcepto() {
    let selectConcepto = document.getElementById("concepto");

    conceptos.forEach(concepto => {
        let option = document.createElement("option");
        option.value = concepto;
        option.textContent = concepto.charAt(0).toUpperCase() + concepto.slice(1);

        selectConcepto.appendChild(option);
    });

    selectConcepto.addEventListener('change', function() {
        let nuevoConceptoInput = document.getElementById("nuevo-concepto");
        if (selectConcepto.value === "Otro") {
            nuevoConceptoInput.style.display = "block";
            nuevoConceptoInput.value = ""; // Limpiar el campo si cambia de selección
        } else {
            nuevoConceptoInput.style.display = "none";
        }
    });
}

// Función para agregar un nuevo gasto
function agregarGasto() {
    let mes = document.getElementById("mes").value.trim();
    let conceptoSeleccionado = document.getElementById("concepto").value.trim();
    let monto = parseFloat(document.getElementById("monto").value);

    let concepto;

    if (conceptoSeleccionado === "Otro") {
        document.getElementById("nuevo-concepto").style.display = "block";
        
        let nuevoConcepto = document.getElementById("nuevo-concepto").value.trim();
        if (nuevoConcepto && nuevoConcepto.trim() !== "") {
            concepto = nuevoConcepto.charAt(0).toUpperCase() + nuevoConcepto.slice(1);
        } else {
            mostrarMensaje("Por favor, ingrese un nuevo concepto válido.");
            return;
        }
    } else {
        document.getElementById("nuevo-concepto").style.display = "none";
        concepto = conceptoSeleccionado;
    }

    if (concepto && !isNaN(monto) && monto > 0 && mes) {
        let nuevoGasto = new Gasto(concepto, parseFloat(monto), mes);
        gastos.push(nuevoGasto);

        // Guardar en localStorage
        localStorage.setItem('gastos', JSON.stringify(gastos));

        mostrarGastos();
    } else {
        mostrarMensaje("Por favor, ingrese un monto numérico positivo.");
    }
}

//funcion para mostrar gastos
function mostrarGastos(gastosAMostrar = gastos) {
    let gastosLista = document.getElementById("gastos-lista");
    gastosLista.innerHTML = "";

    let mesas = {}; // Objeto para almacenar las tablas por mes

    gastosAMostrar.forEach(gasto => {
        // Crear una tabla para cada mes si no existe
        if (!mesas[gasto.mes]) {
            mesas[gasto.mes] = document.createElement("div");
            mesas[gasto.mes].classList.add("tabla-mes");

            // Crear la fila del encabezado de la tabla
            let encabezado = document.createElement("div");
            encabezado.classList.add("gasto-item", "header");
            let mesElement = document.createElement("span");
            mesElement.textContent = gasto.mes;
            encabezado.appendChild(mesElement);
            mesas[gasto.mes].appendChild(encabezado);

            // Agregar la nueva tabla al contenedor gastosLista
            gastosLista.appendChild(mesas[gasto.mes]);
        }

        // Crear una nueva fila para cada gasto (excepto para la primera fila con el encabezado)
        let gastoItem = document.createElement("div");
        gastoItem.classList.add("gasto-item");

        // Crear subelementos para concepto y monto
        let conceptoElement = document.createElement("span");
        let montoElement = document.createElement("span");
        let eliminarButton = document.createElement("button");
        eliminarButton.textContent = "X";
        eliminarButton.classList.add("button-eliminar")
        eliminarButton.addEventListener('click', function() {
            eliminarGasto(gasto);
        });
        gastoItem.appendChild(eliminarButton);

        // Establecer el contenido de los subelementos
        conceptoElement.textContent = `${gasto.concepto}`;
        montoElement.textContent = `$${gasto.monto.toFixed(2)}`;

        // Agregar los subelementos al elemento principal
        gastoItem.appendChild(conceptoElement);
        gastoItem.appendChild(montoElement);

        // Agregar el elemento principal a la tabla del mes correspondiente
        mesas[gasto.mes].appendChild(gastoItem);
    });

    // Calcular y mostrar el total de gastos por cada tabla de mes
    Object.keys(mesas).forEach(mes => {
        let totalGastosPorMes = Array.from(mesas[mes].querySelectorAll('.gasto-item:not(.header)'))
            .reduce((total, item) => {
                let montoElement = item.querySelector('span:last-child');
                if (montoElement) {
                    let montoText = montoElement.textContent;
                    let monto = parseFloat(montoText.replace('$', '')) || 0;
                    return total + monto;
                }
                return total;
            }, 0);

        // Crear la fila del total de gastos por mes
        let totalMesElement = document.createElement("div");
        totalMesElement.classList.add("gasto-item", "total-mes");
        totalMesElement.textContent = `Total: $${totalGastosPorMes.toFixed(2)}`;

        // Agregar el total de gastos por mes al final de la tabla actual
        mesas[mes].appendChild(totalMesElement);
    });
}

//funcion para eliminar gasto
function eliminarGasto(gasto) {
    // Encuentra el índice del gasto
    let index = gastos.indexOf(gasto);

    if (index !== -1) {
        gastos.splice(index, 1);
    }
    localStorage.setItem('gastos', JSON.stringify(gastos));

    mostrarGastos();
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje) {
    Swal.fire({
        text: mensaje,
        icon: 'warning',
        timer: 5000,
        timerProgressBar: true,
    });
}

// Función para cargar los gastos desde json local
async function cargarGastosDesdeJSON() {
    const url = 'js/gastos.json';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al cargar los gastos.');
        }

        const data = await response.json();
        gastos = data;
        mostrarGastos();
    } catch (error) {
        mostrarMensaje('Error al cargar los gastos. Inténtelo nuevamente.');
    }
}

// Borrar datos almacenados
document.getElementById('borrar-datos').addEventListener('click', function() {
    Swal.fire({
        title: '¿Está seguro que desea borrar todos los datos?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, borrar datos'
    }).then((result) => {
        if (result.isConfirmed) {
            gastos = [];
            localStorage.removeItem('gastos');
            mostrarGastos();

            Swal.fire(
                'Datos borrados',
                'Los datos han sido borrados correctamente.',
                'success'
            );
        }
    });
});

// Llamo a las funciones al cargar la página
window.onload = function () {
    generarOpcionesSelectMes();
    generarOpcionesSelectConcepto();
    cargarGastosDesdeJSON();

    // Asocio eventos
    document.getElementById('agregar-gasto').addEventListener('click', function() {
        agregarGasto();
    });
};