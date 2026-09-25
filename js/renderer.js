// js/renderer.js

class Renderer {
    constructor() {
        this.container = document.getElementById('terminal-content');
        this.wipeLayer = document.getElementById('wipe-transition-layer');
        this.isTyping = false;
    }

    setContent(html) {
        this.container.innerHTML = html;
    }
    appendHTML(html) {
        this.container.innerHTML += html;
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.container.scrollTop = this.container.scrollHeight;
    }

    async typeText(text, containerElement, delayMs = 20) {
        this.isTyping = true;
        containerElement.innerHTML = '';

        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\n') {
                containerElement.innerHTML += '<br>';
            } else {
                const span = document.createElement('span');
                span.textContent = text[i];
                span.className = 'phosphor-fade-in';
                containerElement.appendChild(span);
            }

            if (text[i] !== ' ' && text[i] !== '\n') {
                if (i % 3 === 0) {
                    window.Audio.playKeystroke();
                }
            }

            await new Promise(r => setTimeout(r, delayMs));
        }
        this.isTyping = false;
    }

    async screenWipe(newHTML, playSound = true) {
        return new Promise((resolve) => {
            if (playSound) window.Audio.playSectionWhoosh();

            this.wipeLayer.classList.remove('screen-wipe-enter');
            this.wipeLayer.classList.add('screen-wipe-exit');

            setTimeout(() => {
                this.setContent(newHTML);
                this.wipeLayer.classList.remove('screen-wipe-exit');
                this.wipeLayer.classList.add('screen-wipe-enter');

                setTimeout(() => {
                    this.wipeLayer.classList.remove('screen-wipe-enter');
                    resolve();
                }, 150);
            }, 150);
        });
    }

    createDOSBox(title, contentHTML, instructionsHTML = "ESC: Home") {
        const isMobile = window.innerWidth < 768;
        const isSubsection = window.MenuManager && window.MenuManager.state === 'subsection';
        const backAction = isSubsection ? "window.SectionProjects.drawList(true)" : "window.location.href='/'";
        const backLabel = isSubsection ? "◀ PROJECTS" : "◀ HOME";
        
        // Touch-friendly responsive Back button always available
        const backBtn = `<button type="button" class="back-btn-dos" onclick="${backAction}; window.Audio.playKeystroke();" style="cursor: pointer; border: 1px solid #050505; background: rgba(0,0,0,0.15); color: #050505; font-family: inherit; font-size: ${isMobile ? '0.75em' : '0.85em'}; font-weight: bold; padding: 0.2vmin 1.2vmin; margin-left: 1.5vmin; letter-spacing: 0.1vmin; transition: transform 0.1s; display: inline-flex; align-items: center; justify-content: center;">${backLabel}</button>`;
        
        return `<div class="phosphor-highlight-inverse" style="display:flex; justify-content:space-between; align-items: center; margin-bottom: 0.5vmin; padding: 0.3vmin 1vmin; min-height: 3.5vmin;">
    <span style="font-weight:bold; letter-spacing: 1px; white-space: nowrap; margin-right: 1vmin; font-size: ${isMobile ? '0.9em' : '1em'}; overflow: hidden; text-overflow: ellipsis;">${title}</span>
    <span style="display: flex; align-items: center; text-align: right; font-size: 0.85em; white-space: nowrap;">
        <span class="dos-instructions" style="${isMobile ? 'display:none;' : ''}">${instructionsHTML}</span>
        ${backBtn}
    </span>
</div><div style="font-size: 1.2em;">${contentHTML.trimStart()}</div>`;
    }
}

window.Renderer = new Renderer();
