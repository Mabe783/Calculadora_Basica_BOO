class CalculadoraBasica extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.shadow.innerHTML = `
      <link rel="stylesheet" href="./bootstrap/css/bootstrap.min.css">
      <div class="card shadow p-4" style="max-width: 400px;">
        <h5 class="mb-3">Operaciones Matemáticas</h5>
        <div class="mb-3">
          <input type="number" class="form-control" id="num1" placeholder="Primer número">
        </div>
        <div class="mb-3">
          <input type="number" class="form-control" id="num2" placeholder="Segundo número">
        </div>
        <div class="mb-3">
          <select class="form-select" id="operacion">
            <option value="suma">Suma</option>
            <option value="resta">Resta</option>
            <option value="multiplicacion">Multiplicación</option>
            <option value="division">División</option>
          </select>
        </div>
        <button class="btn btn-primary w-100" id="calcularBtn">Calcular</button>
        <div class="mt-3">
          <p id="resultado" class="fw-bold text-success"></p>
        </div>
        <div class="mt-2">
          <small id="error" class="text-danger"></small>
        </div>
        <hr>
        <h6>Historial:</h6>
        <ul id="historial" class="list-group list-group-flush"></ul>
      </div>
    `;

    this.shadow.getElementById('calcularBtn').addEventListener('click', () => this.realizarCalculo());
  }
  realizarCalculo() {
    const num1 = parseFloat(this.shadow.getElementById('num1').value);
    const num2 = parseFloat(this.shadow.getElementById('num2').value);
    const operacion = this.shadow.getElementById('operacion').value;
    const resultadoEl = this.shadow.getElementById('resultado');
    const errorEl = this.shadow.getElementById('error');
    const historialEl = this.shadow.getElementById('historial');

    resultadoEl.textContent = '';
    errorEl.textContent = '';

    if (isNaN(num1) || isNaN(num2)) {
      errorEl.textContent = 'Por favor, ingresa números válidos.';
      return;
    }

    let resultado;
    let operacionTexto;

    switch (operacion) {
      case 'suma':
        resultado = num1 + num2;
        operacionTexto = `${num1} + ${num2} = ${resultado}`;
        break;
      case 'resta':
        resultado = num1 - num2;
        operacionTexto = `${num1} - ${num2} = ${resultado}`;
        break;
      case 'multiplicacion':
        resultado = num1 * num2;
        operacionTexto = `${num1} × ${num2} = ${resultado}`;
        break;
      case 'division':
        if (num2 === 0) {
          errorEl.textContent = 'Error: No se puede dividir entre cero.';
          return;
        }
        resultado = num1 / num2;
        operacionTexto = `${num1} ÷ ${num2} = ${resultado.toFixed(2)}`;
        break;
      default:
        errorEl.textContent = 'Operación no válida.';
        return;
    }

    resultadoEl.textContent = `Resultado: ${resultado}`;
    
    // Agregar al historial
    const item = document.createElement('li');
    item.textContent = operacionTexto;
    item.className = 'list-group-item';
    historialEl.prepend(item);

    // Evento opcional
    this.dispatchEvent(new CustomEvent('resultado-calculado', {
      detail: { resultado },
      bubbles: true,
      composed: true
    }));
  }
}
customElements.define('calculadora-basica', CalculadoraBasica);