// ─────────────────────────────────────────────
// DATA INICIAL con detalles únicos por evento
const eventosPorDefecto = [
  {
    titulo: "Ruta Cordillera Verde",
    descripcion: "Aventura en montaña",
    fecha: "2025-08-15",
    estado: "activo",
    imagen: "IMAGENES/cordillera.jpg",
    horario: "15-17 Agosto, 7:00 AM - 6:00 PM",
    ubicacion: "Cordillera Central, Caldas",
    edad: "18+ años"
  },
  {
    titulo: "Feria Nacional de Motos",
    descripcion: "Exhibición de motos",
    fecha: "2025-08-22",
    estado: "activo",
    imagen: "IMAGENES/FERIA.jpg",
    horario: "22-24 Agosto, 10:00 AM - 8:00 PM",
    ubicacion: "Plaza Mayor, Medellín",
    edad: "Todas las edades"
  },
  {
    titulo: "Ruta Tierra Dorada",
    descripcion: "Viaje a pueblos mágicos",
    fecha: "2025-09-05",
    estado: "activo",
    imagen: "IMAGENES/DORADA.jpg",
    horario: "5-7 Septiembre, 6:30 AM - 5:00 PM",
    ubicacion: "Antioquia - Ruta del Café",
    edad: "16+ años"
  }
];

const subsPorDefecto = [
  { nombre: "Juan Pérez", correo: "juan@example.com", fecha: "2025-07-01" }
];

let eventos = JSON.parse(localStorage.getItem("eventos")) || eventosPorDefecto;
const suscriptores = JSON.parse(localStorage.getItem("suscriptores")) || subsPorDefecto;

// ─────────────────────────────────────────────
// FUNCIONES GLOBALES
function guardarEventos() {
  localStorage.setItem("eventos", JSON.stringify(eventos));
  window.dispatchEvent(new Event("storage")); // Notifica cambio manual si es misma pestaña
}

// ─────────────────────────────────────────────
// RENDER EN index.html
function renderEventosIndex() {
  const contenedor = document.querySelector("#eventos .grid");
  if (!contenedor) return;
  contenedor.innerHTML = "";
  eventos
    .filter(e => e.estado === "activo")
    .forEach(ev => {
      contenedor.innerHTML += `
      <div class="event-card card-hover">
        <div class="event-image">
          <img src="${ev.imagen}" alt="${ev.titulo}" class="w-full h-48 object-cover rounded-t-xl">
        </div>
        <div class="p-6">
          <h3 class="font-bold text-xl mb-2">${ev.titulo}</h3>
          <p class="text-gray-600 mb-4">${ev.descripcion}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-verde-hoja font-semibold">${ev.fecha}</span>
            <button class="btn-primary text-sm" onclick='verDetalles(${JSON.stringify(ev)})'>Ver Detalles</button>
          </div>
        </div>
      </div>`;
    });
}

// ─────────────────────────────────────────────
// RENDER EN events.html
function renderEventosAdmin() {
  const tabla = document.querySelector("table tbody");
  if (!tabla) return;

  tabla.innerHTML = "";
  eventos.forEach((e, i) => {
    tabla.innerHTML += `
      <tr class="border-t">
        <td class="p-4">
          <input type="text" value="${e.titulo}" onchange="actualizarCampo(${i}, 'titulo', this.value)" class="border px-2 py-1 w-full rounded">
        </td>
        <td class="p-4">
          <input type="date" value="${e.fecha}" onchange="actualizarCampo(${i}, 'fecha', this.value)" class="border px-2 py-1 w-full rounded">
        </td>
        <td class="p-4">
          <select onchange="actualizarCampo(${i}, 'estado', this.value)" class="border px-2 py-1 w-full rounded">
            <option value="activo" ${e.estado === "activo" ? "selected" : ""}>Activo</option>
            <option value="inactivo" ${e.estado === "inactivo" ? "selected" : ""}>Inactivo</option>
            <option value="cancelado" ${e.estado === "cancelado" ? "selected" : ""}>Cancelado</option>
          </select>
        </td>
        <td class="p-4 space-x-2">
          <button class="bg-red-600 text-white px-3 py-1 rounded" onclick="eliminarEvento(${i})">Eliminar</button>
        </td>
      </tr>`;
  });
}

// ─────────────────────────────────────────────
// FUNCIONES ADMIN

window.actualizarCampo = function(index, campo, valor) {
  eventos[index][campo] = valor;
  guardarEventos();
  renderEventosAdmin();
};

window.eliminarEvento = function(i) {
  if (confirm("¿Eliminar este evento?")) {
    eventos.splice(i, 1);
    guardarEventos();
    renderEventosAdmin();
  }
};

// ─────────────────────────────────────────────
// AGREGAR NUEVO EVENTO

document.addEventListener("DOMContentLoaded", () => {
  const esIndex = window.location.pathname.includes("index.html");
  const esAdmin = window.location.pathname.includes("events.html");
  const botonAgregar = document.querySelector("button.bg-green-600");

  if (esIndex) renderEventosIndex();
  if (esAdmin) renderEventosAdmin();

  if (botonAgregar) {
    botonAgregar.addEventListener("click", () => {
      const titulo = prompt("Título del evento:");
      const descripcion = prompt("Descripción:");
      const fecha = prompt("Fecha (YYYY-MM-DD):");
      const estado = prompt("Estado (activo/inactivo/cancelado):", "activo");

      if (titulo && descripcion && fecha && estado) {
        eventos.push({ titulo, descripcion, fecha, estado, imagen: "IMAGENES/default.jpg", horario: "Por confirmar", ubicacion: "Por definir", edad: "Todas las edades" });
        guardarEventos();
        renderEventosAdmin();
      }
    });
  }
});

// ─────────────────────────────────────────────
// ACTUALIZAR INDEX EN TIEMPO REAL SI CAMBIA

window.addEventListener("storage", () => {
  const esIndex = window.location.pathname.includes("index.html");
  if (esIndex) {
    eventos = JSON.parse(localStorage.getItem("eventos")) || [];
    renderEventosIndex();
  }
});

// ─────────────────────────────────────────────
// SUSCRIPTORES (opcional)
if (window.location.pathname.includes("subscriptions.html") || window.location.pathname.includes("dashboard.html")) {
  const tabla = document.querySelector("table tbody");
  if (tabla) {
    tabla.innerHTML = "";
    suscriptores.forEach(s => {
      tabla.innerHTML += `
        <tr class="border-t">
          <td class="p-4">${s.nombre}</td>
          <td class="p-4">${s.correo}</td>
          <td class="p-4">${s.fecha}</td>
        </tr>`;
    });
  }
}

if (window.location.pathname.includes("index.html")) {
  const botonSuscribir = document.querySelector("footer button");
  const inputCorreo = document.querySelector("footer input[type='email']");
  if (botonSuscribir && inputCorreo) {
    botonSuscribir.addEventListener("click", () => {
      const correo = inputCorreo.value.trim();
      if (!correo.includes("@")) return alert("Correo inválido.");
      if (suscriptores.find(s => s.correo === correo)) return alert("Ya estás suscrito.");
      suscriptores.push({ nombre: "Anónimo", correo, fecha: new Date().toISOString().split("T")[0] });
      localStorage.setItem("suscriptores", JSON.stringify(suscriptores));
      alert("¡Gracias por suscribirte!");
      inputCorreo.value = "";
    });
  }
}

// ─────────────────────────────────────────────
// MOSTRAR MENSAJES EN contact.html Y dashboard.html
if (window.location.pathname.includes("contact.html") || window.location.pathname.includes("dashboard.html")) {
  const lista = document.querySelector("#lista-mensajes");
  const mensajes = JSON.parse(localStorage.getItem("mensajes")) || [];

  if (lista) {
    lista.innerHTML = "";
    mensajes.forEach(m => {
      lista.innerHTML += `
        <li class="bg-white p-4 rounded shadow">
          <p class="font-semibold">${m.nombre}</p>
          <p class="text-sm text-gray-600">${m.correo}</p>
          <p class="mt-2">${m.mensaje}</p>
        </li>`;
    });
  }
}

