document.querySelectorAll("#create-team").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nameInput = form.querySelector("[name=name]");
    const name = nameInput instanceof HTMLInputElement ? nameInput.value : "";
    await fetch("/api/teams", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name }),
    });
    location.href = "/app";
  });
});

