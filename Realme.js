
// Dummy data for now (replace with Firestore later)
//const recentTransactions = [
  { date: "2025-08-10", description: "Gas Purchase", amount: "50 kg", img: "gas1.jpg" },
  { date: "2025-08-09", description: "Gas Sale", amount: "15 kg", img: "gas2.jpg" },
  { date: "2025-08-08", description: "Gas Purchase", amount: "30 kg", img: "gas3.jpg" }
];

function loadRecentTransactions() {
  const slider = document.getElementById("recentSlider");
  slider.innerHTML = "";

  recentTransactions.forEach(tx => {
    const card = document.createElement("div");
    card.classList.add("slide");
    card.innerHTML = `
      <img src="${tx.img}" alt="${tx.description}">
      <div class="slide-info">
        <p class="slide-date">${tx.date}</p>
        <p class="slide-desc">${tx.description}</p>
        <p class="slide-amount">${tx.amount}</p>
      </div>
    `;
    slider.appendChild(card);
  });
}

window.onload = loadRecentTransactions;//