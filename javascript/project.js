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