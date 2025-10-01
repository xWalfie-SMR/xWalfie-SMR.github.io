const button = document.querySelector("#content-card .card-button");
const cardDetails = document.querySelector("#content-card .card-details");

button.addEventListener("click", () => {
  // Si ya está expandido -> colapsar (pero mantener la clase hasta que termine)
  if (cardDetails.classList.contains("expanded")) {
    // 1) fijar la altura actual explícitamente
    cardDetails.style.height = cardDetails.scrollHeight + "px";

    // 2) forzar reflow para que el navegador "registre" esa altura ahora mismo
    cardDetails.getBoundingClientRect();

    // 3) setear la transición inline (igual duración que la que te guste)
    cardDetails.style.transition = "height 600ms ease"; // ajusta duración si quieres

    // 4) en el siguiente frame iniciar la animación hacia 0
    requestAnimationFrame(() => {
      cardDetails.style.height = "0px";
    });

    // 5) al terminar, limpiar y quitar la clase
    const onCollapseEnd = (e) => {
      if (e.propertyName !== "height") return;
      cardDetails.classList.remove("expanded");
      // Keep height at 0
      cardDetails.style.height = "0";
      cardDetails.style.removeProperty("transition");
      cardDetails.removeEventListener("transitionend", onCollapseEnd);
    };
    cardDetails.addEventListener("transitionend", onCollapseEnd);

  } else {
    // Expandir (simétrico al colapso)
    // 1) marcar expansión para que el contenido sea visible/medible
    cardDetails.classList.add("expanded");

    // 2) empezar desde 0
    cardDetails.style.height = "0px";
    cardDetails.getBoundingClientRect();

    // 3) setear la transición inline
    cardDetails.style.transition = "height 600ms ease";

    // 4) en el siguiente frame ir a la altura completa
    requestAnimationFrame(() => {
      cardDetails.style.height = cardDetails.scrollHeight + "px";
    });

    // 5) al acabar limpiar inline styles (permitir tamaño natural)
    const onExpandEnd = (e) => {
      if (e.propertyName !== "height") return;
      cardDetails.style.removeProperty("height");
      cardDetails.style.removeProperty("transition");
      cardDetails.removeEventListener("transitionend", onExpandEnd);
    };
    cardDetails.addEventListener("transitionend", onExpandEnd);
  }
});
