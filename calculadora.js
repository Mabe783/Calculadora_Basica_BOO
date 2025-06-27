// Cree una clase para el componente personalizado
class CalculadoraBasica extends HTMLElement {
  constructor() {
    super();
    // Cree el Shadow DOM para encapsular todo el contenido del componente
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  // Cree el contenido del componente cuando se agrega al DOM
  connectedCallback() {
    // Cree el contenido HTML que se mostrará dentro del Shadow DOM
    // Esta parte me costo un poco al principio, pero ya funciona bien
    this.shadow.innerHTML = `
      <link rel="stylesheet" href="./bootstrap/css/bootstrap.min.css">
      <div class="card shadow p-4" style="max-width: 400px;">
        <h5 class="mb-3">Operaciones Matematicas</h5>
        
        <!-- Cree el campo para el primer numero -->
        <div class="mb-3">
          <input type="number" class="form-control" id="num1" placeholder="Primer numero">
        </div>

        <!-- Cree el campo para el segundo numero -->
        <div class="mb-3">
          <input type="number" class="form-control" id="num2" placeholder="Segundo numero">
        </div>

        <!-- Cree el selector para elegir la operacion -->
        <div class="mb-3">
          <select class="form-select" id="operacion">
            <option value="suma">Suma</option>
            <option value="resta">Resta</option>
            <option value="multiplicacion">Multiplicacion</option>
            <option value="division">Division</option>
          </select>
        </div>

        <!-- Cree el boton para ejecutar el calculo -->
        <button class="btn btn-primary w-100" id="calcularBtn">Calcular</button>

        <!-- Cree el espacio para mostrar el resultado -->
        <div class="mt-3">
          <p id="resultado" class="fw-bold text-success"></p>
        </div>

        <!-- Cree el espacio para mostrar errores -->
        <div class="mt-2">
          <small id="error" class="text-danger"></small>
        </div>

        <!-- Cree el historial de operaciones realizadas -->
        <hr>
        <h6>Historial:</h6>
        <ul id="historial" class="list-group list-group-flush"></ul>
      </div>
    `;

    // Cree un evento para que al hacer clic en el boton, se realice el calculo
    this.shadow.getElementById('calcularBtn').addEventListener('click', () => this.realizarCalculo());
  }

  // Cree una funcion que realiza la operacion seleccionada
  realizarCalculo() {
    // Cree las variables para capturar los valores ingresados
    const num1 = parseFloat(this.shadow.getElementById('num1').value);
    const num2 = parseFloat(this.shadow.getElementById('num2').value);
    const operacion = this.shadow.getElementById('operacion').value;
    const resultadoEl = this.shadow.getElementById('resultado');
    const errorEl = this.shadow.getElementById('error');
    const historialEl = this.shadow.getElementById('historial');

    // Limpie mensajes anteriores
    resultadoEl.textContent = '';
    errorEl.textContent = '';

    // Verifique que los campos sean numeros
    if (isNaN(num1) || isNaN(num2)) {
      errorEl.textContent = 'Por favor, ingresa numeros validos.';
      return;
    }

    let resultado;
    let operacionTexto;

    // Cree, calculo segun la operacion seleccionada
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
        // Verifique que no haya division entre cero
        if (num2 === 0) {
          errorEl.textContent = 'Error: No se puede dividir entre cero.';
          return;
        }
        resultado = num1 / num2;
        operacionTexto = `${num1} ÷ ${num2} = ${resultado.toFixed(2)}`;
        break;
      default:
        errorEl.textContent = 'Operacion no valida.';
        return;
    }

    // sirve para mostrar el resultado
    resultadoEl.textContent = `Resultado: ${resultado}`;
    
    // Cree un elemento en la lista del historial con la operacion realizada
    const item = document.createElement('li');
    item.textContent = operacionTexto;
    item.className = 'list-group-item';
    historialEl.prepend(item);

    // Cree un evento personalizado que envia el resultado hacia fuera del componente
    this.dispatchEvent(new CustomEvent('resultado-calculado', {
      detail: { resultado },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('calculadora-basica', CalculadoraBasica);