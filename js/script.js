const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const scrollTopButton = document.querySelector(".scroll-top");
const loader = document.querySelector(".site-loader");

const iconMenu = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
const iconClose = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>';

window.addEventListener("load", () => {
  loader?.classList.add("is-hidden");
});

function updateHeaderState() {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
  scrollTopButton?.classList.toggle("is-visible", window.scrollY > 480);
}

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks?.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", Boolean(isOpen));
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  navToggle.innerHTML = isOpen ? iconClose : iconMenu;
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    navToggle?.setAttribute("aria-expanded", "false");
    if (navToggle) navToggle.innerHTML = iconMenu;
  });
});

scrollTopButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sectionLinks = [...document.querySelectorAll(".nav-link[href^='#']")];
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (sections.length) {
  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => activeObserver.observe(section));
}

const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count);
      const suffix = element.dataset.suffix || "";
      const duration = 1500;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      counterObserver.unobserve(element);
    });
  },
  { threshold: 0.45 }
);

counters.forEach((counter) => counterObserver.observe(counter));

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const isOpen = item?.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });
});

function validateForm(form) {
  let isValid = true;
  const status = form.querySelector(".form-status");
  status?.classList.remove("is-visible");

  form.querySelectorAll("[data-required]").forEach((field) => {
    const error = form.querySelector(`[data-error-for="${field.id}"]`);
    const value = field.value.trim();
    let message = "";

    if (!value) {
      message = "Please complete this field.";
    } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = "Please enter a valid email address.";
    } else if (field.type === "tel" && value.replace(/\D/g, "").length < 7) {
      message = "Please enter a valid phone number.";
    }

    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message;
    if (message) isValid = false;
  });

  if (isValid) {
    form.reset();
    status?.classList.add("is-visible");
    status?.focus?.();
  }
}

document.querySelectorAll(".form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    validateForm(form);
  });
});
