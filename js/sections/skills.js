// js/sections/skills.js

class SectionSkills {
    async render() {
        window.MenuManager.state = 'section';
        
        const skillsData = [
            { cat: "PROGRAMMING LANGUAGES", skills: [
                { name: "C#", pct: 85 },
                { name: "TypeScript", pct: 85 },
                { name: "Golang", pct: 80 },
                { name: "Python", pct: 60 }
            ]},
            { cat: "FRAMEWORKS & RUNTIMES", skills: [
                { name: "Unity", pct: 85 },
                { name: "Hono / Bun", pct: 85 },
                { name: "Node.js", pct: 85 },
                { name: "gRPC/REST", pct: 80 }
            ]},
            { cat: "DATABASES & QUEUES", skills: [
                { name: "PostgreSQL", pct: 85 },
                { name: "Redis/BullMQ", pct: 80 },
                { name: "MySQL", pct: 75 },
                { name: "Firebase", pct: 65 }
            ]},
            { cat: "TOOLS & ARCHITECTURE", skills: [
                { name: "Git", pct: 85 },
                { name: "Clean Arch", pct: 80 },
                { name: "Docker", pct: 75 },
                { name: "AWS S3", pct: 75 }
            ]}
        ];

        let contentHTML = `<div style="display:flex; flex-direction:column; gap: 4vmin;">\n`;
        
        skillsData.forEach(group => {
            contentHTML += `<div style="font-size: 1.2em;">`;
            contentHTML += `<div class="phosphor-highlight" style="margin-bottom: 1.5vmin;">${group.cat}</div>`;
            group.skills.forEach(skill => {
                const barStr = `[░░░░░░░░░░░░░░░░]   0%`;
                contentHTML += `<div style="display:flex; margin-bottom: 0.5vmin;">`;
                contentHTML += `<span style="width: 15ch;">${skill.name}</span>`;
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
