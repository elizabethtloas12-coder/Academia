document.addEventListener('DOMContentLoaded', () => {
  /* ================= 1. MENÚ MÓVIL ================= */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggle.addEventListener('click', () => {
    const isExpanded = nav.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ================= 2. CARRUSEL RESPONSIVO Y TÁCTIL ================= */
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');
  const viewport = document.getElementById('carouselViewport');
  const cards = Array.from(track.children);

  let currentIndex = 0;
  let cardsPerView = getCardsPerView();

  function getCardsPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - cardsPerView);
  }

  function renderDots() {
    dotsContainer.innerHTML = '';
    const totalPositions = getMaxIndex() + 1;

    for (let i = 0; i < totalPositions; i++) {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      if (i === currentIndex) dot.classList.add('active');
      dot.setAttribute('aria-label', `Ir a posición ${i + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateCarousel() {
    const gap = 24;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : getMaxIndex();
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = currentIndex < getMaxIndex() ? currentIndex + 1 : 0;
    updateCarousel();
  });

  // Soporte táctil (Swipe en móviles)
  let touchStartX = 0;
  viewport.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        currentIndex = currentIndex < getMaxIndex() ? currentIndex + 1 : 0;
      } else {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : getMaxIndex();
      }
      updateCarousel();
    }
  });

  // Recalcular al cambiar el tamaño de la pantalla
  window.addEventListener('resize', () => {
    const newCardsPerView = getCardsPerView();
    if (newCardsPerView !== cardsPerView) {
      cardsPerView = newCardsPerView;
      if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
      renderDots();
    }
    updateCarousel();
  });

  // Inicializar carrusel
  renderDots();
  updateCarousel();

  /* ================= 3. MODALES (INSCRIPCIÓN Y DETALLES) ================= */
  const inscripcionModal = document.getElementById('inscripcionModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const openInscripcionBtns = document.querySelectorAll('[data-open-modal="inscripcion"]');
  const enrollForm = document.getElementById('enrollForm');
  const formFeedback = document.getElementById('formFeedback');
  const styleSelect = document.getElementById('danceStyleSelect');

  function openInscripcion(preselectedStyle = '') {
    formFeedback.textContent = '';
    if (preselectedStyle) {
      styleSelect.value = preselectedStyle;
    }
    inscripcionModal.classList.add('open');
    inscripcionModal.setAttribute('aria-hidden', 'false');
  }

  function closeInscripcion() {
    inscripcionModal.classList.remove('open');
    inscripcionModal.setAttribute('aria-hidden', 'true');
  }

  openInscripcionBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      nav.classList.remove('active');
      openInscripcion();
    });
  });

  closeModalBtn.addEventListener('click', closeInscripcion);
  inscripcionModal.addEventListener('click', e => {
    if (e.target === inscripcionModal) closeInscripcion();
  });

  enrollForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('studentName').value.trim();
    const style = styleSelect.value;
    formFeedback.textContent = `¡Gracias, ${name}! Tu preinscripción en ${style} ha sido registrada. Nos comunicaremos contigo pronto.`;
    enrollForm.reset();
  });

  // Modal de información por cada estilo de baile
  const styleDetailsData = {
    'Urbano': {
      tag: 'Energía & Ritmo',
      desc: 'Clases dinámicas centradas en groove, aislamiento corporal, coreografía urbana y freestyle. Ideal para ganar seguridad escénica y resistencia.',
      schedule: 'Horarios: Martes y Jueves • 4:00 PM a 5:30 PM | Sábados • 10:00 AM'
    },
    'Contemporáneo': {
      tag: 'Fluidez & Expresión',
      desc: 'Entrenamiento enfocado en el uso del peso, respiración, trabajo de suelo (floorwork) e improvisación guiada para desarrollar expresividad orgánica.',
      schedule: 'Horarios: Lunes y Miércoles • 4:30 PM a 6:00 PM'
    },
    'Lírico': {
      tag: 'Emoción & Técnica',
      desc: 'Combina extensiones, giros y saltos suaves con interpretación musical profunda, trabajando la conexión emocional con cada pieza.',
      schedule: 'Horarios: Martes y Jueves • 5:30 PM a 7:00 PM'
    },
    'Joropo': {
      tag: 'Tradición & Zapateo',
      desc: 'Aprendizaje técnico del zapateo, escobillao, figuras en pareja y ritmo del arpa, cuatro y maracas con autenticidad y fuerza.',
      schedule: 'Horarios: Miércoles y Viernes • 3:30 PM a 5:00 PM'
    },
    'Nacionalista': {
      tag: 'Identidad & Escena',
      desc: 'Montajes coreográficos que exaltan nuestras tradiciones mediante el manejo de faldas, sombreros, proyección teatral y técnica estilizada.',
      schedule: 'Horarios: Lunes y Viernes • 5:00 PM a 6:30 PM'
    },
    'Técnicas de Ballet': {
      tag: 'Base & Postura',
      desc: 'Trabajo progresivo en barra, centro y diagonal enfocado en colocación, en dehors, elasticidad, fuerza en pies y elegancia.',
      schedule: 'Horarios: Lunes, Miércoles y Viernes • 2:30 PM a 4:00 PM'
    }
  };

  const detailModal = document.getElementById('styleDetailModal');
  const closeDetailBtn = document.getElementById('closeDetailBtn');
  const detailEnrollBtn = document.getElementById('detailEnrollBtn');
  let selectedStyleForEnroll = '';

  document.querySelectorAll('.card-link').forEach(btn => {
    btn.addEventListener('click', () => {
      const styleName = btn.getAttribute('data-style');
      const info = styleDetailsData[styleName];
      if (!info) return;

      selectedStyleForEnroll = styleName;
      document.getElementById('detailTag').textContent = info.tag;
      document.getElementById('detailTitle').textContent = styleName;
      document.getElementById('detailDescription').textContent = info.desc;
      document.getElementById('detailSchedule').textContent = info.schedule;

      detailModal.classList.add('open');
      detailModal.setAttribute('aria-hidden', 'false');
    });
  });

  function closeDetail() {
    detailModal.classList.remove('open');
    detailModal.setAttribute('aria-hidden', 'true');
  }

  closeDetailBtn.addEventListener('click', closeDetail);
  detailModal.addEventListener('click', e => {
    if (e.target === detailModal) closeDetail();
  });

  detailEnrollBtn.addEventListener('click', () => {
    closeDetail();
    openInscripcion(selectedStyleForEnroll);
  });
});