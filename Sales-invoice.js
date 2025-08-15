document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.sales-table');

  function parseNum(x) {
    const n = Number(x);
    return Number.isFinite(n) ? n : 0;
  }

  function todayDate() {
    return new Date().toISOString().split("T")[0];
  }

  function renderFromStorage() {
    const tbody = table.querySelector('tbody');
    const balanceRow = tbody.querySelector('.balance-row');
    const todayKey = `addNewData_${todayDate()}`;
    const addNewData = JSON.parse(localStorage.getItem(todayKey) || '[]');
    const filledKg = parseNum(localStorage.getItem('filledKg') || 0);

    tbody.querySelectorAll('tr:not(.balance-row)').forEach(tr => tr.remove());

    let runningBalance = filledKg;

    addNewData.forEach(rowData => {
      const sn = rowData.sn || '';
      const date = rowData.date || '';
      const outputVal = parseNum(rowData.unit || 0);
      runningBalance -= outputVal;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input type="number" value="${sn}" readonly></td>
        <td><input type="date" value="${date}" readonly></td>
        <td><input type="text"></td>
        <td><input type="number"></td>
        <td><input type="number" value="${outputVal.toFixed(2)}" readonly></td>
        <td><input type="number" value="${runningBalance.toFixed(2)}" readonly></td>
      `;
      tbody.insertBefore(tr, balanceRow);
    });

    const balanceInput = balanceRow.querySelector('td:last-child input');
    if (balanceInput) balanceInput.value = runningBalance.toFixed(2);
  }

  renderFromStorage();
  window.addEventListener('storage', e => {
    if (e.key.startsWith('addNewData_') || e.key === 'filledKg') renderFromStorage();
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