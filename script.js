// Inicializar AOS (animaciones al hacer scroll)
AOS.init({ duration: 1200 });

// Confetti con canvas-confetti
function launchConfetti() {
  const duration = 3 * 1000;
  const end = Date.now() + duration;
  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#ff99cc", "#ffcc00", "#66ffcc", "#99ccff", "#ff6666"],
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#ff99cc", "#ffcc00", "#66ffcc", "#99ccff", "#ff6666"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

// Scroll suave al dar clic en flecha
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

document.querySelectorAll(".scroll-down").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const next = btn.closest("section, header").nextElementSibling;
    if (next) smoothScrollTo(next, 2000);
  });
});

// Slider Swiper (responsabilidades, conciertos, galería)
var responsabilidadesSwiper = new Swiper(".responsabilidadesSwiper", {
  loop: true,
  autoplay: { delay: 2500, disableOnInteraction: false },
  speed: 1200,
  slidesPerView: 1,
  spaceBetween: 20,
  effect: "slide",
});

//EMOJIS:

// Animación de emojis secuencial con rebote
const emojisSection = document.getElementById("section6");
const emojis = document.querySelectorAll(".emoji");

function showEmojis() {
  emojis.forEach((emoji, index) => {
    setTimeout(() => {
      emoji.classList.add("show");
    }, index * 2000); // 2 segundos entre cada emoji
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

observer.observe(emojisSection);

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
const mensajeTexto = document.getElementById("mensaje-leidy").innerText;
document.getElementById("mensaje-leidy").innerText = "";
document.getElementById("mensaje-leidy").classList.add("typewriter");

function typeWriterEffect(element, text, speed = 10) {
  let i = 0;
  function typing() {
    if (i < text.length) {
      element.innerText += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    } else {
      element.classList.remove("typewriter"); // quitar cursor al final
    }
  }
  typing();
}

const mensajeTWObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        typeWriterEffect(
          document.getElementById("mensaje-leidy"),
          mensajeTexto,
          110
        );
        mensajeTWObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

mensajeTWObserver.observe(document.getElementById("mensaje-leidy"));

// --- POPUP CON FUEGOS ARTIFICIALES ---
const popup = document.getElementById("popup");

function showPopup() {
  popup.classList.add("active");
  launchFireworks();
}

function closePopup() {
  popup.classList.remove("active");
}

// Observer para footer
const footer = document.querySelector("footer");
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

// Fuegos artificiales con canvas-confetti
function launchFireworks() {
  const duration = 4 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

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
