# Sangram Rajpoot - Premium Portfolio Website

## Design Guidelines

### Design References
- **Apple.com**: Clean, premium feel with scroll-based animations
- **Stripe.com**: Modern dark theme with gradient accents
- **Linear.app**: Glassmorphism, smooth transitions

### Color Palette (Dark Mode)
- Primary BG: #0a0a0f (Deep Black)
- Secondary BG: #12121a (Charcoal)
- Card BG: rgba(255,255,255,0.05) (Glass)
- Accent: #00d4ff (Electric Blue)
- Accent2: #7b61ff (Purple)
- Gradient: linear-gradient(135deg, #00d4ff, #7b61ff)
- Text Primary: #ffffff
- Text Secondary: #a0a0b0
- Border: rgba(255,255,255,0.1)

### Color Palette (Light Mode)
- Primary BG: #f5f5fa
- Secondary BG: #ffffff
- Card BG: rgba(255,255,255,0.8)
- Accent: #0066ff
- Accent2: #6b4ce6
- Text Primary: #1a1a2e
- Text Secondary: #555570
- Border: rgba(0,0,0,0.1)

### Typography
- Headings: 'Inter', sans-serif, weight 700-800
- Body: 'Inter', sans-serif, weight 400
- Mono: 'JetBrains Mono', monospace (for code-like elements)

### Key Component Styles
- Glassmorphism cards: backdrop-filter blur(20px), semi-transparent bg, subtle border
- Buttons: Gradient bg, rounded 12px, hover glow effect
- Progress bars: Gradient fill with animation
- Timeline: Vertical line with animated dots

## Files to Create

1. **index.html** - Main HTML structure with all sections, SEO meta tags, preloader
2. **style.css** - Complete styling with dark/light themes, animations, responsive design
3. **script.js** - All interactivity: preloader, canvas sequence, typing effect, counters, scroll animations, theme toggle, voice assistant, form handling, custom cursor

## Sections
1. Preloader (SR logo + progress %)
2. Hero (canvas sequence + typing + CTAs)
3. About Me (intro + counters)
4. Skills (grouped cards + progress bars)
5. Projects (tilt cards)
6. Experience (timeline)
7. Achievements
8. Contact (Formspree form + social links)

## Features
- Theme toggle (dark/light) with localStorage
- Custom cursor
- Scroll progress indicator
- Back-to-top button
- Floating background shapes
- Navbar blur on scroll
- Voice assistant
- Scroll reveal animations
- Canvas-based frame sequence on scroll