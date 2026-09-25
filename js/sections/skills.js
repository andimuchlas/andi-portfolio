// js/sections/skills.js

class SectionSkills {
    async render() {
        window.MenuManager.state = 'section';
        
        const skillsData = [
            { cat: "1. SOFTWARE ENGINEERING", skills: [
                { name: "Go", pct: 88 },
                { name: "TypeScript", pct: 88 },
                { name: "Python", pct: 82 },
                { name: "C# / CSharp", pct: 85 }
            ]},
            { cat: "2. BACKEND & DISTRIBUTED", skills: [
                { name: "PostgreSQL", pct: 88 },
                { name: "Redis & BullMQ", pct: 85 },
                { name: "NATS & gRPC", pct: 84 },
                { name: "Docker & K8s", pct: 82 }
            ]},
            { cat: "3. AI & ML ORCHESTRATION", skills: [
                { name: "PyTorch", pct: 80 },
                { name: "DistilBERT", pct: 82 },
                { name: "Transformers", pct: 80 },
                { name: "STT / TTS Voice", pct: 82 }
            ]},
            { cat: "4. GEOSPATIAL & ROUTING", skills: [
                { name: "PostGIS", pct: 88 },
                { name: "OSRM Routing", pct: 85 },
                { name: "Uber H3 Grid", pct: 84 },
                { name: "Typesense Geo", pct: 85 }
            ]},
            { cat: "5. REAL-TIME & INTERACTIVE", skills: [
                { name: "Unity (C#)", pct: 88 },
                { name: "Oculus LipSync", pct: 82 },
                { name: "MetaPerson SDK", pct: 80 },
                { name: "LiDAR Integration", pct: 82 }
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
