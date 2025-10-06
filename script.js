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
    
    // If opening, set overflow to visible after animation
    if (open) {
      const handleTransitionEnd = (e) => {
        if (e.propertyName === 'max-height') {
          cardDetails.style.overflow = 'visible';
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
  link.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-5px) scale(1.1)';
  });
  
  link.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

// Create floating particles
function createFloatingParticle() {
  const particle = document.createElement('div');
  particle.style.position = 'fixed';
  particle.style.width = '4px';
  particle.style.height = '4px';
  particle.style.background = 'rgba(59, 130, 246, 0.6)';
  particle.style.borderRadius = '50%';
  particle.style.pointerEvents = 'none';
  particle.style.left = Math.random() * window.innerWidth + 'px';
  particle.style.top = window.innerHeight + 'px';
  particle.style.zIndex = '1';
  
  document.querySelector('.bg-particles').appendChild(particle);
  
  const duration = Math.random() * 3000 + 5000;
  const xMove = (Math.random() - 0.5) * 100;
  
  particle.animate([
    { transform: 'translate(0, 0) scale(1)', opacity: 0 },
    { transform: `translate(${xMove}px, -${window.innerHeight + 100}px) scale(0)`, opacity: 1 },
    { transform: `translate(${xMove}px, -${window.innerHeight + 100}px) scale(0)`, opacity: 0 }
  ], {
    duration: duration,
    easing: 'linear'
  }).onfinish = () => particle.remove();
}

// Initialize on DOM ready (better performance)
document.addEventListener("DOMContentLoaded", () => {
  typeCommand();
  checkTabletOrientation();
});

// Start particle animations after page fully loads (performance optimization)
window.addEventListener("load", () => {
  setTimeout(() => {
    setInterval(createFloatingParticle, 500);
  }, 1000);
});

window.addEventListener("resize", checkTabletOrientation);

// Add smooth hover for cards
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-10px) scale(1.02)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});