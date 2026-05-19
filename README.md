# AMRSYS 9400 - Retro Terminal Portfolio

Welcome to **AMRSYS 9400**, my personal software engineering portfolio styled as a retro, CRT-based Terminal User Interface (TUI) / DOS-like environment. This project aims to showcase my background in backend systems, Go, and Unity through a unique and nostalgic interactive experience.

## 🌟 Features

- **Retro Aesthetic**: Authentic CRT monitor effects including scanlines, phosphor glow, curvature, and subtle glitch animations.
- **Interactive Terminal**: Navigate through different sections using an interactive boot sequence and terminal-like menu.
- **Sound Effects**: Immersive audio cues for bootup and interactions (with a hardware mute button feature on the "monitor bezel").
- **Responsive Design**: Adapts gracefully to different screen sizes, with a dedicated notice and compact mode fallback for smaller mobile displays.
- **Hidden SEO Optimization**: Retains semantic HTML content for search engine crawlers without compromising the retro visual style.

## 🚀 Sections Included

- **Profile**: Overview of my background as a Software Engineer.
- **Experience**: Timeline of my professional roles and achievements.
- **Projects**: Showcase of key projects (Backend systems, Unity simulations, etc.).
- **Skills**: Technical proficiencies (Go, gRPC, Redis, PostgreSQL, OSRM, Unity, Docker).
- **Contact**: Links to my LinkedIn, GitHub, and email.

## 🛠️ Technology Stack

- **HTML5**: Semantic structure and hidden content for SEO.
- **CSS3**: Extensive use of CSS animations, filters, and pseudo-elements to create the CRT monitor, scanlines, and glow effects.
- **Vanilla JavaScript**: Handles boot sequence, audio playback, keystroke capturing, and view rendering.

## 📂 Project Structure

```
├── assets/         # Images, fonts, and audio files
├── css/            # Stylesheets
│   ├── crt-hardware.css   # Monitor bezel and physical hardware styles
│   ├── crt-phosphor.css   # Screen glow and color themes
│   ├── dos-ui.css         # Text rendering and DOS layout
│   ├── monitor.css        # Monitor structure and screen glass
│   └── reset.css          # CSS reset
├── js/             # JavaScript logic
│   ├── sections/   # Individual section logic (profile, experience, etc.)
│   ├── audio.js    # Audio playback manager
│   ├── boot.js     # Boot sequence simulation
│   ├── menu.js     # Menu navigation
│   └── renderer.js # Text rendering engine
├── index.html      # Main entry point
└── README.md       # Project documentation (this file)
```

## 💻 How to Run Locally

Since this is a static website, you can run it using any simple local web server. 

### Using Python (if installed)
```bash
python -m http.server 8000
```

### Using Node.js (http-server)
```bash
npx http-server -p 8000
```

Then, open your browser and navigate to `http://localhost:8000`.

## 👨‍💻 About Me

I am Andi Muchlas Ramadani, a Software Engineer with a Computer Science background. I have a strong focus on building scalable backend microservices (Go, gRPC, Redis, event-driven architectures) and developing spatial computations and real-time visualization systems (Unity, OSRM, PostGIS).

Connect with me:
- [LinkedIn](https://linkedin.com/in/andimuchlas)
- [GitHub](https://github.com/andimuchlas)
