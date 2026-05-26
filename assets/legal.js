// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Active TOC item based on scroll position
const sections = Array.from(document.querySelectorAll('.legal-section[id]'));
const tocLinks = Array.from(document.querySelectorAll('.toc-list a'));
const linkById = new Map(tocLinks.map(a => [a.getAttribute('href').slice(1), a]));

function updateActiveToc() {
  const scrollY = window.scrollY + 160;
  let current = sections[0]?.id;
  for (const sec of sections) {
    if (sec.offsetTop <= scrollY) current = sec.id;
    else break;
  }
  tocLinks.forEach(a => a.classList.remove('active'));
  if (current && linkById.has(current)) {
    linkById.get(current).classList.add('active');
  }
}
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => { updateActiveToc(); ticking = false; });
    ticking = true;
  }
}, { passive: true });
updateActiveToc();

// Smooth-scroll handler (also closes any hash from sticky nav offset gracefully)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    history.pushState(null, '', '#' + id);
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 110,
      behavior: 'smooth'
    });
  });
});
