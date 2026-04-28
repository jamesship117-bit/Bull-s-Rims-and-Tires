// Shared UI interactions for all pages.
document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  highlightActiveNavLink();
  setupRevealAnimations();
  setupProductFilters();
  setupContactForm();
  setupSmoothAnchorScroll();
});

function setupMobileMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-nav-menu]");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function highlightActiveNavLink() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".nav-links a");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    link.removeAttribute("aria-current");
    if (href === path) {
      link.setAttribute("aria-current", "page");
    }
  });
}

function setupRevealAnimations() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

function setupProductFilters() {
  const filterGroups = document.querySelectorAll("[data-filter-group]");

  filterGroups.forEach((group) => {
    const buttons = group.querySelectorAll("[data-filter]");
    const itemSelector = group.getAttribute("data-target");
    if (!itemSelector) return;

    const items = document.querySelectorAll(itemSelector);
    if (!buttons.length || !items.length) return;

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.getAttribute("data-filter");
        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        items.forEach((item) => {
          const itemValue = item.getAttribute("data-filter-value");
          const show = value === "all" || value === itemValue;
          item.style.display = show ? "" : "none";
        });
      });
    });
  });
}

function setupContactForm() {
  const form = document.querySelector("#quote-form");
  if (!form) return;

  const successMessage = document.querySelector("#form-success");
  const requiredFields = form.querySelectorAll("[data-required]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors(form);

    let isValid = true;
    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        showFieldError(field, "This field is required.");
        isValid = false;
      }
    });

    const email = form.querySelector('input[name="email"]');
    if (email && email.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        showFieldError(email, "Please enter a valid email address.");
        isValid = false;
      }
    }

    const phone = form.querySelector('input[name="phone"]');
    if (phone && phone.value.trim()) {
      const digits = phone.value.replace(/\D/g, "");
      if (digits.length < 10) {
        showFieldError(phone, "Please enter a valid phone number.");
        isValid = false;
      }
    }

    if (!isValid) return;

    form.reset();
    if (successMessage) {
      successMessage.classList.add("show");
      successMessage.textContent = "Thanks! We'll be in touch soon.";
    }
  });
}

function showFieldError(field, message) {
  field.classList.add("input-error");
  const error = document.createElement("div");
  error.className = "error-text";
  error.textContent = message;
  field.insertAdjacentElement("afterend", error);
}

function clearErrors(form) {
  form.querySelectorAll(".input-error").forEach((el) => el.classList.remove("input-error"));
  form.querySelectorAll(".error-text").forEach((el) => el.remove());
  const successMessage = document.querySelector("#form-success");
  if (successMessage) successMessage.classList.remove("show");
}

function setupSmoothAnchorScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}
