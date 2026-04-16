// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
    }
    });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// Trigger hero reveal immediately
document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));

// Form submit handler
function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.submit-btn');
    btn.textContent = 'Message sent ✓';
    btn.style.background = '#4a7c59';
    btn.disabled = true;
}