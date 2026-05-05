// js/renderer.js

class Renderer {
    constructor() {
        this.container = document.getElementById('terminal-content');
        this.wipeLayer = document.getElementById('wipe-transition-layer');
        this.isTyping = false;
    }

    // Completely replace content (used mainly by boot)
    setContent(html) {
        this.container.innerHTML = html;
    }

    // Append HTML
    appendHTML(html) {
        this.container.innerHTML += html;
        this.scrollToBottom();
    }

    scrollToBottom() {
        // The container doesn't scroll, the body does if overflow is allowed, 
        // but we are fixed. If we need scrolling inside terminal-content:
        this.container.scrollTop = this.container.scrollHeight;
    }

    // Typing animation for strings
    async typeText(text, containerElement, delayMs = 20) {
        this.isTyping = true;
        containerElement.innerHTML = '';
        
        for (let i = 0; i < text.length; i++) {
            // Check if we need to render HTML entities or newlines
            if (text[i] === '\n') {
                containerElement.innerHTML += '<br>';
            } else {
                // Add the phosphor fade-in class to individual characters or lines
                const span = document.createElement('span');
                span.textContent = text[i];
                span.className = 'phosphor-fade-in';
                containerElement.appendChild(span);
            }
            
            // Audio feedback
            if (text[i] !== ' ' && text[i] !== '\n') {
                if (i % 3 === 0) { // Don't play on every single char to avoid overloading
                    window.Audio.playKeystroke();
                }
            }
            
            await new Promise(r => setTimeout(r, delayMs));
        }
        this.isTyping = false;
    }

    // Wipes the screen, sets new HTML, and wipes back in
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
                }, 150); // Match CSS animation time
            }, 150); // Match CSS animation time
        });
    }

    createDOSBox(title, contentHTML, instructionsHTML = "Press [ESC] to back") {
        return `<div class="phosphor-highlight-inverse" style="display:flex; justify-content:space-between; margin-bottom: 0.5vmin;">
    <span style="font-weight:bold; letter-spacing: 2px;">${title}</span>
    <span>${instructionsHTML}</span>
</div><div style="font-size: 1.2em;">${contentHTML.trimStart()}</div>`;
    }
}

window.Renderer = new Renderer();
