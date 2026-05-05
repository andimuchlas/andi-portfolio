// js/sections/projects.js

class SectionProjects {
    constructor() {
        this.state = 'list';
        this.activeIndex = 0;
        this.projects = [
            { id: 'A', name: 'RAJADEREK' },
            { id: 'B', name: 'GEPHYRION' },
            { id: 'C', name: 'DISASTER ROOM GAMIFICATION' },
            { id: 'D', name: 'THE SEARCH OF ELDORIA' },
            { id: 'E', name: 'CHATVIBES' },
            { id: 'F', name: 'HAUNTED MANSION' }
        ];
        this.keydownHandler = this.handleKeydown.bind(this);
    }

    async render() {
        window.MenuManager.state = 'section';
        document.addEventListener('keydown', this.keydownHandler);
        this.state = 'list';
        this.activeIndex = 0;
        this.drawList(true);
    }

    async drawList(forceWipe = true) {
        let contentHTML = `<div style="font-size: 1.5em; margin-bottom: 4vmin;">SELECT PROJECT:</div>\n<div style="display:flex; flex-direction:column; gap: 2vmin;">\n`;
        this.projects.forEach((proj, idx) => {
            const isSelected = this.activeIndex === idx;
            const cls = isSelected ? 'phosphor-highlight' : 'phosphor-amber';
            const selector = isSelected ? '▶' : '&nbsp;';
            contentHTML += `<div class="menu-item ${cls}" data-id="${proj.id}" data-idx="${idx}" style="font-size: 1.1em; cursor:pointer; border-radius: 2px; padding: 0.5vmin;">${selector} [ ${proj.id} ] ${proj.name}</div>\n`;
        });
        contentHTML += `</div>`;

        const fullHTML = window.Renderer.createDOSBox("PROJECTS", contentHTML, "↑/↓ or A-F: Select, ENTER: Open, ESC: Back");

        if (forceWipe) {
            await window.Renderer.screenWipe(fullHTML);
        } else {
            window.Renderer.setContent(fullHTML);
        }

        setTimeout(() => {
            document.querySelectorAll('.menu-item').forEach(el => {
                el.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    this.activeIndex = parseInt(e.currentTarget.getAttribute('data-idx'));
                    this.showDetail(id);
                });
            });
        }, 50);
    }

    async showDetail(id) {
        this.state = 'detail';
        window.MenuManager.state = 'subsection';
        window.Audio.playEnter();

        if (id === 'A') await this.drawRajaderek();
        else if (id === 'B') await this.drawGephyrion();
        else if (id === 'C') await this.drawDisasterRoom();
        else if (id === 'D') await this.drawEldoria();
        else if (id === 'E') await this.drawChatvibes();
        else if (id === 'F') await this.drawHauntedMansion();
    }

    async drawRajaderek() {
        const diagram = `
<span class="ascii-node" title="Web Client / Mobile App">CLIENT</span>          <span class="ascii-node" title="TypeScript Gateway routing requests">GATEWAY (TS)</span>       <span class="ascii-node" title="Go-based core logic and services">CORE ENGINE (Go)</span>
┌──────┐         ┌──────────────┐      ┌──────────────┐
│      │──HTTP─▶│              │─gRPC▶│              │
│ Web  │         │  TypeScript  │      │   Go Logic   │
│ App  │◀─JSON──│              │◀gRPC─│              │
└──────┘         └──────────────┘      └──────┬───────┘
                                             │
                       ┌─────────────┬───────┴───────┬─────────────┐
                       ▼             ▼               ▼             ▼
                 ┌───────────┐ ┌───────────┐   ┌───────────┐ ┌───────────┐
                 │   Redis   │ │  PostGIS  │   │   OSRM    │ │   NATS    │
                 │   Cache   │ │ Spatial DB│   │  Routing  │ │Messaging  │
                 └───────────┘ └───────────┘   └───────────┘ └───────────┘`;

        let contentHTML = `
<div class="phosphor-highlight" style="font-size: 1.5em; margin-bottom: 2vmin;">RAJADEREK — High-Performance Logistics Routing</div>
<div style="border-bottom: 2px solid #FFB000; margin-bottom: 4vmin; opacity: 0.5;"></div>
<div style="font-size: 0.8em; white-space: pre; margin-bottom: 2vmin;">${diagram}</div>
<div style="font-size: 1.1em; line-height: 1.5; opacity: 0.9; text-align: left;">
    Developed the backend of Rajaderek using Go, TypeScript, and OSRM to power a high-performance, low-latency routing and spatial processing system for logistics.<div style="height: 1vmin;"></div>
    <span style="opacity: 0.7;">Tech Stack:</span> Go, TypeScript, OSRM, PostgreSQL/PostGIS, gRPC, Redis, NATS, Docker, Kubernetes.
</div>`;

        const fullHTML = window.Renderer.createDOSBox("PROJECTS > RAJADEREK", contentHTML);
        await window.Renderer.screenWipe(fullHTML, false);
        this.attachTooltips();
    }

    async drawGephyrion() {
        const contentHTML = `
<div class="phosphor-highlight" style="font-size: 1.8em; margin-bottom: 2vmin;">GEPHYRION</div>
<div style="font-size: 1.1em; max-width: 90%; line-height: 1.5; text-align: left;">
Gephyrion is an immersive room installation where a web-based interface connects with a Unity-powered projection system. Users interact with a website to make specific choices, which are transmitted in real time to display a character projection inside a physical room.<div style="height: 1vmin;"></div>
Developed collaboratively. Responsible for designing and developing the website interface, backend logic, and handling the Unity-side development that visualizes user inputs in real time.<div style="height: 1vmin;"></div>
<span style="opacity: 0.7;">Tech Stack:</span> Unity, C#, Laravel, PHP, MySQL, WebSocket
</div>
<div style="margin-top: 3vmin; display: flex; gap: 2vmin; overflow-x: auto; padding-bottom: 1vmin;">
    <img src="assets/img/gephyrion/prediction.png" style="height: 25vmin; border: 1px solid #FFB000; filter: grayscale(1) sepia(1) hue-rotate(15deg) saturate(2) brightness(0.9);">
    <img src="assets/img/gephyrion/quiz.png" style="height: 25vmin; border: 1px solid #FFB000; filter: grayscale(1) sepia(1) hue-rotate(15deg) saturate(2) brightness(0.9);">
    <img src="assets/img/gephyrion/unity.png" style="height: 25vmin; border: 1px solid #FFB000; filter: grayscale(1) sepia(1) hue-rotate(15deg) saturate(2) brightness(0.9);">
</div>`;
        const fullHTML = window.Renderer.createDOSBox("PROJECTS > GEPHYRION", contentHTML);
        await window.Renderer.screenWipe(fullHTML, false);
    }

    async drawDisasterRoom() {
        const contentHTML = `
<div class="phosphor-highlight" style="font-size: 1.8em; margin-bottom: 2vmin;">DISASTER ROOM GAMIFICATION</div>
<div style="font-size: 1.1em; max-width: 90%; line-height: 1.5; margin-bottom: 2vmin; text-align: left;">
An interactive wall installation and floor projection developed for the Disaster Room exhibit at Museum Geologi Bandung. Seamlessly integrates Unity, LiDAR technology, and projector mapping to create a real-time, educational experience focused on natural disasters in Indonesia.<div style="height: 1vmin;"></div>
<span style="opacity: 0.7;">Tech Stack:</span> Unity, C#, LiDAR Integration, OSC, LAN<br>
<span style="opacity: 0.7;">Video Demo:</span> <a href="https://drive.google.com/file/d/1cZP6pzpNJWETzoOTkOpkZI3qRfvd0RzO/view?usp=drive_link" target="_blank" style="color: #FFB000;">Google Drive Video</a>
</div>
<div style="margin-top: 2vmin; border: 2px dashed #009900; padding: 1vmin; display: inline-block;">
    <div style="font-size: 0.9em; margin-bottom: 1vmin;" class="phosphor-amber">[ VIDEO STREAM ]</div>
    <div style="width: 70vmin; height: 40vmin; background: #000; border: 1px solid #FFB000; overflow: hidden; position: relative;">
        <iframe src="https://drive.google.com/file/d/1cZP6pzpNJWETzoOTkOpkZI3qRfvd0RzO/preview" style="width: 100%; height: 100%; border: none; filter: grayscale(1) sepia(1) hue-rotate(15deg) saturate(2) brightness(0.9);"></iframe>
    </div>
</div>`;
        const fullHTML = window.Renderer.createDOSBox("PROJECTS > GAMIFICATION", contentHTML);
        await window.Renderer.screenWipe(fullHTML, false);
    }

    async drawEldoria() {
        const contentHTML = `
<div class="phosphor-highlight" style="font-size: 1.8em; margin-bottom: 2vmin;">THE SEARCH OF ELDORIA</div>
<div style="font-size: 1.1em; max-width: 90%; line-height: 1.5; margin-bottom: 2vmin; text-align: left;">
A 2D top-down action-adventure game developed as a final project for Game Programming. Players take on the role of a lone warrior exploring a mystical forest, engaging in real-time combat, and interacting with NPCs. Features pixel-art visuals focusing on exploration, progression, and strategic action.<div style="height: 1vmin;"></div>
<span style="opacity: 0.7;">Tech Stack:</span> Unity, C#<br>
<span style="opacity: 0.7;">Link:</span> <a href="https://andimuchlas.itch.io/the-search-of-eldoria" target="_blank" style="color: #FFB000;">andimuchlas.itch.io/the-search-of-eldoria</a>
</div>
<div style="margin-top: 2vmin; display: flex; gap: 2vmin; overflow-x: auto; padding-bottom: 1vmin;">
    <img src="assets/img/search-of-eldoria/main-menu.png" style="height: 25vmin; border: 1px solid #FFB000; filter: grayscale(1) sepia(1) hue-rotate(15deg) saturate(2) brightness(0.9);">
    <img src="assets/img/search-of-eldoria/demo-1.png" style="height: 25vmin; border: 1px solid #FFB000; filter: grayscale(1) sepia(1) hue-rotate(15deg) saturate(2) brightness(0.9);">
    <img src="assets/img/search-of-eldoria/demo-2.png" style="height: 25vmin; border: 1px solid #FFB000; filter: grayscale(1) sepia(1) hue-rotate(15deg) saturate(2) brightness(0.9);">
</div>`;
        const fullHTML = window.Renderer.createDOSBox("PROJECTS > ELDORIA", contentHTML);
        await window.Renderer.screenWipe(fullHTML, false);
    }

    async drawChatvibes() {
        const contentHTML = `
<div class="phosphor-highlight" style="font-size: 1.8em; margin-bottom: 2vmin;">CHATVIBES</div>
<div style="padding: 1vmin 0; margin-top: 1vmin; margin-bottom: 2vmin;">
    <div style="font-size: 1.1em; max-width: 90%; line-height: 1.5; margin-bottom: 1vmin; text-align: left;" class="phosphor-green-primary">
        A group chat mobile app allowing users to register, sign in, join or create chat groups, and interact in real time. Designed intuitive user flows and state management to deliver a smooth responsive chatting experience.
        <div style="height: 1vmin;"></div>
        <span class="phosphor-amber">Tech Stack:</span> Flutter, Firebase
    </div>
</div>
<div style="margin-top: 2vmin; display: flex; gap: 2vmin; overflow-x: auto; padding-bottom: 1vmin;">
    <img src="assets/img/chat-vibes/login.png" style="height: 40vmin; border: 1px solid #FFB000; filter: grayscale(1) sepia(1) hue-rotate(15deg) saturate(2) brightness(0.9);">
    <img src="assets/img/chat-vibes/main-menu.png" style="height: 40vmin; border: 1px solid #FFB000; filter: grayscale(1) sepia(1) hue-rotate(15deg) saturate(2) brightness(0.9);">
    <img src="assets/img/chat-vibes/profile.png" style="height: 40vmin; border: 1px solid #FFB000; filter: grayscale(1) sepia(1) hue-rotate(15deg) saturate(2) brightness(0.9);">
</div>`;
        const fullHTML = window.Renderer.createDOSBox("PROJECTS > CHATVIBES", contentHTML);
        await window.Renderer.screenWipe(fullHTML, false);
    }

    async drawHauntedMansion() {
        const contentHTML = `
<div class="phosphor-highlight" style="font-size: 1.8em; margin-bottom: 2vmin;">HAUNTED MANSION</div>
<div style="font-size: 1.1em; max-width: 90%; line-height: 1.5; margin-bottom: 2vmin; text-align: left;">
Haunted Mansion is a prototype horror game made using the Unity engine.<div style="height: 1vmin;"></div>
<span style="opacity: 0.7;">Tech Stack:</span> Unity, C#
</div>
<div style="margin-top: 2vmin; display: flex; gap: 2vmin; overflow-x: auto; padding-bottom: 1vmin;">
    <img src="assets/img/hauted-house/footage-1.png" style="height: 25vmin; border: 1px solid #FFB000; filter: grayscale(1) sepia(1) hue-rotate(15deg) saturate(2) brightness(0.9);">
    <img src="assets/img/hauted-house/footage-2.png" style="height: 25vmin; border: 1px solid #FFB000; filter: grayscale(1) sepia(1) hue-rotate(15deg) saturate(2) brightness(0.9);">
    <img src="assets/img/hauted-house/footage-3.png" style="height: 25vmin; border: 1px solid #FFB000; filter: grayscale(1) sepia(1) hue-rotate(15deg) saturate(2) brightness(0.9);">
</div>`;
        const fullHTML = window.Renderer.createDOSBox("PROJECTS > HAUNTED MANSION", contentHTML);
        await window.Renderer.screenWipe(fullHTML, false);
    }

    async drawDhweb() {
        const contentHTML = `
<div class="phosphor-highlight" style="font-size: 1.8em; margin-bottom: 2vmin;">DHWEB</div>
<div style="position: relative; padding: 2vmin; border: 1px dashed #FFB000; margin-top: 1vmin;">
    <div style="position: absolute; top: -2.2vmin; left: -1vmin; background: #050505; color: #FFB000; padding: 0 1vmin; font-size: 1.2em;">┌───────┐</div>
    <div style="position: absolute; top: -2.2vmin; right: -1vmin; background: #050505; color: #FFB000; padding: 0 1vmin; font-size: 1.2em;">┌───────┐</div>
    <div style="position: absolute; bottom: -2.2vmin; left: -1vmin; background: #050505; color: #FFB000; padding: 0 1vmin; font-size: 1.2em;">└───────┘</div>
    <div style="position: absolute; bottom: -2.2vmin; right: -1vmin; background: #050505; color: #FFB000; padding: 0 1vmin; font-size: 1.2em;">└───────┘</div>
    
    <div style="font-size: 1.1em; max-width: 90%; line-height: 1.5; margin-bottom: 1vmin;" class="phosphor-green-primary">
        A website using the Laravel framework that serves as a hospital database management system.
        <div style="height: 1vmin;"></div>
        <span class="phosphor-amber">Features:</span> Data Pegawai, Data Dokter, Jadwal Praktek Dokter, Data Pasien, Data Tempat Tidur, Data Rawat.
        <div style="height: 1vmin;"></div>
        <span class="phosphor-amber">Tech Stack:</span> Laravel, PHP, MySQL
    </div>
</div>`;
        const fullHTML = window.Renderer.createDOSBox("PROJECTS > DHWEB", contentHTML);
        await window.Renderer.screenWipe(fullHTML, false);
    }

    attachTooltips() {
        document.querySelectorAll('.ascii-node').forEach(node => {
            node.addEventListener('mouseenter', (e) => {
                let tooltip = document.getElementById('ascii-tooltip');
                if (!tooltip) {
                    tooltip = document.createElement('div');
                    tooltip.id = 'ascii-tooltip';
                    tooltip.className = 'ascii-tooltip';
                    document.body.appendChild(tooltip);
                }
                tooltip.innerText = e.target.getAttribute('title');
                tooltip.style.left = e.pageX + 10 + 'px';
                tooltip.style.top = e.pageY + 10 + 'px';
                tooltip.style.opacity = 1;
            });
            node.addEventListener('mouseleave', () => {
                const tooltip = document.getElementById('ascii-tooltip');
                if (tooltip) tooltip.style.opacity = 0;
            });
        });
    }

    handleKeydown(e) {
        if (window.MenuManager.state === 'section' && window.MenuManager.activeIndex === 3) {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.activeIndex = (this.activeIndex > 0) ? this.activeIndex - 1 : this.projects.length - 1;
                window.Audio.playKeystroke();
                this.drawList(false);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.activeIndex = (this.activeIndex < this.projects.length - 1) ? this.activeIndex + 1 : 0;
                window.Audio.playKeystroke();
                this.drawList(false);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.showDetail(this.projects[this.activeIndex].id);
            } else if (['A', 'B', 'C', 'D', 'E', 'F', 'a', 'b', 'c', 'd', 'e', 'f'].includes(e.key)) {
                e.preventDefault();
                const key = e.key.toUpperCase();
                this.activeIndex = this.projects.findIndex(p => p.id === key);
                this.showDetail(key);
            } else if (e.key === 'Escape') {
                document.removeEventListener('keydown', this.keydownHandler);
            }
        } else if (window.MenuManager.state === 'subsection') {
            if (e.key === 'Escape') {
                e.preventDefault();
                window.Audio.playKeystroke();
                this.drawList(true);
                window.MenuManager.state = 'section';
            }
        }
    }
}

window.SectionProjects = new SectionProjects();
