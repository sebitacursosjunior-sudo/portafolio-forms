document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('gymdogForm');
  const formAlert = document.getElementById('formAlert');
  const summaryCard = document.getElementById('summaryCard');
  const summaryText = document.getElementById('summaryText');
  const resetBtn = document.getElementById('resetBtn');

  // Elementos del Modal de Celebración
  const celebrationModal = document.getElementById('celebrationModal');
  const celebrationPetMsg = document.getElementById('celebrationPetMsg');
  const closeCelebrationBtn = document.getElementById('closeCelebrationBtn');
  const confettiCanvas = document.getElementById('confettiCanvas');

  let confettiAnimationId = null;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    ocultarAlerta();

    // Captura de valores - Mascota
    const petName = document.getElementById('petName').value.trim();
    const petBreed = document.getElementById('petBreed').value;
    const petAge = document.getElementById('petAge').value;
    const energyLevel = document.getElementById('energyLevel').value;
    const socialization = document.getElementById('socialization').value;
    const vaccines = document.getElementById('vaccines').value;
    const medicalNotes = document.getElementById('medicalNotes').value.trim() || 'Sin observaciones';

    // Captura de objetivos (checkboxes)
    const selectedGoals = Array.from(document.querySelectorAll('input[name="goals"]:checked'))
      .map(cb => cb.nextElementSibling.textContent);

    // Captura de valores - Dueño
    const ownerName = document.getElementById('ownerName').value.trim();
    const ownerPhone = document.getElementById('ownerPhone').value.trim();
    const ownerEmail = document.getElementById('ownerEmail').value.trim();

    // Validaciones
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

    // Preparamos el texto de la Ficha de Ingreso (quedará lista debajo)
    summaryText.innerHTML = `
      <strong>${petName}</strong> ha sido pre-inscrito correctamente bajo la tutela de <strong>${ownerName}</strong>.<br>
      Objetivos asignados: <em>${selectedGoals.join(', ')}</em>.<br>
      Enviaremos el horario de evaluación inicial a <strong>${ownerEmail}</strong> o vía WhatsApp al <strong>${ownerPhone}</strong>.
    `;

    form.classList.add('hidden');
    summaryCard.classList.remove('hidden');

    // Lanzamos la celebración (Sonido + Emoticón + Confeti)
    celebrationPetMsg.textContent = `¡${petName} ya está listo para entrenar!`;
    celebrationModal.classList.remove('hidden');
    reproducirLadrido();
    iniciarConfeti();
  });

  // Cerrar el modal con la X para leer la Ficha de Ingreso
  closeCelebrationBtn.addEventListener('click', () => {
    celebrationModal.classList.add('hidden');
    detenerConfeti();
  });

  // Botón para registrar otra mascota
  resetBtn.addEventListener('click', () => {
    form.reset();
    ocultarAlerta();
    summaryCard.classList.add('hidden');
    form.classList.remove('hidden');
  });

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

  // --- GENERADOR DE SONIDO DE LADRIDO (WEB AUDIO API) ---
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
      // Doble ladrido alegre ("¡Guau, guau!")
      crearGuau(ahora, 0.18, 220, 480);
      crearGuau(ahora + 0.26, 0.22, 240, 520);
    } catch (err) {
      console.warn('El navegador bloqueó el audio automático:', err);
    }
  }

  // --- ANIMACIÓN DE CONFETI CON LOS COLORES DE GIMDOG ---
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