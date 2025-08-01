// Modal: carga los datos del postulante
const modalPostulante = document.getElementById("modalPostulante");
modalPostulante?.addEventListener("show.bs.modal", function (event) {
  const trigger = event.relatedTarget;
  const postulanteId = trigger.getAttribute("data-id");

  // Establecemos el ID actual en el modal
  this.setAttribute("data-current-id", postulanteId);

  document.getElementById("modalNombre").value =
    trigger.getAttribute("data-nombre") || "";
  document.getElementById("modalCI").value =
    trigger.getAttribute("data-ci") || "";
  document.getElementById("modalFechaNacimiento").value =
    trigger.getAttribute("data-fechanacimiento") || "";
  document.getElementById("modalCelular").value =
    trigger.getAttribute("data-celular") || "";
  document.getElementById("modalNroContrato").value =
    trigger.getAttribute("data-nrocontrato") || "";
  document.getElementById("modalNroGrupo").value =
    trigger.getAttribute("data-nrogrupo") || "";
  document.getElementById("modalPDSE").value =
    trigger.getAttribute("data-pdse") || "";
});

// Guardar PDSE
document
  .getElementById("btnGuardarPDSE")
  ?.addEventListener("click", function () {
    const pdse = document.getElementById("modalPDSE").value;
    const modal = document.getElementById("modalPostulante");
    const postulanteId = modal.getAttribute("data-current-id"); // Usamos un atributo para almacenar el ID

    if (!postulanteId) {
      console.error("No se encontró el ID del postulante");
      return;
    }

    // Aquí puedes guardar el PDSE en tu base de datos
    console.log(`Postulante ID: ${postulanteId}, PDSE: ${pdse}`);

    // Actualizar el valor en la tabla
    const fila = document.querySelector(`tr[data-id="${postulanteId}"]`);
    if (fila) {
      fila.setAttribute("data-pdse", pdse);
      fila.cells[3].textContent = pdse; // Actualiza la celda de PDSE
    }

    // Cerrar modal
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
  });

// Buscador + Paginación (solo búsqueda por nombre y CI)
const buscador = document.getElementById("buscador");
const tabla = document
  .getElementById("tablaPostulantes")
  .getElementsByTagName("tbody")[0];
const paginacion = document.getElementById("paginacion");
const filasPorPagina = 5;
let paginaActual = 1;
let filasFiltradas = [];

function mostrarPagina(pagina) {
  paginaActual = pagina;
  const inicio = (pagina - 1) * filasPorPagina;
  const fin = inicio + filasPorPagina;

  for (const fila of tabla.rows) {
    fila.style.display = "none";
  }

  filasFiltradas.slice(inicio, fin).forEach((fila) => {
    fila.style.display = "";
  });

  actualizarPaginacion();
}

function actualizarPaginacion() {
  paginacion.innerHTML = "";
  const totalPaginas = Math.ceil(filasFiltradas.length / filasPorPagina);
  if (totalPaginas <= 1) return;

  // Botón Anterior
  const liPrev = document.createElement("li");
  liPrev.className = "page-item " + (paginaActual === 1 ? "disabled" : "");
  const aPrev = document.createElement("a");
  aPrev.className = "page-link";
  aPrev.href = "#";
  aPrev.textContent = "Anterior";
  aPrev.addEventListener("click", (e) => {
    e.preventDefault();
    if (paginaActual > 1) mostrarPagina(paginaActual - 1);
  });
  liPrev.appendChild(aPrev);
  paginacion.appendChild(liPrev);

  // Botones numéricos
  for (let i = 1; i <= totalPaginas; i++) {
    const li = document.createElement("li");
    li.className = "page-item " + (paginaActual === i ? "active" : "");
    const a = document.createElement("a");
    a.className = "page-link";
    a.href = "#";
    a.textContent = i;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      mostrarPagina(i);
    });
    li.appendChild(a);
    paginacion.appendChild(li);
  }

  // Botón Siguiente
  const liNext = document.createElement("li");
  liNext.className =
    "page-item " + (paginaActual === totalPaginas ? "disabled" : "");
  const aNext = document.createElement("a");
  aNext.className = "page-link";
  aNext.href = "#";
  aNext.textContent = "Siguiente";
  aNext.addEventListener("click", (e) => {
    e.preventDefault();
    if (paginaActual < totalPaginas) mostrarPagina(paginaActual + 1);
  });
  liNext.appendChild(aNext);
  paginacion.appendChild(liNext);
}

function filtrarFilas() {
  const filtro = buscador.value.toLowerCase();
  filasFiltradas = [];
  for (const fila of tabla.rows) {
    const nombre = fila.cells[0].textContent.toLowerCase();
    const ci = fila.cells[1].textContent.toLowerCase();
    if (nombre.includes(filtro) || ci.includes(filtro)) {
      filasFiltradas.push(fila);
    }
  }
}

function inicializar() {
  filtrarFilas();
  mostrarPagina(1);
}

buscador.addEventListener("input", () => {
  filtrarFilas();
  mostrarPagina(1);
});

window.addEventListener("load", inicializar);

//exportar excel
document.getElementById("exportarExcel").addEventListener("click", function () {
  const tabla = document.getElementById("tablaPostulantes");
  const wb = XLSX.utils.table_to_book(tabla);
  XLSX.writeFile(wb, "asesoria_legal.xlsx");
});
