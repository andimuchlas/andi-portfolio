// js/sections/experience.js

class SectionExperience {
    constructor() {
        this.expandedId = null;
        this.keydownHandler = this.handleKeydown.bind(this);
    }

    async render() {
        window.MenuManager.state = 'section';
        document.addEventListener('keydown', this.keydownHandler);
        this.expandedId = null;
        await this.draw();
    }

    async draw() {
        const jobs = [
            {
                id: 1, title: "PT LINTAS CAKRA CIPTA", role: "Backend Engineer · Sep 2025–Present", logo: "assets/img/logo/LCC.png",
                desc: "Architect scalable backend services using Go and TypeScript.<br>Design spatial data workflows with PostGIS and OSRM.<br>Build distributed systems using Docker, NATS, and Redis."
            },
            {
                id: 2, title: "AUTOMATA VISUAL", role: "Unity Developer · Sep 2024–Feb 2025", logo: "assets/img/logo/automata-visual.png",
                desc: "Developed interactive system using Unity and LiDAR integration<br>at the Disaster Room of Geological Museum in Bandung."
            },
            {
                id: 3, title: "UVISUAL STUDIO", role: "R&D Freelancer · Aug 2023–Sep 2024", logo: "assets/img/logo/uvisual.png",
                desc: "Developed Gephyrion, a Website connected to Unity with Restful API.<br>Responsible for installing hardware and software on Sky-G and Hallway Space."
            },
            {
                id: 4, title: "BANDUNG INST. OF TECHNOLOGY", role: "Lab Assistant · Oct 2023–Jul 2025", logo: "assets/img/logo/lab-assistant.png",
                desc: "Game Programming (Jan 2025 - Jul 2025)<br>Object-Oriented Programming (Jan 2024 - Jul 2024)<br>Database Programming (Oct 2023 - Jan 2024)"
            }
        ];

        let contentHTML = `<div style="display:flex; flex-direction:column; gap: 1.5vmin; margin-top: 1.5vmin; width: 100%;">\n`;

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

        const fullHTML = window.Renderer.createDOSBox("EXPERIENCE", contentHTML, "Click to expand");

        if (!this.expandedId) {
            await window.Renderer.screenWipe(fullHTML);
        } else {
            window.Renderer.setContent(fullHTML);
            window.Audio.playEnter();
        }

        setTimeout(() => {
            document.querySelectorAll('.exp-item').forEach(el => {
                el.addEventListener('click', (e) => {
                    const id = parseInt(e.currentTarget.getAttribute('data-id'));
                    this.expandedId = (this.expandedId === id) ? null : id;
                    this.draw();
                });
            });
        }, 100);
    }

    handleKeydown(e) {
        if (window.MenuManager.state !== 'section' || window.MenuManager.activeIndex !== 2) return;
        if (['1', '2', '3', '4'].includes(e.key)) {
            const id = parseInt(e.key);
            this.expandedId = (this.expandedId === id) ? null : id;
            this.draw();
        } else if (e.key === 'Escape') {
            document.removeEventListener('keydown', this.keydownHandler);
        }
    }
}

window.SectionExperience = new SectionExperience();
