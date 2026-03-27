// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    // Start particles after load
    initParticles();
  }, 2400);
});

// ===== YEAR =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
}
applyTheme(localStorage.getItem('theme') || 'dark');
themeToggle.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ===== SCROLL PROGRESS BAR =====
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
}, { passive: true });

// ===== NAVBAR SCROLL & ACTIVE =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  let current = '';
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 160 && rect.bottom >= 160) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// ===== MOBILE MENU =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinksContainer = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
  const isOpen = navLinksContainer.classList.toggle('open');
  mobileMenuBtn.textContent = isOpen ? '✕' : '☰';
});
document.querySelectorAll('.nav-links .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksContainer.classList.remove('open');
    mobileMenuBtn.textContent = '☰';
  });
});

// ===== CURSOR GLOW =====
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow && window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
}

// ===== TYPING ANIMATION =====
const phrases = [
  'Full Stack Developer',
  'Data Science Enthusiast',
  'Passionate Coder and Learner !!',
];
let phraseIndex = 0, charIndex = 0, isDeleting = false;
const typingEl = document.getElementById('typingText');

function type() {
  const current = phrases[phraseIndex];
  typingEl.textContent = isDeleting
    ? current.substring(0, charIndex--)
    : current.substring(0, charIndex++);

  let delay = isDeleting ? 45 : 85;
  if (!isDeleting && charIndex > current.length) { delay = 2000; isDeleting = true; }
  else if (isDeleting && charIndex < 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; delay = 400; }

  setTimeout(type, delay);
}
setTimeout(type, 2600);

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));

// ===== PROJECT FILTERING =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

// Inject fadeUp animation
const animStyle = document.createElement('style');
animStyle.textContent = '@keyframes fadeCardIn { from{opacity:0;transform:translateY(25px)} to{opacity:1;transform:translateY(0)} }';
document.head.appendChild(animStyle);

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-category') === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        void card.offsetWidth;
        card.style.animation = 'fadeCardIn 0.6s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== CONTACT FORM — FORMSPREE =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn     = document.getElementById('ctcSubmitBtn');
    const success = document.getElementById('ctcSuccess');
    const error   = document.getElementById('ctcError');

    // Loading state
    btn.disabled = true;
    btn.querySelector('.ctc-btn-text').textContent = 'Sending…';
    success.style.display = 'none';
    error.style.display   = 'none';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.reset();
        success.style.display = 'flex';
      } else {
        error.style.display = 'flex';
      }
    } catch {
      error.style.display = 'flex';
    } finally {
      btn.disabled = false;
      btn.querySelector('.ctc-btn-text').textContent = 'Send Message';
    }
  });
}


// ===== PARTICLE SYSTEM =====
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); createParticles(); });

  let particles = [];
  const PARTICLE_COUNT = window.innerWidth < 768 ? 40 : 80;

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.6 + 0.1,
        color: Math.random() > 0.5 ? '99,102,241' : (Math.random() > 0.5 ? '168,85,247' : '6,182,212')
      });
    }
  }
  createParticles();

  let mouseX = -1000, mouseY = -1000;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connection lines near mouse
    particles.forEach((p, i) => {
      // Move particle
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
      ctx.fill();

      // Mouse interaction - draw glow connection
      const distToMouse = Math.hypot(p.x - mouseX, p.y - mouseY);
      if (distToMouse < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = `rgba(${p.color}, ${(1 - distToMouse / 120) * 0.3})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Draw connection lines between close particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(99,102,241, ${(1 - dist / 100) * 0.12})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// ===== STAT COUNTER ANIMATION =====
const allCounters = document.querySelectorAll('.stat-box-value, .ach-count[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.getAttribute('data-target'), 10);
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    let current = 0;
    const step = Math.ceil(target / 112);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = prefix + current + suffix;
      if (current >= target) clearInterval(timer);
    }, 16);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
allCounters.forEach(el => counterObserver.observe(el));

const cursor = document.querySelector(".custom-cursor");
const dot = document.querySelector(".cursor-dot");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";

  dot.style.left = e.clientX + "px";
  dot.style.top = e.clientY + "px";
});

// Hover effect (buttons, links)
const hoverElements = document.querySelectorAll("a, button");

hoverElements.forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1.6)";
    cursor.style.background = "rgba(99,102,241,0.15)";
  });

  el.addEventListener("mouseleave", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1)";
    cursor.style.background = "transparent";
  });
});

const counters = document.querySelectorAll(".circle");

counters.forEach(counter => {
  let started = false;

  const animate = () => {
    const target = +counter.getAttribute("data-target");
    const suffix = counter.getAttribute("data-suffix") || "";
    let count = 0;

    const duration = 1500; // total time
    const stepTime = 20;
    const increment = target / (duration / stepTime);

    const update = () => {
      count += increment;

      if (count < target) {
        counter.innerText = Math.floor(count);
        counter.classList.add("pulse");
        setTimeout(update, stepTime);
      } else {
        counter.innerText = target + suffix;
        counter.classList.remove("pulse");
      }
    };

    update();
  };

  // Run only when visible (smooth UX)
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        animate();
        started = true;
      }
    });
  });

  observer.observe(counter);
});
