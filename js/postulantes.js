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

  // Configurar eventos para los selects de estado
  document.querySelectorAll('.estado-select').forEach(select => {
    select.addEventListener('change', function() {
      const estado = this.value;
      const postulanteId = this.getAttribute('data-postulante-id');
      const fila = document.querySelector(`tr[data-id="${postulanteId}"]`);
      
      // Remover clases anteriores
      fila.classList.remove('estado-descartado', 'estado-seleccionado', 'estado-norevisado');
      
      // Aplicar nueva clase según estado
      if(estado === 'DESCARTADO') {
        fila.classList.add('estado-descartado');
        mostrarModalMotivoDescarto(postulanteId);
      } else if(estado === 'SELECCIONADO') {
        fila.classList.add('estado-seleccionado');
      } else {
        fila.classList.add('estado-norevisado');
      }
    });
  });

  function mostrarModalMotivoDescarto(postulanteId) {
    document.getElementById('postulanteDescartadoId').value = postulanteId;
    document.getElementById('motivoDescarto').value = '';
    const modal = new bootstrap.Modal(document.getElementById('modalMotivoDescarto'));
    modal.show();
  }

  // Formulario motivo de descarte
  document.getElementById('formMotivoDescarto').addEventListener('submit', function(e) {
    e.preventDefault();
    const motivo = document.getElementById('motivoDescarto').value;
    const postulanteId = document.getElementById('postulanteDescartadoId').value;
    
    // Aquí puedes guardar el motivo en tu base de datos
    console.log(`Postulante ID: ${postulanteId}, Motivo: ${motivo}`);
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalMotivoDescarto'));
    modal.hide();
  });

  window.addEventListener('load', inicializar);

  //exportar excel
  document.getElementById('exportarExcel').addEventListener('click', function() {
    const tabla = document.getElementById('tablaPostulantes');
    const wb = XLSX.utils.table_to_book(tabla);
    XLSX.writeFile(wb, 'postulantes.xlsx');
  });

  document.addEventListener('DOMContentLoaded', function() {
    const tabla = document.querySelector('#tablaPostulantes tbody');
    
    // datos de prueba
    const postulantes = [
        {
        id: 1,
        nombre: 'Juan Pérez',
        ci: '1234567',
        celular: '71234567',
        nro_experiencia: 5,
        curriculum : 'http://ingenieria.cunoc.usac.edu.gt/portal/articulos/09113cb13b803aeb110a7dd569af49a3e4632073.pdf',
        carnet_identidad: 'http://ingenieria.cunoc.usac.edu.gt/portal/articulos/09113cb13b803aeb110a7dd569af49a3e4632073.pdf',
        no_militancia: 'http://ingenieria.cunoc.usac.edu.gt/portal/articulos/09113cb13b803aeb110a7dd569af49a3e4632073.pdf',
        captura_pantalla: 'http://ingenieria.cunoc.usac.edu.gt/portal/articulos/09113cb13b803aeb110a7dd569af49a3e4632073.pdf',
        estado: 'NO_REVISADO',
        },
        {
        id: 2,
        nombre: 'Juan Soliz',
        ci: '1123123',
        celular: 'asdw2323',
        nro_experiencia: 5,
        curriculum : 'http://ingenieria.cunoc.usac.edu.gt/portal/articulos/09113cb13b803aeb110a7dd569af49a3e4632073.pdf',
        carnet_identidad: 'http://ingenieria.cunoc.usac.edu.gt/portal/articulos/09113cb13b803aeb110a7dd569af49a3e4632073.pdf',
        no_militancia: 'http://ingenieria.cunoc.usac.edu.gt/portal/articulos/09113cb13b803aeb110a7dd569af49a3e4632073.pdf',
        captura_pantalla: 'http://ingenieria.cunoc.usac.edu.gt/portal/articulos/09113cb13b803aeb110a7dd569af49a3e4632073.pdf',
        estado: 'NO_REVISADO',
        },
        {
        id: 3,
        nombre: 'Pedro Soliz',
        ci: '33322112',
        celular: '76285852',
        nro_experiencia: 2,
        curriculum : 'http://ingenieria.cunoc.usac.edu.gt/portal/articulos/09113cb13b803aeb110a7dd569af49a3e4632073.pdf',
        carnet_identidad: 'http://ingenieria.cunoc.usac.edu.gt/portal/articulos/09113cb13b803aeb110a7dd569af49a3e4632073.pdf',
        no_militancia: 'http://ingenieria.cunoc.usac.edu.gt/portal/articulos/09113cb13b803aeb110a7dd569af49a3e4632073.pdf',
        captura_pantalla: 'http://ingenieria.cunoc.usac.edu.gt/portal/articulos/09113cb13b803aeb110a7dd569af49a3e4632073.pdf',
        estado: 'NO_REVISADO',
        }
    ];

    postulantes.forEach(postulante => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${postulante.nombre}</td>
            <td>${postulante.ci}</td>
            <td>${postulante.celular}</td>
            <td>${postulante.nro_experiencia}</td>
            <td>
                <button class="btn btn-outline-info btn-sm ver-archivo" data-url="${postulante.curriculum}">
                    <i class="fas fa-file-pdf"></i>
                </button>
            </td>
            <td>
                <button class="btn btn-outline-info btn-sm ver-archivo" data-url="${postulante.carnet_identidad}">
                    <i class="fas fa-file-pdf"></i>
                </button>
            </td>
            <td>
                <button class="btn btn-outline-info btn-sm ver-archivo" data-url="${postulante.no_militancia}">
                    <i class="fas fa-file-pdf"></i>
                </button>
            </td>
            <td>
                <button class="btn btn-outline-info btn-sm ver-archivo" data-url="${postulante.captura_pantalla}">
                    <i class="fas fa-file-pdf"></i>
                </button>
            </td>
            <td>
                <select class="form-select estado-select" data-id="${postulante.id}">
                <option value="NO REVISADO">NO REVISADO</option>
                <option value="DESCARTADO">DESCARTADO</option>
                <option value="SELECCIONADO">SELECCIONADO</option>
                </select>
            </td>
            <td>
                <button class="btn btn-success btn-sm guardar-estado" data-id="${postulante.id}">
                    Guardar
                </button>
            </td>
        `;
        tabla.appendChild(tr);

    })

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('ver-archivo')) {
        const url = e.target.dataset.url;
        // Aquí puedes abrir un modal y cargar el archivo con iframe o embed
        window.open(url, '_blank');
        }   
    });

    // Guardar estado (simulado)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('guardar-estado')) {
        const id = e.target.dataset.id;
        const select = document.querySelector(`.estado-select[data-id="${id}"]`);
        const nuevoEstado = select.value;
        alert(`Guardando estado del ID ${id}: ${nuevoEstado}`);
        // Aquí simularías un fetch PUT o POST si tuvieras el backend
        }
    });

  });