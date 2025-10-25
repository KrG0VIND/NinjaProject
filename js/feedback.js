// Simple Feedback System
const feedbackForm = document.getElementById("feedbackForm");
const feedbackList = document.getElementById("feedbackList");

let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

feedbackForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim() || "Anonymous";
  const category = document.getElementById("category").value;
  const message = document.getElementById("message").value.trim();

  const newFeedback = {
    name,
    category,
    message,
    date: new Date().toLocaleString()
  };

  feedbacks.unshift(newFeedback);
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

  feedbackForm.reset();
  displayFeedbacks();
});

function displayFeedbacks() {
  feedbackList.innerHTML = "";

  if (feedbacks.length === 0) {
    feedbackList.innerHTML = "<p>No feedback yet.</p>";
    return;
  }

  feedbacks.forEach(fb => {
    const div = document.createElement("div");
    div.classList.add("feedback-item");
    div.innerHTML = `
      <h4>${fb.name} <small>(${fb.category})</small></h4>
      <p>${fb.message}</p>
      <span class="date">${fb.date}</span>
    `;
    feedbackList.appendChild(div);
  });
}

displayFeedbacks();
