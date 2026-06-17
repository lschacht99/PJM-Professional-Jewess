(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  /* Mobile nav */
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");
  const navScrim = $("#navScrim");

  function closeNav() {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("is-open");
    navScrim?.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  function openNav() {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute("aria-expanded", "true");
    navLinks.classList.add("is-open");
    navScrim?.classList.add("is-open");
    document.body.classList.add("nav-open");
  }

  navToggle?.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    expanded ? closeNav() : openNav();
  });

  navScrim?.addEventListener("click", closeNav);

  $$("#navLinks a, #navLinks button").forEach((item) => {
    item.addEventListener("click", closeNav);
  });

  /* Application modal */
  const modal = $("#applyModal");
  const form = $("#pjApplicationForm");
  const statusEl = $("#pjFormStatus");
  const openers = $$("[data-apply-open]");
  const closers = $$("[data-apply-close]");
  let lastFocusedEl = null;

  function setStatus(message, type = "") {
    if (!statusEl) return;
    statusEl.textContent = message || "";
    statusEl.classList.remove("is-success", "is-error");
    if (type) statusEl.classList.add(`is-${type}`);
  }

  function setRole(role) {
    if (!form || !role) return;
    const input = form.querySelector(`input[name="role"][value="${role}"]`);
    if (input) input.checked = true;
  }

  function openApplyModal(role = "") {
    if (!modal) return;

    lastFocusedEl = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("pj-modal-open");

    setStatus("");
    setRole(role);

    const firstInput = form?.querySelector("input[name='role']:checked") || form?.querySelector("input, select, textarea, button");
    setTimeout(() => firstInput?.focus(), 80);
  }

  function closeApplyModal() {
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("pj-modal-open");

    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
      lastFocusedEl.focus();
    }
  }

  openers.forEach((opener) => {
    opener.addEventListener("click", (event) => {
      event.preventDefault();
      const role = opener.getAttribute("data-apply-role") || "";
      openApplyModal(role);
    });
  });

  closers.forEach((closer) => {
    closer.addEventListener("click", closeApplyModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal?.classList.contains("is-open")) {
      closeApplyModal();
    }
  });

  /* Open modal from URL, example:
     index.html?apply=1
     index.html?role=mentee
     index.html?role=mentor
  */
  const urlParams = new URLSearchParams(window.location.search);
  const roleFromUrl = urlParams.get("role");
  const applyFromUrl = urlParams.get("apply");

  if (roleFromUrl || applyFromUrl) {
    window.addEventListener("load", () => {
      openApplyModal(roleFromUrl || "");
    });
  }

  /* Submit application to Google Apps Script */
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const endpoint = window.PJ_FORM_ENDPOINT;

    if (!endpoint || endpoint.includes("PASTE_YOUR_GOOGLE_SCRIPT")) {
      setStatus("The form is not connected yet. Add your Google Apps Script Web App URL in index.html.", "error");
      return;
    }

    const submitBtn = form.querySelector("[type='submit']");
    const formData = new FormData(form);

    if (formData.get("website")) {
      setStatus("Application received.", "success");
      form.reset();
      return;
    }

    const payload = {
      timestamp: new Date().toISOString(),
      page: window.location.href,
      source: formData.get("source") || "homepage-popup",
      role: formData.get("role") || "",
      name: formData.get("name") || "",
      email: formData.get("email") || "",
      phone: formData.get("phone") || "",
      community: formData.get("community") || "",
      field: formData.get("field") || "",
      stage: formData.get("stage") || "",
      goals: formData.get("goals") || "",
      privacy_ack: formData.get("privacy_ack") || ""
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
    setStatus("");

    try {
      /*
        text/plain keeps this as a simple request for Apps Script.
        no-cors avoids browser blocking from Google Script response headers.
        Because no-cors responses are opaque, we treat no thrown error as submitted.
      */
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      form.reset();
      setStatus("Application received. We will review it before making any introduction.", "success");

      setTimeout(() => {
        closeApplyModal();
      }, 1400);
    } catch (error) {
      console.error(error);
      setStatus("Something went wrong. Please try again, or contact us directly.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit application";
    }
  });
})();
