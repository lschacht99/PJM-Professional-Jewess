(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  /* =========================
     Copy cleanup
     ========================= */

  const copyReplacements = [
    ["Private mentorship for frum Jewish women", "Private mentorship for observant Jewish women"],
    ["Private, thoughtfully matched mentorship for frum Jewish women in the professions.", "Private, thoughtfully matched mentorship for observant Jewish women in the professions."],
    ["A private, thoughtfully matched mentorship network for frum Jewish women in the professions.", "A private, thoughtfully matched mentorship network for observant Jewish women in the professions."],
    ["A private mentorship network for frum Jewish women in the professions.", "A private mentorship network for observant Jewish women in the professions."],
    ["Professional Jewess · 5786 / 2026 · Private mentorship for frum Jewish women", "Professional Jewess · 5786 / 2026 · Private mentorship for observant Jewish women"],
    ["Professional Jewess connects frum women building careers with women who have already walked the path.", "Professional Jewess connects observant and Orthodox women building careers with women who have already walked the path."],
    ["with guidance from a frum woman who has lived it.", "with guidance from an observant woman who has lived it."],
    ["They are also about frum life, family life,", "They are also about observant life, family life,"],
    ["A college student is considering law school and wants a frum woman’s perspective on practice areas, workload, and family life.", "An Orthodox college student is considering law school and wants a mentor’s perspective on practice areas, workload, and family life."],
    ["Find a frum woman mentor in your field, thoughtfully matched.", "Find an observant mentor in your field, thoughtfully matched."],
    ["you want a guide who’s done it as a frum woman, and knows", "you want a guide who understands Orthodox life, and knows"],
    ["Frum life at work", "Observant life at work"],
    ["Mentor a young frum woman on your terms.", "Mentor an observant woman on your terms."],
    ["Frum women who’ve built a career", "Observant women who’ve built a career"],
    ["Milestones and lessons from frum professional women.", "Milestones and lessons from observant professional women."],
    ["The 3am you is building the doctor a frum family will be lucky to have.", "The 3am you is building the doctor a Jewish family will be lucky to have."],
    ["frum Jewish women", "observant Jewish women"],
    ["frum professional women", "observant professional women"],
    ["frum women", "observant women"],
    ["frum woman’s", "Orthodox woman’s"],
    ["frum woman", "observant woman"],
    ["frum life", "observant life"],
    ["frum family", "Jewish family"],
    ["Frum Jewish women", "Observant Jewish women"],
    ["Frum professional women", "Observant professional women"],
    ["Frum women", "Observant women"],
    ["Frum woman’s", "Orthodox woman’s"],
    ["Frum woman", "Observant woman"],
    ["Frum life", "Observant life"],
    ["Frum family", "Jewish family"]
  ];

  function rewriteCopy(value) {
    if (!value) return value;

    return copyReplacements.reduce(
      (text, pair) => text.split(pair[0]).join(pair[1]),
      value
    );
  }

  function normalizeReligiousCopy() {
    document.title = rewriteCopy(document.title);

    $$('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]').forEach((meta) => {
      meta.setAttribute("content", rewriteCopy(meta.getAttribute("content") || ""));
    });

    $$('script[type="application/ld+json"]').forEach((script) => {
      script.textContent = rewriteCopy(script.textContent || "");
    });

    if (!document.body) return;

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (["SCRIPT", "STYLE", "TEXTAREA", "NOSCRIPT"].includes(parent.tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          return node.nodeValue && node.nodeValue.includes("frum") || node.nodeValue.includes("Frum")
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );

    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach((node) => {
      node.nodeValue = rewriteCopy(node.nodeValue);
    });
  }

  normalizeReligiousCopy();

  /* =========================
     Mobile nav
     ========================= */

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

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 861) closeNav();
  });

  /* =========================
     Application modal
     ========================= */

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

    if (type) {
      statusEl.classList.add(`is-${type}`);
    }
  }

  function setRole(role) {
    if (!form || !role) return;

    const input = form.querySelector(`input[name="role"][value="${role}"]`);
    if (input) input.checked = true;
  }

  function openApplyModal(role = "") {
    if (!modal) return;

    closeNav();

    lastFocusedEl = document.activeElement;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("pj-modal-open");

    setStatus("");
    setRole(role);

    const firstInput =
      form?.querySelector("input[name='role']:checked") ||
      form?.querySelector("input:not(.pj-honeypot), select, textarea, button");

    window.setTimeout(() => firstInput?.focus(), 80);
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
      openApplyModal(opener.getAttribute("data-apply-role") || "");
    });
  });

  closers.forEach((closer) => {
    closer.addEventListener("click", closeApplyModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
      if (modal?.classList.contains("is-open")) {
        closeApplyModal();
      }
    }
  });

  const urlParams = new URLSearchParams(window.location.search);
  const roleFromUrl = urlParams.get("role");
  const applyFromUrl = urlParams.get("apply");

  if (roleFromUrl || applyFromUrl) {
    window.addEventListener("load", () => {
      openApplyModal(roleFromUrl || "");
    });
  }

  /* =========================
     Google Apps Script form submit
     ========================= */

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

    const firstName = formData.get("first_name") || "";
    const lastName = formData.get("last_name") || "";
    const fullName = `${firstName} ${lastName}`.trim();

    const payload = {
      timestamp: new Date().toISOString(),
      page: window.location.href,
      source: formData.get("source") || "homepage-popup",

      role: formData.get("role") || "",

      first_name: firstName,
      last_name: lastName,
      name: fullName,

      email: formData.get("email") || "",
      phone: formData.get("phone") || "",
      whatsapp: formData.get("whatsapp") || "",

      community: formData.get("community") || "",
      field: formData.get("field") || "",
      stage: formData.get("stage") || "",
      goals: formData.get("goals") || "",
      privacy_ack: formData.get("privacy_ack") || ""
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";
    }

    setStatus("");

    try {
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

      window.setTimeout(() => {
        closeApplyModal();
      }, 1300);
    } catch (error) {
      console.error(error);
      setStatus("Something went wrong. Please try again, or contact us directly.", "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit application";
      }
    }
  });
})();