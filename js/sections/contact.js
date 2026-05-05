// js/sections/contact.js

class SectionCertification {
    constructor() {
        this.certs = [
            { id: 1, title: 'Asisten Basis Data', url: 'https://drive.google.com/file/d/1qMl7SUakUq8fW-DVXx5wy0EhwVr5rzux/preview' },
            { id: 2, title: 'Unity Certified Associate: Game Developer', url: 'https://drive.google.com/file/d/1WEm9poxaDCFBn58CmfnDWVoc4LfDf-gJ/preview' },
            { id: 3, title: 'Game Seed', type: 'img', url: 'assets/img/game-seed.png' },
            { id: 4, title: 'AWS Certified Cloud Practitioner', type: 'img', url: 'assets/img/aws-cloud-practitioner.png', link: 'https://www.credly.com/badges/55f7f23f-acc6-40f1-a0cd-a3cb70e5db8e/public_url' },
            { id: 5, title: 'Machine Learning Terminology and Process', url: 'https://drive.google.com/file/d/1u5fq3eVU0_nh5FONoHzm6Cr_Tw2IhzT6/preview' },
            { id: 6, title: 'AWS re/Start Graduate', type: 'img', url: 'assets/img/aws-restart.png', link: 'https://www.credly.com/badges/210e19f0-0fb8-4055-b241-20978744c489/public_url' },
            { id: 7, title: 'Fundamentals of Machine Learning & AI', url: 'https://drive.google.com/file/d/1U2bKCxNZ11TE13CRJmRKNh6Ucdm7KFJE/preview' },
            { id: 8, title: 'Analyze Sentiment with Natural Language API', type: 'img', url: 'assets/img/analyze-sentiment.png', link: 'https://www.skills.google/public_profiles/104038eb-cdaa-4a54-8bf4-4d575ae2c783/badges/18365515' },
            { id: 9, title: 'App Building with AppSheet', type: 'img', url: 'assets/img/app-building-sheet.png', link: 'https://www.skills.google/public_profiles/104038eb-cdaa-4a54-8bf4-4d575ae2c783/badges/18360946' },
            { id: 10, title: 'Analyze Images with the Cloud Vision API', type: 'img', url: 'assets/img/cloud-vision.png', link: 'https://www.skills.google/public_profiles/104038eb-cdaa-4a54-8bf4-4d575ae2c783/badges/18364106' },
            { id: 11, title: 'Level 3: Terraform Essentials', type: 'img', url: 'assets/img/terraform-essential.png', link: 'https://www.skills.google/public_profiles/104038eb-cdaa-4a54-8bf4-4d575ae2c783/badges/17939079' },
            { id: 12, title: 'Level 3: Advanced App Operations', type: 'img', url: 'assets/img/advance-app-operation.png', link: 'https://www.skills.google/public_profiles/104038eb-cdaa-4a54-8bf4-4d575ae2c783/badges/17157037' },
            { id: 13, title: 'Level 2: Modern Application Deployment', type: 'img', url: 'assets/img/modern-app-deployment.png', link: 'https://www.skills.google/public_profiles/104038eb-cdaa-4a54-8bf4-4d575ae2c783/badges/17214897' },
            { id: 14, title: 'Skills Boost Arcade Certification July 2025', type: 'img', url: 'assets/img/july-certification.png', link: 'https://www.skills.google/public_profiles/104038eb-cdaa-4a54-8bf4-4d575ae2c783/badges/17255023' },
            { id: 15, title: 'Level 1: Core Infrastructure and Security', type: 'img', url: 'assets/img/infrastucture-and-security.png', link: 'https://www.skills.google/public_profiles/104038eb-cdaa-4a54-8bf4-4d575ae2c783/badges/17156466' },
            { id: 16, title: 'Asisten PBO', url: 'https://drive.google.com/file/d/15vhjDiam0VjkAbXjhOlbRkWxCNCavMmX/preview' }
        ];
        this.activeIndex = 0;
        this.keydownHandler = this.handleKeydown.bind(this);
    }

    async render() {
        window.MenuManager.state = 'section';
        document.addEventListener('keydown', this.keydownHandler);
        this.isFirstRender = true;
        await this.draw();
    }

    async draw() {
        let listHTML = `<div style="display:flex; flex-direction:column; gap: 1vmin; padding-right: 1vmin;">`;
        this.certs.forEach((cert, idx) => {
            const isSelected = this.activeIndex === idx;
            const cls = isSelected ? 'phosphor-highlight' : 'phosphor-amber';
            listHTML += `<div class="cert-item ${cls}" data-idx="${idx}" style="cursor:pointer; padding: 0.5vmin; font-size: 0.9em; border-radius: 2px; line-height: 1.2;">`;
            listHTML += `${idx === this.activeIndex ? '▼' : '▶'} ${cert.title}`;
            listHTML += `</div>`;
        });
        listHTML += `</div>`;

        const activeCert = this.certs[this.activeIndex];
        let displayHTML = '';
        if (activeCert.type === 'img') {
            displayHTML = `
<div style="flex: 1; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; padding-top: 1vmin; padding-right: 15%; border:2px solid #FFB000; text-align:center; box-sizing: border-box; position: relative; overflow: hidden;">
    <div style="position:relative; display:inline-block; margin-bottom: 2vmin; cursor:pointer;" onclick="window.open('${activeCert.link || activeCert.url}', '_blank')" title="Click to view original badge">
        <img src="${activeCert.url}" alt="${activeCert.title}" style="max-width: 90%; max-height: 60vmin; object-fit:contain; filter: grayscale(1) sepia(1) hue-rotate(15deg) saturate(2) brightness(0.9);" onerror="this.style.display='none'; document.getElementById('img-error-${this.activeIndex}').style.display='block';" />
        <div style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; background: linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.15) 50%); background-size: 100% 4px; opacity: 0.4;"></div>
    </div>
    <div id="img-error-${this.activeIndex}" style="display:none; color: #FFB000;">
        [ IMAGE NOT FOUND ]<br><br>
        Due to browser security, this badge cannot be displayed via iframe.<br>
        Please take a screenshot and save it to:<br>
        <strong style="color: #FFF;">${activeCert.url}</strong><br><br>
        ${activeCert.link ? `<a href="${activeCert.link}" target="_blank" style="color:#FFB000; text-decoration:underline;">Click here to view the original badge link</a>` : ''}
    </div>
</div>`;
        } else {
            displayHTML = `
<div style="flex: 1; position: relative; border:2px solid #FFB000; box-sizing: border-box; overflow: hidden; background: #050505;">
    <iframe src="${activeCert.url}" style="width:100%; height: calc(100% + 80px); border:none; margin-top: -60px; filter: grayscale(1) sepia(1) hue-rotate(15deg) saturate(2) brightness(0.8) blur(0.5px);"></iframe>
    <div style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; background: linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.25) 50%); background-size: 100% 4px; opacity: 0.6;"></div>
</div>`;
        }

        const contentHTML = `<style>
.cert-scroll-container::-webkit-scrollbar { width: 8px; }
.cert-scroll-container::-webkit-scrollbar-track { background: transparent; }
.cert-scroll-container::-webkit-scrollbar-thumb { background: #FFB000; opacity: 0.5; }
</style><div style="display:flex; flex-direction:row; height: 74vmin; width: 100%;">
    <div class="cert-scroll-container" style="flex: 1; overflow-y: auto; border-right: 2px solid #FFB000; padding-right: 2vmin; display:flex; flex-direction:column;">
        ${listHTML}
    </div>
    <div style="flex: 2; padding: 0 1vmin; display: flex; align-items: stretch; justify-content: center;">
        ${displayHTML}
    </div>
</div>`;

        const fullHTML = window.Renderer.createDOSBox("CERTIFICATIONS", contentHTML, "↑/↓: Select, ESC: Back");

        let previousScrollTop = 0;
        const existingContainer = document.querySelector('.cert-scroll-container');
        if (existingContainer) {
            previousScrollTop = existingContainer.scrollTop;
        }

        if (this.isFirstRender) {
            await window.Renderer.screenWipe(fullHTML);
            this.isFirstRender = false;
        } else {
            window.Renderer.setContent(fullHTML);
            const newContainer = document.querySelector('.cert-scroll-container');
            if (newContainer) {
                newContainer.scrollTop = previousScrollTop;
            }
        }

        setTimeout(() => {
            const container = document.querySelector('.cert-scroll-container');
            const activeItem = document.querySelector('.cert-item.phosphor-highlight');
            if (container && activeItem) {
                activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            document.querySelectorAll('.cert-item').forEach(el => {
                el.addEventListener('click', (e) => {
                    const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
                    this.activeIndex = idx;
                    window.Audio.playKeystroke();
                    this.draw();
                });
            });
        }, 50);
    }

    handleKeydown(e) {
        if (window.MenuManager.state !== 'section' || window.MenuManager.activeIndex !== 5) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.activeIndex = (this.activeIndex < this.certs.length - 1) ? this.activeIndex + 1 : 0;
            window.Audio.playKeystroke();
            this.draw();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.activeIndex = (this.activeIndex > 0) ? this.activeIndex - 1 : this.certs.length - 1;
            window.Audio.playKeystroke();
            this.draw();
        } else if (e.key === 'Escape') {
            document.removeEventListener('keydown', this.keydownHandler);
        }
    }
}

window.SectionCertification = new SectionCertification();
