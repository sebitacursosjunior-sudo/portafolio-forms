document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('gymdogForm');
  const formAlert = document.getElementById('formAlert');
  const summaryCard = document.getElementById('summaryCard');
  const summaryText = document.getElementById('summaryText');
  const resetBtn = document.getElementById('resetBtn');

  const formScreen = document.getElementById('formScreen');
  const adminScreen = document.getElementById('adminScreen');

  // Elementos de Celebración
  const celebrationModal = document.getElementById('celebrationModal');
  const celebrationPetMsg = document.getElementById('celebrationPetMsg');
  const closeCelebrationBtn = document.getElementById('closeCelebrationBtn');
  const confettiCanvas = document.getElementById('confettiCanvas');

  // Elementos de Admin y Data View
  const openAdminLoginBtn = document.getElementById('openAdminLoginBtn');
  const adminLoginModal = document.getElementById('adminLoginModal');
  const closeLoginBtn = document.getElementById('closeLoginBtn');
  const submitLoginBtn = document.getElementById('submitLoginBtn');
  const adminUser = document.getElementById('adminUser');
  const adminPass = document.getElementById('adminPass');
  const loginError = document.getElementById('loginError');

  const backToFormBtn = document.getElementById('backToFormBtn');
  const addNewPetBtn = document.getElementById('addNewPetBtn');
  const resetTableBtn = document.getElementById('resetTableBtn');
  const exportExcelBtn = document.getElementById('exportExcelBtn');
  const exportPdfBtn = document.getElementById('exportPdfBtn');
  const excelTableBody = document.getElementById('excelTableBody');

  let confettiAnimationId = null;

  // 3 DATOS FICTICIOS INICIALES
  const defaultRecords = [
    {
      mascota: { nombre: "Max", tamano: "Grande", etapa: "Adulto joven", energia: "Inagotable", objetivos: ["Control de peso", "Agility"], socializacion: "Sí, sociable", vacunas: "Al día", notasMedicas: "Ninguna" },
      dueno: { nombreCompleto: "Carlos Ruiz", telefono: "+56911223344", correo: "carlos.ruiz@correo.com" }
    },
    {
      mascota: { nombre: "Luna", tamano: "Pequeño", etapa: "Cachorro", energia: "Equilibrado", objetivos: ["Socialización"], socializacion: "Sí, sociable", vacunas: "Al día", notasMedicas: "Sensible al ruido" },
      dueno: { nombreCompleto: "Andrea Soto", telefono: "+56988776655", correo: "andrea.soto@correo.com" }
    },
    {
      mascota: { nombre: "Thor", tamano: "Gigante", etapa: "Senior", energia: "Tranquilo", objetivos: ["Movilidad"], socializacion: "Selectivo", vacunas: "Pendiente", notasMedicas: "Displasia leve" },
      dueno: { nombreCompleto: "Matías Rojas", telefono: "+56933445566", correo: "matias.rojas@correo.com" }
    }
  ];

  let sessionRecords = JSON.parse(JSON.stringify(defaultRecords));

  // Envío del Formulario principal
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    ocultarAlerta();

    const petName = document.getElementById('petName').value.trim();
    const petBreed = document.getElementById('petBreed').value;
    const petAge = document.getElementById('petAge').value;
    const energyLevel = document.getElementById('energyLevel').value;
    const socialization = document.getElementById('socialization').value;
    const vaccines = document.getElementById('vaccines').value;
    const medicalNotes = document.getElementById('medicalNotes').value.trim() || 'Sin observaciones';

    const selectedGoals = Array.from(document.querySelectorAll('input[name="goals"]:checked'))
      .map(cb => cb.value);

    const ownerName = document.getElementById('ownerName').value.trim();
    const ownerPhone = document.getElementById('ownerPhone').value.trim();
    const ownerEmail = document.getElementById('ownerEmail').value.trim();

    if (!petName || !petBreed || !petAge || !energyLevel || !socialization || !vaccines) {
      mostrarError('Por favor, completa todos los campos obligatorios de la mascota.');
      return;
    }

    if (selectedGoals.length === 0) {
      mostrarError('Selecciona al menos un objetivo principal para el entrenamiento de tu mascota.');
      return;
    }

    if (!ownerName || !ownerPhone || !ownerEmail) {
      mostrarError('Por favor, completa todos los datos de contacto del tutor.');
      return;
    }

    if (!validarEmail(ownerEmail)) {
      mostrarError('Ingresa un correo electrónico válido.');
      return;
    }

    sessionRecords.push({
      mascota: {
        nombre: petName,
        tamano: petBreed,
        etapa: petAge,
        energia: energyLevel,
        objetivos: selectedGoals,
        socializacion: socialization,
        vacunas: vaccines,
        notasMedicas: medicalNotes
      },
      dueno: {
        nombreCompleto: ownerName,
        telefono: ownerPhone,
        correo: ownerEmail
      }
    });

    summaryText.innerHTML = `
      <strong>${petName}</strong> ha sido pre-inscrito correctamente bajo la tutela de <strong>${ownerName}</strong>.<br>
      Objetivos asignados: <em>${selectedGoals.join(', ')}</em>.<br>
      Enviaremos el horario de evaluación inicial a <strong>${ownerEmail}</strong> o vía WhatsApp al <strong>${ownerPhone}</strong>.
    `;

    form.classList.add('hidden');
    summaryCard.classList.remove('hidden');

    celebrationPetMsg.textContent = `¡${petName} ya está listo para entrenar!`;
    celebrationModal.classList.remove('hidden');
    reproducirLadrido();
    iniciarConfeti();
  });

  closeCelebrationBtn.addEventListener('click', () => {
    celebrationModal.classList.add('hidden');
    detenerConfeti();
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    ocultarAlerta();
    summaryCard.classList.add('hidden');
    form.classList.remove('hidden');
  });

  // --- LÓGICA DE ADMINISTRADOR / DATA VIEW ---
  openAdminLoginBtn.addEventListener('click', () => {
    adminUser.value = '';
    adminPass.value = '';
    loginError.classList.add('hidden');
    adminLoginModal.classList.remove('hidden');
  });

  closeLoginBtn.addEventListener('click', () => {
    adminLoginModal.classList.add('hidden');
  });

  submitLoginBtn.addEventListener('click', () => {
    const userVal = adminUser.value.trim();
    const passVal = adminPass.value.trim();

    if (userVal === 'admin1' && passVal === 'admin1234') {
      adminLoginModal.classList.add('hidden');
      formScreen.classList.add('hidden');
      renderExcelTable();
      adminScreen.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      loginError.textContent = 'Usuario o contraseña incorrectos. (Prueba admin1 / admin1234)';
      loginError.classList.remove('hidden');
    }
  });

  // Botón Volver al formulario
  backToFormBtn.addEventListener('click', () => {
    adminScreen.classList.add('hidden');
    formScreen.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Botón Agregar nueva mascota (desde el Data View)
  addNewPetBtn.addEventListener('click', () => {
    form.reset();
    ocultarAlerta();
    summaryCard.classList.add('hidden');
    form.classList.remove('hidden');
    adminScreen.classList.add('hidden');
    formScreen.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Botón Resetear tabla
  resetTableBtn.addEventListener('click', () => {
    sessionRecords = JSON.parse(JSON.stringify(defaultRecords));
    renderExcelTable();
  });

  // Botón Exportar a Excel (.xlsx real con SheetJS)
  exportExcelBtn.addEventListener('click', () => {
    const dataToExport = sessionRecords.map((item, index) => ({
      "#": index + 1,
      "Mascota": item.mascota.nombre,
      "Tamaño": item.mascota.tamano,
      "Edad": item.mascota.etapa,
      "Energía": item.mascota.energia,
      "Objetivos": item.mascota.objetivos.join(', '),
      "Sociable": item.mascota.socializacion,
      "Vacunas": item.mascota.vacunas,
      "Notas Médicas": item.mascota.notasMedicas,
      "Tutor": item.dueno.nombreCompleto,
      "Teléfono": item.dueno.telefono,
      "Correo": item.dueno.correo
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inscripciones GimDog");
    XLSX.writeFile(workbook, "gimdog_inscripciones.xlsx");
  });

  // Botón Exportar a PDF (Imprimir navegador)
  exportPdfBtn.addEventListener('click', () => {
    window.print();
  });

  // Renderizar filas en la tabla Data View
  function renderExcelTable() {
    excelTableBody.innerHTML = '';
    sessionRecords.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${index + 1}</strong></td>
        <td>${item.mascota.nombre}</td>
        <td>${item.mascota.tamano}</td>
        <td>${item.mascota.etapa}</td>
        <td>${item.mascota.energia}</td>
        <td>${item.mascota.objetivos.join(', ')}</td>
        <td>${item.mascota.socializacion}</td>
        <td>${item.mascota.vacunas}</td>
        <td>${item.mascota.notasMedicas}</td>
        <td><strong>${item.dueno.nombreCompleto}</strong></td>
        <td>${item.dueno.telefono}</td>
        <td>${item.dueno.correo}</td>
      `;
      excelTableBody.appendChild(tr);
    });
  }

  function mostrarError(mensaje) {
    formAlert.textContent = mensaje;
    formAlert.className = 'alert alert-error';
  }

  function ocultarAlerta() {
    formAlert.className = 'alert hidden';
    formAlert.textContent = '';
  }

  function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // --- AUDIO DE LADRIDO ---
  function reproducirLadrido() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();

      const crearGuau = (tiempoInicio, duracion, freqInicial, freqPico) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freqInicial, tiempoInicio);
        osc.frequency.exponentialRampToValueAtTime(freqPico, tiempoInicio + duracion * 0.35);
        osc.frequency.exponentialRampToValueAtTime(freqInicial * 0.75, tiempoInicio + duracion);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(650, tiempoInicio);
        filter.Q.setValueAtTime(2.5, tiempoInicio);

        gain.gain.setValueAtTime(0.01, tiempoInicio);
        gain.gain.linearRampToValueAtTime(0.45, tiempoInicio + duracion * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, tiempoInicio + duracion);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(tiempoInicio);
        osc.stop(tiempoInicio + duracion);
      };

      const ahora = ctx.currentTime;
      crearGuau(ahora, 0.18, 220, 480);
      crearGuau(ahora + 0.26, 0.22, 240, 520);
    } catch (err) {
      console.warn('Audio bloqueado:', err);
    }
  }

  // --- CONFETI ---
  function iniciarConfeti() {
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const colores = ['#FF6B00', '#FF3B30', '#0094FF', '#FFD166', '#FFFFFF'];
    const particulas = Array.from({ length: 130 }, () => ({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      w: Math.random() * 10 + 6,
      h: Math.random() * 6 + 4,
      color: colores[Math.floor(Math.random() * colores.length)],
      velY: Math.random() * 3.5 + 2,
      velX: Math.random() * 2 - 1,
      angulo: Math.random() * 360,
      velAngulo: Math.random() * 6 - 3
    }));

    function animar() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      particulas.forEach((p) => {
        p.y += p.velY;
        p.x += p.velX;
        p.angulo += p.velAngulo;

        if (p.y > confettiCanvas.height) {
          p.y = -15;
          p.x = Math.random() * confettiCanvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angulo * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      confettiAnimationId = requestAnimationFrame(animar);
    }

    animar();
  }

  function detenerConfeti() {
    if (confettiAnimationId) {
      cancelAnimationFrame(confettiAnimationId);
      confettiAnimationId = null;
    }
  }
});