// js/sections/profile.js

class SectionProfile {
    async render() {
        window.MenuManager.state = 'section';
        const contentHTML = `
<div style="display: flex; flex-direction: column; gap: 2vmin; padding: 1vmin 2vmin;">
    <!-- TOP HEADER -->
    <div style="display: flex; flex-direction: row; gap: 4vmin; align-items: flex-start;">
        <!-- PHOTO BOX -->
        <div style="flex-shrink: 0; width: 20vmin;">
            <div style="font-size: 0.75em; opacity: 0.6; margin-bottom: 0.3vmin; text-align: center;">┌ PHOTO ┐</div>
            <div style="width: 100%; aspect-ratio: 1/1; border: 1px solid #FFB000; overflow: hidden; background: #000; display: flex; align-items: center; justify-content: center;">
                <img src="assets/img/profile-photos.png" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) sepia(1) hue-rotate(15deg) saturate(2) brightness(0.9);">
            </div>
            <div style="font-size: 0.75em; opacity: 0.6; margin-top: 0.3vmin; text-align: center;">└───────┘</div>
        </div>
        
        <!-- IDENTITY & PHILOSOPHY -->
        <div style="flex: 1; padding-top: 1vmin;">
            <div style="font-size: 1.7em; font-weight: bold; letter-spacing: 1px; margin-bottom: 0.2vmin;" class="phosphor-amber">ANDI MUCHLAS RAMADANI</div>
            <div style="font-size: 1.1em; opacity: 0.9;">Backend Engineer / Unity Developer</div>
            <div style="font-size: 0.9em; opacity: 0.5; margin-bottom: 1.5vmin;">Bandung, Indonesia</div>
            
            <div style="font-style: italic; font-size: 1.05em; color: #FFB000; opacity: 0.8; line-height: 1.1; border-left: 2px solid rgba(255,176,0,0.3); padding-left: 1.5vmin;">
                "Build systems that work.<br>Not systems that impress."
            </div>
        </div>
    </div>

    <!-- MAIN STATEMENTS -->
    <div style="border-top: 1px solid rgba(255,176,0,0.2); border-bottom: 1px solid rgba(255,176,0,0.2); padding: 1.5vmin 0; opacity: 0.9; line-height: 1.1;">
        <div style="display: flex; margin-bottom: 1vmin;">
            <span style="color: #FFB000; margin-right: 1.5ch;">[>]</span>
            <span>Specializes in <span class="phosphor-amber">spatial computation</span> and <span class="phosphor-amber">routing systems</span></span>
        </div>
        <div style="display: flex; margin-bottom: 1vmin;">
            <span style="color: #FFB000; margin-right: 1.5ch;">[>]</span>
            <span>Builds from <span class="phosphor-amber">first principles</span> — minimal dependencies</span>
        </div>
        <div style="display: flex; opacity: 0.8;">
            <span style="color: #FFB000; margin-right: 1.5ch;">[>]</span>
            <span>Go · TS · PostGIS · OSRM · Docker · K8s · NATS · Redis · Unity · C#</span>
        </div>
    </div>

    <!-- EDUCATION -->
    <div style="display: flex; flex-direction: row; gap: 3vmin; align-items: center; border: 1px solid rgba(255,176,0,0.15); padding: 1.5vmin; margin-top: 0.5vmin;">
        <div style="width: 10vmin; height: 10vmin; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
            <img src="assets/img/logo/itenas-logo.png" alt="Itenas Logo" style="max-width: 100%; max-height: 100%; object-fit: contain; filter: grayscale(1) sepia(1) hue-rotate(15deg) saturate(2) brightness(0.9);">
        </div>
        <div style="line-height: 1.3;">
            <div style="font-size: 1.1em; font-weight: bold;" class="phosphor-amber">Bandung National Institute of Technology</div>
            <div style="font-size: 1em; font-style: italic; opacity: 0.8;">Bachelor of Computer Science</div>
            <div style="font-size: 0.95em; margin-top: 0.5vmin;">Current GPA: <span class="phosphor-amber">3.46</span></div>
        </div>
    </div>

    <!-- STATS & CONTACT -->
    <div style="display: flex; flex-direction: row; gap: 8vmin; align-items: flex-start;">
        <!-- STATS -->
        <div style="border: 1px dashed #FFB000; padding: 1.5vmin; font-size: 0.9em; opacity: 0.7;">
            <div style="margin-bottom: 0.5vmin;">Exp   : ~2 years</div>
            <div style="margin-bottom: 0.5vmin;">Loc   : Bandung</div>
            <div style="margin-bottom: 0.5vmin;">Edu   : CS Degree</div>
            <div>Company : PT LCC</div>
        </div>

        <!-- CONTACT -->
        <div style="flex: 1; font-size: 0.95em;">
            <div style="display:flex; margin-bottom: 0.5vmin;"><span style="width:10ch; opacity: 0.6;">Email:</span> <span id="profile-email" style="cursor:pointer; border-bottom: 1px dashed #FFB000;">andimuchlas156@gmail.com</span></div>
            <div style="display:flex; margin-bottom: 0.5vmin;"><span style="width:10ch; opacity: 0.6;">LinkedIn:</span> <span style="cursor:pointer; border-bottom: 1px dashed #FFB000;" onclick="window.open('https://www.linkedin.com/in/andi-m-489b61248/', '_blank')">linkedin.com/in/andimuchlas</span></div>
            <div style="display:flex;"><span style="width:10ch; opacity: 0.6;">GitHub:</span> <span style="cursor:pointer; border-bottom: 1px dashed #FFB000;" onclick="window.open('https://github.com/andimuchlas', '_blank')">github.com/andimuchlas</span></div>
            <div id="profile-status-msg" style="margin-top: 1.5vmin; font-size: 0.8em; opacity: 0.5; height: 1.2em;">[ Click email to copy / links to open ]</div>
        </div>
    </div>
</div>
`;

        const fullHTML = window.Renderer.createDOSBox("PROFILE", contentHTML, "[ESC]← Back");
        await window.Renderer.screenWipe(fullHTML);

        // Re-attach email copy handler
        setTimeout(() => {
            const emailEl = document.getElementById('profile-email');
            if (emailEl) {
                emailEl.addEventListener('click', () => {
                    navigator.clipboard.writeText("andimuchlas156@gmail.com").then(() => {
                        window.Audio.playCopyDoubleBeep();
                        const msg = document.getElementById('profile-status-msg');
                        if (msg) {
                            msg.innerText = "> andimuchlas156@gmail.com COPIED TO CLIPBOARD.";
                            msg.className = "phosphor-highlight phosphor-fade-in";
                            setTimeout(() => {
                                msg.innerText = "[ Click email to copy / links to open ]";
                                msg.className = "";
                                msg.style.opacity = "0.5";
                            }, 3000);
                        }
                    });
                });
            }
        }, 100);
    }
}

window.SectionProfile = new SectionProfile();
