/* ===========================
   Landing: contador + partículas
   =========================== */
(function () {
  // ELEMENTOS
  const countdownElement = document.getElementById("countdown");
  const countdownContainer = document.getElementById("countdown-container");
  const particlesCanvas = document.getElementById("particles");
  const mainPage = document.getElementById("main-page");

  // seguridad si falta
  if (
    !countdownElement ||
    !countdownContainer ||
    !particlesCanvas ||
    !mainPage
  ) {
    console.warn(
      "Elementos del overlay faltan. Asegúrate que el HTML contiene #countdown, #countdown-container, #particles y #main-page"
    );
  }

  // Inicializar contador (10 -> 0, sin llegar a -1)
  let counter = 19;
  if (countdownElement) countdownElement.textContent = counter;

  // PARTICULAS (canvas)
  const canvas = particlesCanvas;
  const ctx = canvas ? canvas.getContext("2d") : null;
  let particlesArray = [];
  let particleAnimId = null;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * (canvas.width || window.innerWidth);
      this.y = Math.random() * (canvas.height || window.innerHeight);
      this.size = Math.random() * 2.2 + 0.6;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = (Math.random() - 0.5) * 0.6;
      this.alpha = Math.random() * 0.7 + 0.15;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (
        this.x < -10 ||
        this.x > canvas.width + 10 ||
        this.y < -10 ||
        this.y > canvas.height + 10
      ) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles(count = 80) {
    if (!ctx) return;
    particlesArray = [];
    for (let i = 0; i < count; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animateParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particlesArray) {
      p.update();
      p.draw();
    }
    particleAnimId = requestAnimationFrame(animateParticles);
  }

  // ajustar tamaño
  window.addEventListener("resize", () => {
    resizeCanvas();
    if (particlesArray.length) initParticles(particlesArray.length);
  });

  // arrancar partículas
  resizeCanvas();
  initParticles(100);
  animateParticles();

  // CONTADOR
  const interval = setInterval(() => {
    if (!countdownElement) return;

    // si counter está en 0 => finalizar
    if (counter === 1) {
      clearInterval(interval);

      // transición (fade out)
      countdownContainer.style.transition =
        "opacity 0.8s ease, visibility 0.8s ease";
      countdownContainer.style.opacity = "0";

      // detener partículas tras la transición
      setTimeout(() => {
        cancelAnimationFrame(particleAnimId);
        if (particlesCanvas) particlesCanvas.style.display = "none";
        countdownContainer.classList.add("hidden");
        mainPage.classList.remove("hidden");

        // inicializar todo lo que depende del DOM visible
        initPage();
      }, 850);

      return;
    }

    // mostrar y decrementar (para no ir a -1)
    counter--;
    countdownElement.textContent = counter;
  }, 1000);
})();

/* ===========================
   InitPage: inicia funcionalidades de la página principal
   (AOS, Swiper, scroll, emojis, typing, popup, confetti, etc.)
   =========================== */
function initPage() {
  // AOS
  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 1200, once: true });
  }

  // Smooth scroll helper
  function smoothScrollTo(target, duration = 2200) {
    const start = window.pageYOffset;
    const end = target.getBoundingClientRect().top + start;
    const distance = end - start;
    let startTime = null;
    function animation(currentTime) {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;
      window.scrollTo(0, start + distance * ease);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    requestAnimationFrame(animation);
  }

  // scroll-down buttons
  document.querySelectorAll(".scroll-down").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const next = btn.closest("section, header").nextElementSibling;
      if (next) smoothScrollTo(next, 2000);
    });
  });

  // Swiper sliders
  if (typeof Swiper !== "undefined") {
    document.querySelectorAll(".responsabilidadesSwiper").forEach((el) => {
      new Swiper(el, {
        loop: true,
        autoplay: { delay: 2500, disableOnInteraction: false },
        speed: 1200,
        slidesPerView: 1,
        spaceBetween: 20,
        effect: "slide",
      });
    });
  }

  // Emojis animation
  const emojisSection = document.getElementById("section6");
  const emojis = document.querySelectorAll(".emoji");

  if (emojisSection && emojis.length) {
    const emojiObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            emojis.forEach((emoji, i) =>
              setTimeout(() => emoji.classList.add("show"), i * 600)
            );
            emojiObserver.unobserve(emojisSection);
          }
        });
      },
      { threshold: 0.4 }
    );
    emojiObserver.observe(emojisSection);
  }

  // MENSAJE IMPORTNATE LEIDY
  const mensaje = document.getElementById("mensaje-leidy");

  const mensajeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          mensaje.classList.add("show");
          mensajeObserver.unobserve(mensaje);
        }
      });
    },
    { threshold: 0.5 }
  );

  mensajeObserver.observe(mensaje);

  // --- EFECTO MÁQUINA DE ESCRIBIR ---
  // Guardamos el texto original respetando saltos
  const mensajeElemento = document.getElementById("mensaje-leidy");
  const mensajeTexto = mensajeElemento.innerHTML.trim();
  mensajeElemento.innerHTML = "";
  mensajeElemento.classList.add("typewriter");

  function typeWriterEffect(element, text, speed = 30) {
    let i = 0;
    function typing() {
      if (i < text.length) {
        // Si encuentra salto de línea, lo respeta
        if (text.substr(i, 4) === "<br>") {
          element.innerHTML += "<br>";
          i += 4;
        } else {
          element.innerHTML += text.charAt(i);
          i++;
        }
        setTimeout(typing, speed);
      } else {
        element.classList.remove("typewriter"); // quitar cursor al final
      }
    }
    typing();
  }

  // Observer para iniciar cuando aparezca
  const mensajeTWObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          typeWriterEffect(mensajeElemento, mensajeTexto, 50); // velocidad ajustable
          mensajeTWObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  mensajeTWObserver.observe(mensajeElemento);

  // Popup logic (footer)
  const popup = document.getElementById("popup");
  function showPopup() {
    if (!popup) return;
    popup.classList.add("active");
    launchFireworks();
  }
  function closePopup() {
    if (!popup) return;
    popup.classList.remove("active");
  }
  window.closePopup = closePopup;

  const footer = document.querySelector("footer");
  if (footer && popup) {
    const popupObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            showPopup();
            popupObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    popupObserver.observe(footer);
  }
}

/* ===========================
   Confetti / Fireworks helpers
   =========================== */
function launchConfetti() {
  if (typeof confetti !== "function") return;
  const duration = 2 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#ff99cc", "#ffcc00", "#66ffcc"],
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#ff99cc", "#ffcc00", "#66ffcc"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
window.launchConfetti = launchConfetti;

function launchFireworks() {
  if (typeof confetti !== "function") return;
  const duration = 4 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 50 * (timeLeft / duration);
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
}
window.launchFireworks = launchFireworks;

//EMOJIS:

// Animación de emojis secuencial con rebote
const emojisSection = document.getElementById("section9");
const emojis = document.querySelectorAll(".emoji");

function showEmojis() {
  emojis.forEach((emoji, index) => {
    setTimeout(() => {
      emoji.classList.add("show");
    }, index * 7000); // 2.5 segundos entre cada emoji
  });
}

// Intersection Observer: dispara la animación al aparecer la sección
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        showEmojis();
        observer.unobserve(emojisSection); // solo se ejecuta una vez
      }
    });
  },
  { threshold: 0.5 }
);
