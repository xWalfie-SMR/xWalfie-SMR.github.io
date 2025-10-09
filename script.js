// Terminal Typing Effect - Python AI commands
const terminalText = "import xWalfie as developer";

let commandIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 80;

function typeCommand() {
  const typingElement = document.getElementById('typing-code');

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
    button.setAttribute('aria-expanded', open);
    cardDetails.setAttribute('aria-hidden', !open);

    // Prevent tabbing to hidden elements
    if (open) {
      cardDetails.removeAttribute('inert');
    } else {
      cardDetails.setAttribute('inert', '');
    }

    // If opening, set overflow to visible after animation and focus on content
    if (open) {
      const handleTransitionEnd = (e) => {
        if (e.propertyName === 'max-height') {
          cardDetails.style.overflow = 'visible';
          // Direct focus to new content for screen readers
          const firstHeading = cardDetails.querySelector('h4');
          if (firstHeading) {
            firstHeading.setAttribute('tabindex', '-1');
            firstHeading.focus();
          }
          cardDetails.removeEventListener('transitionend', handleTransitionEnd);
        }
      };
      cardDetails.addEventListener('transitionend', handleTransitionEnd);
    } else {
      // If closing, set overflow to hidden immediately
      cardDetails.style.overflow = 'hidden';
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
document.querySelectorAll('.social-link').forEach(link => {
  link.addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-5px) scale(1.1)';
  });

  link.addEventListener('mouseleave', function () {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

// Create floating particles
const activeParticles = [];
let mouseX = -1000;
let mouseY = -1000;

function createFloatingParticle() {
  const particle = document.createElement('div');
  particle.style.position = 'absolute';
  particle.style.width = '5px';
  particle.style.height = '5px';
  particle.style.background = 'rgba(59, 130, 246, 1)';
  particle.style.borderRadius = '50%';
  particle.style.pointerEvents = 'none';
  particle.style.left = Math.random() * window.innerWidth + 'px';
  particle.style.top = Math.random() * window.innerHeight + 'px';
  particle.style.boxShadow = '0 0 12px rgba(59, 130, 246, 0.9), 0 0 20px rgba(59, 130, 246, 0.5)';

  document.querySelector('.bg-particles').appendChild(particle);

  const lifetime = Math.random() * 4000 + 3000;
  const xMove = (Math.random() - 0.5) * 200;
  const yMove = (Math.random() - 0.5) * 200;

  // Track particle for line drawing with opacity tracking
  const particleData = { element: particle, opacity: 0, startTime: Date.now(), lifetime: lifetime };
  activeParticles.push(particleData);

  particle.animate([
    { transform: 'translate(0, 0) scale(0.5)', opacity: 0 },
    { transform: `translate(${xMove * 0.5}px, ${yMove * 0.5}px) scale(1)`, opacity: 1, offset: 0.2 },
    { transform: `translate(${xMove}px, ${yMove}px) scale(1)`, opacity: 1, offset: 0.8 },
    { transform: `translate(${xMove}px, ${yMove}px) scale(0.5)`, opacity: 0 }
  ], {
    duration: lifetime,
    easing: 'ease-in-out'
  }).onfinish = () => {
    particle.remove();
    const index = activeParticles.indexOf(particleData);
    if (index > -1) activeParticles.splice(index, 1);
  };
}

// Canvas for drawing lines
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = '0';
const ctx = canvas.getContext('2d');

// Track mouse position
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Draw lines between cursor and nearby particles
let lastFrameTime = Date.now();
let frameCount = 0;
let fps = 60;

function drawParticleLines() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const radius = Math.min(window.innerWidth, window.innerHeight) * 0.35;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const now = Date.now();

  activeParticles.forEach(particleData => {
    const elapsed = now - particleData.startTime;
    const progress = elapsed / particleData.lifetime;

    let particleOpacity = 0;
    if (progress < 0.2) {
      particleOpacity = progress / 0.2;
    } else if (progress < 0.8) {
      particleOpacity = 1;
    } else if (progress < 1) {
      particleOpacity = 1 - ((progress - 0.8) / 0.2);
    }

    if (particleOpacity < 0.05) return;

    const rect = particleData.element.getBoundingClientRect();
    const particleX = rect.left + rect.width / 2;
    const particleY = rect.top + rect.height / 2;

    const dx = mouseX - particleX;
    const dy = mouseY - particleY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < radius) {
      const distanceOpacity = 1 - (distance / radius);

      let lineStrength = 0;
      if (particleOpacity >= 0.1) {
        lineStrength = Math.pow(particleOpacity, 0.7);
      }

      // Combine distance opacity with scaled particle opacity
      const finalOpacity = distanceOpacity * lineStrength * 0.8;

      // Only draw if opacity is meaningful
      if (finalOpacity > 0.05) {
        ctx.strokeStyle = `rgba(59, 130, 246, ${finalOpacity})`;
        ctx.lineWidth = 1.5 + (lineStrength * 0.5);
        ctx.beginPath();
        ctx.moveTo(mouseX, mouseY);
        ctx.lineTo(particleX, particleY);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawParticleLines);
}


// Initialize on DOM ready (better performance)
document.addEventListener("DOMContentLoaded", () => {
  typeCommand();
  checkTabletOrientation();

  // Set initial inert state on collapsed card details
  const cardDetails = document.querySelector("#content-card .card-details");
  if (cardDetails) {
    cardDetails.setAttribute('inert', '');
  }
});

// Start particle animations after page fully loads (performance optimization)
window.addEventListener("load", () => {
  // Add canvas to bg-particles
  const bgParticles = document.querySelector('.bg-particles');
  if (bgParticles) {
    bgParticles.appendChild(canvas);
  }

  // Start line drawing animation
  drawParticleLines();

  // Spawn delay before particles start appearing
  setTimeout(() => {
    setInterval(createFloatingParticle, 150); // More frequent spawning (every 150ms)
  }, 800); // 800ms initial delay
});

window.addEventListener("resize", checkTabletOrientation);

// Ultra-smooth scroll with perfect frame timing
let targetScrollPosition = window.scrollY;
let currentScrollPosition = window.scrollY;
let scrollAnimationFrame = null;
let scrollLastFrameTime = performance.now();

function smoothScrollAnimation(currentTime) {
  const deltaTime = (currentTime - scrollLastFrameTime) / 16.67; // Normalize to 60fps
  scrollLastFrameTime = currentTime;

  const diff = targetScrollPosition - currentScrollPosition;
  const delta = diff * 0.12 * Math.min(deltaTime, 2); // Frame-independent, capped at 2x

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

window.addEventListener('wheel', (e) => {
  e.preventDefault();

  const scrollAmount = e.deltaY * 1.2;
  targetScrollPosition += scrollAmount;

  // Clamp to valid scroll range
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  targetScrollPosition = Math.max(0, Math.min(targetScrollPosition, maxScroll));

  // Start animation if not already running
  if (!scrollAnimationFrame) {
    currentScrollPosition = window.scrollY;
    scrollLastFrameTime = performance.now();
    scrollAnimationFrame = requestAnimationFrame(smoothScrollAnimation);
  }
}, { passive: false });

// Add smooth hover for cards
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-10px) scale(1.02)';
  });

  card.addEventListener('mouseleave', function () {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

/* Contact Modal Behavior */
(() => {
  const openBtn = document.getElementById('contact-open');
  const modal = document.getElementById('contact-modal');
  const closeBtns = modal ? modal.querySelectorAll('.modal-close, #contact-cancel') : [];
  const form = document.getElementById('contact-form');
  let lastFocused = null;

  if (!modal || !openBtn) return;

  function setAriaOpen(isOpen) {
    modal.setAttribute('aria-hidden', String(!isOpen));
    openBtn.setAttribute('aria-expanded', String(isOpen));
  }

  function openModal() {
    lastFocused = document.activeElement;
    setAriaOpen(true);
    document.body.style.overflow = 'hidden';
    // focus first input
    const first = modal.querySelector('input, textarea, button');
    if (first) first.focus();
  }

  function closeModal() {
    setAriaOpen(false);
    document.body.style.overflow = '';
    // restore focus
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  openBtn.addEventListener('click', () => {
    openModal();
  });

  closeBtns.forEach(btn => btn.addEventListener('click', () => closeModal()));

  // Close when clicking outside dialog
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      e.preventDefault();
      closeModal();
    }
  });

  // Focus trap
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || modal.getAttribute('aria-hidden') === 'true') return;
    const focusable = modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) { // Shift+Tab
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else { // Tab
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Replace mailto with POST to server backend
  // Add a status element below the form for feedback
  const status = document.createElement('p');
  status.className = 'contact-status';
  form.parentElement.appendChild(status);

  // Create spinner element for the submit button
  const submitBtn = form.querySelector('button[type="submit"]');
  const spinner = document.createElement('span');
  spinner.className = 'btn-spinner';
  spinner.setAttribute('aria-hidden', 'true');

  if (submitBtn) submitBtn.appendChild(spinner);

  // Simple inline validation helper
  function validate() {
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    if (!name) return 'Please enter your name.';
    if (!email) return 'Please enter a valid email.';
    if (!message) return 'Please enter a message.';
    return '';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    status.textContent = '';
    status.classList.remove('success', 'error');

    const validationError = validate();
    if (validationError) {
      status.textContent = validationError;
      status.classList.add('error');
      return;
    }

    const data = {
      name: document.getElementById('contact-name').value.trim(),
      email: document.getElementById('contact-email').value.trim(),
      message: document.getElementById('contact-message').value.trim()
    };

    try {
      // disable UI while sending
      if (submitBtn) {
        submitBtn.disabled = true;
        spinner.classList.add('spinning');
      }

      const res = await fetch('https://portfolio-backend-sadj.onrender.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json().catch(() => ({}));

      if (res.ok) {
        status.textContent = 'Message sent successfully!';
        status.classList.add('success');
        form.reset();
        // optionally close modal after a short delay
        setTimeout(() => closeModal(), 900);
      } else {
        status.textContent = 'Error: ' + (result.error || 'Something went wrong');
        status.classList.add('error');
      }
    } catch (err) {
      status.textContent = 'Error: ' + err.message;
      status.classList.add('error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        spinner.classList.remove('spinning');
      }
    }
  });

  // cancel button resets form and closes modal
  const cancelBtn = document.getElementById('contact-cancel');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      form.reset();
      status.textContent = '';
      status.classList.remove('success', 'error');
      closeModal();
    });
  }
})();