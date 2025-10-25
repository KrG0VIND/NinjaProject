// Simple Attendance Tracker
let attendance = JSON.parse(localStorage.getItem("attendance")) || {};

const form = document.getElementById("attendanceForm");
const subjectInput = document.getElementById("subject");
const statusInput = document.getElementById("status");
const tableBody = document.querySelector("#attendanceTable tbody");

form.addEventListener("submit", function(e) {
  e.preventDefault();
  const subject = subjectInput.value.trim();
  const status = statusInput.value;

  if (!subject) return;

  if (!attendance[subject]) {
    attendance[subject] = { present: 0, total: 0 };
  }

  attendance[subject].total += 1;
  if (status === "Present") attendance[subject].present += 1;

  localStorage.setItem("attendance", JSON.stringify(attendance));
  form.reset();
  displayAttendance();
});

function displayAttendance() {
  tableBody.innerHTML = "";

  const subjects = Object.keys(attendance);
  if (subjects.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='4'>No attendance data yet.</td></tr>";
    return;
  }

  subjects.forEach(sub => {
    const data = attendance[sub];
    const percent = ((data.present / data.total) * 100).toFixed(1);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${sub}</td>
      <td>${data.present}</td>
      <td>${data.total}</td>
      <td>${percent}%</td>
    `;
    tableBody.appendChild(tr);
  });
}

displayAttendance();
