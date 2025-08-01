//CRUD para procesos

document.addEventListener("DOMContentLoaded", function () {
  // Datos iniciales (luego vendrán de BD)
  const procesos = [
    {
      id: 1,
      nombre: "OPERADOR RURAL",
      monto: 1500,
      montoLiteral: "Mil quinientos",
      casos: 10,
    },
    {
      id: 2,
      nombre: "OPERADOR URBANO",
      monto: 1800,
      montoLiteral: "Mil ochocientos",
      casos: 12,
    },
    {
      id: 3,
      nombre: "SOPORTE",
      monto: 2000,
      montoLiteral: "Dos mil",
      casos: 8,
    },
    {
      id: 4,
      nombre: "COORDINADOR",
      monto: 2500,
      montoLiteral: "Dos mil quinientos",
      casos: 5,
    },
  ];

  // Elementos del DOM
  const btnProcesoCtr = document.getElementById("procesoCtr");
  const modalProcesos = new bootstrap.Modal("#modalProcesos");
  const btnNuevoProceso = document.getElementById("btnNuevoProceso");
  const formContainer = document.getElementById("formContainer");
  const formProceso = document.getElementById("formProceso");
  const tBodyProcesos = document.getElementById("tBodyProcesos");
  const buscarProceso = document.getElementById("buscarProceso");

  // modal al clickear el btn
  btnProcesoCtr.addEventListener("click", function () {
    cargarTablaProcesos();
    modalProcesos.show();
  });

  // modal nuevo proceso
  btnNuevoProceso.addEventListener("click", function () {
    // nuevo modal
    const modalHTML = `
    <div class="modal fade" id="modalNuevoProceso" tabindex="-1" aria-labelledby="modalNuevoProcesoLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalNuevoProcesoLabel">Nuevo Proceso de Contratación</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="formNuevoProceso">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="nombreProceso" class="form-label">Nombre del Proceso*</label>
                                <input type="text" class="form-control" id="nombreProceso" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="unidadSolicitante" class="form-label">Unidad Solicitante*</label>
                                <input type="text" class="form-control" id="unidadSolicitante" required>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="montoNumeral" class="form-label">Monto Numeral*</label>
                                <input type="number" step="0.01" class="form-control" id="montoNumeral" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="montoLiteral" class="form-label">Monto en Letras*</label>
                                <input type="text" class="form-control" id="montoLiteral" required>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="cantidadCasos" class="form-label">Cantidad de Casos*</label>
                                <input type="number" class="form-control" id="cantidadCasos" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="responsable" class="form-label">Responsable*</label>
                                <input type="text" class="form-control" id="responsable" required>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="fechaFirma" class="form-label">Fecha de Firma*</label>
                                <input type="date" class="form-control" id="fechaFirma" required>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="guardarProceso">Guardar</button>
                </div>
            </div>
        </div>
    </div>
    `;

    // Insertar el modal en el body si no existe
    if (!document.getElementById("modalNuevoProceso")) {
      document.body.insertAdjacentHTML("beforeend", modalHTML);
    }

    // Mostrar el modal
    const modalNuevoProceso = new bootstrap.Modal(
      document.getElementById("modalNuevoProceso")
    );
    modalNuevoProceso.show();

    // Configurar evento para el botón Guardar
    document
      .getElementById("guardarProceso")
      .addEventListener("click", function () {
        // Validar formulario
        const form = document.getElementById("formNuevoProceso");
        if (!form.checkValidity()) {
          form.classList.add("was-validated");
          return;
        }

        // Obtener valores del formulario
        const procesoData = {
          nombre_proceso: document.getElementById("nombreProceso").value,
          monto_numeral: document.getElementById("montoNumeral").value,
          monto_literal: document.getElementById("montoLiteral").value,
          cantidad_casos: document.getElementById("cantidadCasos").value,
          unidad_solicitante:
            document.getElementById("unidadSolicitante").value,
          responsable: document.getElementById("responsable").value,
          fecha_firma: document.getElementById("fechaFirma").value,
        };

        // Enviar datos a la API
        fetch("/api/procesoContratacion/setNuevoProcesoContratacion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(procesoData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error en la respuesta del servidor");
            }
            return response.json();
          })
          .then((data) => {
            // Mostrar mensaje de éxito
            alert("Proceso creado exitosamente");

            // Cerrar el modal de nuevo proceso
            modalNuevoProceso.hide();

            // tabla de procesos de contratacion
            cargarTablaProcesos();

            // cerrar modal principal si es necesario
            // modalProcesos.hide();
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Error UwU: " + error.message);
          });
      });

    // Limpiar la validación al cerrar el modal
    document
      .getElementById("modalNuevoProceso")
      .addEventListener("hidden.bs.modal", function () {
        document
          .getElementById("formNuevoProceso")
          .classList.remove("was-validated");
      });
  });

  // tabla de procesos
  function cargarTablaProcesos(filtro = "") {
    tBodyProcesos.innerHTML = "";

    // peticion para obtener procesos actualizados
    fetch("/api/procesoContratacion/getProcesosContratacion")
      .then((response) => response.json())
      .then((procesos) => {
        const procesosFiltrados = filtro
          ? procesos.filter((p) =>
              p.nombre.toLowerCase().includes(filtro.toLowerCase())
            )
          : procesos;

        if (procesosFiltrados.length === 0) {
          tBodyProcesos.innerHTML =
            '<tr><td colspan="4" class="text-center">No se encontraron procesos</td></tr>';
          return;
        }

        // llenando tabla de procesos
        procesosFiltrados.forEach((proceso) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
                <td>${proceso.nombre}</td>
                <td>${proceso.monto_literal} (${proceso.monto_numeral} Bs.)</td>
                <td>${proceso.cantidad_casos}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-2 btn-editar" data-id="${proceso.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-eliminar" data-id="${proceso.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
          tBodyProcesos.appendChild(tr);
        });

        // botones de editar , eliminar
        configurarBotonesAcciones();
      })
      .catch((error) => {
        console.error("Error al cargar los procesos:", error);
        tBodyProcesos.innerHTML =
          '<tr><td colspan="4" class="text-center">Error al cargar los procesos</td></tr>';
      });
  }

  // eventos de botones editar, eliminar
  function configurarBotonesAcciones() {
    document.querySelectorAll(".btn-editar").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        // logica d eedicion
        console.log("Editar proceso con ID:", id);
      });
    });

    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        if (confirm("¿Está seguro de eliminar este proceso?")) {
          // logica de eliminacion
          console.log("Eliminar proceso con ID:", id);
          // recargando tabla
          cargarTablaProcesos();
        }
      });
    });
  }

  // Cancelar edición/creación
  document.getElementById("btnCancelar").addEventListener("click", function () {
    formContainer.style.display = "none";
  });

  // Guardar proceso (crear o actualizar)
  formProceso.addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("procesoId").value;
    const proceso = {
      nombre: document.getElementById("nombreProceso").value,
      monto: document.getElementById("montoProceso").value,
      montoLiteral: document.getElementById("montoLiteralProceso").value,
      casos: document.getElementById("casosProceso").value,
    };

    if (id) {
      // Actualizar proceso existente
      const index = procesos.findIndex((p) => p.id == id);
      if (index !== -1) {
        procesos[index] = { ...procesos[index], ...proceso };
      }
    } else {
      // Crear nuevo proceso
      proceso.id =
        procesos.length > 0 ? Math.max(...procesos.map((p) => p.id)) + 1 : 1;
      procesos.push(proceso);
    }

    cargarTablaProcesos();
    formContainer.style.display = "none";
    formProceso.reset();
  });

  // busca proceso
  buscarProceso.addEventListener("input", function () {
    cargarTablaProcesos(this.value.toLowerCase());
  });

  // datos en la tabla
  function cargarTablaProcesos(filtro = "") {
    tBodyProcesos.innerHTML = "";

    const procesosFiltrados = filtro
      ? procesos.filter((p) => p.nombre.toLowerCase().includes(filtro))
      : procesos;

    if (procesosFiltrados.length === 0) {
      tBodyProcesos.innerHTML =
        '<tr><td colspan="4" class="text-center">No se encontraron procesos</td></tr>';
      return;
    }

    procesosFiltrados.forEach((proceso) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>${proceso.nombre}</td>
            <td>${proceso.montoLiteral} (${proceso.monto} Bs.)</td>
            <td>${proceso.casos}</td>
            <td>
            <button class="btn btn-sm btn-warning me-2 btn-editar" data-id="${proceso.id}">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger btn-eliminar" data-id="${proceso.id}">
                <i class="fas fa-trash"></i>
            </button>
            </td>
        `;
      tBodyProcesos.appendChild(tr);
    });

    // eventos para botones de eliminado y modificado
    document.querySelectorAll(".btn-editar").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        const proceso = procesos.find((p) => p.id == id);
        if (proceso) {
          document.getElementById("formTitle").textContent = "Editar Proceso";
          document.getElementById("procesoId").value = proceso.id;
          document.getElementById("nombreProceso").value = proceso.nombre;
          document.getElementById("montoProceso").value = proceso.monto;
          document.getElementById("montoLiteralProceso").value =
            proceso.montoLiteral;
          document.getElementById("casosProceso").value = proceso.casos;
          formContainer.style.display = "block";
        }
      });
    });

    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
      btn.addEventListener("click", function () {
        if (confirm("¿Está seguro de eliminar este proceso?")) {
          const id = this.getAttribute("data-id");
          const index = procesos.findIndex((p) => p.id == id);
          if (index !== -1) {
            procesos.splice(index, 1);
            cargarTablaProcesos();
          }
        }
      });
    });
  }
});

// conf inicial
document.addEventListener("DOMContentLoaded", function () {
  inicializarPaginacion();
  configurarEventosClick();
});

// eventos en todas las filas menos en la de CI, CV, NM
function configurarEventosClick() {
  document.querySelectorAll(".clickable-row").forEach((cell) => {
    cell.addEventListener("click", function (e) {
      if (e.target.classList.contains("pdf-btn")) return;

      const fila = this.closest("tr");
      const modal = new bootstrap.Modal(
        document.getElementById("modalPostulante")
      );

      document.getElementById("modalNombre").value =
        fila.getAttribute("data-nombre") || "";
      document.getElementById("modalCI").value =
        fila.getAttribute("data-ci") || "";
      document.getElementById("modalExtension").value =
        fila.getAttribute("data-extension") || "";
      document.getElementById("modalFechaNacimiento").value =
        fila.getAttribute("data-fechanacimiento") || "";

      // Configurar evento para el proceso de contratación
      const selectProceso = document.getElementById("modalProcesoContratacion");
      selectProceso.addEventListener("change", function () {
        // Lógica para llenar automáticamente según proceso seleccionado
        const proceso = this.value;

        // Ejemplo temporal - reemplazar con llamada a BD
        if (proceso === "operador_rural") {
          document.getElementById("modalMonto").value = "1500";
          document.getElementById("modalMontoLiteral").value =
            "Mil quinientos bolivianos";
          document.getElementById("modalCantidadCasos").value = "10";
        } else if (proceso === "operador_urbano") {
          document.getElementById("modalMonto").value = "1800";
          document.getElementById("modalMontoLiteral").value =
            "Mil ochocientos bolivianos";
          document.getElementById("modalCantidadCasos").value = "12";
        }
        // Añadir más casos según sea necesario
      });

      // Mostrar modal
      modal.show();
    });
  });
}

// Funciones de paginación
function inicializarPaginacion() {
  const filas = Array.from(
    document.querySelectorAll("#tablaPostulantes tbody tr")
  );
  mostrarPagina(1, filas);
}

function filtrarFilas() {
  const filtro = document.getElementById("buscador").value.toLowerCase();
  const filas = Array.from(
    document.querySelectorAll("#tablaPostulantes tbody tr")
  );

  const filasFiltradas = filas.filter((fila) => {
    const nombre = fila.cells[0].textContent.toLowerCase();
    const ci = fila.cells[1].textContent.toLowerCase();
    return nombre.includes(filtro) || ci.includes(filtro);
  });

  mostrarPagina(1, filasFiltradas);
}

function mostrarPagina(pagina, filas) {
  const filasPorPagina = 5;
  const inicio = (pagina - 1) * filasPorPagina;
  const fin = inicio + filasPorPagina;

  // Ocultar todas las filas primero
  document.querySelectorAll("#tablaPostulantes tbody tr").forEach((fila) => {
    fila.style.display = "none";
  });

  // Mostrar solo las filas de la página actual
  filas.slice(inicio, fin).forEach((fila) => {
    fila.style.display = "";
  });

  actualizarPaginacion(filas.length);
}

function actualizarPaginacion(totalFilas) {
  const filasPorPagina = 5;
  const totalPaginas = Math.ceil(totalFilas / filasPorPagina);
  const paginacion = document.getElementById("paginacion");
  paginacion.innerHTML = "";

  if (totalPaginas <= 1) return;

  // Botón Anterior
  const liPrev = document.createElement("li");
  liPrev.className = "page-item";
  liPrev.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
  liPrev.addEventListener("click", (e) => {
    e.preventDefault();
    if (paginaActual > 1) mostrarPagina(paginaActual - 1, getFilasVisibles());
  });
  paginacion.appendChild(liPrev);

  // Botones de página
  for (let i = 1; i <= totalPaginas; i++) {
    const li = document.createElement("li");
    li.className = "page-item";
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      mostrarPagina(i, getFilasVisibles());
    });
    paginacion.appendChild(li);
  }

  // Botón Siguiente
  const liNext = document.createElement("li");
  liNext.className = "page-item";
  liNext.innerHTML = `<a class="page-link" href="#">Siguiente</a>`;
  liNext.addEventListener("click", (e) => {
    e.preventDefault();
    if (paginaActual < totalPaginas)
      mostrarPagina(paginaActual + 1, getFilasVisibles());
  });
  paginacion.appendChild(liNext);
}

function getFilasVisibles() {
  const filtro = document.getElementById("buscador").value.toLowerCase();
  const todasFilas = Array.from(
    document.querySelectorAll("#tablaPostulantes tbody tr")
  );

  if (!filtro) return todasFilas;

  return todasFilas.filter((fila) => {
    const nombre = fila.cells[0].textContent.toLowerCase();
    const ci = fila.cells[1].textContent.toLowerCase();
    return nombre.includes(filtro) || ci.includes(filtro);
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

window.addEventListener("load", inicializar);

// Configurar eventos para los selects de estado
document.querySelectorAll(".estado-select").forEach((select) => {
  let estadoAnterior = select.value;

  select.addEventListener("change", async function () {
    const nuevoEstado = this.value;
    const fila = this.closest("tr");

    if (!fila) {
      console.error("Error: No se pudo encontrar la fila contenedora");
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
      // CORRECCIÓN: Usar estadoAnterior en lugar de estado
      fila.classList.add(
        `estado-${estadoAnterior.toLowerCase().replace(" ", "")}`
      );
    }
  });
});

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
//exportar excel
document.getElementById("exportarExcel").addEventListener("click", function () {
  const tabla = document.getElementById("tablaPostulantes");
  const wb = XLSX.utils.table_to_book(tabla);
  XLSX.writeFile(wb, "asesoria_legal.xlsx");
});
