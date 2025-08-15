document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const saveBtn = document.getElementById('saveAddNew');

  function parseNum(val) {
    const n = parseFloat(val);
    return isNaN(n) ? null : n;
  }
  function fmt(num) {
    return num != null ? num.toFixed(2) : '';
  }
  function todayDate() {
    return new Date().toISOString().split('T')[0];
  }
  function getUnitPrice() {
    return parseNum(localStorage.getItem('currentPrice')) || 0;
  }
  function balanceRow() {
    return tbody.querySelector('.balance-row');
  }
  function renumberRows() {
    let sn = 1;
    tbody.querySelectorAll('tr:not(.balance-row)').forEach(row => {
      row.querySelector('td:first-child input').value = sn++;
    });
  }

  function createRow() {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="number" readonly></td>
      <td><input type="date" value="${todayDate()}"></td>
      <td><input type="number"></td>
      <td><input type="number"></td>
      <td><input type="number"></td>
      <td><input type="number" readonly></td>
      <td><input type="text"></td>
    `;
    return tr;
  }

  function calcRow(row, changedInput) {
    const initial = parseNum(row.cells[2].querySelector('input').value);
    const final = parseNum(row.cells[3].querySelector('input').value);
    const unit = parseNum(row.cells[4].querySelector('input').value);
    const costInput = row.cells[5].querySelector('input');

    if (initial != null && final != null && changedInput !== row.cells[4].querySelector('input')) {
      row.cells[4].querySelector('input').value = fmt(final - initial);
    } else if (initial != null && unit != null && changedInput !== row.cells[3].querySelector('input')) {
      row.cells[3].querySelector('input').value = fmt(initial + unit);
    }

    const unitNow = parseNum(row.cells[4].querySelector('input').value);
    const price = getUnitPrice();
    costInput.value = (unitNow != null && price) ? fmt(unitNow * price) : '';
  }

  function calcTotals() {
    let totalUnits = 0;
    let totalCost = 0;
    tbody.querySelectorAll('tr:not(.balance-row)').forEach(r => {
      totalUnits += parseNum(r.cells[4].querySelector('input').value) || 0;
      totalCost += parseNum(r.cells[5].querySelector('input').value) || 0;
    });
    const b = balanceRow();
    b.cells[4].querySelector('input').value = fmt(totalUnits);
    b.cells[5].querySelector('input').value = fmt(totalCost);
  }

  function recalcAll(changedInput = null) {
    tbody.querySelectorAll('tr:not(.balance-row)').forEach(r => calcRow(r, changedInput));
    calcTotals();
  }

  document.addEventListener('keydown', e => {
    if (!(e.key === 'Tab' || e.key === 'Enter')) return;
    const active = document.activeElement;
    if (!active || active.tagName !== 'INPUT') return;
    const currentRow = active.closest('tr');
    if (!currentRow || currentRow.nextElementSibling !== balanceRow()) return;

    e.preventDefault();
    const newRow = createRow();
    tbody.insertBefore(newRow, balanceRow());
    renumberRows();

    function updateResetCountdown() {
  const countdownEl = document.getElementById("resetCountdown");

  if (!countdownEl) return;

  // Get next midnight
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  const diffMs = midnight - now;

  // Convert to hours, minutes, seconds
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  countdownEl.textContent = `Next Reset in: ${hours}h ${minutes}m ${seconds}s`;
}

// Update every second
setInterval(updateResetCountdown, 1000);
updateResetCountdown();
    newRow.querySelector('td:nth-child(2) input').focus();
  });

  table.addEventListener('input', e => {
    const row = e.target.closest('tr');
    if (!row || row.classList.contains('balance-row')) return;
    calcRow(row, e.target);
    calcTotals();
    renumberRows();
  });

  saveBtn.addEventListener("click", () => {
    const todayKey = `addNewData_${todayDate()}`;
    let existingData = JSON.parse(localStorage.getItem(todayKey) || "[]");

    const rows = Array.from(table.querySelectorAll("tbody tr:not(.balance-row)"));
    const data = rows.map(row => ({
      sn: row.querySelector('td:nth-child(1) input').value,
      date: row.querySelector('td:nth-child(2) input').value,
      initial: row.querySelector('td:nth-child(3) input').value,
      final: row.querySelector('td:nth-child(4) input').value,
      unit: row.querySelector('td:nth-child(5) input').value,
      cost: row.querySelector('td:nth-child(6) input').value,
      remark: row.querySelector('td:nth-child(7) input').value
    }));

    localStorage.setItem(todayKey, JSON.stringify(data));
    localStorage.setItem("addNewData", JSON.stringify(data)); // Live sync
    alert("✅ Add New data saved!");
  });

  function loadData() {
    const todayKey = `addNewData_${todayDate()}`;
    const saved = JSON.parse(localStorage.getItem(todayKey) || '[]');
    if (saved.length) {
      tbody.querySelectorAll('tr:not(.balance-row)').forEach(r => r.remove());
      saved.forEach(item => {
        const tr = createRow();
        tr.cells[0].querySelector('input').value = item.sn;
        tr.cells[1].querySelector('input').value = item.date;
        tr.cells[2].querySelector('input').value = item.initial;
        tr.cells[3].querySelector('input').value = item.final;
        tr.cells[4].querySelector('input').value = item.unit;
        tr.cells[5].querySelector('input').value = item.cost;
        tr.cells[6].querySelector('input').value = item.remark;
        tbody.insertBefore(tr, balanceRow());
      });
    }
    renumberRows();
    calcTotals();
  }

  loadData();
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

// ===== Midnight Auto-Reset Patch =====
function getTodayDateStr() {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function resetDataForNewDay() {
  console.log("🕛 Midnight reached — resetting data for a new day...");

  // Clear Add New data
  localStorage.removeItem("addNewData");

  // Update reset date
  localStorage.setItem("lastResetDate", getTodayDateStr());

  // Optional: reload the page to start fresh
  location.reload();
}

// Ensure lastResetDate exists
if (!localStorage.getItem("lastResetDate")) {
  localStorage.setItem("lastResetDate", getTodayDateStr());
}

// Check every minute if date changed
setInterval(() => {
  const lastDate = localStorage.getItem("lastResetDate");
  const today = getTodayDateStr();

  if (today !== lastDate) {
    resetDataForNewDay();
  }
}, 60000); // check every 60 seconds


function updateResetCountdown() {
  const countdownEl = document.getElementById("resetCountdown");

  if (!countdownEl) return;

  // Get next midnight
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  const diffMs = midnight - now;

  // Convert to hours, minutes, seconds
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  countdownEl.textContent = `Next Reset in: ${hours}h ${minutes}m ${seconds}s`;
}

// Update every second
setInterval(updateResetCountdown, 1000);
updateResetCountdown();
