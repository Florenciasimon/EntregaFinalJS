// Objeto para representar un gasto
class Gasto {
    constructor(concepto, monto, mes) {
        this.concepto = concepto;
        this.monto = monto;
        this.mes = mes;
    }

    obtenerDescripcion() {
        return `${this.concepto} (${this.mes}): $${this.monto.toFixed(2)}`;
    }
}

// Array de meses
const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// Array de gastos (conceptos a seleccionar)
const conceptos = ["Alquiler", "Luz", "Gas", "Agua", "Obra social", "Tarjeta de credito", "Seguro", "Celular", "Cable", "Internet", "Otro"]
