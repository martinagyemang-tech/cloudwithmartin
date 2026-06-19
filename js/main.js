document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("js-ready");

  const body = document.body;

  /* =========================
     SCROLL PROGRESS BAR
  ========================= */
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  body.appendChild(progress);

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = `${percent}%`;
  }

  window.addEventListener("scroll", updateProgress);
  updateProgress();

  /* =========================
     INTERACTIVE BACKGROUND CANVAS
  ========================= */
  const canvas = document.createElement("canvas");
  canvas.id = "interactive-bg";
  body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    initParticles();
  }

  window.addEventListener("resize", resizeCanvas);

  let particles = [];
  const particleCount = window.innerWidth < 768 ? 40 : 75;

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * h;
    }

    reset() {
      this.x = Math.random() * w;
      this.y = h + Math.random() * h;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = -(Math.random() * 0.6 + 0.2);
      this.opacity = Math.random() * 0.5 + 0.15;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (mouse.x && mouse.y) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          this.x += dx / 18;
          this.y += dy / 18;
        }
      }

      if (this.y < -20 || this.x < -30 || this.x > w + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.fillStyle = `rgba(90, 190, 255, ${this.opacity})`;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = window.innerWidth < 768 ? 35 : 70;
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

        if (distance < 110) {
          const opacity = 1 - distance / 110;
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

  initParticles();
  animateBackground();

  /* =========================
     NAVBAR SCROLL
  ========================= */
  const navbar = document.getElementById("navbar");

  function handleNavbar() {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 40);
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
     ACTIVE NAV LINKS
  ========================= */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  function setActiveNav() {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
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

      const rotateY = ((x / rect.width) - 0.5) * 6;
      const rotateX = ((y / rect.height) - 0.5) * -6;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
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

  console.log("Modern portfolio loaded successfully 🚀");
});
/* =========================================================
   CLOUDWITHMARTIN — Interactive Portfolio JS
   Replace your full js/main.js with this file
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
document.body.classList.add("js-ready");

 
 const body = document.body;

  /* Scroll progress bar */
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  body.appendChild(progress);

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = `${percent}%`;
  };

  window.addEventListener("scroll", updateProgress);
  updateProgress();

  /* Cursor glow */
  const cursorGlow = document.createElement("div");
  cursorGlow.className = "cursor-glow";
  body.appendChild(cursorGlow);

  window.addEventListener("mousemove", (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });

  /* Floating cloud particles */
  const createParticles = () => {
    const particleCount = window.innerWidth < 700 ? 14 : 28;

    for (let i = 0; i < particleCount; i++) {
      const dot = document.createElement("span");
      dot.className = "cloud-particle";
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.animationDuration = `${10 + Math.random() * 16}s`;
      dot.style.animationDelay = `${Math.random() * 10}s`;
      dot.style.opacity = `${0.25 + Math.random() * 0.55}`;
      dot.style.transform = `scale(${0.6 + Math.random() * 1.8})`;
      body.appendChild(dot);
    }
  };

  createParticles();

  /* Navbar scroll effect */
  const navbar = document.getElementById("navbar");

  const handleNavbar = () => {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 45);
  };

  window.addEventListener("scroll", handleNavbar);
  handleNavbar();

  /* Mobile menu */
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

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetID = anchor.getAttribute("href");
      const target = document.querySelector(targetID);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  /* Reveal animation */
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const parentChildren = Array.from(element.parentElement.children);
        const index = parentChildren.indexOf(element);

        element.style.transitionDelay = `${Math.min(index * 0.08, 0.35)}s`;
        element.classList.add("visible");
        revealObserver.unobserve(element);
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* Skill bar animation */
  const skillFills = document.querySelectorAll(".skill-fill");

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const width = el.getAttribute("data-width") || "70";
        el.style.width = `${width}%`;

        skillObserver.unobserve(el);
      });
    },
    { threshold: 0.45 }
  );

  skillFills.forEach((el) => skillObserver.observe(el));

  /* Active nav link on scroll */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const setActiveNav = () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 160;
      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  };

  window.addEventListener("scroll", setActiveNav);
  setActiveNav();

  /* Card tilt effect */
  const tiltCards = document.querySelectorAll(".project-card, .skill-card, .stat-card");

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = ((y / rect.height) - 0.5) * -8;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-7px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* Button magnetic hover */
  const buttons = document.querySelectorAll(".btn");

  buttons.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });

  /* Contact form button feedback */
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", () => {
      const button = contactForm.querySelector('button[type="submit"]');

      if (!button) return;

      const originalText = button.innerHTML;
      button.innerHTML = 'Sending <i class="fas fa-spinner fa-spin"></i>';
      button.disabled = true;

      setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
      }, 4500);
    });
  }

  /* Console signature */
  console.log("%cCloudWithMartin portfolio loaded ☁️", "color:#38bdf8;font-size:16px;font-weight:bold;");
});
   PORTFOLIO — main.js
   ───────────────────────────────────────────── */

// ── NAVBAR: add .scrolled on scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── SCROLL REVEAL ──
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Staggered delay based on sibling index
      const siblings = Array.from(entry.target.parentElement.children);
      const index = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${index * 0.08}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

// ── SKILL BARS: animate on scroll ──
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const width = el.getAttribute('data-width');
      el.style.width = width + '%';
      skillObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

skillFills.forEach(el => skillObserver.observe(el));

// ── ACTIVE NAV LINK on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--white)';
    }
  });
});

// ── CONTACT FORM: basic feedback ──
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    // Formspree handles the actual send
    // Re-enable after a few seconds if not redirected
    setTimeout(() => {
      btn.textContent = 'Send Message ✉';
      btn.disabled = false;
    }, 4000);
  });
}

// ── SMOOTH SCROLL for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

