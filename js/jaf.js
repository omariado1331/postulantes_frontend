//CRUD para procesos

    document.addEventListener('DOMContentLoaded', function() {
  // Datos iniciales (luego vendrán de BD)
    const procesos = [
        { id: 1, nombre: 'OPERADOR RURAL', monto: 1500, montoLiteral: 'Mil quinientos', casos: 10 },
        { id: 2, nombre: 'OPERADOR URBANO', monto: 1800, montoLiteral: 'Mil ochocientos', casos: 12 },
        { id: 3, nombre: 'SOPORTE', monto: 2000, montoLiteral: 'Dos mil', casos: 8 },
        { id: 4, nombre: 'COORDINADOR', monto: 2500, montoLiteral: 'Dos mil quinientos', casos: 5 }
    ];

    // Elementos del DOM
    const btnProcesoCtr = document.getElementById('procesoCtr');
    const modalProcesos = new bootstrap.Modal('#modalProcesos');
    const btnNuevoProceso = document.getElementById('btnNuevoProceso');
    const formContainer = document.getElementById('formContainer');
    const formProceso = document.getElementById('formProceso');
    const tBodyProcesos = document.getElementById('tBodyProcesos');
    const buscarProceso = document.getElementById('buscarProceso');

    // Mostrar modal al clickear el botón
    btnProcesoCtr.addEventListener('click', function() {
        cargarTablaProcesos();
        modalProcesos.show();
    });

    // Mostrar formulario para nuevo proceso
    btnNuevoProceso.addEventListener('click', function() {
        formContainer.sstyle.display = 'block';
        document.getElementById('formTitle').textContent = 'Nuevo Proceso';
        formProceso.reset();
        document.getElementById('procesoId').value = '';
    });

    // Cancelar edición/creación
    document.getElementById('btnCancelar').addEventListener('click', function() {
        formContainer.style.display = 'none';
    });

    // Guardar proceso (crear o actualizar)
    formProceso.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('procesoId').value;
        const proceso = {
        nombre: document.getElementById('nombreProceso').value,
        monto: document.getElementById('montoProceso').value,
        montoLiteral: document.getElementById('montoLiteralProceso').value,
        casos: document.getElementById('casosProceso').value
        };

        if(id) {
        // Actualizar proceso existente
        const index = procesos.findIndex(p => p.id == id);
        if(index !== -1) {
            procesos[index] = { ...procesos[index], ...proceso };
        }
        } else {
        // Crear nuevo proceso
        proceso.id = procesos.length > 0 ? Math.max(...procesos.map(p => p.id)) + 1 : 1;
        procesos.push(proceso);
        }

        cargarTablaProcesos();
        formContainer.style.display = 'none';
        formProceso.reset();
    });

    // Buscar procesos
    buscarProceso.addEventListener('input', function() {
        cargarTablaProcesos(this.value.toLowerCase());
    });

    // Cargar datos en la tabla
    function cargarTablaProcesos(filtro = '') {
        tBodyProcesos.innerHTML = '';
        
        const procesosFiltrados = filtro 
        ? procesos.filter(p => p.nombre.toLowerCase().includes(filtro))
        : procesos;

        if(procesosFiltrados.length === 0) {
        tBodyProcesos.innerHTML = '<tr><td colspan="4" class="text-center">No se encontraron procesos</td></tr>';
        return;
        }

        procesosFiltrados.forEach(proceso => {
        const tr = document.createElement('tr');
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

        // Eventos para botones de editar y eliminar
        document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const proceso = procesos.find(p => p.id == id);
            if(proceso) {
            document.getElementById('formTitle').textContent = 'Editar Proceso';
            document.getElementById('procesoId').value = proceso.id;
            document.getElementById('nombreProceso').value = proceso.nombre;
            document.getElementById('montoProceso').value = proceso.monto;
            document.getElementById('montoLiteralProceso').value = proceso.montoLiteral;
            document.getElementById('casosProceso').value = proceso.casos;
            formContainer.style.display = 'block';
            }
        });
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            if(confirm('¿Está seguro de eliminar este proceso?')) {
            const id = this.getAttribute('data-id');
            const index = procesos.findIndex(p => p.id == id);
            if(index !== -1) {
                procesos.splice(index, 1);
                cargarTablaProcesos();
            }
            }
        });
        });
    }
    });

  // Configuración inicial
  document.addEventListener('DOMContentLoaded', function() {
    inicializarPaginacion();
    configurarEventosClick();
  });

// Configurar eventos de click en las filas (excepto columnas CI, CV, NM)
function configurarEventosClick() {
  document.querySelectorAll('.clickable-row').forEach(cell => {
    cell.addEventListener('click', function(e) {
      // Evitar que el click se propague a los botones de PDF
      if(e.target.classList.contains('pdf-btn')) return;
      
      const fila = this.closest('tr');
      const modal = new bootstrap.Modal(document.getElementById('modalPostulante'));
      
      // Llenar datos básicos automáticos
      document.getElementById('modalNombre').value = fila.getAttribute('data-nombre') || '';
      document.getElementById('modalCI').value = fila.getAttribute('data-ci') || '';
      document.getElementById('modalExtension').value = fila.getAttribute('data-extension') || '';
      document.getElementById('modalFechaNacimiento').value = fila.getAttribute('data-fechanacimiento') || '';
      
      // Configurar evento para el proceso de contratación
      const selectProceso = document.getElementById('modalProcesoContratacion');
      selectProceso.addEventListener('change', function() {
        // Lógica para llenar automáticamente según proceso seleccionado
        const proceso = this.value;
        
        // Ejemplo temporal - reemplazar con llamada a BD
        if(proceso === 'operador_rural') {
          document.getElementById('modalMonto').value = '1500';
          document.getElementById('modalMontoLiteral').value = 'Mil quinientos bolivianos';
          document.getElementById('modalCantidadCasos').value = '10';
        } else if(proceso === 'operador_urbano') {
          document.getElementById('modalMonto').value = '1800';
          document.getElementById('modalMontoLiteral').value = 'Mil ochocientos bolivianos';
          document.getElementById('modalCantidadCasos').value = '12';
        }
        // Añadir más casos según sea necesario
      });
      
      // Mostrar modal
      modal.show();
    });
  });
}

  // Función para exportar a Excel
  document.getElementById('exportarExcel').addEventListener('click', function() {
    const tabla = document.getElementById('tablaPostulantes');
    const wb = XLSX.utils.table_to_book(tabla);
    XLSX.writeFile(wb, 'asesoria_legal.xlsx');
  });

  // Funciones de paginación
  function inicializarPaginacion() {
    const filas = Array.from(document.querySelectorAll('#tablaPostulantes tbody tr'));
    mostrarPagina(1, filas);
  }

  function filtrarFilas() {
    const filtro = document.getElementById('buscador').value.toLowerCase();
    const filas = Array.from(document.querySelectorAll('#tablaPostulantes tbody tr'));
    
    const filasFiltradas = filas.filter(fila => {
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
    document.querySelectorAll('#tablaPostulantes tbody tr').forEach(fila => {
      fila.style.display = 'none';
    });
    
    // Mostrar solo las filas de la página actual
    filas.slice(inicio, fin).forEach(fila => {
      fila.style.display = '';
    });
    
    actualizarPaginacion(filas.length);
  }

  function actualizarPaginacion(totalFilas) {
    const filasPorPagina = 5;
    const totalPaginas = Math.ceil(totalFilas / filasPorPagina);
    const paginacion = document.getElementById('paginacion');
    paginacion.innerHTML = '';
    
    if (totalPaginas <= 1) return;
    
    // Botón Anterior
    const liPrev = document.createElement('li');
    liPrev.className = 'page-item';
    liPrev.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
    liPrev.addEventListener('click', e => {
      e.preventDefault();
      if (paginaActual > 1) mostrarPagina(paginaActual - 1, getFilasVisibles());
    });
    paginacion.appendChild(liPrev);
    
    // Botones de página
    for (let i = 1; i <= totalPaginas; i++) {
      const li = document.createElement('li');
      li.className = 'page-item';
      li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      li.addEventListener('click', e => {
        e.preventDefault();
        mostrarPagina(i, getFilasVisibles());
      });
      paginacion.appendChild(li);
    }
    
    // Botón Siguiente
    const liNext = document.createElement('li');
    liNext.className = 'page-item';
    liNext.innerHTML = `<a class="page-link" href="#">Siguiente</a>`;
    liNext.addEventListener('click', e => {
      e.preventDefault();
      if (paginaActual < totalPaginas) mostrarPagina(paginaActual + 1, getFilasVisibles());
    });
    paginacion.appendChild(liNext);
  }

  function getFilasVisibles() {
    const filtro = document.getElementById('buscador').value.toLowerCase();
    const todasFilas = Array.from(document.querySelectorAll('#tablaPostulantes tbody tr'));
    
    if (!filtro) return todasFilas;
    
    return todasFilas.filter(fila => {
      const nombre = fila.cells[0].textContent.toLowerCase();
      const ci = fila.cells[1].textContent.toLowerCase();
      return nombre.includes(filtro) || ci.includes(filtro);
    });
  }

  // Buscador + Paginación (solo búsqueda por nombre y CI)
  const buscador = document.getElementById('buscador');
  const tabla = document.getElementById('tablaPostulantes').getElementsByTagName('tbody')[0];
  const paginacion = document.getElementById('paginacion');
  const filasPorPagina = 5;
  let paginaActual = 1;
  let filasFiltradas = [];

  function mostrarPagina(pagina) {
    paginaActual = pagina;
    const inicio = (pagina - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;

    for (const fila of tabla.rows) {
      fila.style.display = 'none';
    }

    filasFiltradas.slice(inicio, fin).forEach(fila => {
      fila.style.display = '';
    });

    actualizarPaginacion();
  }

  function actualizarPaginacion() {
    paginacion.innerHTML = '';
    const totalPaginas = Math.ceil(filasFiltradas.length / filasPorPagina);
    if (totalPaginas <= 1) return;

    // Botón Anterior
    const liPrev = document.createElement('li');
    liPrev.className = 'page-item ' + (paginaActual === 1 ? 'disabled' : '');
    const aPrev = document.createElement('a');
    aPrev.className = 'page-link';
    aPrev.href = '#';
    aPrev.textContent = 'Anterior';
    aPrev.addEventListener('click', e => {
      e.preventDefault();
      if (paginaActual > 1) mostrarPagina(paginaActual - 1);
    });
    liPrev.appendChild(aPrev);
    paginacion.appendChild(liPrev);

    // Botones numéricos
    for (let i = 1; i <= totalPaginas; i++) {
      const li = document.createElement('li');
      li.className = 'page-item ' + (paginaActual === i ? 'active' : '');
      const a = document.createElement('a');
      a.className = 'page-link';
      a.href = '#';
      a.textContent = i;
      a.addEventListener('click', e => {
        e.preventDefault();
        mostrarPagina(i);
      });
      li.appendChild(a);
      paginacion.appendChild(li);
    }

    // Botón Siguiente
    const liNext = document.createElement('li');
    liNext.className = 'page-item ' + (paginaActual === totalPaginas ? 'disabled' : '');
    const aNext = document.createElement('a');
    aNext.className = 'page-link';
    aNext.href = '#';
    aNext.textContent = 'Siguiente';
    aNext.addEventListener('click', e => {
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

  buscador.addEventListener('input', () => {
    filtrarFilas();
    mostrarPagina(1);
  });


  window.addEventListener('load', inicializar);

  //exportar excel
  document.getElementById('exportarExcel').addEventListener('click', function() {
    const tabla = document.getElementById('tablaPostulantes');
    const wb = XLSX.utils.table_to_book(tabla);
    XLSX.writeFile(wb, 'asesoria_legal.xlsx');
  });