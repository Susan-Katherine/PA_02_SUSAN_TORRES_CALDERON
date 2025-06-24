let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

// --- Función para agregar productos ---
function agregarAlCarrito(nombre, precio) {
  const index = carrito.findIndex(item => item.nombre === nombre);
  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }
  guardarCarrito();
  actualizarCarrito();
  abrirCarritoSiEsNecesario();
}

// --- Función para modificar cantidad ---
function modificarCantidad(index, cambio) {
  carrito[index].cantidad += cambio;
  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }
  guardarCarrito();
  actualizarCarrito();
}

// --- Guardar en localStorage ---
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// --- Mostrar carrito ---
function actualizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalElemento = document.getElementById("total");
  lista.innerHTML = "";

  total = 0;

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nombre} - S/. ${(item.precio * item.cantidad).toFixed(2)}
      <button class="btn-menos" onclick="modificarCantidad(${index}, -1)"></button>
      <strong>${item.cantidad}</strong>
      <button class="btn-mas" onclick="modificarCantidad(${index}, 1)"></button>
    `;
    lista.appendChild(li);
    total += item.precio * item.cantidad;
  });

  totalElemento.textContent = total.toFixed(2);
}

// --- Vaciar carrito ---
function vaciarCarrito() {
  carrito = [];
  total = 0;
  actualizarCarrito();
  mostrarPopup("Tu carrito ha sido vaciado", true);
}


// --- Finalizar compra y mostrar mensaje ---
function finalizarCompra() {
  const popup = document.getElementById("popup");
  const mensaje = document.getElementById("popup-mensaje");

  if (carrito.length === 0) {
    mensaje.innerHTML = "Tu carrito está vacío.";
  } else {
    mensaje.innerHTML = `
      🎉🎉 ¡Felicidades! Completó su compra. Acaba de comprar:<br>
      <ul>${carrito.map(item => `<li>${item.cantidad}x ${item.nombre}</li>`).join("")}</ul>
      Muchas gracias por su compra.
    `;
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
  }

  popup.classList.remove("oculto");
  popup.classList.add("activo");

  // Auto-cierre en 5 segundos
  setTimeout(() => {
    popup.classList.add("oculto");
    popup.classList.remove("activo");
  }, 5000);
}

// --- Alternar carrito flotante ---
function alternarCarrito() {
  const carritoDiv = document.getElementById("carrito");
  carritoDiv.classList.toggle("cerrado");
  carritoDiv.classList.toggle("mostrar");
}

// --- Abrir carrito si está cerrado al agregar producto ---
function abrirCarritoSiEsNecesario() {
  const carritoDiv = document.getElementById("carrito");
  if (carritoDiv.classList.contains("cerrado")) {
    alternarCarrito();
  }
}
function mostrarPopup(mensajeHTML, esSimple) {
  const popup = document.getElementById("popup");
  const popupContenido = document.getElementById("popup-mensaje");

  if (!popup || !popupContenido) return;

  popupContenido.innerHTML = mensajeHTML;
  popup.classList.remove("oculto");
  popup.classList.add("activo");

  if (esSimple) {
    popupContenido.innerHTML += '<br><button onclick="cerrarPopup()">Cerrar</button>';
  }
}

// --- Cerrar popup (si decides volver a usar botón) ---
function cerrarPopup() {
  const popup = document.getElementById("popup");
  popup.classList.add("oculto");
  popup.classList.remove("activo");
}

// --- Inicialización al cargar ---
document.addEventListener("DOMContentLoaded", actualizarCarrito);
