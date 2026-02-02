/* ===== SERVICE WORKER ===== */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

/* ===== LOGIN ===== */
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (role === "admin") {
    if (username === "admin" && password === "admin123") {
      localStorage.clear();
      localStorage.setItem("role", "admin");
      window.location.href = "admin.html";
    } else {
      alert("Invalid admin credentials");
    }
    return;
  }

  if (!username) {
    alert("Enter username");
    return;
  }

  localStorage.clear();
  localStorage.setItem("role", "user");
  window.location.href = "dashboard.html";
}

/* ===== LOGOUT ===== */
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

/* ===== ROUTE PROTECTION ===== */
document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  const page = location.pathname;

  if (page.includes("dashboard") && !role) {
    location.href = "index.html";
  }

  if (page.includes("admin") && role !== "admin") {
    location.href = "index.html";
  }
});

/* ===== STORAGE ===== */
function getNotes() {
  return JSON.parse(localStorage.getItem("notes")) || [];
}
function saveNotes(n) {
  localStorage.setItem("notes", JSON.stringify(n));
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
  console.log("File loaded successfully");
    const notes = getNotes();
    notes.push({
      title,
      subject,
      filename: file.name,
      data: reader.result,
      approved: false
    });
    saveNotes(notes);
    alert("File sent for admin approval");

    document.getElementById("title").value = "";
    document.getElementById("subject").value = "";
    fileInput.value = "";
  };
  reader.readAsDataURL(file);
}

/* ===== LOAD APPROVED NOTES ===== */
function loadNotes() {
  const div = document.getElementById("notes");
  if (!div) return;

  const notes = getNotes();
  const role = localStorage.getItem("role");
  div.innerHTML = "";

  notes.forEach((n, i) => {
    if (n.approved) {
      div.innerHTML += `
        <div class="note">
          ${role === "admin" ? `<span class="delete" onclick="deleteNote(${i})">🗑️</span>` : ""}
          <h4>${n.title}</h4>
          <p>${n.subject}</p>
          <p>${n.filename}</p>
          <button onclick="downloadFile('${n.filename}','${n.data}')">Download</button>
        </div>
      `;
    }
  });
}

/* ===== ADMIN PENDING ===== */
function loadAdminNotes() {
  const div = document.getElementById("pending");
  if (!div) return;

  const notes = getNotes();
  div.innerHTML = "";

  notes.forEach((n, i) => {
    if (!n.approved) {
      div.innerHTML += `
        <div class="note">
          <h4>${n.title}</h4>
          <p>${n.subject}</p>
          <p>${n.filename}</p>
          <button onclick="approve(${i})">Approve</button>
          <button onclick="reject(${i})">Reject</button>
        </div>
      `;
    }
  });
}

/* ===== ADMIN ACTIONS ===== */
function approve(i) {
  const n = getNotes();
  n[i].approved = true;
  saveNotes(n);
  loadAdminNotes();
}

function reject(i) {
  const n = getNotes();
  n.splice(i, 1);
  saveNotes(n);
  loadAdminNotes();
}

function deleteNote(i) {
  if (localStorage.getItem("role") !== "admin") return;
  const n = getNotes();
  n.splice(i, 1);
  saveNotes(n);
  loadNotes();
}

/* ===== DOWNLOAD ===== */
function downloadFile(name, data) {
  const a = document.createElement("a");
  a.href = data;
  a.download = name;
  a.click();
}

/* ===== AUTO LOAD ===== */
document.addEventListener("DOMContentLoaded", () => {
  loadNotes();
  loadAdminNotes();
});
