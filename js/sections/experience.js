// js/sections/experience.js

class SectionExperience {
    constructor() {
        this.expandedId = 1;
        this.isInitialized = false;
        this.keydownHandler = this.handleKeydown.bind(this);
    }

    async render() {
        window.MenuManager.state = 'section';
        document.addEventListener('keydown', this.keydownHandler);
        this.expandedId = 1;
        this.isInitialized = false;
        await this.draw();
    }

    async draw() {
        const jobs = [
            {
                id: 1, title: "PT LINTAS CAKRA CIPTA", role: "Software Engineer (Backend & Web Systems) · Sep 2025–Present", logo: "/assets/img/logo/LCC.png",
                desc: "• Engineered high-performance backend services and API gateways in Go & TypeScript, connecting low-latency REST/gRPC interfaces with interactive mapping web apps.<br>• Optimized custom map routing and spatial query pipelines using PostgreSQL/PostGIS and stored procedures (sub-second execution SLAs).<br>• Owned service deployment and container orchestration across Kubernetes & Docker, integrating Redis caching and NATS distributed messaging.<br>• Refactored high-traffic spatial SQL queries and GiST spatial indexes across multi-million record datasets.<br>• Profiled with Go pprof to isolate memory leaks and CPU hotspots, significantly boosting service throughput under peak concurrent loads."
            },
            {
                id: 2, title: "MOLCA TEKNOLOGI NUSANTARA", role: "Interactive Software Engineer (Remote) · Jun 2026–Present", logo: "/assets/img/logo/molca.png",
                desc: "• Engineered interactive simulation systems and modular client-side features in C# (Unity), adhering to decoupled software architecture patterns.<br>• Optimized runtime memory allocation and rendering loops, reducing frame drops and ensuring stable performance across hardware configurations.<br>• Collaborated asynchronously with technical leads and product teams to deliver complex interactive milestones on schedule."
            },
            {
                id: 3, title: "AUTOMATA VISUAL", role: "Software Engineer (IoT & Interactive Systems) · Sep 2024–Feb 2025", logo: "/assets/img/logo/automata-visual.png",
                desc: "• Engineered an IoT interactive display at the Disaster Room of Geological Museum Bandung, integrating hardware LiDAR sensors with C# client visualization runtimes.<br>• Developed real-time spatial touch-detection pipelines, transforming raw LiDAR telemetry into low-latency multi-user interaction events.<br>• Built automated watchdog recovery routines and calibration utilities, sustaining continuous zero-crash uptime and stable 60 FPS display rendering."
            },
            {
                id: 4, title: "UVISUAL STUDIO", role: "Software Engineer (Web & Interactive Systems) · Aug 2023–Sep 2024", logo: "/assets/img/logo/uvisual.png",
                desc: "• Engineered Gephyrion, a full-stack real-time interactive platform featuring a PHP and MySQL web application integrated via bidirectional WebSockets with interactive displays for live character projection.<br>• Architected relational database schemas and event-driven API endpoints in PHP to manage real-time character states, user sessions, and hardware triggering events.<br>• Deployed multi-projector hardware and network communication pipelines, ensuring reliable sub-100ms latency and 60 FPS performance during live exhibitions."
            }
        ];

        let contentHTML = `<div style="display:flex; flex-direction:column; gap: 1.5vmin; margin-top: 1vmin; width: 100%;">`;

        jobs.forEach(job => {
            const isExpanded = this.expandedId === job.id;
            const marker = isExpanded ? '▼' : '▶';
            const titleCls = isExpanded ? 'phosphor-highlight' : 'phosphor-amber';
            const isMobile = window.innerWidth < 768;

            contentHTML += `<div class="exp-item" data-id="${job.id}" style="cursor:pointer; display:flex; flex-direction:row; align-items: flex-start; width: 100%; overflow: hidden;">`;

            contentHTML += `<div style="width: 8vmin; min-width: 8vmin; margin-right: 2vmin; margin-top: 0.5vmin; display: flex; justify-content: center; align-items: flex-start;">
                <img src="${job.logo}" alt="${job.title} logo" style="max-width: 100%; max-height: 8vmin; object-fit: contain; filter: grayscale(1) sepia(1) hue-rotate(60deg) saturate(5) brightness(0.8);" />
            </div>`;

            contentHTML += `<div style="flex: 1; display:flex; flex-direction:column; min-width: 0;">`;
            contentHTML += `<div class="${titleCls}" style="font-size: ${isMobile ? '0.9em' : '1.1em'}; display: block; padding-right: 1vmin; word-break: keep-all; line-height: 1.2;">${marker} ${job.title}</div>`;
            contentHTML += `<div style="opacity: 0.8; margin-left: 2vmin; font-size: 0.85em; margin-top: 0.5vmin; line-height: 1.2;">${job.role}</div>`;

            if (isExpanded) {
                contentHTML += `<div class="phosphor-fade-in" style="margin-left: 2vmin; margin-top: 1vmin; border-left: 2px solid #FFB000; padding-left: 1.5vmin; font-size: 0.85em; line-height: 1.4;">${job.desc}</div>`;
            }
            contentHTML += `</div></div>`;
        });

        contentHTML += `</div>`;

        const fullHTML = window.Renderer.createDOSBox("EXPERIENCE", contentHTML, "1-4: Expand, ESC: Home");

        if (!this.isInitialized) {
            await window.Renderer.screenWipe(fullHTML);
            this.isInitialized = true;
        } else {
            window.Renderer.setContent(fullHTML);
            if (window.Audio) window.Audio.playEnter();
        }

        setTimeout(() => {
            document.querySelectorAll('.exp-item').forEach(el => {
                el.addEventListener('click', (e) => {
                    const id = parseInt(e.currentTarget.getAttribute('data-id'));
                    this.expandedId = (this.expandedId === id) ? null : id;
                    this.draw();
                });
            });
        }, 50);
    }

    handleKeydown(e) {
        if (window.MenuManager.state !== 'section' || window.MenuManager.activeIndex !== 2) return;
        if (['1', '2', '3', '4'].includes(e.key)) {
            if (document.activeElement.tagName === 'INPUT' && document.activeElement.id !== 'keyboard-capture') {
                return;
            }
            if (e.altKey || e.ctrlKey || e.metaKey) return;
            const id = parseInt(e.key);
            this.expandedId = (this.expandedId === id) ? null : id;
            this.draw();
        } else if (e.key === 'Escape') {
            document.removeEventListener('keydown', this.keydownHandler);
        }
    }
}

window.SectionExperience = new SectionExperience();
