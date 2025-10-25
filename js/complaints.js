// complaints.js
const STORAGE_KEY = "campus_complaints_v1";

// Load or init
let complaints = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Elements
const form = document.getElementById("complaintForm");
const nameInput = document.getElementById("complainantName");
const categoryInput = document.getElementById("complaintCategory");
const priorityInput = document.getElementById("complaintPriority");
const descInput = document.getElementById("complaintDesc");

const listEl = document.getElementById("complaintList");
const filterCategory = document.getElementById("filterCategory");
const filterStatus = document.getElementById("filterStatus");
const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearFilters");

// Helpers
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

function uid() {
  // simple unique id (time + random)
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

function createBadge(text, cls = "") {
  return `<span class="badge ${cls}">${text}</span>`;
}

function priorityClass(p) {
  if (p === "High") return "high";
  if (p === "Medium") return "medium";
  return "low";
}

function statusClass(s) {
  if (s === "Pending") return "pending";
  if (s === "In Progress") return "inprogress";
  return "resolved";
}

// Add new complaint
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const titleSnippet = descInput.value.trim().split("\n")[0].slice(0,60);
  const newComplaint = {
    id: uid(),
    name: nameInput.value.trim() || "Anonymous",
    category: categoryInput.value,
    priority: priorityInput.value,
    desc: descInput.value.trim(),
    shortTitle: titleSnippet || "No title",
    status: "Pending",
    date: new Date().toLocaleString()
  };
  complaints.push(newComplaint);
  save();
  form.reset();
  render();
});

// Render complaints (with filters)
function render() {
  const catFilter = filterCategory.value;
  const statusFilter = filterStatus.value;
  const q = searchInput.value.trim().toLowerCase();

  // show newest first
  const list = complaints.slice().reverse().filter(c => {
    if (catFilter !== "All" && c.category !== catFilter) return false;
    if (statusFilter !== "All" && c.status !== statusFilter) return false;
    if (q) {
      const hay = (c.name + " " + c.shortTitle + " " + c.desc + " " + c.category).toLowerCase();
      return hay.includes(q);
    }
    return true;
  });

  listEl.innerHTML = "";
  if (list.length === 0) {
    listEl.innerHTML = "<p>No complaints found.</p>";
    return;
  }

  list.forEach(c => {
    const div = document.createElement("div");
    div.className = "card complaint-card";
    div.dataset.id = c.id;
    div.innerHTML = `
      <div class="row-between">
        <div>
          <strong>${escapeHtml(c.shortTitle)}</strong>
          <div class="meta">
            <small>${escapeHtml(c.name)} • ${escapeHtml(c.category)} • ${c.date}</small>
          </div>
        </div>
        <div style="text-align:right">
          ${createBadge(escapeHtml(c.status), statusClass(c.status))}
          ${createBadge(escapeHtml(c.priority), priorityClass(c.priority))}
        </div>
      </div>

      <p class="complaint-desc">${escapeHtml(c.desc)}</p>

      <div class="card-actions">
        <select class="status-select" data-id="${c.id}">
          <option value="Pending" ${c.status === "Pending" ? "selected":""}>Pending</option>
          <option value="In Progress" ${c.status === "In Progress" ? "selected":""}>In Progress</option>
          <option value="Resolved" ${c.status === "Resolved" ? "selected":""}>Resolved</option>
        </select>

        <button class="delete-btn" data-id="${c.id}">Delete</button>
      </div>
    `;
    listEl.appendChild(div);
  });
}

// Event delegation: status change & delete
listEl.addEventListener("change", (e) => {
  if (e.target.matches(".status-select")) {
    const id = e.target.dataset.id;
    const newStatus = e.target.value;
    const idx = complaints.findIndex(x => x.id === id);
    if (idx > -1) {
      complaints[idx].status = newStatus;
      save();
      render();
    }
  }
});

listEl.addEventListener("click", (e) => {
  if (e.target.matches(".delete-btn")) {
    const id = e.target.dataset.id;
    if (confirm("Delete this complaint?")) {
      complaints = complaints.filter(x => x.id !== id);
      save();
      render();
    }
  }
});

// Filters / search listeners
filterCategory.addEventListener("change", render);
filterStatus.addEventListener("change", render);
searchInput.addEventListener("input", render);
clearBtn.addEventListener("click", () => {
  filterCategory.value = "All";
  filterStatus.value = "All";
  searchInput.value = "";
  render();
});

// Utility: simple escape to avoid HTML injection in demo
function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// initial render
render();
