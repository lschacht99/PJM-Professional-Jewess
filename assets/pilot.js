(() => {
  "use strict";
  const DB_URL = "https://vvveenntewwtyhnmimal.supabase.co";
  const PUBLIC_KEY = "sb_publishable_-ydn9Mgc5B0Sqw4Qh6zfdg_46FQy87z";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const menuButton = $("#menuButton");
  const menu = $("#primaryNav");

  function closeMenu() {
    if (!menu || !menuButton) return;
    menu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  }
  menuButton?.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });
  $$("a", menu || document.createElement("div")).forEach(a => a.addEventListener("click", closeMenu));

  // The first-round priority window ends at midnight in New York on Nov 9, 2026.
  // After the cutoff, keep the intake open for later introductions instead of displaying an expired offer.
  const firstRoundClosed = Date.now() >= Date.parse("2026-11-09T05:00:00Z");
  if (firstRoundClosed) {
    $("[data-round-banner]").forEach(banner => {
      banner.innerHTML = '<div class="round-header">FUTURE MATCHING OPPORTUNITIES</div>' +
        '<p>The November first-round deadline has passed. You can still apply to be considered for future introductions as the network grows. There is no guarantee of a match.</p>';
    });
    $("[data-round-status]").forEach(label => {
      label.textContent = "Future matching opportunities · Applications open";
    });
    $("[data-round-cta]").forEach(link => {
      link.textContent = "Apply for future introductions ↗";
    });
    $("[data-round-desc]").forEach(desc => {
      desc.textContent = "The first matching-round deadline has passed. New applications are welcome and will be considered for future introductions as the network grows.";
    });
    const successText = $("#applicationSuccess p");
    if (successText) successText.textContent =
      "Your application has been saved for consideration in future matching opportunities. We will contact you if a suitable next step becomes available. An introduction is not guaranteed.";
  }

  const form = $("#applicationForm");
  if (form) {
    const roleInputs = $$('input[name="role"]', form);
    const needed = $("#needGroup");
    const offered = $("#offerGroup");
    const capacity = $("#capacityGroup");
    const needText = $('#helpNeeded');
    const offerText = $('#helpOffered');
    const capacityInput = $('#mentorCapacity');
    const phoneGroup = $("#phoneGroup");
    const whatsappGroup = $("#whatsappGroup");
    const phoneInput = $('#phone');
    const whatsappInput = $('#whatsapp');
    const preferred = $$('input[name="preferred_contact"]', form);
    const params = new URLSearchParams(window.location.search);
    const preset = params.get("role");
    if (["mentee", "mentor", "both"].includes(preset)) {
      const target = roleInputs.find(input => input.value === preset);
      if (target) target.checked = true;
    }

    function updateRole() {
      const role = $('input[name="role"]:checked', form)?.value || "";
      const wants = role === "mentee" || role === "both";
      const gives = role === "mentor" || role === "both";
      needed.hidden = !wants;
      offered.hidden = !gives;
      capacity.hidden = !gives;
      needText.required = wants;
      offerText.required = gives;
      capacityInput.required = gives;
      needText.disabled = !wants;
      offerText.disabled = !gives;
      capacityInput.disabled = !gives;
    }
    function updateContact() {
      const value = $('input[name="preferred_contact"]:checked', form)?.value || "email";
      phoneGroup.hidden = value !== "phone";
      whatsappGroup.hidden = value !== "whatsapp";
      phoneInput.required = value === "phone";
      whatsappInput.required = value === "whatsapp";
      phoneInput.disabled = value !== "phone";
      whatsappInput.disabled = value !== "whatsapp";
    }
    roleInputs.forEach(input => input.addEventListener("change", updateRole));
    preferred.forEach(input => input.addEventListener("change", updateContact));
    updateRole();
    updateContact();
  }

  async function insert(table, payload) {
    const response = await fetch(DB_URL + "/rest/v1/" + table, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: {
        apikey: PUBLIC_KEY,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Database returned HTTP " + response.status);
  }

  function showState(el, message, isError) {
    if (!el) return;
    el.textContent = message;
    el.className = "form-state" + (isError ? " form-state--error" : " form-state--success");
    if (isError) el.focus();
  }

  form?.addEventListener("submit", async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const v = name => String(data.get(name) || "").trim();
    const status = $("#applicationStatus");
    const submitButton = $('#applicationSubmit');
    if (v("website")) {
      showState(status, "Thank you for your interest.", false);
      return;
    }

    const role = v("role");
    const payload = {
      role,
      first_name: v("first_name"),
      last_name: v("last_name"),
      email: v("email"),
      community: v("community") || null,
      field: v("field") || null,
      stage: v("stage") || null,
      preferred_contact: v("preferred_contact"),
      phone: v("phone") || null,
      whatsapp: v("whatsapp") || null,
      help_needed: role === "mentee" || role === "both" ? v("help_needed") : null,
      help_offered: role === "mentor" || role === "both" ? v("help_offered") : null,
      mentor_capacity: role === "mentor" || role === "both" ? v("mentor_capacity") : null,
      privacy_ack: data.get("privacy_ack") === "yes",
      goals: [v("help_needed"), v("help_offered")].filter(Boolean).join(" | ").slice(0, 3000) || null,
      source: "professional-jewess-pilot-2026"
    };
    if (!payload.privacy_ack) return;
    submitButton.disabled = true;
    submitButton.textContent = "Saving application…";
    showState(status, "Saving your application…", false);
    try {
      await insert("pj_applications", payload);
      form.hidden = true;
      const success = $("#applicationSuccess");
      if (success) {
        success.hidden = false;
        success.querySelector("h2")?.focus();
      }
    } catch (error) {
      console.error("Application could not be saved", error);
      showState(status, "We couldn't save your application. Please try again. If the problem continues, use the contact form.", true);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit application";
    }
  });

  const contactForm = $("#contactForm");
  contactForm?.addEventListener("submit", async event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const get = name => String(data.get(name) || "").trim();
    const status = $("#contactStatus");
    const button = $("#contactSubmit");
    if (get("website")) {
      showState(status, "Thank you.", false);
      return;
    }
    button.disabled = true;
    button.textContent = "Saving message…";
    try {
      await insert("pj_inquiries", {
        full_name: get("full_name"),
        email: get("email"),
        message: get("message"),
        source: "professional-jewess-contact"
      });
      contactForm.reset();
      showState(status, "Your message has been saved. We’ll review it as part of the pilot.", false);
    } catch (error) {
      console.error("Contact form could not be saved", error);
      showState(status, "Your message couldn't be saved. Please try again.", true);
    } finally {
      button.disabled = false;
      button.textContent = "Send message";
    }
  });
})();