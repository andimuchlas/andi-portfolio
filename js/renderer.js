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

    createDOSBox(title, contentHTML, instructionsHTML = "Press [ESC] to back") {
        const isMobile = window.innerWidth < 768;
        const backBtn = isMobile ? `<span class="back-btn-mobile" onclick="window.MenuManager.showMenu()" style="cursor:pointer; border: 1px solid #FFB000; padding: 0 1.5vmin; background: transparent; color: #FFB000; font-weight: bold; margin-left: 2vmin; font-size: 0.8em;">BACK</span>` : "";
        
        return `<div class="phosphor-highlight-inverse" style="display:flex; justify-content:space-between; align-items: center; margin-bottom: 0.5vmin; padding: 0.2vmin 1vmin; min-height: 3.5vmin;">
    <span style="font-weight:bold; letter-spacing: 2px; white-space: nowrap; margin-right: 2vmin;">${title}</span>
    <span style="display: flex; align-items: center; text-align: right; font-size: 0.85em;">${instructionsHTML}${backBtn}</span>
</div><div style="font-size: 1.2em;">${contentHTML.trimStart()}</div>`;
    }
}

window.Renderer = new Renderer();
