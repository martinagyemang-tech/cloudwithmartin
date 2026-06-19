cat > js/main.js <<'EOF'
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("js-ready");

  const body = document.body;

  /* =========================
     SCROLL PROGRESS
  ========================= */
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  body.appendChild(progress);

  function updateProgress() {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const percent = height > 0 ? (scrollTop / height) * 100 : 0;
    progress.style.width = `${percent}%`;
  }

  window.addEventListener("scroll", updateProgress);
  updateProgress();

  /* =========================
     INTERACTIVE BACKGROUND
  ========================= */
  const canvas = document.createElement("canvas");
  canvas.id = "interactive-bg";
  body.prepend(canvas);

  const ctx = canvas.getContext("2d");

  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  let particles = [];

  const mouse = {
    x: null,
    y: null,
    radius: 130
  };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * h;
    }

    reset() {
      this.x = Math.random() * w;
      this.y = h + Math.random() * h;
      this.size = Math.random() * 2.2 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = -(Math.random() * 0.55 + 0.25);
      this.opacity = Math.random() * 0.45 + 0.18;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          this.x += dx / 20;
          this.y += dy / 20;
        }
      }

      if (this.y < -30 || this.x < -40 || this.x > w + 40) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.fillStyle = `rgba(56, 189, 248, ${this.opacity})`;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = window.innerWidth < 768 ? 38 : 75;

    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 115) {
          const opacity = 1 - distance / 115;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(124, 92, 255, ${opacity * 0.18})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateBackground() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    connectParticles();
    requestAnimationFrame(animateBackground);
  }

  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    initParticles();
  }

  window.addEventListener("resize", resizeCanvas);

  initParticles();
  animateBackground();

  /* =========================
     NAVBAR
  ========================= */
  const navbar = document.getElementById("navbar");

  function handleNavbar() {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 45);
  }

  window.addEventListener("scroll", handleNavbar);
  handleNavbar();

  /* =========================
     MOBILE MENU
  ========================= */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      mobileMenu.classList.toggle("open");
      body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        mobileMenu.classList.remove("open");
        body.style.overflow = "";
      });
    });
  }

  /* =========================
     SMOOTH SCROLL
  ========================= */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));

      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  /* =========================
     REVEAL ANIMATION
  ========================= */
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealElements.forEach((el) => revealObserver.observe(el));

  /* =========================
     SKILL BAR ANIMATION
  ========================= */
  const skillFills = document.querySelectorAll(".skill-fill");

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const width = el.getAttribute("data-width") || "70";
      el.style.width = `${width}%`;
      skillObserver.unobserve(el);
    });
  }, { threshold: 0.4 });

  skillFills.forEach((el) => skillObserver.observe(el));

  /* =========================
     ACTIVE NAV LINK
  ========================= */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  function setActiveNav() {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  }

  window.addEventListener("scroll", setActiveNav);
  setActiveNav();

  /* =========================
     CARD TILT EFFECT
  ========================= */
  const tiltCards = document.querySelectorAll(".project-card, .skill-card, .stat-card");

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateY = ((x / rect.width) - 0.5) * 7;
      const rotateX = ((y / rect.height) - 0.5) * -7;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-7px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* =========================
     CONTACT FORM FEEDBACK
  ========================= */
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", () => {
      const button = contactForm.querySelector('button[type="submit"]');

      if (!button) return;

      const oldHTML = button.innerHTML;
      button.innerHTML = `Sending <i class="fas fa-spinner fa-spin"></i>`;
      button.disabled = true;

      setTimeout(() => {
        button.innerHTML = oldHTML;
        button.disabled = false;
      }, 4000);
    });
  }

  console.log("CloudWithMartin modern portfolio loaded 🚀");
});
EOF

