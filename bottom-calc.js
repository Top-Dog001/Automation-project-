// === Calculator Logic ===
const calcBtn = document.querySelector(".calc-float");
const calcPanel = document.getElementById("bottomCalc");
const calcDisplay = document.getElementById("calcDisplay");
const calcKeys = document.getElementById("calcKeys");

calcBtn.addEventListener("click", () => {
  calcPanel.classList.toggle("show");
});

calcKeys.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  const key = e.target.textContent;

  if (key === "=") {
    try {
      calcDisplay.value = eval(calcDisplay.value) || "";
    } catch {
      calcDisplay.value = "Error";
    }
    return;
  }

  if (key === "AC") {
    calcDisplay.value = "";
    return;
  }

  calcDisplay.value += key;
});