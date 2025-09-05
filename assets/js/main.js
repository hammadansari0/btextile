
// Page transitions, scroll reveal, nav, cursor glow, and simple form handler

const pageTransition = document.querySelector('.page-transition');
const cursor = document.querySelector('.cursor');
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Cursor glow
document.addEventListener('pointermove', (e)=>{
  document.documentElement.style.setProperty('--mx', e.clientX + 'px');
  document.documentElement.style.setProperty('--my', e.clientY + 'px');
});

// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav){
  toggle.addEventListener('click', ()=>{
    const open = nav.style.display === 'flex';
    nav.style.display = open ? 'none' : 'flex';
    toggle.setAttribute('aria-expanded', (!open).toString());
  });
}

// Scroll reveal
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
},{threshold: .12});
document.querySelectorAll('[data-animate]').forEach(el=>io.observe(el));

// Smooth page transition
function navigateWithTransition(url, origin='right'){
  if (!pageTransition) return (window.location.href = url);
  document.documentElement.style.setProperty('--origin', origin);
  pageTransition.style.transform = 'scaleX(1)';
  setTimeout(()=>{ window.location.href = url; }, 420);
}

document.addEventListener('click', (e)=>{
  const link = e.target.closest('a[data-link]');
  if(!link) return;
  const url = link.getAttribute('href');
  if (url.startsWith('#')) return;
  e.preventDefault();
  const rect = link.getBoundingClientRect();
  const mx = rect.left + rect.width/2, my = rect.top + rect.height/2;
  document.documentElement.style.setProperty('--mx', mx+'px');
  document.documentElement.style.setProperty('--my', my+'px');
  navigateWithTransition(url, mx < window.innerWidth/2 ? 'left' : 'right');
});

window.addEventListener('pageshow', (e)=>{
  if (pageTransition) pageTransition.style.transform = 'scaleX(0)';
});

// Contact form (demo-only: stores to localStorage)
window.handleContact = (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const list = JSON.parse(localStorage.getItem('bt_enquiries')||'[]');
  list.push({...data, ts: new Date().toISOString()});
  localStorage.setItem('bt_enquiries', JSON.stringify(list));
  alert('Thanks! Your wholesale enquiry has been saved locally for this demo.');
  e.target.reset();
};

document.querySelectorAll("[data-link]").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    window.location.href = link.getAttribute("href");
  });
});
