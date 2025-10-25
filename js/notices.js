// Load notices from localStorage or empty array
let notices = JSON.parse(localStorage.getItem("notices")) || [];

// Form submission
document.getElementById("noticeForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const title = document.getElementById("noticeTitle").value.trim();
  const desc = document.getElementById("noticeDesc").value.trim();

  if (title && desc) {
    const newNotice = {
      title,
      desc,
      date: new Date().toLocaleString()
    };

    // Add to array & save
    notices.push(newNotice);
    localStorage.setItem("notices", JSON.stringify(notices));

    // Reset form
    this.reset();

    // Refresh notice list
    displayNotices();
  }
});

// Function to display all notices
function displayNotices() {
  const list = document.getElementById("noticeList");
  list.innerHTML = "";

  if (notices.length === 0) {
    list.innerHTML = "<p>No notices yet.</p>";
    return;
  }

  notices.slice().reverse().forEach((n) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${n.title}</h3>
      <p>${n.desc}</p>
      <small>Posted on: ${n.date}</small>
    `;
    list.appendChild(card);
  });
}

// Initial load
displayNotices();
