const form = document.getElementById("waitlist-form");
const status = document.getElementById("waitlist-status");
const emailInput = document.getElementById("email");

if (form && status && emailInput instanceof HTMLInputElement) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: emailInput.value }),
    });
    const data = await response.json();
    status.textContent = data.message || "";
    status.hidden = false;
  });
}
