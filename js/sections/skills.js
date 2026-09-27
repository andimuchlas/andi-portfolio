// js/sections/skills.js

class SectionSkills {
    async render() {
        window.MenuManager.state = 'section';
        
        const skillsData = [
            { cat: "1. LANGUAGES & WEB", skills: [
                { name: "TypeScript & JS", pct: 90 },
                { name: "React & Next.js", pct: 88 },
                { name: "Three.js & Leaflet", pct: 85 },
                { name: "Go & C#", pct: 86 }
            ]},
            { cat: "2. BACKEND & GEOSPATIAL", skills: [
                { name: "PostgreSQL & PostGIS", pct: 88 },
                { name: "Uber H3 & OSRM", pct: 85 },
                { name: "Redis & NATS", pct: 85 },
                { name: "gRPC & Hono.js", pct: 84 }
            ]},
            { cat: "3. REAL-TIME & INTERACTIVE", skills: [
                { name: "Unity (C#)", pct: 88 },
                { name: "LiDAR Sensor IoT", pct: 84 },
                { name: "WebSocket Stream", pct: 86 },
                { name: "Oculus LipSync", pct: 82 }
            ]},
            { cat: "4. CLOUD & DEVOPS", skills: [
                { name: "Docker & K8s", pct: 84 },
                { name: "AWS & Vercel", pct: 82 },
                { name: "Vitest & Testing", pct: 85 },
                { name: "Scrapy ETL", pct: 86 }
            ]},
            { cat: "5. AI & AUTOMATION", skills: [
                { name: "LLM Orchestration", pct: 86 },
                { name: "Agentic Tool-Call", pct: 85 },
                { name: "n8n Automation", pct: 88 },
                { name: "Webhooks & APIs", pct: 88 }
            ]},
            { cat: "6. SPOKEN & PROTOTYPING", skills: [
                { name: "English (Proficient)", pct: 85 },
                { name: "Indonesian (Native)", pct: 100 },
                { name: "Rapid Prototyping", pct: 88 },
                { name: "Figma UI Design", pct: 80 }
            ]}
        ];

        let contentHTML = `<div style="display:flex; flex-direction:column; gap: 1.8vmin; margin-top: 1vmin;">`;
        
        skillsData.forEach(group => {
            contentHTML += `<div style="font-size: 1.15em;">`;
            contentHTML += `<div class="phosphor-highlight" style="margin-bottom: 0.8vmin;">${group.cat}</div>`;
            group.skills.forEach(skill => {
                const barStr = `[░░░░░░░░░░░░░░░░]   0%`;
                contentHTML += `<div style="display:flex; margin-bottom: 0.4vmin;">`;
                contentHTML += `<span style="width: 20ch; display: inline-block;">${skill.name}</span>`;
                contentHTML += `<span id="skill-${skill.name.replace(/[^a-zA-Z]/g, '')}">${barStr}</span>`;
                contentHTML += `</div>`;
            });
            contentHTML += `</div>`;
        });
        
        contentHTML += `</div>`;

        const fullHTML = window.Renderer.createDOSBox("SKILLS", contentHTML);
        await window.Renderer.screenWipe(fullHTML);
        
        this.animateBars(skillsData);
    }

    async animateBars(skillsData) {
        let maxPct = 0;
        skillsData.forEach(g => g.skills.forEach(s => { if (s.pct > maxPct) maxPct = s.pct; }));
        
        for (let i = 0; i <= maxPct; i += 2) {
            let soundPlayed = false;
            skillsData.forEach(group => {
                group.skills.forEach(skill => {
                    const el = document.getElementById(`skill-${skill.name.replace(/[^a-zA-Z]/g, '')}`);
                    if (!el) return;
                    
                    const currentPct = Math.min(i, skill.pct);
                    const filledBlocks = Math.floor((currentPct / 100) * 16);
                    let barStr = "[";
                    for(let b=0; b<16; b++) {
                        barStr += (b < filledBlocks) ? "█" : "░";
                    }
                    barStr += `]  ${currentPct}%`;
                    
                    if (el.innerText !== barStr) {
                        el.innerText = barStr;
                        if (!soundPlayed) {
                            window.Audio.playBootBeep();
                            soundPlayed = true;
                        }
                    }
                });
            });
            await new Promise(r => setTimeout(r, 20));
        }
    }
}

window.SectionSkills = new SectionSkills();
