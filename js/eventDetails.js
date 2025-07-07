function verDetalles(evento) {
      document.getElementById('modal-img').src = evento.imagen;
      document.getElementById('modal-title').textContent = evento.titulo;
      document.getElementById('modal-desc').textContent = evento.descripcion;
      document.getElementById('modal-horario').textContent = evento.horario || 'Por confirmar';
      document.getElementById('modal-ubicacion').textContent = evento.ubicacion || 'Por definir';
      document.getElementById('modal-edad').textContent = evento.edad || 'Todas las edades';
      document.getElementById('evento-modal').classList.add('active');
    }

    function cerrarModal() {
      document.getElementById('evento-modal').classList.remove('active');
    }