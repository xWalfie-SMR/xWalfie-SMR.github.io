// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================
const RECAPTCHA_SITE_KEY = "6Lcy4eYrAAAAAFZ6seRTrRtGDPWc8qXfK7ZfTcEo";
const HOSTNAME = location.hostname;

// =============================================================================
// TERMINAL TYPING ANIMATION
// =============================================================================
const TERMINAL_TEXT = "import xWalfie as developer";
const TYPING_SPEED = 80;
const PAUSE_DURATION = 1500;

let characterIndex = 0;
let isDeleting = false;
let currentTypingSpeed = TYPING_SPEED;

/**
 * Animates typing effect in the terminal banner
 */
function animateTerminalTyping() {
  const typingElement = document.getElementById("typing-code");

  if (!typingElement) {
    return;
  }

  if (!isDeleting) {
    typingElement.textContent = TERMINAL_TEXT.substring(0, characterIndex);
    characterIndex++;

    if (characterIndex > TERMINAL_TEXT.length) {
      isDeleting = true;
      currentTypingSpeed = PAUSE_DURATION;
    } else {
      currentTypingSpeed = TYPING_SPEED;
    }
  }

  setTimeout(animateTerminalTyping, currentTypingSpeed);
}

// =============================================================================
// EXPANDABLE CARD FUNCTIONALITY
// =============================================================================
const CARD_ANIMATION_DURATION = 600;

const expandableButton = document.querySelector("#content-card .card-button");
const cardDetailsElement = document.querySelector(
  "#content-card .card-details"
);

let isCardAnimating = false;
let isCardOpen = false;

/**
 * Handles card expand/collapse transition end
 */
function handleCardTransitionEnd(event) {
  if (event.propertyName === "max-height") {
    cardDetailsElement.style.overflow = "visible";

    // Direct focus to new content for screen readers
    const firstHeading = cardDetailsElement.querySelector("h4");
    if (firstHeading) {
      firstHeading.setAttribute("tabindex", "-1");
      firstHeading.focus();
    }

    cardDetailsElement.removeEventListener(
      "transitionend",
      handleCardTransitionEnd
    );
  }
}

/**
 * Toggle card expansion state
 */
function toggleCard() {
  if (isCardAnimating) {
    return;
  }

  isCardAnimating = true;
  isCardOpen = !isCardOpen;

  expandableButton.classList.toggle("expanded");
  cardDetailsElement.classList.toggle("expanded");

  // Update ARIA attributes for accessibility
  expandableButton.setAttribute("aria-expanded", isCardOpen);
  cardDetailsElement.setAttribute("aria-hidden", !isCardOpen);

  // Prevent tabbing to hidden elements
  if (isCardOpen) {
    cardDetailsElement.removeAttribute("inert");
    cardDetailsElement.addEventListener(
      "transitionend",
      handleCardTransitionEnd
    );
  } else {
    cardDetailsElement.setAttribute("inert", "");
    cardDetailsElement.style.overflow = "hidden";
  }

  setTimeout(() => {
    isCardAnimating = false;
  }, CARD_ANIMATION_DURATION);
}

// Initialize expandable card
if (expandableButton && cardDetailsElement) {
  expandableButton.addEventListener("click", toggleCard);
}

// =============================================================================
// TABLET ORIENTATION CHECK
// =============================================================================
const TABLET_MIN_WIDTH = 768;
const TABLET_MAX_WIDTH = 1400;

/**
 * Shows rotation popup for tablets in portrait mode
 */
function checkTabletOrientation() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const rotatePopup = document.getElementById("rotate-popup");

  const isTabletPortrait =
    windowWidth >= TABLET_MIN_WIDTH &&
    windowWidth < TABLET_MAX_WIDTH &&
    windowHeight > windowWidth;

  rotatePopup.style.display = isTabletPortrait ? "flex" : "none";
}

// =============================================================================
// SOCIAL LINKS HOVER EFFECTS
// =============================================================================
/**
 * Initialize hover effects for social media links
 */
function initializeSocialLinksHoverEffects() {
  document.querySelectorAll(".social-link").forEach((link) => {
    link.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px) scale(1.1)";
    });

    link.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
}

initializeSocialLinksHoverEffects();

// =============================================================================
// PARTICLE SYSTEM
// =============================================================================
const PARTICLE_CONFIG = {
  maxParticles: 60,
  spawnProbability: 0.2,
  connectionRadius: 0.35, // Multiplied by min viewport dimension
  interConnectionRadius: 150,
  maxConnections: 12,
  particleDensity: 25000, // pixels² per particle
};

const particles = [];
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let particleCanvas = null;
let particleContext = null;
let animationFrameId = null;

/**
 * Particle class representing a single animated particle
 */
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

  /**
   * Updates particle position and lifecycle
   * @returns {boolean} True if particle is still alive
   */
  update() {
    // Update position with velocity and wave motion
    this.x += this.vx;
    this.y += this.vy;
    this.x += Math.sin(this.life * 0.02) * 0.2;
    this.y += Math.cos(this.life * 0.015) * 0.2;

    // Wrap around screen edges
    if (this.x < -50) this.x = window.innerWidth + 50;
    if (this.x > window.innerWidth + 50) this.x = -50;
    if (this.y < -50) this.y = window.innerHeight + 50;
    if (this.y > window.innerHeight + 50) this.y = -50;

    this.life++;

    // Handle opacity transitions (fade in/out)
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

  /**
   * Draws the particle on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  draw(ctx) {
    if (this.opacity < 0.01) {
      return;
    }

    ctx.save();
    ctx.globalAlpha = this.opacity;

    // Draw particle glow
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

    // Draw particle core
    ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, 1)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Calculates distance from particle to mouse cursor
   * @returns {number} Distance in pixels
   */
  getDistanceToMouse() {
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

/**
 * Initializes the particle system canvas
 */
function initParticleSystem() {
  particleCanvas = document.createElement("canvas");
  particleCanvas.style.position = "fixed";
  particleCanvas.style.top = "0";
  particleCanvas.style.left = "0";
  particleCanvas.style.width = "100%";
  particleCanvas.style.height = "100%";
  particleCanvas.style.pointerEvents = "none";
  particleCanvas.style.zIndex = "1";

  particleContext = particleCanvas.getContext("2d", {
    alpha: true,
    desynchronized: true,
  });

  resizeParticleCanvas();

  const backgroundParticlesContainer = document.querySelector(".bg-particles");
  if (backgroundParticlesContainer) {
    backgroundParticlesContainer.appendChild(particleCanvas);
  }

  // Initialize particles based on screen size
  const initialCount = Math.floor(
    (window.innerWidth * window.innerHeight) / PARTICLE_CONFIG.particleDensity
  );

  for (let i = 0; i < initialCount; i++) {
    const particle = new Particle();
    particle.life = Math.random() * 60;
    particles.push(particle);
  }
}

/**
 * Resizes particle canvas to match viewport
 */
function resizeParticleCanvas() {
  if (!particleCanvas) {
    return;
  }

  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}

/**
 * Animates all particles and draws connections
 */
function animateParticles() {
  if (!particleContext || !particleCanvas) {
    return;
  }

  particleContext.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

  drawConnectionLines();

  // Spawn new particles probabilistically
  if (
    Math.random() < PARTICLE_CONFIG.spawnProbability &&
    particles.length < PARTICLE_CONFIG.maxParticles
  ) {
    particles.push(new Particle());
  }

  // Update and draw particles, removing dead ones
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    const isAlive = particle.update();

    if (!isAlive) {
      particles.splice(i, 1);
      continue;
    }

    particle.draw(particleContext);
  }

  animationFrameId = requestAnimationFrame(animateParticles);
}

/**
 * Draws connection lines between nearby particles and mouse
 */
function drawConnectionLines() {
  const connectionRadius =
    Math.min(window.innerWidth, window.innerHeight) *
    PARTICLE_CONFIG.connectionRadius;

  particleContext.save();
  particleContext.lineCap = "round";

  // Find particles near mouse cursor
  const nearbyParticles = particles
    .map((p) => ({ particle: p, distance: p.getDistanceToMouse() }))
    .filter((p) => p.distance < connectionRadius && p.particle.opacity > 0.2)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, PARTICLE_CONFIG.maxConnections);

  // Draw lines from mouse to nearby particles
  nearbyParticles.forEach(({ particle, distance }) => {
    const distanceFactor = 1 - distance / connectionRadius;
    const opacity = distanceFactor * particle.opacity * 0.7;

    if (opacity < 0.03) {
      return;
    }

    // Draw outer glow line
    particleContext.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.3})`;
    particleContext.lineWidth = 3 + distanceFactor * 2;
    particleContext.beginPath();
    particleContext.moveTo(mouseX, mouseY);
    particleContext.lineTo(particle.x, particle.y);
    particleContext.stroke();

    // Draw inner bright line
    particleContext.strokeStyle = `rgba(147, 197, 253, ${opacity})`;
    particleContext.lineWidth = 1.5 + distanceFactor;
    particleContext.beginPath();
    particleContext.moveTo(mouseX, mouseY);
    particleContext.lineTo(particle.x, particle.y);
    particleContext.stroke();
  });

  // Draw connections between nearby particles
  if (nearbyParticles.length > 1) {
    for (let i = 0; i < nearbyParticles.length; i++) {
      for (let j = i + 1; j < nearbyParticles.length; j++) {
        const p1 = nearbyParticles[i].particle;
        const p2 = nearbyParticles[j].particle;

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < PARTICLE_CONFIG.interConnectionRadius) {
          const opacity =
            (1 - distance / PARTICLE_CONFIG.interConnectionRadius) *
            0.2 *
            Math.min(p1.opacity, p2.opacity);

          if (opacity > 0.02) {
            particleContext.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            particleContext.lineWidth = 1;
            particleContext.beginPath();
            particleContext.moveTo(p1.x, p1.y);
            particleContext.lineTo(p2.x, p2.y);
            particleContext.stroke();
          }
        }
      }
    }
  }

  particleContext.restore();
}

/**
 * Updates mouse position for particle interactions
 */
document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

/**
 * Resets mouse position when cursor leaves window
 */
document.addEventListener("mouseleave", () => {
  mouseX = window.innerWidth / 2;
  mouseY = window.innerHeight / 2;
});

// =============================================================================
// SMOOTH SCROLLING
// =============================================================================
let targetScrollPosition = window.scrollY;
let currentScrollPosition = window.scrollY;
let scrollAnimationFrame = null;
let scrollLastFrameTime = performance.now();

/**
 * Smooth scroll animation using requestAnimationFrame
 */
function smoothScrollAnimation(currentTime) {
  const deltaTime = (currentTime - scrollLastFrameTime) / 16.67;
  scrollLastFrameTime = currentTime;

  const difference = targetScrollPosition - currentScrollPosition;
  const delta = difference * 0.12 * Math.min(deltaTime, 2);

  if (Math.abs(difference) < 0.5) {
    currentScrollPosition = targetScrollPosition;
    window.scrollTo(0, currentScrollPosition);
    scrollAnimationFrame = null;
    return;
  }

  currentScrollPosition += delta;
  window.scrollTo(0, currentScrollPosition);
  scrollAnimationFrame = requestAnimationFrame(smoothScrollAnimation);
}

/**
 * Handle wheel events for smooth scrolling
 */
window.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();

    const scrollAmount = event.deltaY * 1.2;
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

// =============================================================================
// CARD HOVER EFFECTS
// =============================================================================
/**
 * Initialize hover effects for all cards
 */
function initializeCardHoverEffects() {
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
}

initializeCardHoverEffects();

// =============================================================================
// CONTACT MODAL
// =============================================================================
(() => {
  const openButton = document.getElementById("contact-open");
  const modal = document.getElementById("contact-modal");
  const closeButtons = modal
    ? modal.querySelectorAll(".modal-close, #contact-cancel")
    : [];
  const form = document.getElementById("contact-form");
  let lastFocusedElement = null;

  if (!modal || !openButton) {
    return;
  }

  /**
   * Updates ARIA attributes for modal state
   */
  function setModalAriaState(isOpen) {
    modal.setAttribute("aria-hidden", String(!isOpen));
    openButton.setAttribute("aria-expanded", String(isOpen));
  }

  /**
   * Opens the contact modal
   */
  function openModal() {
    lastFocusedElement = document.activeElement;
    setModalAriaState(true);
    document.body.style.overflow = "hidden";

    const firstFocusable = modal.querySelector("input, textarea, button");
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  /**
   * Closes the contact modal
   */
  function closeModal() {
    setModalAriaState(false);
    document.body.style.overflow = "";

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  // Event listeners
  openButton.addEventListener("click", openModal);
  closeButtons.forEach((btn) => btn.addEventListener("click", closeModal));

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      modal.getAttribute("aria-hidden") === "false"
    ) {
      event.preventDefault();
      closeModal();
    }
  });

  // Trap focus within modal
  modal.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || modal.getAttribute("aria-hidden") === "true") {
      return;
    }

    const focusableElements = modal.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements.length) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });

  // Form status and spinner setup
  const statusElement = document.createElement("p");
  statusElement.className = "contact-status";
  form.parentElement.appendChild(statusElement);

  const submitButton = form.querySelector('button[type="submit"]');
  const spinner = document.createElement("span");
  spinner.className = "btn-spinner";
  spinner.setAttribute("aria-hidden", "true");

  if (submitButton) {
    submitButton.appendChild(spinner);
  }

  /**
   * Validates form input fields
   * @returns {string} Error message or empty string if valid
   */
  function validateForm() {
    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    // Name validation: require at least two parts (first + last) and each part at least 2 chars
    if (!name) {
      return "Please enter your name.";
    }

    const nameParts = name.split(/\s+/).filter(Boolean);
    if (nameParts.length < 2 || nameParts.some((part) => part.length < 2)) {
      return "Please enter your full name (first and last name).";
    }

    // Email validation: basic RFC-like validation
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!email) {
      return "Please enter your email.";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    // Message length validation: min 30 chars, max 2000 chars
    const messageLength = message.length;
    if (messageLength < 30) {
      return "Message is too short — please write at least 30 characters.";
    }
    if (messageLength > 2000) {
      return "Message is too long — please keep it under 2000 characters.";
    }

    return "";
  }

  /**
   * Handles form submission
   */
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    statusElement.textContent = "";
    statusElement.classList.remove("success", "error");

    const validationError = validateForm();
    if (validationError) {
      statusElement.textContent = validationError;
      statusElement.classList.add("error");
      return;
    }

    const formData = {
      name: document.getElementById("contact-name").value.trim(),
      email: document.getElementById("contact-email").value.trim(),
      message: document.getElementById("contact-message").value.trim(),
    };

    try {
      if (submitButton) {
        submitButton.disabled = true;
        spinner.classList.add("spinning");
      }

      statusElement.textContent = "Verifying...";

      // Execute reCAPTCHA v3
      const recaptchaToken = await grecaptcha.execute(RECAPTCHA_SITE_KEY, {
        action: "contact",
      });
      formData.recaptchaToken = recaptchaToken;

      const response = await fetch(
        "https://portfolio-backend-sadj.onrender.com/api/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (result.success && result.emailSent && result.aiDecision === "ALLOW") {
        statusElement.textContent = "Message sent successfully!";
        statusElement.classList.add("success");
        form.reset();
        setTimeout(() => closeModal(), 900);
      } else {
        statusElement.textContent =
          "Message not sent: " +
          (result.aiReason || result.error || "Unknown error");
        statusElement.classList.add("error");
      }
    } catch (error) {
      statusElement.textContent = "Error: " + error.message;
      statusElement.classList.add("error");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        spinner.classList.remove("spinning");
      }
    }
  });

  // Cancel button handler
  const cancelButton = document.getElementById("contact-cancel");
  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      form.reset();
      statusElement.textContent = "";
      statusElement.classList.remove("success", "error");
      closeModal();
    });
  }
})();

// =============================================================================
// FILES MODAL
// =============================================================================
(() => {
  const openButton = document.getElementById("files-open");
  const modal = document.getElementById("files-modal");
  const closeButtons = modal ? modal.querySelectorAll(".modal-close") : [];
  const filesList = document.getElementById("files-list");
  const filePreview = document.getElementById("file-preview");
  const backToListButton = document.getElementById("back-to-list");
  const downloadButton = document.getElementById("download-file");
  let lastFocusedElement = null;
  let currentFile = null;

  if (!modal || !openButton) {
    return;
  }

  /**
   * Updates ARIA attributes for modal state
   */
  function setModalAriaState(isOpen) {
    modal.setAttribute("aria-hidden", String(!isOpen));
    openButton.setAttribute("aria-expanded", String(isOpen));
  }

  /**
   * Opens the files modal
   */
  function openModal() {
    lastFocusedElement = document.activeElement;
    setModalAriaState(true);
    document.body.style.overflow = "hidden";
    loadFiles();

    const firstFocusable = modal.querySelector("button");
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  /**
   * Closes the files modal
   */
  function closeModal() {
    setModalAriaState(false);
    document.body.style.overflow = "";
    showFilesList();

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  // Prevent scroll propagation on modal and preview content
  const modalContent = modal.querySelector(".modal-content");
  const previewContent = document.getElementById("preview-content");

  if (modalContent) {
    modalContent.addEventListener(
      "wheel",
      (e) => {
        e.stopPropagation();
      },
      { passive: true }
    );
  }

  if (previewContent) {
    previewContent.addEventListener(
      "wheel",
      (e) => {
        e.stopPropagation();
      },
      { passive: true }
    );
  }

  /**
   * Shows the files list view
   */
  function showFilesList() {
    filesList.style.display = "block";
    filePreview.style.display = "none";
    currentFile = null;
  }

  /**
   * Shows the file preview view
   */
  function showFilePreview() {
    filesList.style.display = "none";
    filePreview.style.display = "block";
  }

  /**
   * Formats file size in human-readable format
   */
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  /**
   * Gets file icon based on file extension using VSCode Codicons
   */
  function getFileIcon(filename) {
    const ext = filename.split(".").pop().toLowerCase();

    // VSCode Codicon classes for different file types
    const iconMap = {
      // Code files
      json: "codicon-json",
      js: "codicon-symbol-method",
      jsx: "codicon-symbol-method",
      ts: "codicon-symbol-method",
      tsx: "codicon-symbol-method",
      py: "codicon-symbol-method",
      java: "codicon-symbol-method",
      cpp: "codicon-symbol-method",
      c: "codicon-symbol-method",
      h: "codicon-symbol-method",
      php: "codicon-symbol-method",
      rb: "codicon-symbol-method",
      go: "codicon-symbol-method",
      rs: "codicon-symbol-method",

      // Web files
      html: "codicon-symbol-method",
      css: "codicon-symbol-method",
      scss: "codicon-symbol-method",
      sass: "codicon-symbol-method",
      less: "codicon-symbol-method",

      // Documents
      pdf: "codicon-file-pdf",
      doc: "codicon-file-text",
      docx: "codicon-file-text",
      txt: "codicon-file-text",
      md: "codicon-markdown",

      // Images
      jpg: "codicon-file-media",
      jpeg: "codicon-file-media",
      png: "codicon-file-media",
      gif: "codicon-file-media",
      svg: "codicon-file-media",
      webp: "codicon-file-media",

      // Archives
      zip: "codicon-file-zip",
      rar: "codicon-file-zip",
      "7z": "codicon-file-zip",
      tar: "codicon-file-zip",
      gz: "codicon-file-zip",

      // VPN/Config files
      ovpn: "codicon-file-text",

      // Media
      mp4: "codicon-file-media",
      avi: "codicon-file-media",
      mov: "codicon-file-media",
      mp3: "codicon-file-media",
      wav: "codicon-file-media",
      flac: "codicon-file-media",
    };

    const iconClass = iconMap[ext] || "codicon-file";
    return `<i class="codicon ${iconClass} file-type-icon"></i>`;
  }

  /**
   * Gets Prism.js language identifier based on file extension
   */
  function getLanguage(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    const languageMap = {
      json: "json",
      js: "javascript",
      jsx: "javascript",
      ts: "javascript",
      tsx: "javascript",
      py: "python",
      css: "css",
      scss: "css",
      html: "markup",
      xml: "markup",
      svg: "markup",
      md: "markdown",
      txt: "none",
      ovpn: "none",
    };
    return languageMap[ext] || "none";
  }

  /**
   * Applies syntax highlighting to code content
   */
  function highlightCode(code, language) {
    if (language === "none" || !window.Prism) {
      return code;
    }

    // Format JSON for better readability
    if (language === "json") {
      try {
        code = JSON.stringify(JSON.parse(code), null, 2);
      } catch (e) {
        // If parsing fails, use original code
      }
    }

    const grammar = window.Prism.languages[language];
    if (grammar) {
      return window.Prism.highlight(code, grammar, language);
    }
    return code;
  }

  /**
   * Loads files from the downloadable folder dynamically using GitHub API
   */
  async function loadFiles() {
    filesList.innerHTML =
      '<p style="text-align: center; color: var(--text-muted);">Loading files...</p>';

    try {
      // Fetch file list from GitHub API
      const apiUrl = 'https://api.github.com/repos/xWalfie-SMR/xWalfie-SMR.github.io/contents/downloadable';
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const filesData = await response.json();
      
      // Filter to only include files (not directories) and exclude the manifest itself
      const files = filesData
        .filter(item => item.type === 'file')
        .map(item => ({
          name: item.name,
          path: `downloadable/${item.name}`,
          size: item.size
        }));

      if (files.length === 0) {
        filesList.innerHTML =
          '<p style="text-align: center; color: var(--text-muted);">No files available</p>';
        return;
      }

      filesList.innerHTML = "";

      for (const file of files) {
        const fileItem = document.createElement("div");
        fileItem.className = "file-item";
        fileItem.setAttribute("role", "button");
        fileItem.setAttribute("tabindex", "0");

        fileItem.innerHTML = `
          <div class="file-item-info">
            <div class="file-icon">${getFileIcon(file.name)}</div>
            <div class="file-details">
              <div class="file-name">${file.name}</div>
              <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
          </div>
          <i class="fas fa-chevron-right file-arrow" aria-hidden="true"></i>
        `;

        fileItem.addEventListener("click", () => {
          previewFile(file.name, file.path, file.size);
        });

        fileItem.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            previewFile(file.name, file.path, file.size);
          }
        });

        filesList.appendChild(fileItem);
      }
    } catch (error) {
      filesList.innerHTML =
        '<p style="text-align: center; color: var(--text-muted);">Error loading files</p>';
      console.error("Error loading files:", error);
    }
  }

  /**
   * Previews a file
   */
  async function previewFile(filename, filepath, filesize) {
    currentFile = { name: filename, path: filepath };

    document.getElementById("preview-filename").textContent = filename;
    document.getElementById("preview-filesize").textContent =
      formatFileSize(filesize);

    const previewContent = document.getElementById("preview-content");
    previewContent.innerHTML =
      '<p style="text-align: center; color: var(--text-muted);">Loading preview...</p>';

    showFilePreview();

    try {
      const response = await fetch(filepath);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();

      const language = getLanguage(filename);

      if (language !== "none") {
        // Format JSON for better readability before highlighting
        let code = text;
        if (language === "json") {
          try {
            code = JSON.stringify(JSON.parse(text), null, 2);
          } catch (e) {
            // If parsing fails, use original code
            console.warn("Failed to format JSON:", e);
          }
        }

        // Create code element and let Prism highlight it
        const codeElement = document.createElement("code");
        codeElement.className = `language-${language}`;
        codeElement.textContent = code;

        const preElement = document.createElement("pre");
        preElement.appendChild(codeElement);

        previewContent.textContent = "";
        previewContent.appendChild(preElement);

        // Highlight with Prism if available
        if (window.Prism && window.Prism.highlightElement) {
          window.Prism.highlightElement(codeElement);
        }
      } else {
        previewContent.textContent = text;
      }
    } catch (error) {
      previewContent.innerHTML =
        '<p style="text-align: center; color: var(--text-muted);">Error loading preview</p>';
      console.error("Error loading file preview:", error);
    }
  }

  /**
   * Downloads the current file
   */
  function downloadFile() {
    if (!currentFile) return;

    const link = document.createElement("a");
    link.href = currentFile.path;
    link.download = currentFile.name;
    link.click();
  }

  // Event listeners
  openButton.addEventListener("click", openModal);
  closeButtons.forEach((btn) => btn.addEventListener("click", closeModal));
  backToListButton.addEventListener("click", showFilesList);
  downloadButton.addEventListener("click", downloadFile);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      modal.getAttribute("aria-hidden") === "false"
    ) {
      event.preventDefault();
      closeModal();
    }
  });

  // Trap focus within modal
  modal.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || modal.getAttribute("aria-hidden") === "true") {
      return;
    }

    const focusableElements = modal.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements.length) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });
})();

// =============================================================================
// RECAPTCHA TOGGLE (DEVELOPMENT ONLY)
// =============================================================================
if (HOSTNAME === "localhost" || HOSTNAME === "127.0.0.1") {
  const toggleButton = document.createElement("button");
  toggleButton.id = "toggleRecaptcha";
  toggleButton.className = "toggle-recaptcha-btn";
  toggleButton.textContent = "Toggle Recaptcha";
  document.body.appendChild(toggleButton);

  toggleButton.onclick = async () => {
    try {
      const response = await fetch(
        "https://portfolio-backend-sadj.onrender.com/api/toggle-recaptcha",
        {
          method: "POST",
        }
      );

      const data = await response.json();
      console.log("Recaptcha enabled:", data.recaptchaEnabled);
      alert(
        `Recaptcha is now ${data.recaptchaEnabled ? "ENABLED" : "DISABLED"}`
      );
    } catch (error) {
      console.error("Toggle failed:", error);
      alert("Failed to toggle recaptcha: " + error.message);
    }
  };
}

// =============================================================================
// THEME TOGGLE
// =============================================================================
(() => {
  const themeToggleButton = document.getElementById("theme-toggle");
  const rootElement = document.documentElement;
  const themeIcon = themeToggleButton.querySelector("i");

  /**
   * Applies the specified theme to the page
   * @param {string} theme - Either 'light' or 'dark'
   */
  function applyTheme(theme) {
    if (theme === "light") {
      rootElement.classList.add("light-theme");
      rootElement.setAttribute("data-theme", "light");
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    } else {
      rootElement.classList.remove("light-theme");
      rootElement.setAttribute("data-theme", "dark");
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    }
  }

  /**
   * Gets stored theme preference from localStorage
   * @returns {string|null} Stored theme or null
   */
  function getStoredTheme() {
    try {
      return localStorage.getItem("theme");
    } catch (error) {
      return null;
    }
  }

  // Determine initial theme: stored preference > system preference > default dark
  const storedTheme = getStoredTheme();
  const prefersLightTheme =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches;

  if (storedTheme === "light" || storedTheme === "dark") {
    applyTheme(storedTheme);
  } else {
    applyTheme(prefersLightTheme ? "light" : "dark");
  }

  // Theme toggle button event listener
  themeToggleButton.addEventListener("click", () => {
    const isLight = rootElement.classList.toggle("light-theme");
    themeIcon.style.transform = "rotate(180deg) scale(0)";

    setTimeout(() => {
      const newTheme = isLight ? "light" : "dark";
      applyTheme(newTheme);

      try {
        localStorage.setItem("theme", newTheme);
      } catch (error) {
        // Ignore localStorage errors
      }

      themeIcon.style.transform = "rotate(0deg) scale(1)";
    }, 150);
  });

  // Listen for system preference changes when user hasn't set an explicit choice
  try {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");

      const handleSystemThemeChange = (event) => {
        if (!getStoredTheme()) {
          applyTheme(event.matches ? "light" : "dark");
        }
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleSystemThemeChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleSystemThemeChange);
      }
    }
  } catch (error) {
    // Ignore errors
  }

  themeIcon.style.transition = "transform 0.3s ease";
})();

// =============================================================================
// INITIALIZATION
// =============================================================================
/**
 * Initialize on DOM ready
 */
document.addEventListener("DOMContentLoaded", () => {
  animateTerminalTyping();
  checkTabletOrientation();

  // Set initial inert state on collapsed card details
  const cardDetailsElement = document.querySelector(
    "#content-card .card-details"
  );
  if (cardDetailsElement) {
    cardDetailsElement.setAttribute("inert", "");
  }
});

/**
 * Initialize particle system after page load
 */
window.addEventListener("load", () => {
  initParticleSystem();
  setTimeout(() => {
    animateParticles();
  }, 300);
});

/**
 * Handle window resize events
 */
window.addEventListener("resize", () => {
  checkTabletOrientation();
  resizeParticleCanvas();
});
