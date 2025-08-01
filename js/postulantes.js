// Modal: carga los datos en el formulario
const modal = document.getElementById("modalEditar");
if (modal) {
  modal.addEventListener("show.bs.modal", function (event) {
    const trigger = event.relatedTarget;
    const form = modal.querySelector("form");

    form.nombre.value = trigger.getAttribute("data-nombre") || "";
    form.ci.value = trigger.getAttribute("data-ci") || "";
    form.fecha.value = trigger.getAttribute("data-fecha") || "";
    form.direccion.value = trigger.getAttribute("data-direccion") || "";
    form.correo.value = trigger.getAttribute("data-correo") || "";
    form.preventivo.value = trigger.getAttribute("data-preventivo") || "";
    form.adjudicacion.value = trigger.getAttribute("data-adjudicacion") || "";
    form.contrato.value = trigger.getAttribute("data-contrato") || "";
    form.unidad.value = trigger.getAttribute("data-unidad") || "";
    form.proceso.value = trigger.getAttribute("data-proceso") || "";
    form.fechacontrato.value = trigger.getAttribute("data-fechacontrato") || "";
    form.certificacion.value = trigger.getAttribute("data-certificacion") || "";
    form.monto.value = trigger.getAttribute("data-monto") || "";
  });
}

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

//-----------------------------
// Configurar eventos para los selects de estado
document.querySelectorAll(".estado-select").forEach((select) => {
  let estadoAnterior = select.value;

  select.addEventListener("change", async function () {
    const nuevoEstado = this.value;
    const fila = this.closest("tr");

    if (!fila) {
      console.error("ERROR: nos epuede encontrar la fila");
      this.value = estadoAnterior;
      return;
    }

    const postulanteId = fila.getAttribute("data-id");

    // si no hay cambio no hacer nada
    if (nuevoEstado === estadoAnterior) return;

    // mostrar una alert para cambios importantes
    if (
      nuevoEstado !== "NO REVISADO" &&
      !confirm(`¿Está seguro de cambiar el estado a ${nuevoEstado}?`)
    ) {
      this.value = estadoAnterior;
      return;
    }

    try {
      // actualizar interfz visual
      fila.classList.remove(
        "estado-descartado",
        "estado-seleccionado",
        "estado-norevisado"
      );

      if (nuevoEstado === "DESCARTADO") {
        fila.classList.add("estado-descartado");
        const motivo = await mostrarModalMotivoDescarto(postulanteId);
        if (!motivo) throw new Error("No se proporcionó motivo");

        console.log(`Postulante ${postulanteId} descartado. Motivo: ${motivo}`);

        // Eliminar de la vista con animación
        setTimeout(() => {
          fila.style.transition = "opacity 0.5s ease";
          fila.style.opacity = "0";
          setTimeout(() => fila.remove(), 500);
        }, 1000);
      } else if (nuevoEstado === "SELECCIONADO") {
        fila.classList.add("estado-seleccionado");

        //
        const datosPostulante = {
          nombre: fila.cells[0].textContent.trim(),
          ci: fila.cells[1].textContent.trim(),
          celular: fila.cells[2].textContent.trim(),
          nro_experiencia: fila.cells[3].textContent.trim(),
          documentos: {
            cv: fila.cells[4].querySelector("button")?.dataset.url || "",
            ci: fila.cells[5].querySelector("button")?.dataset.url || "",
            nm: fila.cells[6].querySelector("button")?.dataset.url || "",
            contrato: fila.cells[7].querySelector("button")?.dataset.url || "",
          },
        };

        console.log("Datos para JAF:", datosPostulante);

        // Eliminar de la vista con animación
        setTimeout(() => {
          fila.style.transition = "opacity 0.5s ease";
          fila.style.opacity = "0";
          setTimeout(() => fila.remove(), 500);
        }, 1000);
      } else {
        fila.classList.add("estado-norevisado");
      }

      estadoAnterior = nuevoEstado;
    } catch (error) {
      console.error("Error:", error);
      this.value = estadoAnterior;
      fila.classList.remove(
        "estado-descartado",
        "estado-seleccionado",
        "estado-norevisado"
      );
      fila.classList.add(
        `estado-${estadoAnterior.toLowerCase().replace(" ", "")}`
      );
    }
  });
});

function obtenerDatosPostulante(fila) {
  const celdas = fila.querySelectorAll("td");
  return {
    nombre: celdas[0].textContent.trim(),
    ci: celdas[1].textContent.trim(),
    fecha_nacimiento: "",
    domicilio: "",
    celular: celdas[2].textContent.trim(),
    correo: "",
    documentos: {
      ci:
        fila.querySelector('[data-bs-target="#pdfModalCI"]')?.dataset.url || "",
      cv:
        fila.querySelector('[data-bs-target="#pdfModalCV"]')?.dataset.url || "",
      nm:
        fila.querySelector('[data-bs-target="#pdfModalNM"]')?.dataset.url || "",
    },
  };
}

// para los el motivo
function mostrarModalMotivoDescarto(postulanteId) {
  return new Promise((resolve) => {
    const modalElement = document.getElementById("modalMotivoDescarto");
    const modal = new bootstrap.Modal(modalElement);

    document.getElementById("postulanteDescartadoId").value = postulanteId;
    document.getElementById("motivoDescarto").value = "";

    const handleSubmit = (e) => {
      e.preventDefault();
      const motivo = document.getElementById("motivoDescarto").value.trim();

      if (motivo) {
        modal.hide();
        resolve(motivo);
      } else {
        alert("Por favor ingrese un motivo válido");
        // mensaje de alert si no hay algun motivo
      }
    };

    // funcion para cierre de modal
    const handleHidden = () => {
      // Si el modal se cierra sin enviar, resolvemos con null
      if (!document.getElementById("motivoDescarto").value.trim()) {
        resolve(null);
      }
      // Limpiar event listeners
      form.removeEventListener("submit", handleSubmit);
      modalElement.removeEventListener("hidden.bs.modal", handleHidden);
    };

    const form = document.getElementById("formMotivoDescarto");
    form.addEventListener("submit", handleSubmit);
    modalElement.addEventListener("hidden.bs.modal", handleHidden);

    modal.show();
  });
}
// ejemplo para enviar datos a JAF
function enviarDatosAJAF(datos) {
  fetch("/api/jaf/procesar-seleccionado", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Respuesta de JAF:", data);
    })
    .catch((error) => {
      console.error("Error al enviar a JAF:", error);
    });
}
//------------------------------

window.addEventListener("load", inicializar);

//exportar excel
document.getElementById("exportarExcel").addEventListener("click", function () {
  const tabla = document.getElementById("tablaPostulantes");
  const wb = XLSX.utils.table_to_book(tabla);
  XLSX.writeFile(wb, "postulantes.xlsx");
});
