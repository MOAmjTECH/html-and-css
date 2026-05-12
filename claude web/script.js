/* ── Custom Cursor ── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  dot.style.left  = e.clientX + 'px';
  dot.style.top   = e.clientY + 'px';
  rx += (e.clientX - rx) * .12;
  ry += (e.clientY - ry) * .12;
});
(function animCursor() {
  rx += (parseFloat(dot.style.left) - rx) * .12;
  ry += (parseFloat(dot.style.top)  - ry) * .12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animCursor);
})();

/* ── Particle Canvas ── */
(function(){
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const N = 60;
  for (let i = 0; i < N; i++) pts.push({
    x: Math.random()*W, y: Math.random()*H,
    vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3,
    r: Math.random()*1.5+.5
  });

  function draw() {
    ctx.clearRect(0,0,W,H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x<0||p.x>W) p.vx*=-1;
      if (p.y<0||p.y>H) p.vy*=-1;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = 'rgba(0,200,210,.55)';
      ctx.fill();
    });
    // lines between close pts
    for (let i=0; i<N; i++) for (let j=i+1; j<N; j++) {
      const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if (d<130) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x,pts[i].y);
        ctx.lineTo(pts[j].x,pts[j].y);
        ctx.strokeStyle = `rgba(0,200,210,${.18*(1-d/130)})`;
        ctx.lineWidth = .6;
        ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── Counter animation ── */
function animCount(el) {
  const target = +el.dataset.target;
  const dur = 1600, step = 16;
  const inc = target / (dur/step);
  let cur = 0;
  const t = setInterval(() => {
    cur = Math.min(cur + inc, target);
    el.textContent = Math.floor(cur) + (target >= 100 ? '+' : '');
    if (cur >= target) clearInterval(t);
  }, step);
}
const counters = document.querySelectorAll('.stat-num');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animCount(e.target); counterObs.unobserve(e.target); } });
}, { threshold: .5 });
counters.forEach(c => counterObs.observe(c));

/* ── Card scroll reveal ── */
const cards = document.querySelectorAll('.card');
const cardObs = new IntersectionObserver(entries => {
  entries.forEach((e,i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 120);
      cardObs.unobserve(e.target);
    }
  });
}, { threshold: .15 });
cards.forEach(c => cardObs.observe(c));

/* ── Ripple on login button ── */
document.querySelector('.btn-login').addEventListener('click', function(e) {
  const r = document.createElement('span');
  r.className = 'ripple';
  const rect = this.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
  this.appendChild(r);
  setTimeout(() => r.remove(), 700);
});

/* ── Mobile Nav Toggle ── */
function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('hamburger');
  const isOpen = nav.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}
function closeMobileNav() {
  document.getElementById('mobileNav').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileNav(); });

/* ── Navigation Functionality ── */
function scrollToSection(sectionClass) {
  const section = document.querySelector(sectionClass);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
  // Close mobile nav if open
  closeMobileNav();
}

function navigateHome() {
  scrollToSection('.hero');
}

function navigateAbout() {
  scrollToSection('.services');
}

function navigateProducts() {
  scrollToSection('.services');
}

function navigateContact() {
  scrollToSection('.login-section');
}

// Add navigation event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Desktop navigation
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const text = this.textContent.toLowerCase();
      if (text === 'home') navigateHome();
      else if (text === 'about') navigateAbout();
      else if (text === 'products') navigateProducts();
      else if (text === 'contact') navigateContact();
    });
  });

  // Mobile navigation
  const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const text = this.textContent.toLowerCase();
      if (text === 'home') navigateHome();
      else if (text === 'about') navigateAbout();
      else if (text === 'products') navigateProducts();
      else if (text === 'contact') navigateContact();
    });
  });

  // Highlight active navigation item based on scroll position
  function updateActiveNav() {
    const sections = ['.hero', '.services', '.login-section'];
    const navItems = ['home', 'about', 'contact'];
    
    let current = '';
    sections.forEach((section, index) => {
      const element = document.querySelector(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          current = navItems[index];
        }
      }
    });

    // Update desktop nav
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.textContent.toLowerCase() === current) {
        link.classList.add('active');
      }
    });

    // Update mobile nav
    mobileNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.textContent.toLowerCase() === current) {
        link.classList.add('active');
      }
    });
  }

  // Listen for scroll events to update active nav
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav(); // Initial call
});