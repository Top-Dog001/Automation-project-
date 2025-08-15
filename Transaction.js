document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("transactions-container");

  function parseNum(val) {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  }
  function fmt(num) {
    return Number(num).toFixed(2);
  }
  function todayDate() {
    return new Date().toISOString().split('T')[0];
  }

  function buildTable(dateKey, data) {
    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>S/N</th><th>DATE</th><th>INITIAL (kg)</th>
          <th>FINAL (kg)</th><th>UNIT PURCHASE (kg)</th>
          <th>COST (#)</th><th>REMARK</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");

    let totalUnits = 0;
    let totalCost = 0;

    data.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.sn || ""}</td>
        <td>${row.date || ""}</td>
        <td>${row.initial || ""}</td>
        <td>${row.final || ""}</td>
        <td>${row.unit || ""}</td>
        <td>${row.cost || ""}</td>
        <td>${row.remark || ""}</td>
      `;
      tbody.appendChild(tr);
      totalUnits += parseNum(row.unit);
      totalCost += parseNum(row.cost);
    });

    const balanceRow = document.createElement("tr");
    balanceRow.className = "balance-row";
    balanceRow.innerHTML = `
      <td></td><td></td><td></td>
      <td>TOTAL >>>></td>
      <td>${fmt(totalUnits)}</td>
      <td>${fmt(totalCost)}</td>
      <td></td>
    `;
    tbody.appendChild(balanceRow);

    const title = document.createElement("h3");
    title.textContent = `Transactions for ${dateKey.replace("addNewData_", "")}`;
    container.appendChild(title);
    container.appendChild(table);
  }

  function render() {
    container.innerHTML = "";
    Object.keys(localStorage)
      .filter(k => k.startsWith("addNewData_"))
      .sort()
      .reverse()
      .forEach(k => {
        const data = JSON.parse(localStorage.getItem(k) || "[]");
        if (data.length) buildTable(k, data);
      });
  }

  render();
  window.addEventListener("storage", e => {
    if (e.key && e.key.startsWith("addNewData_")) render();
  });
});

// ===== Midnight Auto-Refresh =====
(function midnightWatcher() {
  let currentDate = new Date().toDateString();

  setInterval(() => {
    let nowDate = new Date().toDateString();
    if (nowDate !== currentDate) {
      console.log("📅 New day detected — switching to new storage key...");
      currentDate = nowDate;

      // Force refresh the page so new day table is loaded
      location.reload();
    }
  }, 60000); // Check every minute
})();