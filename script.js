// REEMPLAZA AQUÍ CON TU URL DE GOOGLE APPS SCRIPT
const URL_WEB_APP = "https://script.google.com/macros/s/AKfycbwLZhT0JefeEBciksR4V2QWQbfl3-ke6hEOik_yGkw1eX7tBT0WcNte1Recl_nse9KV/exec";

// Cambiar Pestañas Principales
function cambiarPestana(idPestana, botonElemento) {
  document.querySelectorAll('.btn-pestana').forEach(btn => btn.classList.remove('activa'));
  document.querySelectorAll('.contenido-pestana').forEach(sec => sec.classList.remove('activa'));

  if (botonElemento) {
    botonElemento.classList.add('activa');
  }
  const seccion = document.getElementById(idPestana);
  if (seccion) {
    seccion.classList.add('activa');
  }
}

// Sub-pestañas Novanet
function cambiarSubPestana(idSubPestana, botonElemento) {
  const contenedor = document.getElementById('atencionNovanet');
  if (!contenedor) return;

  contenedor.querySelectorAll('.btn-sub-pestana').forEach(btn => btn.classList.remove('activa'));
  contenedor.querySelectorAll('.contenido-sub-pestana').forEach(sec => sec.classList.remove('activa'));

  if (botonElemento) {
    botonElemento.classList.add('activa');
  }
  const seccion = document.getElementById(idSubPestana);
  if (seccion) {
    seccion.classList.add('activa');
  }
}

// Sub-pestañas Filantropis
function cambiarSubPestanaFil(idSubPestana, botonElemento) {
  const contenedor = document.getElementById('llamadasFilantropis');
  if (!contenedor) return;

  contenedor.querySelectorAll('.btn-sub-pestana').forEach(btn => btn.classList.remove('activa'));
  contenedor.querySelectorAll('.contenido-sub-pestana-fil').forEach(sec => sec.classList.remove('activa'));

  if (botonElemento) {
    botonElemento.classList.add('activa');
  }
  const seccion = document.getElementById(idSubPestana);
  if (seccion) {
    seccion.classList.add('activa');
  }
}

// --- ENVÍO DE CITA DE NOVANET A GOOGLE SHEETS ---
const formCita = document.getElementById('formCitaNovanet');
const btnGuardarCita = document.getElementById('btnGuardarCita');
const mensajeExitoCita = document.getElementById('mensajeExitoCita');
const mensajeErrorCita = document.getElementById('mensajeErrorCita');
const correoCampo = document.getElementById('correoCliente');

if (formCita) {
  formCita.addEventListener('submit', function(e) {
    e.preventDefault();

    mensajeExitoCita.classList.add('oculto');
    mensajeErrorCita.classList.add('oculto');
    btnGuardarCita.innerText = "Guardando Cita en Google Sheets...";
    btnGuardarCita.disabled = true;
    
    const datosCita = {
      nombre: document.getElementById('nombreCliente').value,
      dpi: document.getElementById('dpiCliente').value || "No indicado",
      telefono: document.getElementById('telefonoCliente').value,
      correo: (correoCampo && correoCampo.value.trim() !== "") ? correoCampo.value : "No indicado",
      ubicacion: document.getElementById('ubicacionCliente').value,
      fechaVisita: document.getElementById('fechaCita').value,
      horaCompromiso: document.getElementById('horaCita').value
    };

    fetch(URL_WEB_APP, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosCita)
    })
    .then(() => {
      btnGuardarCita.innerText = "Guardar Cita en la Base de Datos";
      btnGuardarCita.disabled = false;
      mensajeExitoCita.classList.remove('oculto');
      formCita.reset();
    })
    .catch(error => {
      console.error('Error:', error);
      btnGuardarCita.innerText = "Guardar Cita en la Base de Datos";
      btnGuardarCita.disabled = false;
      mensajeErrorCita.classList.remove('oculto');
    });
  });
}

// --- SISTEMA DE PLANTILLAS Y PLANES NOVANET (LOCALSTORAGE) ---
document.addEventListener('DOMContentLoaded', () => {
  cargarPlantillasGuardadas();
  cargarPlanesNovanet();
});

function guardarPlantillaLocal() {
  const titulo = document.getElementById('nombrePlantilla').value;
  const texto = document.getElementById('contenidoPlantilla').value;

  if (!titulo || !texto) {
    alert("Por favor escribe tanto el título como el contenido de la plantilla.");
    return;
  }

  let plantillas = JSON.parse(localStorage.getItem('plantillasFilantropis')) || [];
  plantillas.push({ id: Date.now(), titulo: titulo, texto: texto });
  localStorage.setItem('plantillasFilantropis', JSON.stringify(plantillas));

  document.getElementById('nombrePlantilla').value = "";
  document.getElementById('contenidoPlantilla').value = "";

  cargarPlantillasGuardadas();
  alert("¡Plantilla guardada con éxito!");
}

function cargarPlantillasGuardadas() {
  const contenedor = document.getElementById('listaPlantillasGuardadas');
  if (!contenedor) return;

  let plantillas = JSON.parse(localStorage.getItem('plantillasFilantropis')) || [];

  if (plantillas.length === 0) {
    contenedor.innerHTML = '<p style="color: #64748b; font-size: 13.5px;">No hay plantillas personalizadas guardadas aún.</p>';
    return;
  }

  contenedor.innerHTML = "";
  plantillas.forEach(item => {
    const div = document.createElement('div');
    div.className = "tarjeta-plantilla-guardada";
    div.innerHTML = `
      <h5>📌 ${item.titulo}</h5>
      <p>${item.texto}</p>
      <button class="btn-eliminar-plantilla" onclick="eliminarPlantilla(${item.id})">🗑️ Eliminar Plantilla</button>
    `;
    contenedor.appendChild(div);
  });
}

function eliminarPlantilla(id) {
  let plantillas = JSON.parse(localStorage.getItem('plantillasFilantropis')) || [];
  plantillas = plantillas.filter(p => p.id !== id);
  localStorage.setItem('plantillasFilantropis', JSON.stringify(plantillas));
  cargarPlantillasGuardadas();
}

function guardarPlanNovanet() {
  const titulo = document.getElementById('tituloPlan').value;
  const detalles = document.getElementById('detallesPlan').value;

  if (!titulo || !detalles) {
    alert("Por favor completa el nombre del plan y sus detalles.");
    return;
  }

  let planes = JSON.parse(localStorage.getItem('planesNovanet')) || [];
  planes.push({ id: Date.now(), titulo: titulo, detalles: detalles });
  localStorage.setItem('planesNovanet', JSON.stringify(planes));

  document.getElementById('tituloPlan').value = "";
  document.getElementById('detallesPlan').value = "";

  cargarPlanesNovanet();
  alert("¡Plan de Novanet agregado al catálogo!");
}

function cargarPlanesNovanet() {
  const contenedor = document.getElementById('listaPlanesNovanet');
  if (!contenedor) return;

  let planes = JSON.parse(localStorage.getItem('planesNovanet')) || [
    { id: 1, titulo: "📶 Plan Hogar Básico (10 MB)", detalles: "Q150/mes. Ideal para estudio, redes sociales y llamadas en casa." },
    { id: 2, titulo: "🚀 Plan Comercial / Institucional", detalles: "Enlace dedicado de alta estabilidad para oficinas y organizaciones." }
  ];

  if (planes.length === 0) {
    contenedor.innerHTML = '<p style="color: #64748b; font-size: 13.5px;">No hay planes registrados.</p>';
    return;
  }

  contenedor.innerHTML = "";
  planes.forEach(item => {
    const div = document.createElement('div');
    div.className = "tarjeta-plantilla-guardada";
    div.style.borderLeftColor = "#ea580c";
    div.innerHTML = `
      <h5>${item.titulo}</h5>
      <p>${item.detalles}</p>
      <button class="btn-eliminar-plantilla" onclick="eliminarPlanNovanet(${item.id})" style="background: #dc2626;">🗑️ Eliminar Plan</button>
    `;
    contenedor.appendChild(div);
  });
}

function eliminarPlanNovanet(id) {
  let planes = JSON.parse(localStorage.getItem('planesNovanet')) || [];
  planes = planes.filter(p => p.id !== id);
  localStorage.setItem('planesNovanet', JSON.stringify(planes));
  cargarPlanesNovanet();
}