/* ============================================
   SANGRAM RAJPOOT - PREMIUM PORTFOLIO JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ===== Configuration =====
    const FRAME_COUNT = 80;
    const FRAME_PATH = './assets/frames/frame_';
    const TYPING_WORDS = ['Java Developer', 'Backend Engineer', 'Spring Boot Specialist'];
    const TYPING_SPEED = 100;
    const TYPING_DELETE_SPEED = 50;
    const TYPING_PAUSE = 2000;

    // ===== DOM Elements =====
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.getElementById('preloaderBar');
    const preloaderPercent = document.getElementById('preloaderPercent');
    const heroCanvas = document.getElementById('heroCanvas');
    const ctx = heroCanvas.getContext('2d');
    const scrollProgress = document.getElementById('scrollProgress');
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('navMenu');
    const navHamburger = document.getElementById('navHamburger');
    const themeToggle = document.getElementById('themeToggle');
    const voiceBtn = document.getElementById('voiceBtn');
    const voiceOverlay = document.getElementById('voiceOverlay');
    const voiceClose = document.getElementById('voiceClose');
    const voiceStatus = document.getElementById('voiceStatus');
    const voiceTranscript = document.getElementById('voiceTranscript');
    const typingText = document.getElementById('typingText');
    const backToTop = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    const mainContent = document.getElementById('mainContent');

    // ===== State =====
    const images = [];
    let loadedCount = 0;
    let currentFrame = 0;
    let canvasReady = false;

    // ===== Preload Images =====
    function preloadImages() {
        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            const num = String(i).padStart(2, '0');
            img.src = `${FRAME_PATH}${num}_delay-0.062s.png`;
            img.onload = () => {
                loadedCount++;
                const percent = Math.round((loadedCount / FRAME_COUNT) * 100);
                preloaderBar.style.width = percent + '%';
                preloaderPercent.textContent = percent + '%';
                if (loadedCount === FRAME_COUNT) {
                    onAllImagesLoaded();
                }
            };
            img.onerror = () => {
                loadedCount++;
                const percent = Math.round((loadedCount / FRAME_COUNT) * 100);
                preloaderBar.style.width = percent + '%';
                preloaderPercent.textContent = percent + '%';
                if (loadedCount === FRAME_COUNT) {
                    onAllImagesLoaded();
                }
            };
            images.push(img);
        }
    }

    function onAllImagesLoaded() {
        canvasReady = true;
        resizeCanvas();
        drawFrame(0);
        setTimeout(() => {
            preloader.classList.add('loaded');
            document.body.style.overflow = '';
            initScrollAnimations();
        }, 500);
    }

    // ===== Canvas =====
    function resizeCanvas() {
        heroCanvas.width = window.innerWidth;
        heroCanvas.height = window.innerHeight;
        if (canvasReady) drawFrame(currentFrame);
    }

    function drawFrame(index) {
        if (index < 0 || index >= images.length) return;
        const img = images[index];
        if (!img || !img.complete || !img.naturalWidth) return;

        ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

        const canvasRatio = heroCanvas.width / heroCanvas.height;
        const imgRatio = img.naturalWidth / img.naturalHeight;

        let drawW, drawH, drawX, drawY;
        if (imgRatio > canvasRatio) {
            drawH = heroCanvas.height;
            drawW = drawH * imgRatio;
            drawX = (heroCanvas.width - drawW) / 2;
            drawY = 0;
        } else {
            drawW = heroCanvas.width;
            drawH = drawW / imgRatio;
            drawX = 0;
            drawY = (heroCanvas.height - drawH) / 2;
        }

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }

    // ===== Scroll Handler =====
    function onScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;

        // Scroll progress bar
        scrollProgress.style.width = (scrollPercent * 100) + '%';

        // Navbar blur
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top
        if (scrollTop > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Hero canvas frame sequence
        if (canvasReady) {
            const heroSection = document.getElementById('hero');
            const heroRect = heroSection.getBoundingClientRect();
            const heroHeight = heroSection.offsetHeight - window.innerHeight;

            if (heroRect.top <= 0 && heroRect.bottom >= window.innerHeight) {
                const heroScrollProgress = Math.min(Math.max(-heroRect.top / heroHeight, 0), 1);
                const frameIndex = Math.min(Math.floor(heroScrollProgress * (FRAME_COUNT - 1)), FRAME_COUNT - 1);
                if (frameIndex !== currentFrame) {
                    currentFrame = frameIndex;
                    drawFrame(currentFrame);
                }
            }
        }

        // Hero content fade
        const heroContent = document.querySelector('.hero-content');
        const heroOverlay = document.querySelector('.hero-overlay');
        if (heroContent && heroOverlay) {
            const fadeStart = window.innerHeight * 0.5;
            const fadeEnd = window.innerHeight * 1.5;
            if (scrollTop < fadeStart) {
                heroContent.style.opacity = '1';
                heroContent.style.display = 'block';
                heroOverlay.style.display = 'block';
            } else if (scrollTop < fadeEnd) {
                const opacity = 1 - (scrollTop - fadeStart) / (fadeEnd - fadeStart);
                heroContent.style.opacity = Math.max(opacity, 0);
                heroContent.style.display = 'block';
                heroOverlay.style.display = 'block';
            } else {
                heroContent.style.opacity = '0';
                heroContent.style.display = 'none';
                heroOverlay.style.display = 'none';
            }
        }

        // Active nav link
        const sections = document.querySelectorAll('.section, .hero');
        const navLinks = document.querySelectorAll('.nav-link');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom >= 200) {
                const id = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ===== Scroll Reveal =====
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');

                    // Animate skill bars
                    if (entry.target.classList.contains('skill-category') || entry.target.closest('.skills')) {
                        const fills = entry.target.querySelectorAll('.skill-fill');
                        fills.forEach(fill => {
                            const width = fill.getAttribute('data-width');
                            fill.style.setProperty('--target-width', width + '%');
                            fill.classList.add('animated');
                        });
                    }

                    // Animate counters
                    const counters = entry.target.querySelectorAll('.counter-number');
                    counters.forEach(counter => {
                        animateCounter(counter);
                    });
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
            observer.observe(el);
        });

        // Also observe skill categories for bar animation
        document.querySelectorAll('.skill-category').forEach(el => {
            observer.observe(el);
        });
    }

    // ===== Counter Animation =====
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        if (!target || el.dataset.animated === 'true') return;
        el.dataset.animated = 'true';

        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current);
        }, 30);
    }

    // ===== Typing Effect =====
    function initTypingEffect() {
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = TYPING_WORDS[wordIndex];

            if (isDeleting) {
                charIndex--;
                typingText.textContent = currentWord.substring(0, charIndex);
            } else {
                charIndex++;
                typingText.textContent = currentWord.substring(0, charIndex);
            }

            let delay = isDeleting ? TYPING_DELETE_SPEED : TYPING_SPEED;

            if (!isDeleting && charIndex === currentWord.length) {
                delay = TYPING_PAUSE;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % TYPING_WORDS.length;
                delay = 300;
            }

            setTimeout(type, delay);
        }

        type();
    }

    // ===== Theme Toggle =====
    function initTheme() {
        const savedTheme = localStorage.getItem('sr-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('sr-theme', next);
        });
    }

    // ===== Custom Cursor =====
    function initCursor() {
        if (window.innerWidth <= 768) return;

        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateOutline() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            requestAnimationFrame(animateOutline);
        }
        animateOutline();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-category, .counter-item, .achievement-card, .contact-link-item');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // ===== Mobile Navigation =====
    function initMobileNav() {
        navHamburger.addEventListener('click', () => {
            navHamburger.classList.toggle('active');
            navMenu.classList.toggle('open');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navHamburger.classList.remove('active');
                navMenu.classList.remove('open');
            });
        });
    }

    // ===== Back to Top =====
    function initBackToTop() {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== Button Ripple Effect =====
    function initRipple() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // ===== Contact Form =====
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.form-submit');
            const originalText = submitBtn.querySelector('span').textContent;
            submitBtn.querySelector('span').textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formSuccess.classList.add('show');
                    contactForm.reset();
                    setTimeout(() => formSuccess.classList.remove('show'), 5000);
                } else {
                    alert('Oops! Something went wrong. Please try again.');
                }
            } catch (err) {
                alert('Network error. Please try again later.');
            }

            submitBtn.querySelector('span').textContent = originalText;
            submitBtn.disabled = false;
        });
    }

    // ===== Voice Assistant =====
    function initVoiceAssistant() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            voiceBtn.style.display = 'none';
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let isListening = false;

        voiceBtn.addEventListener('click', () => {
            voiceOverlay.classList.add('active');
            voiceStatus.textContent = 'Listening...';
            voiceTranscript.textContent = '';
            voiceBtn.classList.add('listening');
            isListening = true;
            recognition.start();
        });

        voiceClose.addEventListener('click', () => {
            voiceOverlay.classList.remove('active');
            voiceBtn.classList.remove('listening');
            if (isListening) {
                recognition.stop();
                isListening = false;
            }
        });

        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            voiceTranscript.textContent = transcript;
        };

        recognition.onend = () => {
            isListening = false;
            voiceBtn.classList.remove('listening');
            const text = voiceTranscript.textContent.toLowerCase().trim();
            if (text) {
                voiceStatus.textContent = 'Processing...';
                handleVoiceCommand(text);
            } else {
                voiceStatus.textContent = 'No speech detected. Try again.';
            }
        };

        recognition.onerror = (event) => {
            isListening = false;
            voiceBtn.classList.remove('listening');
            voiceStatus.textContent = 'Error: ' + event.error + '. Try again.';
        };
    }

    function handleVoiceCommand(text) {
        const commands = {
            'home': '#hero',
            'about': '#about',
            'skill': '#skills',
            'project': '#projects',
            'experience': '#experience',
            'contact': '#contact',
            'achievement': '#achievements',
            'dark': () => {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('sr-theme', 'dark');
                voiceStatus.textContent = 'Switched to dark mode!';
            },
            'light': () => {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('sr-theme', 'light');
                voiceStatus.textContent = 'Switched to light mode!';
            },
            'top': () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                voiceStatus.textContent = 'Scrolling to top!';
            }
        };

        let matched = false;
        for (const [key, value] of Object.entries(commands)) {
            if (text.includes(key)) {
                if (typeof value === 'function') {
                    value();
                } else {
                    const el = document.querySelector(value);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                        voiceStatus.textContent = `Navigating to ${key}...`;
                    }
                }
                matched = true;
                break;
            }
        }

        if (!matched) {
            voiceStatus.textContent = 'Command not recognized. Try: "home", "about", "skills", "projects", "contact", "dark mode", "light mode"';
        }

        setTimeout(() => {
            voiceOverlay.classList.remove('active');
        }, 2000);
    }

    // ===== Project Card Tilt =====
    function initTiltEffect() {
        if (window.innerWidth <= 768) return;

        document.querySelectorAll('[data-tilt]').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -5;
                const rotateY = (x - centerX) / centerX * 5;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ===== Smooth Scroll for Nav Links =====
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ===== Initialize Everything =====
    document.body.style.overflow = 'hidden';
    preloadImages();
    initTheme();
    initTypingEffect();
    initCursor();
    initMobileNav();
    initBackToTop();
    initRipple();
    initContactForm();
    initVoiceAssistant();
    initTiltEffect();
    initSmoothScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resizeCanvas);

    // Fallback: if images take too long, show content after 8 seconds
    setTimeout(() => {
        if (!preloader.classList.contains('loaded')) {
            preloader.classList.add('loaded');
            document.body.style.overflow = '';
            canvasReady = true;
            resizeCanvas();
            initScrollAnimations();
        }
    }, 8000);
});