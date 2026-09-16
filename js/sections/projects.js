// js/sections/projects.js

class SectionProjects {
    constructor() {
        this.state = 'list';
        this.activeIndex = 0;
        this.projects = [
            { id: 'A', name: 'RAJADEREK' },
            { id: 'B', name: 'GENSET MANAGEMENT API' },
            { id: 'C', name: 'CASANELA VILLA API' },
            { id: 'D', name: 'LLM INTENT ROUTER' },
            { id: 'E', name: 'DYNAMIC PDF ENGINE' },
            { id: 'F', name: 'GEPHYRION' },
            { id: 'G', name: 'DISASTER ROOM GAMIFICATION' },
            { id: 'H', name: 'THE SEARCH OF ELDORIA' },
            { id: 'I', name: 'CHATVIBES' },
            { id: 'J', name: 'AI AVATAR UNITY' },
            { id: 'K', name: 'DIGITAL LEARN' }
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
        let contentHTML = `<div style="font-size: 1.4em; margin-bottom: 2.5vmin;">SELECT PROJECT:</div>\n<div style="display:flex; flex-direction:column; gap: 1.2vmin;">\n`;
        this.projects.forEach((proj, idx) => {
            const isSelected = this.activeIndex === idx;
            const cls = isSelected ? 'phosphor-highlight' : 'phosphor-amber';
            const selector = isSelected ? '▶' : '&nbsp;';
            contentHTML += `<div class="menu-item ${cls}" data-id="${proj.id}" data-idx="${idx}" style="font-size: 1em; cursor:pointer; border-radius: 2px; padding: 0.3vmin 0.5vmin;">${selector} [ ${proj.id} ] ${proj.name}</div>\n`;
        });
        contentHTML += `</div>`;

        const fullHTML = window.Renderer.createDOSBox("PROJECTS", contentHTML, "↑/↓ or A-K: Select, ENTER: Open, ESC: Back");

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
        else if (id === 'B') await this.drawGenset();
        else if (id === 'C') await this.drawCasanela();
        else if (id === 'D') await this.drawLlmRouter();
        else if (id === 'E') await this.drawPdfEngine();
        else if (id === 'F') await this.drawGephyrion();
        else if (id === 'G') await this.drawDisasterRoom();
        else if (id === 'H') await this.drawEldoria();
        else if (id === 'I') await this.drawChatvibes();
        else if (id === 'J') await this.drawAiAvatar();
        else if (id === 'K') await this.drawDigitalLearn();
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

    async drawCasanela() {
        const diagram = `
<span class="ascii-node" title="Web Client & OTA Platforms">CLIENT / OTA</span>        <span class="ascii-node" title="Hono.js + Bun High-Speed Gateway">HONO / BUN API</span>        <span class="ascii-node" title="Redis & BullMQ Background Workers">BULLMQ WORKERS</span>
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ Web / OTA    │──HTTP▶│  Hono Router │──Job─▶│ Expire Queue │
│ (HotelMu)    │◀─JSON─│  RBAC & Auth │       │ Sync Channel │
└──────────────┘       └──────┬───────┘       └──────────────┘
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
           ┌───────────┐             ┌───────────┐
           │PostgreSQL │             │ AWS S3 /  │
           │Drizzle ORM│             │   MinIO   │
           └───────────┘             └───────────┘`;

        let contentHTML = `
<div class="phosphor-highlight" style="font-size: 1.4em; margin-bottom: 1.5vmin;">CASANELA VILLA API — Reservation & Channel Backend</div>
<div style="border-bottom: 2px solid #FFB000; margin-bottom: 2.5vmin; opacity: 0.5;"></div>
<div style="font-size: 0.75em; white-space: pre; margin-bottom: 2vmin;">${diagram}</div>
<div style="font-size: 1em; line-height: 1.4; opacity: 0.9; text-align: left;">
    High-performance backend service for villa reservations, dynamic pricing engine (vouchers/add-ons), and real-time availability.<div style="height: 0.8vmin;"></div>
    • <span class="phosphor-amber">Background Workers:</span> BullMQ & Redis for async OTA sync (HotelMu), booking expiry, and transactional emails.<br>
    • <span class="phosphor-amber">Security & Storage:</span> Granular RBAC, JWT / Firebase Auth, and S3 Presigned URLs for media assets.<br>
    • <span class="phosphor-amber">Document Generation:</span> Automated PDF invoices (jsPDF) and Excel financial reports (ExcelJS).<div style="height: 0.8vmin;"></div>
    <span style="opacity: 0.7;">Tech Stack:</span> Bun, TypeScript, Hono.js, PostgreSQL 18, Drizzle ORM, Redis, BullMQ, AWS S3/MinIO, Docker.
</div>`;

        const fullHTML = window.Renderer.createDOSBox("PROJECTS > CASANELA VILLA", contentHTML);
        await window.Renderer.screenWipe(fullHTML, false);
        this.attachTooltips();
    }

    async drawGenset() {
        const diagram = `
<span class="ascii-node" title="Admin Web & Driver Mobile App">FIELD / WEB</span>         <span class="ascii-node" title="Hono + Dependency Injection (tsyringe)">CLEAN ARCH API</span>        <span class="ascii-node" title="BullMQ Distributed Workers">JOB PIPELINE</span>
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ Admin Web /  │──HTTP▶│ Use Cases /  │──Job─▶│ Push (FCM)   │
│ Driver App   │◀─JSON─│ Domain Layer │       │ PDF/XLSX Gen │
└──────────────┘       └──────┬───────┘       └──────────────┘
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
           ┌───────────┐             ┌───────────┐
           │PostgreSQL │             │  AWS S3   │
           │Drizzle ORM│             │Presigned  │
           └───────────┘             └───────────┘`;

        let contentHTML = `
<div class="phosphor-highlight" style="font-size: 1.4em; margin-bottom: 1.5vmin;">ENTERPRISE GENSET MANAGEMENT — Backend & Worker System</div>
<div style="border-bottom: 2px solid #FFB000; margin-bottom: 2.5vmin; opacity: 0.5;"></div>
<div style="font-size: 0.75em; white-space: pre; margin-bottom: 2vmin;">${diagram}</div>
<div style="font-size: 1em; line-height: 1.4; opacity: 0.9; text-align: left;">
    Enterprise rental and field maintenance system built with Clean/Hexagonal Architecture in an NX Monorepo.<div style="height: 0.8vmin;"></div>
    • <span class="phosphor-amber">Core Workflows:</span> Real-time order dispatch, delivery tracking, hour-meter/fuel logging, and digital BAST with e-signatures.<br>
    • <span class="phosphor-amber">Distributed Workers:</span> BullMQ & Redis for decoupled FCM push alerts, email notifications, and automated reporting.<br>
    • <span class="phosphor-amber">Type-Safe & Docs:</span> End-to-end validation with shared Zod schemas, Better-Auth RBAC, and OpenAPI/Scalar API docs.<div style="height: 0.8vmin;"></div>
    <span style="opacity: 0.7;">Tech Stack:</span> Node.js, TypeScript, Hono.js, Drizzle ORM, PostgreSQL, Redis, BullMQ, AWS S3, Better-Auth, NX.
</div>`;

        const fullHTML = window.Renderer.createDOSBox("PROJECTS > GENSET MANAGEMENT", contentHTML);
        await window.Renderer.screenWipe(fullHTML, false);
        this.attachTooltips();
    }

    async drawLlmRouter() {
        const diagram = `
<span class="ascii-node" title="User / System Prompt Query">QUERY INGEST</span>        <span class="ascii-node" title="DistilBERT Classifier (5 Dimensions)">INTENT CLASSIFIER</span>     <span class="ascii-node" title="Cost-Latency Aware Router">ROUTING ENGINE</span>
┌──────────────┐       ┌──────────────────┐    ┌──────────────────┐
│ Client Prompt│──Text▶│ DistilBERT Mini  │───▶│ Model Router     │
│ Query Stream │       │ (5 Dims Classif) │    │ Fallback State-M │
└──────────────┘       └──────────────────┘    └────────┬─────────┘
                                                        │
                         ┌──────────────────────────────┼──────────────────────────────┐
                         ▼                              ▼                              ▼
                 ┌───────────────┐              ┌───────────────┐              ┌───────────────┐
                 │ Cheap Models  │              │   Mid-Tier    │              │ Frontier LLMs │
                 │  (68% Traffic)│              │  (22% Traffic)│              │  (10% Traffic)│
                 └───────────────┘              └───────────────┘              └───────────────┘`;

        let contentHTML = `
<div class="phosphor-highlight" style="font-size: 1.4em; margin-bottom: 1.5vmin;">LLM INTENT ROUTER — Intelligent Model Orchestration</div>
<div style="border-bottom: 2px solid #FFB000; margin-bottom: 2.5vmin; opacity: 0.5;"></div>
<div style="font-size: 0.75em; white-space: pre; margin-bottom: 2vmin;">${diagram}</div>
<div style="font-size: 1em; line-height: 1.4; opacity: 0.9; text-align: left;">
    Intelligent model orchestration layer balancing latency and inference cost through semantic intent classification.<div style="height: 0.8vmin;"></div>
    • <span class="phosphor-amber">Semantic Intent Classifier:</span> DistilBERT model classifying prompts across 5 dimensions with multilingual coverage.<br>
    • <span class="phosphor-amber">Dynamic Cost Optimization:</span> Routes 68% to low-cost models, 22% mid-tier, and 10% frontier LLMs — slashing API spend by ~72%.<br>
    • <span class="phosphor-amber">Fault Tolerance:</span> Automated fallback state machine guaranteeing high availability during upstream rate-limits or outages.<div style="height: 0.8vmin;"></div>
    <span style="opacity: 0.7;">Tech Stack:</span> Python, PyTorch, DistilBERT, HuggingFace Transformers, FastAPI, Redis.
</div>`;

        const fullHTML = window.Renderer.createDOSBox("PROJECTS > LLM INTENT ROUTER", contentHTML);
        await window.Renderer.screenWipe(fullHTML, false);
        this.attachTooltips();
    }

    async drawPdfEngine() {
        const diagram = `
<span class="ascii-node" title="Salesforce / Backend JSON Payload">DATA PAYLOAD</span>        <span class="ascii-node" title="Abstract Base & Client Sub-Templates">OOP PDF ENGINE</span>        <span class="ascii-node" title="Rendered PDF Output with Security">OUTPUT DOC</span>
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  Salesforce  │──JSON▶│BaseQuotation │──Gen─▶│ Dynamic Table│
│  / REST API  │       │Template (OOP)│       │ QR + E-Sign  │
└──────────────┘       └──────┬───────┘       └──────────────┘
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
           ┌───────────┐             ┌───────────┐
           │Multi-Tenant│            │   FAST    │
           │Client Mods│             │Compression│
           └───────────┘             └───────────┘`;

        let contentHTML = `
<div class="phosphor-highlight" style="font-size: 1.4em; margin-bottom: 1.5vmin;">DYNAMIC PDF ENGINE — Quotation & Contract Generator</div>
<div style="border-bottom: 2px solid #FFB000; margin-bottom: 2.5vmin; opacity: 0.5;"></div>
<div style="font-size: 0.75em; white-space: pre; margin-bottom: 2vmin;">${diagram}</div>
<div style="font-size: 1em; line-height: 1.4; opacity: 0.9; text-align: left;">
    Scalable Object-Oriented PDF generation engine for enterprise Quotations, MAP proposals, and LCC contracts.<div style="height: 0.8vmin;"></div>
    • <span class="phosphor-amber">OOP Template Hierarchy:</span> Base template encapsulating A4 pagination, custom font injection, and digital signature alignment.<br>
    • <span class="phosphor-amber">Multi-Tenant Customization:</span> Client-specific sub-templates (Djarum, Gudang Garam, BJB, Mobiletron) with custom layouts and rules.<br>
    • <span class="phosphor-amber">Dynamic Rendering & Assets:</span> Responsive jsPDF-autotable tables, terbilang currency formatting, dynamic QR verification, and asset compression.<div style="height: 0.8vmin;"></div>
    <span style="opacity: 0.7;">Tech Stack:</span> TypeScript, Node.js, jsPDF, jspdf-autotable, qrcode, OOP Architecture.
</div>`;

        const fullHTML = window.Renderer.createDOSBox("PROJECTS > PDF ENGINE", contentHTML);
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

    async drawAiAvatar() {
        const diagram = `
<span class="ascii-node" title="User Microphone Input">VOICE IN</span>         <span class="ascii-node" title="Speech-to-Text (piper1-gpl)">STT PIPELINE</span>         <span class="ascii-node" title="DeepSeek LLM Reasoning">AI CORE</span>
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ User Voice   │──WSS─▶│ piper1-gpl   │──Txt─▶│ DeepSeek LLM │
│ Mic Capture  │       │ STT Docker   │       │ Gen Response │
└──────────────┘       └──────────────┘       └──────┬───────┘
                                                     │
                         ┌───────────────────────────┴───────────────────────────┐
                         ▼                                                       ▼
                  ┌──────────────┐                                        ┌──────────────┐
                  │ faster-      │                                        │ MetaPerson   │
                  │ whisper-tiny │───Audio Sync (Visemes)────────────────▶│ 3D Avatar    │
                  │ TTS Docker   │                                        │ Oculus Lipsyn│
                  └──────────────┘                                        └──────────────┘`;

        let contentHTML = `
<div class="phosphor-highlight" style="font-size: 1.4em; margin-bottom: 1.5vmin;">AI AVATAR UNITY — Real-Time Voice Conversation & Lip-Sync</div>
<div style="border-bottom: 2px solid #FFB000; margin-bottom: 2.5vmin; opacity: 0.5;"></div>
<div style="font-size: 0.75em; white-space: pre; margin-bottom: 2vmin;">${diagram}</div>
<div style="font-size: 1em; line-height: 1.4; opacity: 0.9; text-align: left;">
    Interactive 3D conversational AI avatar in Unity featuring real-time natural voice dialogue and accurate facial lip-syncing.<div style="height: 0.8vmin;"></div>
    • <span class="phosphor-amber">End-to-End Voice Pipeline:</span> Mic Capture → STT (piper1-gpl) → DeepSeek LLM → TTS (faster-whisper-tiny) → Audio Playback.<br>
    • <span class="phosphor-amber">Real-Time Facial Animation:</span> MetaPerson 3D avatar integrated with Meta Oculus Lipsync (viseme-based mouth tracking).<br>
    • <span class="phosphor-amber">Decoupled Architecture:</span> Low-latency WebSocket streaming connecting Unity client with backend Dockerized inference services.<div style="height: 0.8vmin;"></div>
    <span style="opacity: 0.7;">Tech Stack:</span> Unity, C#, MetaPerson SDK, Oculus Lipsync, DeepSeek LLM, STT/TTS Docker Containers, WebSockets.<br>
    <span style="opacity: 0.7;">GitHub:</span> <a href="https://github.com/andimuchlas/AI-Avatar-Unity" target="_blank" style="color: #FFB000; text-decoration: underline;">github.com/andimuchlas/AI-Avatar-Unity ↗</a>
</div>`;

        const fullHTML = window.Renderer.createDOSBox("PROJECTS > AI AVATAR UNITY", contentHTML);
        await window.Renderer.screenWipe(fullHTML, false);
        this.attachTooltips();
    }

    async drawDigitalLearn() {
        const diagram = `
<span class="ascii-node" title="Student & Host Browsers">PLAYERS / HOST</span>      <span class="ascii-node" title="Next.js 16 App Router (Vercel)">VERCEL SERVERLESS</span>     <span class="ascii-node" title="Socket.io Standalone Server (Render)">REALTIME WEBSOCKET</span>
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ Mobile / Web │──HTTP▶│ Next.js 16   │       │ Socket.io    │
│ Client Apps  │◀─WSS──┤ UI & Admin   │       │ State/Timer  │
└──────────────┘       └──────┬───────┘       └──────┬───────┘
                              │                      │
                 ┌────────────┴──────────────────────┴────────────┐
                 ▼                                                ▼
           ┌───────────┐                                    ┌───────────┐
           │Supabase DB│                                    │GSAP Board │
           │PostgreSQL │                                    │25 Petak   │
           └───────────┘                                    └───────────┘`;

        let contentHTML = `
<div class="phosphor-highlight" style="font-size: 1.4em; margin-bottom: 1.5vmin;">DIGITAL LEARN — Real-Time Multiplayer Board Quiz Platform</div>
<div style="border-bottom: 2px solid #FFB000; margin-bottom: 2.5vmin; opacity: 0.5;"></div>
<div style="font-size: 0.75em; white-space: pre; margin-bottom: 2vmin;">${diagram}</div>
<div style="font-size: 1em; line-height: 1.4; opacity: 0.9; text-align: left;">
    Interactive multiplayer synchronous education platform combining live competitive trivia with a 25-tile Serpentine race track (Zero RNG, Pure Knowledge).<div style="height: 0.8vmin;"></div>
    • <span class="phosphor-amber">Decoupled Architecture:</span> Next.js 16 on Vercel paired with a standalone Dockerized Socket.io state server on Render & Supabase PostgreSQL.<br>
    • <span class="phosphor-amber">Synchronous Game Loop:</span> Real-time question dispatch, room management, reconnect tolerance, interactive timer bars, and GSAP animated tokens.<br>
    • <span class="phosphor-amber">Zero-Asset Audio:</span> Embedded Web Audio API procedural sound synthesizer (sound effects & win fanfare) without external audio file latency.<div style="height: 0.8vmin;"></div>
    <span style="opacity: 0.7;">Tech Stack:</span> Next.js 16, React 19, Bun, TypeScript, Socket.io, Drizzle ORM, Supabase/PostgreSQL, Tailwind CSS v4, GSAP.<br>
    <span style="opacity: 0.7;">GitHub:</span> <a href="https://github.com/andimuchlas/Digital-Learn" target="_blank" style="color: #FFB000; text-decoration: underline;">github.com/andimuchlas/Digital-Learn ↗</a>
</div>`;

        const fullHTML = window.Renderer.createDOSBox("PROJECTS > DIGITAL LEARN", contentHTML);
        await window.Renderer.screenWipe(fullHTML, false);
        this.attachTooltips();
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
            } else if (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'].includes(e.key)) {
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
