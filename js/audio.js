// js/audio.js

class AudioManager {
    constructor() {
        this.ctx = null;
        this.muted = false;
        // User must interact first before audio context can start
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.initialized = true;
        } catch (e) {
            console.warn("Web Audio API not supported", e);
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    playOscillator(freq, type, duration, vol = 0.1) {
        if (!this.initialized || this.muted || !this.ctx) return;
        
        // Resume if suspended (browser policy)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Envelope
        gainNode.gain.setValueAtTime(vol, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playKeystroke() {
        // Short oscillator with random pitch +/- 5Hz around 400Hz
        const baseFreq = 400;
        const variation = (Math.random() * 10) - 5;
        this.playOscillator(baseFreq + variation, 'square', 0.05, 0.05);
    }

    playEnter() {
        // Deeper, heavier click
        this.playOscillator(200, 'sawtooth', 0.1, 0.1);
    }

    playBootBeep() {
        // High pitched short beep
        this.playOscillator(1000, 'square', 0.08, 0.05);
    }

    playSectionWhoosh() {
        // A simulated whoosh using noise or a swept sine
        if (!this.initialized || this.muted || !this.ctx) return;
        
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = 'triangle';
        // Sweep frequency down
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);

        gainNode.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }

    playErrorBuzz() {
        // Discordant low buzz
        this.playOscillator(150, 'sawtooth', 0.2, 0.15);
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
