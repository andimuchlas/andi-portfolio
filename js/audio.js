// js/audio.js

class AudioManager {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.initialized = false;
        this.loadingPromise = null;
        this.buffers = {};
        this.masterGain = null;
    }

    async init() {
        if (this.loadingPromise) return this.loadingPromise;
        
        this.loadingPromise = (async () => {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioContext();
                
                this.masterGain = this.ctx.createGain();
                this.masterGain.connect(this.ctx.destination);
                
                // Preload sounds and wait for them
                await Promise.all([
                    this.loadSound('click', 'assets/audio/click-sound.mp3'),
                    this.loadSound('boot', 'assets/audio/old-desktop-pc-booting.mp3')
                ]);
                
                this.initialized = true;
                console.log("Audio assets loaded successfully.");
            } catch (e) {
                console.warn("Web Audio API not supported", e);
            }
        })();

        return this.loadingPromise;
    }

    async loadSound(name, url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            this.buffers[name] = await this.ctx.decodeAudioData(arrayBuffer);
        } catch (e) {
            console.error(`Failed to load sound: ${url}`, e);
        }
    }

    playSoundBuffer(name, volume = 0.5, loop = false, offset = 0) {
        if (!this.initialized || !this.ctx || !this.buffers[name]) return null;

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const source = this.ctx.createBufferSource();
        source.buffer = this.buffers[name];
        source.loop = loop;

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);

        source.connect(gainNode);
        gainNode.connect(this.masterGain);

        source.start(0, offset);
        return { source, gainNode };
    }

    playClick() {
        this.playSoundBuffer('click', 0.6);
    }

    playBoot() {
        // Start playing the long boot sound from 0, but loop from 20s onwards
        const boot = this.playSoundBuffer('boot', 0.35, true, 0);
        if (boot) {
            boot.source.loopStart = 20;
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.masterGain) {
            // Smoothly fade in/out to avoid pops
            const targetGain = this.muted ? 0 : 1;
            this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
        }
        
        // Optional: Play a small beep if unmuting
        if (!this.muted && this.initialized) {
            this.playOscillator(440, 'sine', 0.05, 0.05);
        }
        
        return this.muted;
    }

    playOscillator(freq, type, duration, vol = 0.1) {
        if (!this.initialized || !this.ctx) return;
        
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gainNode.gain.setValueAtTime(vol, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playKeystroke() {
        /* PREVIOUS SYNTHETIC SOUND:
        const baseFreq = 400;
        const variation = (Math.random() * 10) - 5;
        this.playOscillator(baseFreq + variation, 'square', 0.05, 0.05);
        */
        this.playSoundBuffer('click', 0.25);
    }

    playEnter() {
        /* PREVIOUS SYNTHETIC SOUND:
        this.playOscillator(200, 'sawtooth', 0.1, 0.1);
        */
        this.playSoundBuffer('click', 0.6);
    }

    playBootBeep() {
        // High pitched short beep (Restored for progress bar)
        this.playOscillator(1000, 'square', 0.08, 0.05);
    }

    playSectionWhoosh() {
        /* PREVIOUS SYNTHETIC SOUND:
        if (!this.initialized || this.muted || !this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
        */
        this.playSoundBuffer('click', 0.4);
    }

    playErrorBuzz() {
        /* PREVIOUS SYNTHETIC SOUND:
        this.playOscillator(150, 'sawtooth', 0.2, 0.15);
        */
        this.playSoundBuffer('click', 0.8);
    }

    playCopyDoubleBeep() {
        this.playOscillator(800, 'square', 0.05, 0.1);
        setTimeout(() => {
            this.playOscillator(800, 'square', 0.05, 0.1);
        }, 100);
    }

    playStaticNoise(duration = 0.5) {
        if (!this.initialized || this.muted || !this.ctx) return;
        
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        noise.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
    }
}

window.Audio = new AudioManager();
