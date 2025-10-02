const button = document.querySelector("#content-card .card-button");
const cardDetails = document.querySelector("#content-card .card-details");

let animating = false;
const duration = 600;

button.addEventListener("click", () => {
  if (animating) return;
  animating = true;

  if (cardDetails.classList.contains("expanded")) {
    const startHeight = cardDetails.scrollHeight;
    cardDetails.style.height = startHeight + "px";
    cardDetails.getBoundingClientRect();
    cardDetails.style.transition = `height ${duration}ms ease`;
    cardDetails.style.height = "0px";

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
    cardDetails.style.height = cardDetails.scrollHeight + "px";

    setTimeout(() => {
      cardDetails.style.removeProperty("height");
      cardDetails.style.removeProperty("transition");
      animating = false;
    }, duration);
  }
});
