const toggleBtn = document.getElementById("toggleMode");
const body = document.body;

// Check saved mode in localStorage
const savedMode = localStorage.getItem("mode") || "dark";
body.className = savedMode;

toggleBtn.addEventListener("click", () => {
  if (body.classList.contains("dark")) {
    body.classList.replace("dark", "light");
    localStorage.setItem("mode", "light");
  } else {
    body.classList.replace("light", "dark");
    localStorage.setItem("mode", "dark");
  }
});

  const noteArea = document.getElementById("noteArea");
  const saveBtn = document.getElementById("saveBtn");

  // Load note if exists
  window.addEventListener("load", () => {
    const savedNote = localStorage.getItem("userNote");
    if (savedNote) {
      noteArea.value = savedNote;
    }
  });

  // Save note on click
  saveBtn.addEventListener("click", () => {
    localStorage.setItem("userNote", noteArea.value);
    alert("Note saved to browser!");
  });
