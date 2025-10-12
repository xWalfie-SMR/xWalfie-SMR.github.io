const RECAPTCHA_SITE_KEY = "6Lcy4eYrAAAAAFZ6seRTrRtGDPWc8qXfK7ZfTcEo";
const host = location.hostname;

const terminalText = "import xWalfie as developer";

let commandIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 80;

function typeCommand() {
  const typingElement = document.getElementById("typing-code");

  if (typingElement) {
    if (!isDeleting) {
      typingElement.textContent = terminalText.substring(0, charIndex);
      charIndex++;

      if (charIndex > terminalText.length) {
        isDeleting = true;
        typingSpeed = 1500;
      } else {
        typingSpeed = 80;
      }
    }
  }

  setTimeout(typeCommand, typingSpeed);
}

// Expandable card functionality
const button = document.querySelector("#content-card .card-button");
const cardDetails = document.querySelector("#content-card .card-details");

let animating = false;
let open = false;
const duration = 600;

if (button && cardDetails) {
  button.addEventListener("click", () => {
    if (animating) return;
    animating = true;

    button.classList.toggle("expanded");
    cardDetails.classList.toggle("expanded");

    open = !open;

    // Update ARIA attributes for accessibility
    button.setAttribute("aria-expanded", open);
    cardDetails.setAttribute("aria-hidden", !open);

    // Prevent tabbing to hidden elements
    if (open) {
      cardDetails.removeAttribute("inert");
    } else {
      cardDetails.setAttribute("inert", "");
    }

    // If opening, set overflow to visible after animation and focus on content
    if (open) {
      const handleTransitionEnd = (e) => {
        if (e.propertyName === "max-height") {
          cardDetails.style.overflow = "visible";
          // Direct focus to new content for screen readers
          const firstHeading = cardDetails.querySelector("h4");
          if (firstHeading) {
            firstHeading.setAttribute("tabindex", "-1");
            firstHeading.focus();
          }
          cardDetails.removeEventListener("transitionend", handleTransitionEnd);
        }
      };
      cardDetails.addEventListener("transitionend", handleTransitionEnd);
    } else {
      // If closing, set overflow to hidden immediately
      cardDetails.style.overflow = "hidden";
    }

    setTimeout(() => {
      animating = false;
    }, duration);
  });
}

// Check tablet orientation
function checkTabletOrientation() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const popup = document.getElementById("rotate-popup");

  if (width >= 768 && width < 1400 && height > width) {
    popup.style.display = "flex";
  } else {
    popup.style.display = "none";
  }
}

// Add hover effects to social links
document.querySelectorAll(".social-link").forEach((link) => {
  link.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-5px) scale(1.1)";
  });

  link.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// Particle System - Complete Implementation
const particles = [];
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let particleCanvas, particleCtx;
let animationFrameId = null;

class Particle {
  constructor() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = 3 + Math.random() * 2;
    this.baseOpacity = 0.6 + Math.random() * 0.4;
    this.opacity = 0;
    this.life = 0;
    this.maxLife = 200 + Math.random() * 150;
    this.fadeInDuration = 30;
    this.fadeOutDuration = 60;
    this.hue = 217 + (Math.random() - 0.5) * 10;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.x += Math.sin(this.life * 0.02) * 0.2;
    this.y += Math.cos(this.life * 0.015) * 0.2;

    if (this.x < -50) this.x = window.innerWidth + 50;
    if (this.x > window.innerWidth + 50) this.x = -50;
    if (this.y < -50) this.y = window.innerHeight + 50;
    if (this.y > window.innerHeight + 50) this.y = -50;

    this.life++;

    if (this.life < this.fadeInDuration) {
      this.opacity = (this.life / this.fadeInDuration) * this.baseOpacity;
    } else if (this.life > this.maxLife - this.fadeOutDuration) {
      const fadeProgress = (this.maxLife - this.life) / this.fadeOutDuration;
      this.opacity = fadeProgress * this.baseOpacity;
    } else {
      this.opacity = this.baseOpacity;
    }

    return this.life < this.maxLife;
  }

  draw(ctx) {
    if (this.opacity < 0.01) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;

    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size * 3
    );
    gradient.addColorStop(0, `hsla(${this.hue}, 80%, 60%, 1)`);
    gradient.addColorStop(0.4, `hsla(${this.hue}, 80%, 60%, 0.6)`);
    gradient.addColorStop(1, `hsla(${this.hue}, 80%, 60%, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, 1)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  getDistanceToMouse() {
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

function initParticleSystem() {
  particleCanvas = document.createElement("canvas");
  particleCanvas.style.position = "fixed";
  particleCanvas.style.top = "0";
  particleCanvas.style.left = "0";
  particleCanvas.style.width = "100%";
  particleCanvas.style.height = "100%";
  particleCanvas.style.pointerEvents = "none";
  particleCanvas.style.zIndex = "1";

  particleCtx = particleCanvas.getContext("2d", {
    alpha: true,
    desynchronized: true,
  });

  resizeParticleCanvas();

  const bgParticles = document.querySelector(".bg-particles");
  if (bgParticles) {
    bgParticles.appendChild(particleCanvas);
  }

  const initialCount = Math.floor(
    (window.innerWidth * window.innerHeight) / 25000
  );
  for (let i = 0; i < initialCount; i++) {
    particles.push(new Particle());
    particles[particles.length - 1].life = Math.random() * 60;
  }
}

function resizeParticleCanvas() {
  if (!particleCanvas) return;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  particleCanvas.width = viewportWidth;
  particleCanvas.height = viewportHeight;
}

function animateParticles() {
  if (!particleCtx || !particleCanvas) return;

  particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

  drawConnectionLines();

  if (Math.random() < 0.2 && particles.length < 60) {
    particles.push(new Particle());
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    const alive = particle.update();

    if (!alive) {
      particles.splice(i, 1);
      continue;
    }

    particle.draw(particleCtx);
  }

  animationFrameId = requestAnimationFrame(animateParticles);
}

function drawConnectionLines() {
  const connectionRadius =
    Math.min(window.innerWidth, window.innerHeight) * 0.35;
  const maxConnections = 12;

  particleCtx.save();
  particleCtx.lineCap = "round";

  const nearbyParticles = particles
    .map((p) => ({ particle: p, distance: p.getDistanceToMouse() }))
    .filter((p) => p.distance < connectionRadius && p.particle.opacity > 0.2)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxConnections);

  nearbyParticles.forEach(({ particle, distance }) => {
    const distanceFactor = 1 - distance / connectionRadius;
    const opacity = distanceFactor * particle.opacity * 0.7;

    if (opacity < 0.03) return;

    particleCtx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.3})`;
    particleCtx.lineWidth = 3 + distanceFactor * 2;
    particleCtx.beginPath();
    particleCtx.moveTo(mouseX, mouseY);
    particleCtx.lineTo(particle.x, particle.y);
    particleCtx.stroke();

    particleCtx.strokeStyle = `rgba(147, 197, 253, ${opacity})`;
    particleCtx.lineWidth = 1.5 + distanceFactor;
    particleCtx.beginPath();
    particleCtx.moveTo(mouseX, mouseY);
    particleCtx.lineTo(particle.x, particle.y);
    particleCtx.stroke();
  });

  if (nearbyParticles.length > 1) {
    const interConnectionRadius = 150;

    for (let i = 0; i < nearbyParticles.length; i++) {
      for (let j = i + 1; j < nearbyParticles.length; j++) {
        const p1 = nearbyParticles[i].particle;
        const p2 = nearbyParticles[j].particle;

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < interConnectionRadius) {
          const opacity =
            (1 - dist / interConnectionRadius) *
            0.2 *
            Math.min(p1.opacity, p2.opacity);

          if (opacity > 0.02) {
            particleCtx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            particleCtx.lineWidth = 1;
            particleCtx.beginPath();
            particleCtx.moveTo(p1.x, p1.y);
            particleCtx.lineTo(p2.x, p2.y);
            particleCtx.stroke();
          }
        }
      }
    }
  }

  particleCtx.restore();
}

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.addEventListener("mouseleave", () => {
  mouseX = window.innerWidth / 2;
  mouseY = window.innerHeight / 2;
});

// Initialize on DOM ready (better performance)
document.addEventListener("DOMContentLoaded", () => {
  typeCommand();
  checkTabletOrientation();

  // Set initial inert state on collapsed card details
  const cardDetails = document.querySelector("#content-card .card-details");
  if (cardDetails) {
    cardDetails.setAttribute("inert", "");
  }
});

window.addEventListener("load", () => {
  initParticleSystem();
  setTimeout(() => {
    animateParticles();
  }, 300);
});

window.addEventListener("resize", () => {
  checkTabletOrientation();
  resizeParticleCanvas();
});

let targetScrollPosition = window.scrollY;
let currentScrollPosition = window.scrollY;
let scrollAnimationFrame = null;
let scrollLastFrameTime = performance.now();

function smoothScrollAnimation(currentTime) {
  const deltaTime = (currentTime - scrollLastFrameTime) / 16.67;
  scrollLastFrameTime = currentTime;

  const diff = targetScrollPosition - currentScrollPosition;
  const delta = diff * 0.12 * Math.min(deltaTime, 2);

  if (Math.abs(diff) < 0.5) {
    currentScrollPosition = targetScrollPosition;
    window.scrollTo(0, currentScrollPosition);
    scrollAnimationFrame = null;
    return;
  }

  currentScrollPosition += delta;
  window.scrollTo(0, currentScrollPosition);
  scrollAnimationFrame = requestAnimationFrame(smoothScrollAnimation);
}

window.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();

    const scrollAmount = e.deltaY * 1.2;
    targetScrollPosition += scrollAmount;

    // Clamp to valid scroll range
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    targetScrollPosition = Math.max(
      0,
      Math.min(targetScrollPosition, maxScroll)
    );

    // Start animation if not already running
    if (!scrollAnimationFrame) {
      currentScrollPosition = window.scrollY;
      scrollLastFrameTime = performance.now();
      scrollAnimationFrame = requestAnimationFrame(smoothScrollAnimation);
    }
  },
  { passive: false }
);

// Add smooth hover for cards
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px) scale(1.02)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

/* Contact Modal Behavior */
(() => {
  const openBtn = document.getElementById("contact-open");
  const modal = document.getElementById("contact-modal");
  const closeBtns = modal
    ? modal.querySelectorAll(".modal-close, #contact-cancel")
    : [];
  const form = document.getElementById("contact-form");
  let lastFocused = null;

  if (!modal || !openBtn) return;

  function setAriaOpen(isOpen) {
    modal.setAttribute("aria-hidden", String(!isOpen));
    openBtn.setAttribute("aria-expanded", String(isOpen));
  }

  function openModal() {
    lastFocused = document.activeElement;
    setAriaOpen(true);
    document.body.style.overflow = "hidden";
    const first = modal.querySelector("input, textarea, button");
    if (first) first.focus();
  }

  function closeModal() {
    setAriaOpen(false);
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function")
      lastFocused.focus();
  }

  openBtn.addEventListener("click", () => {
    openModal();
  });

  closeBtns.forEach((btn) => btn.addEventListener("click", () => closeModal()));

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      e.preventDefault();
      closeModal();
    }
  });

  modal.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || modal.getAttribute("aria-hidden") === "true") return;
    const focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  const status = document.createElement("p");
  status.className = "contact-status";
  form.parentElement.appendChild(status);

  const submitBtn = form.querySelector('button[type="submit"]');
  const spinner = document.createElement("span");
  spinner.className = "btn-spinner";
  spinner.setAttribute("aria-hidden", "true");

  if (submitBtn) submitBtn.appendChild(spinner);

  function validate() {
    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const message = document.getElementById("contact-message").value.trim();
    if (!name) return "Please enter your name.";
    if (!email) return "Please enter a valid email.";
    if (!message) return "Please enter a message.";
    return "";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    status.textContent = "";
    status.classList.remove("success", "error");

    const validationError = validate();
    if (validationError) {
      status.textContent = validationError;
      status.classList.add("error");
      return;
    }

    const data = {
      name: document.getElementById("contact-name").value.trim(),
      email: document.getElementById("contact-email").value.trim(),
      message: document.getElementById("contact-message").value.trim(),
    };

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        spinner.classList.add("spinning");
      }

      status.textContent = "Verifying...";

      // recaptcha v3
      const recaptchaToken = await grecaptcha.execute(RECAPTCHA_SITE_KEY, {
        action: "contact",
      });
      data.recaptchaToken = recaptchaToken;

      const res = await fetch(
        "https://portfolio-backend-sadj.onrender.com/api/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json().catch(() => ({}));

      if (res.ok) {
        status.textContent = "Message sent successfully!";
        status.classList.add("success");
        form.reset();
        setTimeout(() => closeModal(), 900);
      } else {
        status.textContent =
          "Error: " + (result.error || "Something went wrong");
        status.classList.add("error");
      }
    } catch (err) {
      status.textContent = "Error: " + err.message;
      status.classList.add("error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        spinner.classList.remove("spinning");
      }
    }
  });

  const cancelBtn = document.getElementById("contact-cancel");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      form.reset();
      status.textContent = "";
      status.classList.remove("success", "error");
      closeModal();
    });
  }
})();

/* reCAPTCHA toggle for localhost */

if (host === "localhost" || host === "127.0.0.1") {
  const btn = document.createElement("button");
  btn.id = "toggleRecaptcha";
  btn.className = "toggle-recaptcha-btn";
  btn.textContent = "Toggle Recaptcha";
  document.body.appendChild(btn);

  btn.onclick = async () => {
    try {
      const res = await fetch("https://portfolio-backend-sadj.onrender.com/api/toggle-recaptcha", {
        method: "POST",
      });
      const data = await res.json();
      console.log("Recaptcha enabled:", data.recaptchaEnabled);
      alert(`Recaptcha is now ${data.recaptchaEnabled ? "ENABLED" : "DISABLED"}`);
    } catch (error) {
      console.error("Toggle failed:", error);
      alert("Failed to toggle recaptcha: " + error.message);
    }
  };
}

/* Theme Toggle Functionality */
(() => {
  const themeToggle = document.getElementById("theme-toggle");
  const root = document.documentElement;
  const themeIcon = themeToggle.querySelector("i");

  const currentTheme = localStorage.getItem("theme") || "dark";

  if (currentTheme === "light") {
    root.classList.add("light-theme");
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  }

  themeToggle.addEventListener("click", () => {
    const isLight = root.classList.toggle("light-theme");

    themeIcon.style.transform = "rotate(180deg) scale(0)";

    setTimeout(() => {
      if (isLight) {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
        localStorage.setItem("theme", "light");
      } else {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
        localStorage.setItem("theme", "dark");
      }
      themeIcon.style.transform = "rotate(0deg) scale(1)";
    }, 150);
  });

  themeIcon.style.transition = "transform 0.3s ease";
})();
