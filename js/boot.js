// js/boot.js

class BootSequenceManager {
    constructor() {
        this.bootText = [
            "AMRSYS MODEL 9400 — BIOS v2.4.1",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
            "Detecting CPU............... Intel Core i7   OK",
            "PostGIS spatial drivers..... v3.3.2          OK",
            "OSRM routing engine......... v5.27.1         OK",
            "Mounting /projects.......... 6 items found   OK",
            "NATS message bus............ :4222           OK",
            "Unity ...................... 2025            OK",
            "gRPC services............... :50051          OK\n",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        ];
    }

    async start() {
        // We ensure Audio init is possible via a click anywhere
        const container = document.getElementById('terminal-content');

        // Show animated static first (Old TV effect)
        const staticDiv = document.createElement('div');
        staticDiv.style.cssText = `
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: url('assets/img/static-before-boot.png');
            background-size: cover;
            background-repeat: repeat;
            opacity: 0.7;
            mix-blend-mode: screen;
            z-index: 999;
            animation: staticScroll 0.15s linear infinite;
        `;

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes staticScroll {
                from { background-position-y: 0; }
                to { background-position-y: 512px; }
            }
        `;
        document.head.appendChild(style);
        container.appendChild(staticDiv);

        window.Audio.playStaticNoise(1.8);
        await new Promise(r => setTimeout(r, 1600));

        // Smooth transition: Fade out static
        staticDiv.style.transition = 'opacity 0.3s ease-out';
        staticDiv.style.opacity = '0';
        await new Promise(r => setTimeout(r, 300));

        staticDiv.remove();
        style.remove();
        container.innerHTML = '';

        // Brief "flicker" before boot starts
        document.body.style.filter = 'brightness(2) contrast(1.5)';
        await new Promise(r => setTimeout(r, 50));
        document.body.style.filter = '';
        await new Promise(r => setTimeout(r, 200));

        // Disable keyboard capture during boot
        document.getElementById('keyboard-capture').disabled = true;

        for (let i = 0; i < this.bootText.length; i++) {
            const line = this.bootText[i];
            const div = document.createElement('div');
            container.appendChild(div);

            // Type the line character by character
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                div.innerHTML += char === ' ' ? '&nbsp;' : char;

                // Play keystroke sound occasionally or for specific chars
                if (char !== ' ' && char !== '\n' && j % 2 === 0) {
                    window.Audio.playKeystroke();
                }

                // 20% faster than original (~80% of original delay)
                const delay = line.includes('━') ? 1 : 8 + Math.random() * 12;
                await new Promise(r => setTimeout(r, delay));
            }

            if (line.trim() !== "" && !line.includes('━')) {
                window.Audio.playBootBeep();
                // 20% faster than original (~80% of original delay)
                await new Promise(r => setTimeout(r, 160 + Math.random() * 320));
            } else {
                await new Promise(r => setTimeout(r, 40));
            }
        }

        // Draw progress bar
        const pbContainer = document.createElement('div');
        pbContainer.className = 'progress-bar-container';
        pbContainer.style.marginTop = '1vmin';
        container.appendChild(pbContainer);

        let progressStr = "[";
        for (let i = 0; i < 24; i++) {
            progressStr += " ";
        }
        progressStr += "] 0%";
        pbContainer.innerHTML = progressStr.replace(/ /g, '&nbsp;');

        for (let i = 1; i <= 24; i++) {
            await new Promise(r => setTimeout(r, 50));
            let str = "[";
            for (let j = 0; j < 24; j++) {
                if (j < i) str += "█";
                else str += "&nbsp;";
            }
            const pct = Math.floor((i / 24) * 100);
            str += `] ${pct}%`;
            pbContainer.innerHTML = str;

            // Play a sound every 2 steps during loading for more density
            if (i % 2 === 0) window.Audio.playBootBeep();
        }

        await new Promise(r => setTimeout(r, 500));
        window.Renderer.appendHTML(`<br><div class="phosphor-fade-in" style="cursor:pointer;">System ready. Press any key or click to continue...</div>`);

        // Wait for any key or click
        document.getElementById('keyboard-capture').disabled = false;
        document.getElementById('keyboard-capture').focus();

        const proceed = (e) => {
            if (e) e.stopImmediatePropagation();
            document.removeEventListener('keydown', proceed);
            document.removeEventListener('click', proceed);
            window.Audio.playEnter();
            window.MenuManager.showMenu();
        };

        document.addEventListener('keydown', proceed);
        document.addEventListener('click', proceed);
    }
}

window.BootManager = new BootSequenceManager();
