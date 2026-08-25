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

document.querySelectorAll("form.invite").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const emailInput = form.querySelector("[name=email]");
    const email = emailInput instanceof HTMLInputElement ? emailInput.value : "";
    await fetch(form.getAttribute("action") || "", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
  });
});

document.querySelectorAll("#create-model").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await fetch(form.getAttribute("action") || "", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    location.href = "/app";
  });
});

document.querySelectorAll("#save-model").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const versionInput = form.querySelector("[name=version]");
    const version =
      versionInput instanceof HTMLInputElement
        ? Number(versionInput.value)
        : 0;
    const id = (form.getAttribute("action") || "").split("/").pop();
    const holder = document.getElementById("event-model-document");
    const documentBody = holder
      ? JSON.parse(holder.textContent || "{}")
      : {
          format: "eventmodel",
          schemaVersion: 1,
          id,
          title: "Untitled",
          slices: [],
        };
    const response = await fetch(form.getAttribute("action") || "", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        version,
        document: documentBody,
      }),
    });
    if (response.status === 200) {
      for (const node of document.querySelectorAll("main p")) {
        if (node.textContent === "Unsaved changes.") node.remove();
      }
    }
    if (response.status === 409) {
      const main = document.querySelector("main");
      if (main && !main.textContent?.includes("This Event Model was saved by someone else.")) {
        main.insertAdjacentHTML(
          "afterbegin",
          "<p>This Event Model was saved by someone else.</p>",
        );
      }
    }
  });
});
