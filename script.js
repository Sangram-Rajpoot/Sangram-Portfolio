const $ = (selector) => document.querySelector(selector);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const safeStorage = { get(key) { try { return localStorage.getItem(key); } catch { return null; } }, set(key, value) { try { localStorage.setItem(key, value); } catch {} } };
function setTheme(theme) { document.documentElement.dataset.theme = theme; safeStorage.set('sr-theme', theme); $('#themeToggle').textContent = theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'; $('#themeToggle').setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`); }
setTheme(safeStorage.get('sr-theme') === 'light' ? 'light' : 'dark');
$('#themeToggle').addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
$('#year').textContent = new Date().getFullYear();

// Progressive enhancement: the complete portfolio remains readable without JavaScript.
const intro = $('#intro');
let introSeen = false;
try { introSeen = sessionStorage.getItem('sr-intro-seen') === '1'; } catch {}
function enterPortfolio() {
  $('#siteShell').inert = false;
  document.body.style.overflow = '';
  intro.classList.add('leaving');
  try { sessionStorage.setItem('sr-intro-seen', '1'); } catch {}
  window.setTimeout(() => { intro.hidden = true; $('.wordmark').focus({ preventScroll: true }); }, reducedMotion ? 0 : 1000);
}
if (!introSeen && !reducedMotion && !location.hash) {
  intro.hidden = false;
  $('#siteShell').inert = true;
  document.body.style.overflow = 'hidden';
  $('#enterPortfolio').focus({ preventScroll: true });
  let start;
  const count = (now) => { start ??= now; const progress = Math.min(1, (now - start) / 900); $('.intro-count').textContent = String(Math.round(progress * 100)).padStart(3, '0'); if (progress < 1 && !intro.hidden) requestAnimationFrame(count); };
  requestAnimationFrame(count);
  $('#enterPortfolio').addEventListener('click', enterPortfolio, { once: true });
  intro.addEventListener('keydown', (event) => { if (event.key === 'Escape') enterPortfolio(); if (event.key === 'Tab') { event.preventDefault(); $('#enterPortfolio').focus(); } });
}

if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js-ready');
  const observer = new IntersectionObserver((entries) => { for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}
let scrollQueued = false;
const updateScroll = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  $('.reading-progress').style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  if (!reducedMotion && scrollY < innerHeight * 1.3) $('.hero-photo').style.transform = `translateY(${scrollY * 0.08}px) scale(${1 + Math.min(scrollY / innerHeight, 1) * 0.04})`;
  $('.connect-pill').classList.toggle('is-hidden', $('#contact').getBoundingClientRect().top < innerHeight);
  scrollQueued = false;
};
window.addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); } }, { passive: true });
updateScroll();

function openDialog(dialog) { dialog.showModal(); document.body.style.overflow = 'hidden'; }
function closeDialog(dialog) { dialog.close(); document.body.style.overflow = ''; }
$('#openMenu').addEventListener('click', () => { openDialog($('#menuDialog')); $('#openMenu').setAttribute('aria-expanded', 'true'); });
document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => closeDialog(document.getElementById(button.dataset.close))));
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; if (dialog.id === 'menuDialog') $('#openMenu').setAttribute('aria-expanded', 'false'); });
  dialog.addEventListener('click', (event) => { const r = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) closeDialog(dialog); });
});
$('#menuDialog').querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', () => closeDialog($('#menuDialog'))));

const projects = {
  bloghub: { name: 'BlogHub', category: 'FULL STACK WEB APPLICATION', image: new URL('./assets/images/projects/BlogHub.png', import.meta.url).href, description: 'A full stack Java application with product listing, user authentication, and database integration. Built with Spring Boot and MySQL, with an HTML, CSS, JavaScript, and Bootstrap frontend.', tags: ['JAVA', 'SPRING BOOT', 'MYSQL', 'HTML / CSS / JS', 'BOOTSTRAP'], source: null },
  votezy: { name: 'Votezy', category: 'ONLINE VOTING SYSTEM', image: new URL('./assets/images/projects/Votezy.png', import.meta.url).href, description: 'A Spring-based voting application using REST APIs and MVC architecture. It combines secure voting mechanisms, request interceptors, and real-time results with a responsive frontend.', tags: ['JAVA', 'SPRING MVC', 'REST APIs', 'INTERCEPTORS', 'MYSQL', 'BOOTSTRAP'], source: 'https://github.com/Sangram-Rajpoot/java-Full-Stack-Online-Voting-System' }
};
document.querySelectorAll('[data-project]').forEach((button) => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  $('#projectTitle').textContent = project.name;
  $('#projectCategory').textContent = project.category;
  $('#projectDescription').textContent = project.description;
  $('#projectImage').src = project.image;
  $('#projectImage').alt = `${project.name} application interface`;
  $('#projectTags').replaceChildren(...project.tags.map((tag) => { const span = document.createElement('span'); span.textContent = tag; return span; }));
  $('#projectSource').hidden = !project.source;
  if (project.source) $('#projectSource').href = project.source;
  else $('#projectSource').removeAttribute('href');
  openDialog($('#projectDialog'));
}));
$('#projectContact').addEventListener('click', () => closeDialog($('#projectDialog')));

const form = $('#contactForm');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const button = form.querySelector('button[type="submit"]');
  if (button.disabled) return;
  const label = button.querySelector('span');
  const status = $('#formStatus');
  button.disabled = true; label.textContent = 'SENDING…'; status.textContent = ''; status.removeAttribute('data-state');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: controller.signal });
    if (!response.ok) throw new Error('Could not send');
    form.reset(); status.dataset.state = 'success'; status.textContent = 'Message sent. Thank you — I’ll get back to you soon.';
  } catch {
    status.dataset.state = 'error'; status.textContent = 'Your message wasn’t sent. Please try again, or email rajputsanju2622@gmail.com directly.';
  } finally { clearTimeout(timeout); button.disabled = false; label.textContent = 'LET’S TALK'; }
});

// Voice navigation only asks for microphone access after an explicit visitor action.
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  $('#voiceBtn').hidden = false;
  let recognition = null;
  let transcript = '';
  $('#voiceBtn').addEventListener('click', () => openDialog($('#voiceDialog')));
  $('#startVoice').addEventListener('click', () => {
    if (recognition) return;
    recognition = new SpeechRecognition(); recognition.lang = 'en-US'; recognition.interimResults = false; transcript = '';
    $('#voiceStatus').textContent = 'Listening…'; $('#startVoice').disabled = true;
    recognition.onresult = (event) => {
      transcript = event.results[0][0].transcript.toLowerCase();
      const section = [['home','#home'],['top','#home'],['about','#about'],['skill','#skills'],['expertise','#skills'],['project','#work'],['work','#work'],['experience','#experience'],['journey','#experience'],['achievement','#achievements'],['contact','#contact']].find(([word]) => transcript.includes(word));
      if (transcript.includes('light')) setTheme('light');
      else if (transcript.includes('dark')) setTheme('dark');
      else if (section) { closeDialog($('#voiceDialog')); $(section[1]).scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }); }
      else { $('#voiceStatus').textContent = 'Try a section name such as “projects” or “contact”.'; return; }
      $('#voiceStatus').textContent = `Heard: ${transcript}`;
    };
    recognition.onerror = () => { $('#voiceStatus').textContent = 'Voice navigation is unavailable. Please use the menu or try again.'; };
    recognition.onend = () => { recognition = null; $('#startVoice').disabled = false; if (!transcript && $('#voiceStatus').textContent === 'Listening…') $('#voiceStatus').textContent = 'No speech detected. You can try again.'; };
    try { recognition.start(); } catch { recognition = null; $('#startVoice').disabled = false; $('#voiceStatus').textContent = 'Could not start listening. Please try again.'; }
  });
  $('#voiceDialog').addEventListener('close', () => { if (recognition) recognition.abort(); });
}
if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion) {
  const cursor = $('.cursor');
  window.addEventListener('pointermove', (event) => { cursor.style.left = `${event.clientX}px`; cursor.style.top = `${event.clientY}px`; }, { passive: true });
  document.querySelectorAll('.project').forEach((project) => { project.addEventListener('pointerenter', () => cursor.classList.add('over-project')); project.addEventListener('pointerleave', () => cursor.classList.remove('over-project')); });
}
