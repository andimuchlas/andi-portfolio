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
                id: 1, title: "PT LINTAS CAKRA CIPTA", role: "Backend Developer (Full-time) · Sep 2025–Present", logo: "/assets/img/logo/LCC.png",
                desc: "• Engineered high-performance modular monolith backend in Go & TypeScript with low-latency REST/gRPC interfaces.<br>• Architected & optimized custom map routing and spatial query services using PostGIS & PostgreSQL stored procedures (sub-second SLAs).<br>• Owned Kubernetes & Docker deployments; event-driven messaging with NATS and distributed caching via Redis.<br>• Refactored high-traffic PostgreSQL queries and GiST spatial indexes across multi-million record tables.<br>• Implemented automated background data ETL pipelines and tiered caching strategies.<br>• Profiled with Go pprof to isolate memory leaks and CPU hotspots under peak concurrent loads."
            },
            {
                id: 2, title: "MOLCA TEKNOLOGI NUSANTARA", role: "Unity Developer (Freelance) · Jun 2026–Present", logo: "/assets/img/logo/molca.png",
                desc: "• Develop core gameplay mechanics, interactive features, and real-time simulation logic in Unity (C#).<br>• Implement modular, reusable code architecture and optimize rendering and memory footprint across target platforms.<br>• Coordinate remotely with technical leads and design teams to deliver milestones on schedule."
            },
            {
                id: 3, title: "AUTOMATA VISUAL", role: "Unity Developer (Contract) · Sep 2024–Feb 2025", logo: "/assets/img/logo/automata-visual.png",
                desc: "• Engineered an interactive museum gamification installation at the Disaster Room of Geological Museum in Bandung.<br>• Integrated hardware LiDAR sensors with Unity (C#) for real-time visitor touch detection & room-scale interactive mapping.<br>• Built custom calibration tools and automated recovery routines to ensure stable 60 FPS performance."
            },
            {
                id: 4, title: "UVISUAL STUDIO", role: "R&D Freelancer · Aug 2023–Sep 2024", logo: "/assets/img/logo/uvisual.png",
                desc: "• Developed Gephyrion, a full-stack platform interfacing a web portal with Unity via RESTful APIs and WebSockets for dynamic character projection.<br>• Deployed multi-projector hardware and software mapping systems for immersive projection installations (Sky-G and Hallway Space)."
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
