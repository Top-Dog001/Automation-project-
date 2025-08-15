document.addEventListener("DOMContentLoaded", () => {
  const currentPriceInput = document.getElementById("currentPrice");
  const filledKgInput = document.getElementById("filledKg");
  const saveBtn = document.getElementById("saveBtn");

  // Load saved values (check multiple keys just in case)
  currentPriceInput.value =
    localStorage.getItem("currentPrice") ||
    localStorage.getItem("unitPrice") ||
    localStorage.getItem("settingsCurrentPrice") ||
    "";
  
  filledKgInput.value =
    localStorage.getItem("filledKg") ||
    localStorage.getItem("settingsKgFilled") ||
    "";

  saveBtn.addEventListener("click", () => {
    const price = parseFloat(currentPriceInput.value) || 0;
    const filledKg = parseFloat(filledKgInput.value) || 0;

    // Save under all possible keys so all scripts can read
    localStorage.setItem("currentPrice", price);
    localStorage.setItem("unitPrice", price);
    localStorage.setItem("settingsCurrentPrice", price);

    localStorage.setItem("filledKg", filledKg);
    localStorage.setItem("settingsKgFilled", filledKg);

    alert("✅ Settings saved successfully!");
  });
});