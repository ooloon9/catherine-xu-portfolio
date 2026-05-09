// Scroll reveal for project pages
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
reveals.forEach(el => observer.observe(el));

// Custom cursor
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');

const cursorLabel = document.createElement('span');
cursorLabel.classList.add('cursor-label');
cursor.appendChild(cursorLabel);

document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('[data-cursor]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    const message = el.getAttribute('data-cursor');
    cursorLabel.textContent = message;
    cursor.classList.add('has-message');
  });

  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('has-message');
    cursorLabel.textContent = '';
  });
});

document.querySelectorAll('a, button').forEach(el => {
  if (!el.hasAttribute('data-cursor')) {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  }
});

// Persona carousel
document.querySelectorAll('.carousel').forEach(carousel => {
  const slides = carousel.querySelectorAll('.slide');
  const dots   = carousel.querySelectorAll('.dot');
  const prevBtn = carousel.querySelector('.btn[aria-label="Previous"]');
  const nextBtn = carousel.querySelector('.btn[aria-label="Next"]');
  let current = 0;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  nextBtn?.addEventListener('click', () => goTo(current + 1));
  prevBtn?.addEventListener('click', () => goTo(current - 1));
  dots.forEach(dot => dot.addEventListener('click', () => goTo(+dot.dataset.index)));
});