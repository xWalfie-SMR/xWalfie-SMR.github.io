const button = document.querySelector("#content-card .card-button");
const contentCard = document.getElementById("content-card");

button.addEventListener("click", () => {
  contentCard.classList.toggle("expanded");
});
