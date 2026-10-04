document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const scrollTopButton = document.getElementById("scrollTop");
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const sections = document.querySelectorAll("main section[id]");
  const navItems = document.querySelectorAll(".nav-links a");

  // 1. Theme Management (Dark Mode Default or Saved Preference)
  const savedTheme = localStorage.getItem("portfolio-theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    body.classList.add("dark-theme");
    if (themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    body.classList.remove("dark-theme");
    if (themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-theme");
      const isDark = body.classList.contains("dark-theme");

      themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';

      localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
    });
  }

  // 2. Mobile Menu Toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    // Close mobile menu on clicking any navigation link
    navItems.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });
  }

  // 3. Scrollspy & Scroll-to-Top Button
  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Scroll to top button visibility
    if (scrollTopButton) {
      scrollTopButton.classList.toggle("show", scrollY > 400);
    }

    // Determine current active section
    let currentSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navItems.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${currentSectionId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // Initial run

  if (scrollTopButton) {
    scrollTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 4. Reveal Animations via IntersectionObserver
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  // 5. Contact Form Submission via AJAX (Web3Forms)
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!formStatus) return;

      formStatus.style.color = "var(--primary)";
      formStatus.textContent = "Sending your message...";

      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;

      try {
        const formData = new FormData(form);
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          formStatus.style.color = "#10b981";
          formStatus.textContent = "Thank you! Your message has been sent successfully.";
          form.reset();
        } else {
          formStatus.style.color = "#ef4444";
          formStatus.textContent = data.message || "Oops! Something went wrong. Please try again.";
        }
      } catch (error) {
        formStatus.style.color = "#ef4444";
        formStatus.textContent = "Network error. Please email directly to abeulahmercy@gmail.com";
      } finally {
        if (submitButton) submitButton.disabled = false;
        setTimeout(() => {
          if (formStatus) formStatus.textContent = "";
        }, 6000);
      }
    });
  }
});
