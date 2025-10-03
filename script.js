const button      = document.querySelector("#content-card .card-button");
const cardDetails = document.querySelector("#content-card .card-details");
const popup       = document.getElementById("rotate-popup");

let animating = false;
let open       = false;
const duration  = 600;

button.addEventListener("click", () => {
  if (animating) return;
  animating = true;

  // 1. Add wave class based on state
  button.classList.remove("wave-up", "wave-down");
  button.classList.add(open ? "wave-down" : "wave-up");

  // 2. Expand/collapse height logic
  if (cardDetails.classList.contains("expanded")) {
    const h = cardDetails.scrollHeight;
    cardDetails.style.height = h + "px";
    cardDetails.getBoundingClientRect();
    cardDetails.style.transition = `height ${duration}ms ease`;
    cardDetails.style.height     = "0px";

    setTimeout(() => {
      cardDetails.classList.remove("expanded");
      cardDetails.style.removeProperty("height");
      cardDetails.style.removeProperty("transition");
      animating = false;
    }, duration);

  } else {
    cardDetails.classList.add("expanded");
    cardDetails.style.height = "0px";
    cardDetails.getBoundingClientRect();
    cardDetails.style.transition = `height ${duration}ms ease`;
    cardDetails.style.height     = cardDetails.scrollHeight + "px";

    setTimeout(() => {
      cardDetails.style.removeProperty("height");
      cardDetails.style.removeProperty("transition");
      animating = false;
    }, duration);
  }

  open = !open;
});

// 3. Remove wave classes once animation completes
button.addEventListener("animationend", (e) => {
  if (e.animationName === "waveUp" || e.animationName === "waveDown") {
    button.classList.remove("wave-up", "wave-down");
  }
});

function checkTabletOrientation() {
  const width  = window.innerWidth;
  const height = window.innerHeight;

  if (width >= 768 && width < 1400 && height > width) {
    popup.style.display = "flex";
    popup.style.justifyContent = "center";
    popup.style.alignItems    = "center";
  } else {
    popup.style.display = "none";
  }
}

window.addEventListener("resize", checkTabletOrientation);
window.addEventListener("load",   checkTabletOrientation);

