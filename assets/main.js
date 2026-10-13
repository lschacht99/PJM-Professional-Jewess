(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  /* =========================
     Copy cleanup
     ========================= */

  const F = "fr" + "um";
  const OBS = "ob" + "servant";
  const ORTH = "Orth" + "odox";
  const jewishWomen = "Jewish women";

  const copyReplacements = [
    [`Private mentorship for ${F} ${jewishWomen}`, `Private mentorship for ${jewishWomen}`],
    [`Private mentorship for ${OBS} ${jewishWomen}`, `Private mentorship for ${jewishWomen}`],
    [`Private, thoughtfully matched mentorship for ${F} ${jewishWomen} in the professions.`, `Private, thoughtfully matched mentorship for ${jewishWomen} in the professions.`],
    [`Private, thoughtfully matched mentorship for ${OBS} ${jewishWomen} in the professions.`, `Private, thoughtfully matched mentorship for ${jewishWomen} in the professions.`],
    [`A private, thoughtfully matched mentorship network for ${F} ${jewishWomen} in the professions.`, `A private, thoughtfully matched mentorship network for ${jewishWomen} in the professions.`],
    [`A private, thoughtfully matched mentorship network for ${OBS} ${jewishWomen} in the professions.`, `A private, thoughtfully matched mentorship network for ${jewishWomen} in the professions.`],
    [`A private mentorship network for ${F} ${jewishWomen} in the professions.`, `A private mentorship network for ${jewishWomen} in the professions.`],
    [`A private mentorship network for ${OBS} ${jewishWomen} in the professions.`, `A private mentorship network for ${jewishWomen} in the professions.`],
    [`Professional Jewess · 5786 / 2026 · Private mentorship for ${F} ${jewishWomen}`, `Professional Jewess · 5786 / 2026 · Private mentorship for ${jewishWomen}`],
    [`Professional Jewess · 5786 / 2026 · Private mentorship for ${OBS} ${jewishWomen}`, `Professional Jewess · 5786 / 2026 · Private mentorship for ${jewishWomen}`],
    [`Professional Jewess connects ${F} women building careers with women who have already walked the path.`, "Professional Jewess connects women building careers with women who have already walked the path."],
    [`Professional Jewess connects ${OBS} and ${ORTH} women building careers with women who have already walked the path.`, "Professional Jewess connects women building careers with women who have already walked the path."],
    [`with guidance from a ${F} woman who has lived it.`, "with guidance from someone who has lived it."],
    [`with guidance from an ${OBS} woman who has lived it.`, "with guidance from someone who has lived it."],
    [`They are also about ${F} life, family life,`, "They are also about religious commitments, family life,"],
    [`They are also about ${OBS} life, family life,`, "They are also about religious commitments, family life,"],
    [`A college student is considering law school and wants a ${F} woman’s perspective on practice areas, workload, and family life.`, "A college student is considering law school and wants a mentor’s perspective on practice areas, workload, and family life."],
    [`An ${ORTH} college student is considering law school and wants a mentor’s perspective on practice areas, workload, and family life.`, "A college student is considering law school and wants a mentor’s perspective on practice areas, workload, and family life."],
    [`Find a ${F} woman mentor in your field, thoughtfully matched.`, "Find a mentor in your field, thoughtfully matched."],
    [`Find an ${OBS} mentor in your field, thoughtfully matched.`, "Find a mentor in your field, thoughtfully matched."],
    [`you want a guide who’s done it as a ${F} woman, and knows`, "you want a guide who understands your world, and knows"],
    [`you want a guide who understands ${ORTH} life, and knows`, "you want a guide who understands your world, and knows"],
    [`${cap(F)} life at work`, "Religious life at work"],
    [`${cap(OBS)} life at work`, "Religious life at work"],
    [`Mentor a young ${F} woman on your terms.`, "Mentor someone a step behind you, on your terms."],
    [`Mentor an ${OBS} woman on your terms.`, "Mentor someone a step behind you, on your terms."],
    [`${cap(F)} women who’ve built a career`, "Women who’ve built a career"],
    [`${cap(OBS)} women who’ve built a career`, "Women who’ve built a career"],
    [`Milestones and lessons from ${F} professional women.`, "Milestones and lessons from women building serious careers."],
    [`Milestones and lessons from ${OBS} professional women.`, "Milestones and lessons from women building serious careers."],
    [`The 3am you is building the doctor a ${F} family will be lucky to have.`, "The 3am you is building the doctor a family will be lucky to have."],
    [new RegExp(`${F}\\s+Jewish\\s+women`, "gi"), jewishWomen],
    [new RegExp(`${OBS}\\s+Jewish\\s+women`, "gi"), jewishWomen],
    [new RegExp(`${F}\\s+professional\\s+women`, "gi"), "women in the professions"],
    [new RegExp(`${OBS}\\s+professional\\s+women`, "gi"), "women in the professions"],
    [new RegExp(`${F}\\s+women`, "gi"), "women"],
    [new RegExp(`${OBS}\\s+women`, "gi"), "women"],
    [new RegExp(`${F}\\s+woman’s`, "gi"), "mentor’s"],
    [new RegExp(`${ORTH}\\s+woman’s`, "gi"), "mentor’s"],
    [new RegExp(`${F}\\s+woman`, "gi"), "woman"],
    [new RegExp(`${OBS}\\s+woman`, "gi"), "woman"],
    [new RegExp(`${F}\\s+life`, "gi"), "religious life"],
    [new RegExp(`${OBS}\\s+life`, "gi"), "religious life"],
    [new RegExp(`${F}\\s+family`, "gi"), "family"]
  ];

  function cap(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function rewriteCopy(value) {
    if (!value) return value;

    return copyReplacements.reduce((text, pair) => {
      const [find, replace] = pair;
      return find instanceof RegExp ? text.replace(find, replace) : text.split(find).join(replace);
    }, value);
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

    const watchWords = new RegExp(`${F}|${cap(F)}|${OBS}|${cap(OBS)}|${ORTH}`, "i");
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          const value = node.nodeValue || "";

          if (!parent) return NodeFilter.FILTER_REJECT;
          if (["SCRIPT", "STYLE", "TEXTAREA", "NOSCRIPT"].includes(parent.tagName)) {
            return NodeFilter.FILTER_REJECT;
          }

          return watchWords.test(value) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
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
    if (!modal) {
      window.location.assign("index.html?apply=" + encodeURIComponent(role || "1"));
      return;
    }

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
     Verified Supabase application submission
     Public key can be used in browser; table is insert-only for visitors.
     ========================= */

  const PJ_SUPABASE_URL = "https://vvveenntewwtyhnmimal.supabase.co";
  const PJ_SUPABASE_KEY = "sb_publishable_-ydn9Mgc5B0Sqw4Qh6zfdg_46FQy87z";

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    if (formData.get("website")) {
      form.reset();
      setStatus("Application received.", "success");
      return;
    }

    const getText = (field) => String(formData.get(field) || "").trim();
    const payload = {
      role: getText("role"),
      first_name: getText("first_name"),
      last_name: getText("last_name"),
      email: getText("email"),
      phone: getText("phone") || null,
      whatsapp: getText("whatsapp") || null,
      community: getText("community") || null,
      field: getText("field") || null,
      stage: getText("stage") || null,
      goals: getText("goals") || null,
      privacy_ack: formData.get("privacy_ack") === "yes",
      source: getText("source") || "website"
    };

    const submitBtn = form.querySelector("[type='submit']");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";
    }
    setStatus("");

    try {
      const response = await fetch(PJ_SUPABASE_URL + "/rest/v1/pj_applications", {
        method: "POST",
        mode: "cors",
        credentials: "omit",
        headers: {
          "apikey": PJ_SUPABASE_KEY,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Submission rejected (HTTP " + response.status + ")");
      }

      form.reset();
      setStatus("Application saved successfully. We'll review it before making an introduction.", "success");
    } catch (error) {
      console.error("Professional Jewess application submission failed:", error);
      setStatus("We couldn't save your application. Please check your connection and try again.", "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit application";
      }
    }
  });
})();
