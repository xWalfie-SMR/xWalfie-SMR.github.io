const button = document.querySelector("#content-card .card-button");
const cardDetails = document.querySelector("#content-card .card-details");

button.addEventListener("click", () => {
  if (cardDetails.classList.contains("expanded")) {
    cardDetails.style.height = cardDetails.scrollHeight + "px";
    cardDetails.getBoundingClientRect();
    cardDetails.style.transition = "height 600ms ease";

    requestAnimationFrame(() => {
      cardDetails.style.height = "0px";
    });

    const onCollapseEnd = (e) => {
      if (e.propertyName !== "height") return;
      cardDetails.classList.remove("expanded");
      cardDetails.style.height = "0";
      cardDetails.style.removeProperty("transition");
      cardDetails.removeEventListener("transitionend", onCollapseEnd);
    };
    cardDetails.addEventListener("transitionend", onCollapseEnd);

  } else {
    cardDetails.classList.add("expanded");
    cardDetails.style.height = "0px";
    cardDetails.getBoundingClientRect();
    cardDetails.style.transition = "height 600ms ease";

    requestAnimationFrame(() => {
      cardDetails.style.height = cardDetails.scrollHeight + "px";
    });

    const onExpandEnd = (e) => {
      if (e.propertyName !== "height") return;
      cardDetails.style.removeProperty("height");
      cardDetails.style.removeProperty("transition");
      cardDetails.removeEventListener("transitionend", onExpandEnd);
    };
    cardDetails.addEventListener("transitionend", onExpandEnd);
  }
});