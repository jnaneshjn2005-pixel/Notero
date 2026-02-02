/* ===== SERVICE WORKER ===== */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

/* ===== LOGIN ===== */
function login() {
  const role = document.getElementById("role").value;

  if (role === "admin") {
    localStorage.setItem("role", "admin");
    window.location.href = "admin.html";
  } else {
    localStorage.setItem("role", "user");
    window.location.href = "dashboard.html";
  }
}

/* ===== LOGOUT ===== */
function logout() {
  localStorage.removeItem("role");
  window.location.href = "index.html";
}

/* ===== ROUTE PROTECTION ===== */
document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  const page = location.pathname;

  if (page.includes("dashboard") && role !== "user") {
    location.href = "index.html";
  }

  if (page.includes("admin") && role !== "admin") {
    location.href = "index.html";
  }
});

/* ===== STORAGE HELPERS ===== */
function getNotes() {
  return JSON.parse(localStorage.getItem("notes")) || [];
}

function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

/* ===== ADD NOTE (FILE UPLOAD) ===== */
function addNote() {
  const title = document.getElementById("title").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const fileInput = document.getElementById("file");
  const file = fileInput.files[0];

  if (!title || !subject || !file) {
    alert("Please fill all fields and select a file");
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    const notes = getNotes();

    notes.push({
      title,
      subject,
      filename: file.name,
      data: reader.result,
      approved: false,
      favorite: false,
      rating: 0
    });

    saveNotes(notes);
    alert("File sent for admin approval");

    document.getElementById("title").value = "";
    document.getElementById("subject").value = "";
    fileInput.value = "";
  };

  reader.readAsDataURL(file);
}

/* ===== LOAD USER NOTES ===== */
function loadNotes() {
  const div = document.getElementById("notes");
  if (!div) return;

  const notes = getNotes();
  div.innerHTML = "";

  notes.forEach((n, i) => {
    if (n.approved) {
      div.innerHTML += `
        <div class="note">
          <h3>${n.title}</h3>
          <p>${n.subject}</p>
          <p>${n.filename}</p>
          <p>⭐ ${n.rating}/5</p>
          <button onclick="downloadFile('${n.filename}','${n.data}')">⬇️ Download</button>
          <button onclick="toggleFav(${i})">❤️ Favorite</button>
          <button onclick="rate(${i},5)">⭐ Rate</button>
        </div>
      `;
    }
  });
}

/* ===== DOWNLOAD FILE (ANY FORMAT) ===== */
function downloadFile(filename, data) {
  const a = document.createElement("a");
  a.href = data;
  a.download = filename;
  a.click();
}

/* ===== FAVORITE ===== */
function toggleFav(i) {
  const notes = getNotes();
  notes[i].favorite = !notes[i].favorite;
  saveNotes(notes);
}

/* ===== RATING ===== */
function rate(i, stars) {
  const notes = getNotes();
  notes[i].rating = stars;
  saveNotes(notes);
  loadNotes();
}

/* ===== ADMIN PANEL ===== */
function loadAdminNotes() {
  const div = document.getElementById("pending");
  if (!div) return;

  const notes = getNotes();
  div.innerHTML = "";

  let found = false;

  notes.forEach((n, i) => {
    if (!n.approved) {
      found = true;
      div.innerHTML += `
        <div class="note">
          <h3>${n.title}</h3>
          <p>${n.subject}</p>
          <p>${n.filename}</p>
          <button onclick="approveNote(${i})">Approve</button>
        </div>
      `;
    }
  });

  if (!found) {
    div.innerHTML = "<p>No pending uploads</p>";
  }
}

function approveNote(i) {
  const notes = getNotes();
  notes[i].approved = true;
  saveNotes(notes);
  loadAdminNotes();
}

/* ===== DARK MODE ===== */
function toggleTheme() {
  document.body.classList.toggle("dark");
}

/* ===== AUTO LOAD ===== */
document.addEventListener("DOMContentLoaded", () => {
  loadNotes();
  loadAdminNotes();
});

