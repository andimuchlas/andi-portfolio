// js/menu.js

class MainMenuManager {
    constructor() {
        this.state = 'boot'; // boot, menu, section, subsection
        this.activeIndex = 1; // 1 to 5
        this.menuItems = [
            { id: 1, text: "PROFILE", handler: () => window.SectionProfile.render() },
            { id: 2, text: "EXPERIENCE", handler: () => window.SectionExperience.render() },
            { id: 3, text: "PROJECTS", handler: () => window.SectionProjects.render() },
            { id: 4, text: "SKILLS", handler: () => window.SectionSkills.render() },
            { id: 5, text: "CERTIFICATION", handler: () => window.SectionCertification.render() }
        ];

        this.keyboardHandler = this.handleKeydown.bind(this);
        this.clockInterval = null;
    }

    init() {
        document.addEventListener('keydown', this.keyboardHandler);
    }

    async showMenu(playSound = true) {
        this.state = 'menu';
        const menuHTML = this.generateMenuHTML();

        // Reset scroll to top
        const content = document.getElementById('terminal-content');
        if (content) content.scrollTop = 0;

        await window.Renderer.screenWipe(menuHTML, playSound);
        this.startClock();
        this.attachClickListeners();
    }

    generateMenuHTML() {
        const isMobile = window.innerWidth < 768;
        const itemsGap = isMobile ? '1vmin' : '1.5vmin';
        const itemsFontSize = isMobile ? '0.7em' : '0.9em';
        const asciiVisibility = isMobile ? 'display: none;' : '';
        const bioWidth = isMobile ? '90%' : '75%';
        const bioFontSize = isMobile ? '0.9em' : '1.05em';
        const bioGap = isMobile ? '2vmin' : '4vmin';

        let itemsHTML = `<div style="display: flex; gap: ${itemsGap}; justify-content: center; align-items: center; width: 100%; overflow: hidden; ${isMobile ? 'flex-wrap: wrap; padding: 1vmin 0;' : ''}">\n`;
        this.menuItems.forEach((item, index) => {
            const isActive = this.activeIndex === item.id;
            const selector = isActive ? '▶' : ' ';
            const activeClass = isActive ? 'menu-active-blink' : '';
            const fg = '#050505';
            itemsHTML += `<div class="menu-item ${activeClass}" data-id="${item.id}" style="font-size: ${itemsFontSize}; cursor: default; color: ${fg}; padding: 0.2vmin 0.5vmin; display: inline-flex; align-items: center; white-space: nowrap;"><span class="selector" style="color: ${fg}; margin-right: 0.5vmin;">${selector}</span>${item.text}</div>\n`;
            if (index < this.menuItems.length - 1 && !isMobile) {
                itemsHTML += `<span style="color: ${fg}; font-weight: bold;">|</span>\n`;
            }
        });
        itemsHTML += '</div>';

        const asciiAMR = `
  ░█████╗░███╗░░░███╗██████╗░
  ██╔══██╗████╗░████║██╔══██╗
  ███████║██╔████╔██║██████╔╝
  ██╔══██║██║╚██╔╝██║██╔══██╗
  ██║░░██║██║░╚═╝░██║██║░░██║
  ╚═╝░░╚═╝╚═╝░░░░╚═╝╚═╝░░╚═╝ `;

        const asciiHorizontal = `
⡿⢿⠛⣻⠿⢿⡿⢿⠿⠿⠻⠿⠿⢿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⡿⠿⠟⠟⠿⣿⣿⢿⣿⠿⣛⠟⡻⢿
⣿⣶⣲⣾⣯⣥⣈⡀⡀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⢀⢀⣁⣬⣽⣗⣶⣶⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠉⠻⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠉⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣶⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣦⣄⢀⠀⠀⠀⠀⠀⠉⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⠉⠀⠀⠀⠀⠀⡀⣠⣤⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⡿⠿⠿⠟⠛⠛⠛⠛⠛⠛⠛⠋⠁⠉⠓⠲⠄⢀⠀⠀⠀⠈⠈⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠁⠀⠀⠀⠀⠀⠠⠖⠚⠉⠈⠙⠋⠋⠛⠛⠛⠛⠛⠻⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⠟⠋⠀⠀⢀⠠⠆⠷⠄⠛⠹⠊⠓⠰⠆⡄⣀⣠⡀⠀⠀⠀⢰⣶⣴⣦⣦⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣽⣤⣴⡦⣦⠄⠀⠀⠀⠀⣄⣀⢠⠰⠖⠚⠱⠏⠚⠠⠿⠰⠄⡀⠀⠈⠙⠻⣿⣿⣿⣿
⡿⣿⣿⢷⣦⡝⠛⠽⠚⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠳⣤⡀⠀⠀⠈⠁⠈⠝⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠋⠀⠈⠁⠀⠀⢀⣦⠞⠈⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠐⠓⠯⠛⢣⣔⡾⣿⣿⢿
⣧⡙⢿⡏⠚⠌⠀⠀⣠⣴⣿⣿⡁⠀⠀⠀⠄⠀⠀⢀⠀⠀⣠⡈⢻⣴⡀⠀⠀⠀⠀⠀⠈⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠁⠀⠀⠀⠀⠀⢀⣦⡟⢁⣄⠀⠀⡀⠀⠀⠠⠀⠀⠀⢈⣿⣿⣶⣄⠀⠀⠩⠓⢼⠯⢋⣸
⣿⣷⣮⣁⣠⣤⣤⡄⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠈⠀⠀⣿⣷⣬⠙⢷⣤⡀⠀⠀⠀⠀⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⢀⣤⡞⢋⣡⣾⣿⠀⠀⠁⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⣀⣤⣤⣀⣨⣤⣾⣿
⣿⣿⣿⣯⢿⢿⠛⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣷⡀⠙⣿⣷⣾⣶⣄⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⣠⣶⣷⣷⣿⠏⢀⣾⣿⣿⣿⣧⡀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⠻⡻⣿⣽⣿⣿⣿
⣿⣿⣿⣿⣯⡓⠀⠘⠛⡿⣿⣿⣿⣿⣿⣶⣤⣤⣴⣶⣿⣿⣿⣿⣿⣯⣥⣬⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣬⣬⣼⣿⣿⣿⣿⣿⣶⣦⣤⣤⣶⣾⣿⣿⣿⣿⢿⠛⠈⠆⢺⣽⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣧⣧⡗⡜⣰⠀⡨⠙⠙⠙⠙⠿⠻⡿⠻⢙⣹⣿⣏⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣹⣿⡯⡏⡟⠻⠟⠿⠋⠋⠋⠉⢄⢈⣶⢣⢻⠸⣼⣿⣿
⣿⣿⣿⣿⣿⣿⣯⣷⣷⡆⢠⡇⡼⣆⣰⢰⢰⡅⣷⣰⣳⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣳⡿⣿⣿⣜⣯⣾⢀⡆⣤⣖⣸⣧⢸⡄⣤⣾⣾⣽⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⢥⣿⣾⣼⣟⣿⣽⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣿⣿⣽⣿⣿⣿⣿⣿⣿⣿`;

        const asciiStar = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣭⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣹⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⠤⢤⣀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⠴⠒⢋⣉⣀⣠⣄⣀⣈⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣾⣯⠴⠚⠉⠉⠀⠀⠀⠀⣤⠏⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡿⡇⠁⠀⠀⠀⠀⡄⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⡿⠿⢛⠁⠁⣸⠀⠀⠀⠀⠀⣤⣾⠵⠚⠁
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⢦⡀⠀⣠⠀⡇⢧⠀⠀⢀⣠⡾⡇⠀⠀⠀⠀⠀⣠⣴⠿⠋⠁⠀⠀⠀⠀⠘⣿⠀⣀⡠⠞⠛⠁⠂⠁⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡈⣻⡦⣞⡿⣷⠸⣄⣡⢾⡿⠁⠀⠀⠀⣀⣴⠟⠋⠁⠀⠀⠀⠀⠐⠠⡤⣾⣙⣶⡶⠃⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣂⡷⠰⣔⣾⣖⣾⡷⢿⣐⣀⣀⣤⢾⣋⠁⠀⠀⠀⣀⢀⣀⣀⣀⣀⠀⢀⢿⠑⠃⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠠⡦⠴⠴⠤⠦⠤⠤⠤⠤⠤⠴⠶⢾⣽⣙⠒⢺⣿⣿⣿⣿⢾⠶⣧⡼⢏⠑⠚⠋⠉⠉⡉⡉⠉⠉⠹⠈⠁⠉⠀⠨⢾⡂⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠀⠀⠀⠂⠐⠀⠀⠀⠈⣇⡿⢯⢻⣟⣇⣷⣞⡛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⣆⠀⠀⠀⠀⢠⡷⡛⣛⣼⣿⠟⠙⣧⠅⡄⠀⠀⠀⠀⠀⠀⠰⡆⠀⠀⠀⠀⢠⣾⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⢶⠏⠉⠀⠀⠀⠀⠀⠿⢠⣴⡟⡗⡾⡒⠖⠉⠏⠁⠀⠀⠀⠀⣀⢀⣠⣧⣀⣀⠀⠀⠀⠚⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣠⢴⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⣠⣧⢿⠋⠁⣿⡏⠅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⣿⢭⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⡴⢏⡵⠛⠀⠀⠀⠀⠀⠀⠀⣀⣴⠞⠛⠀⠀⠀⠀⢿⠀⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⢿⠘⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣀⣼⠛⣲⡏⠁⠀⠀⠀⠀⠀⢀⣠⡾⠋⠉⠀⠀⠀⠀⠀⠀⢾⡅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⡴⠟⠀⢰⡯⠄⠀⠀⠀⠀⣠⢴⠟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⣹⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⡾⠁⠁⠀⠘⠧⠤⢤⣤⠶⠏⠙⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢾⡃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠘⣇⠂⢀⣀⣀⠤⠞⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠈⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠾⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢼⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;

        const asciiStackOverflow = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣤⣶⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠈⣿⣿⣇⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢾⣿⣷⣄⠀⠀⢸⣿⣿⠀
⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠙⢿⣿⣧⡀⠈⣿⣿⣇
⠀⠀⠀⠀⠀⠀⢰⣿⣿⣦⣄⡀⠀⠻⣿⣿⣦⠸⠟⠛
⠀⠀⠀⠀⠀⠀⠀⠈⠛⠿⣿⣿⣷⣤⣈⠛⠁⠀⠀⠀
⠀⠀⠀⠀⠀⣿⣶⣶⣦⣤⣀⣙⡻⢿⠃⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠈⠉⠙⠛⠿⢿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀
⢠⣤⡄⠀⣿⣿⣿⣿⣿⣷⣶⣶⣿⠀⣤⣤⡄⠀⠀⠀
⢸⣿⡇⠀⣉⣉⣉⣉⣉⣛⣛⣛⣟⠀⣿⣿⡇⠀⠀⠀
⢸⣿⡇⠀⠿⠿⠿⠿⠿⠿⠿⠿⠿⠀⣿⣿⡇⠀⠀⠀
⢸⣿⣧⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣿⣿⡇⠀⠀⠀
⠸⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠇⠀⠀`;

        const asciiDocker = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⣤⣤⡤⣤⣤⣤⣤⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣾⢿⣟⣷⣿⣻⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣷⡿⣿⣻⣯⣿⢿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣽⡿⣿⣽⡿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠛⠛⠛⠛⠛⠛⠛⠛⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣟⣿⣿⣻⣿⢿⣿⠀⣿⣿⣿⢿⣿⣿⣿⣿⡄⣿⣿⣻⣟⣿⣻⣿⣻⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣽⣾⣳⡿⣽⣿⣻⠀⣿⡷⣿⣻⣷⢿⣾⣿⠀⣿⣿⣻⣿⣟⣿⡿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣳⣯⣿⣽⢿⣞⣿⠀⣿⣟⣿⣽⣿⣻⣷⣿⡀⣿⣿⣻⣷⡿⣟⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣯⣷⣟⣾⣿⣯⣿⠀⣿⣯⣿⣾⣿⣽⣷⣿⠀⣿⣿⣿⣽⣿⣿⣟⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣦⢄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⣀⣀⣀⠀⣉⣉⣉⣉⣉⣉⣈⣹⠄⣙⣉⣉⣉⣉⣉⣉⣹⠇⣉⣉⣉⣉⣉⣉⣉⣉⡁⣀⣀⣀⣀⣀⣀⣀⣀⡀⠀⠀⠀⢀⣾⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⡾⣷⣻⣾⣻⢾⣟⣾⠀⣿⡿⣾⣻⣯⡿⣟⣿⠀⣿⣿⡾⣟⣿⣻⣿⣿⠁⣿⣿⣿⣻⣿⣟⣿⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⣼⣿⣿⣿⣿⣿⣷⣗⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠸⣟⣷⣟⣷⣻⣯⣟⣿⠀⣿⡿⣽⡷⣟⣿⣟⣿⠀⣿⣷⣿⢿⣻⣟⣷⣿⠀⣿⣿⣽⣿⣯⣿⣿⣻⡇⢾⣿⣿⣾⣿⣿⣻⣿⡇⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣶⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⣟⣷⣻⢾⣯⢷⣟⣿⠀⣿⣻⢿⣽⣿⣻⣾⢿⠀⣿⣷⡿⣿⣟⣿⣯⣿⠀⣿⣿⡿⣷⣿⣿⣽⣿⡇⢻⣿⣿⣻⣿⣽⣿⣿⡇⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣽⣿⣽⣶⣆⣄⢀⠀⠀
⠀⠀⠀⠀⠀⠰⣿⣯⣿⣿⣾⣿⣿⣻⠀⣿⣿⣿⣿⣾⣿⣿⣿⠀⢿⣷⣿⣿⣿⣿⣿⣿⠄⢿⣿⣿⣿⣿⣾⣿⣿⠇⢽⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣦
⣖⣲⢖⣲⣒⣖⣲⣔⣲⣔⣲⣔⣲⣒⣶⣒⣦⣲⣔⣲⣔⣦⣲⣖⣖⣲⣆⡶⣔⣦⣒⣖⣶⣲⣲⡴⣆⣶⣴⣒⣶⣲⣖⡶⣴⢦⡶⣴⢦⡶⣴⣶⣲⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏
⣿⣽⣻⢯⡿⣽⣳⡿⣽⡾⣟⣾⢿⣽⡷⣿⢯⣷⣿⣻⣯⣿⢷⣿⣻⣿⣽⣿⡿⣟⣿⣿⣻⣿⣟⣿⣿⡿⣿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀
⣿⢾⣽⣻⣽⢿⣽⣻⣽⣟⡿⣽⡿⣯⣿⣻⣟⣿⡾⣿⣽⣾⣿⣻⣯⣿⣽⣾⣿⢿⣿⣽⣿⣯⣿⣿⣻⣿⣿⣟⣿⣿⣿⣟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠋⠁⠀⠀⠀
⣿⣟⣾⢯⣟⡿⣞⣯⣷⢿⣻⡿⣽⣟⣷⡿⣯⣷⣿⢿⣽⣷⣿⣻⣽⣯⣿⣷⣿⡿⣟⣯⣷⣿⣿⣽⣿⣿⣯⣿⣿⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠋⠋⠁⠀⠀⠀⠀⠀⠀⠀
⣿⣟⣾⢿⣽⣻⢿⣽⡾⣟⣯⣿⢿⣽⣾⣟⣿⣽⣾⡿⣿⣾⣟⣿⣯⣿⣷⡿⣯⣿⣿⡿⣟⣿⣾⣿⡿⣷⣿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣹⣿⣽⣻⣾⣻⣯⣷⢿⣟⣿⢾⣟⣿⢾⣻⣽⡿⣾⢿⣟⣷⣿⣯⣿⣷⡿⣿⣿⣟⣷⣿⣿⣿⢿⣻⣿⣿⣿⣟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠗⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠌⢿⣷⣻⢷⣻⣷⣻⣯⣿⢾⡿⣯⣿⢿⣻⣯⣿⢿⣿⣻⣿⢾⣟⣷⣿⢿⣿⣷⣿⡿⣯⣿⣾⣿⣿⣿⣿⣽⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠘⣿⣽⣟⡿⣞⣯⣷⢿⣻⣟⣿⣽⣿⣻⣽⣿⣻⣯⣿⣟⣿⣿⣻⣿⡿⣿⣾⣟⣿⣿⣿⢿⣻⣯⣷⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠘⣿⡾⣟⣿⢯⣿⣻⣯⣿⣻⣾⢿⣽⣿⢾⣿⣽⣷⡿⣿⣾⣿⣷⣿⣿⣯⣿⣿⢿⣾⣿⣿⣿⣿⣿⡿⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠈⣿⣿⣽⣿⣯⡟⣷⣿⣯⣿⡟⣿⣾⣿⣯⣿⣾⣿⣿⣷⣿⣿⣾⣿⣽⣿⣿⣿⣿⣿⡟⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠈⢻⣷⡿⣾⣟⣿⡷⣿⣯⣿⢿⣽⣷⡿⣯⣿⢿⣾⡿⣷⣿⣻⣽⣿⡿⣷⣿⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠯⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠙⠿⣯⣿⢷⣿⣟⣷⡿⣿⣻⣾⣿⢿⣻⣿⣟⣿⣿⣻⣿⣿⣻⣿⣿⣿⣽⣿⣿⣿⢿⣻⣿⣽⣿⣿⣿⣿⣿⡿⠟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠿⣿⣾⣟⣿⣟⣿⣷⡿⣿⣿⣯⣿⣿⣽⣿⣷⣿⣿⣟⣿⣾⣿⣿⣿⣾⣿⣿⣿⣿⣿⡟⠿⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠛⠿⢿⣿⣾⣿⣿⣷⣿⢿⣾⣿⣯⣿⣿⣽⣿⣿⣿⣿⣽⣿⣿⠿⠟⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠈⠉⠛⠛⠋⠛⠛⠛⠛⠛⠋⠛⠙⠛⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;

        const asciiGame = `
⠀⠀⠀⠀⢀⣠⣤⣴⣶⣶⣤⣤⡀⠉⠢⡀⠀⠀⠈⣠⣤⣤⣤⣤⠀⠀⠇⠀⠀⠀⣤⣤⣤⣤⣤⠀⠀⠏⣠⣤⣤⣤⣤⣤⠀⠀⢠⣤⣤⣤⣤⣤⣤⣤⣤⣤⠀⠀⢠⣤⣤⣤⠀⠀⡇
⠀⡀⢀⣴⣿⣿⣿⠿⠿⠿⢿⣿⡿⠃⠀⠱⠀⠀⣰⣿⣿⣿⣿⣿⡇⢀⢸⠀⠀⢰⣿⣿⣿⣿⣿⡇⠀⢠⣿⣿⣿⣿⣿⡇⠀⠀⣿⣿⣿⣿⣿⣿⠿⠿⠿⠏⠀⠀⣾⣿⣿⡏⠀⢸⠁
⡀⢠⣿⣿⣿⠏⠀⠀⠀⠀⠀⠉⠀⠀⠀⢶⠃⣼⣿⣿⡟⢹⣿⣿⣿⡏⠸⡄⡀⣼⣿⣿⣿⣿⣿⡇⢀⣿⣿⡏⣿⣿⣿⠁⠀⢠⣿⣿⣿⣇⣀⣀⣀⣀⠀⠀⠀⠀⣿⣿⣿⠁⠀⡏⠀
⢀⣿⣿⣿⡟⠀⠀⣼⣿⣿⣿⣿⣿⠀⠀⠁⣼⣿⣿⡟⠀⢸⣿⣿⣿⡅⠂⡷⢀⣿⣿⡟⣿⣿⣿⡇⣼⣿⡿⢸⣿⣿⡏⠀⠀⣸⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⢸⣿⣿⡏⠀⢰⠀⠀
⠘⣿⣿⣿⣧⠀⠀⠛⠛⢻⣿⣿⡏⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⡗⠀⠄⢸⣿⣿⠇⢻⣿⣿⣿⣿⡿⠁⣾⣿⣿⠃⠀⠀⣿⣿⣿⡏⠉⠉⠉⠉⠁⠀⠀⠀⠸⠟⠛⠁⠀⠮⠀⠀
⠀⠹⣿⣿⣿⣷⣤⣤⣴⣾⣿⣿⠃⢀⣾⣿⣿⣏⠍⠭⠟⠋⢻⣿⣿⣷⠶⠂⣿⣿⣿⠀⢸⣿⣿⣿⣿⠃⢨⣿⣿⣿⠀⠀⢸⣿⣿⣿⣷⣶⣶⣶⣶⣶⡆⠀⢰⣶⣶⣶⠀⠀⡇⠀⠀
⢆⠀⠙⠙⠛⠿⠿⠿⠿⠛⠋⠁⠀⠚⠛⠛⠋⠀⢠⠤⠤⡀⠘⠛⠛⠛⠀⠐⠛⠛⠋⠀⠘⠛⠛⠛⠃⠀⠘⠛⠛⠃⠀⠀⠚⠛⠛⠛⠛⠛⠛⠛⠛⠛⠀⠀⠚⠛⠛⠋⠀⢰⠀⠀⠀
⠀⠑⠤⢄⡀⠀⠀⠀⣀⣀⣄⣀⣀⣀⣀⣀⣀⡠⠃⠀⠀⣇⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⡀⠀⠀⠀`;


        return `
<div class="phosphor-highlight-inverse" style="display: flex; justify-content: space-between; align-items: center; padding: 0.5vmin 1vmin; min-height: 4vmin;">
    ${itemsHTML}
    <span id="real-time-clock" style="white-space: nowrap; font-size: 1.1em; font-weight: normal; margin-left: 2vmin; ${isMobile ? 'display: none;' : ''}">--:--:--</span>
</div>

<div style="position: relative; width: 100%; min-height: 75vmin; overflow: hidden; padding: 2vmin;">
    <!-- SCATTERED ASCII ART -->
    <pre class="anim-eyes phosphor-glow-bright" style="position: absolute; top: 2vmin; left: 5vmin; font-size: 0.7vmin; line-height: 1; color: #FFB000; opacity: 0.4; margin: 0;">${asciiStackOverflow}</pre>
    <pre class="anim-star phosphor-glow-bright" style="position: absolute; bottom: 8vmin; left: 8vmin; font-size: 0.5vmin; line-height: 1; color: #FFB000; opacity: 0.3; margin: 0;">${asciiDocker}</pre>
    <pre class="anim-star phosphor-glow-bright" style="position: absolute; top: 4vmin; right: 8vmin; font-size: 0.7vmin; line-height: 1; color: #FFB000; opacity: 0.5; margin: 0;">${asciiStar}</pre>
    <pre class="anim-eyes phosphor-glow-bright" style="position: absolute; bottom: 4vmin; right: 5vmin; font-size: 0.8vmin; line-height: 1; color: #FFB000; opacity: 0.3; margin: 0;">${asciiGame}</pre>
    <pre class="anim-eyes phosphor-glow-bright" style="position: absolute; bottom: 2vmin; left: 50%; transform: translateX(-50%); font-size: 0.45vmin; line-height: 1; color: #FFB000; opacity: 0.15; margin: 0; pointer-events: none; width: 100%; text-align: center;">${asciiHorizontal}</pre>

    <!-- CENTER CONTENT: AMR & BIO -->
    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; display: flex; flex-direction: column; align-items: center; text-align: center;">
        <pre class="phosphor-glow-bright" style="font-size: ${isMobile ? '1.8vmin' : '1.4vmin'}; line-height: 1; color: #FFB000; margin-bottom: 4vmin; opacity: 0.9; max-width: 100%; overflow: hidden;">${asciiAMR.trim()}</pre>
        
        <div style="font-size: ${bioFontSize}; line-height: 1.4; max-width: ${isMobile ? '90%' : '65ch'}; opacity: 0.9; text-align: justify; margin: 0 auto;">
Software engineer with a Computer Science background and 2 years experience across backend systems and Unity. I build scalable services using <span class="phosphor-amber">Go, OSRM, and PostGIS</span> for routing and spatial computation, and develop real-time simulations in <span class="phosphor-amber">Unity (C#)</span> for visualization. Experienced with <span class="phosphor-amber">gRPC, Redis</span>, and event-driven systems, focusing on performance, efficiency, and practical system design.
        </div>

        <div style="border-bottom: 1px solid #FFB000; opacity: 0.2; margin-top: ${bioGap}; width: ${bioWidth};"></div>
    </div>
</div>

<div class="retro-footer" style="margin-top: 2vmin; display: flex; justify-content: space-between; padding: 0 4vmin; font-size: 0.75em; opacity: 0.4;">
    <span>[1-5] Select   [M] Mute   [ESC] Back</span>
    <span>Bandung, ID - 2026</span>
</div>`;
    }

    updateMenuRender() {
        if (this.state !== 'menu') return;
        this.menuItems.forEach(item => {
            const el = document.querySelector(`.menu-item[data-id="${item.id}"]`);
            if (el) {
                const selectorEl = el.querySelector('.selector');
                if (this.activeIndex === item.id) {
                    el.classList.add('menu-active-blink');
                    if (selectorEl) {
                        selectorEl.innerText = '▶';
                    }
                } else {
                    el.classList.remove('menu-active-blink');
                    if (selectorEl) {
                        selectorEl.innerText = ' ';
                    }
                }
            }
        });

        const glass = document.querySelector('.screen-glass');
        if (glass) {
            glass.style.filter = 'brightness(0.8)';
            setTimeout(() => { glass.style.filter = ''; }, 60);
        }
    }

    startClock() {
        if (this.clockInterval) clearInterval(this.clockInterval);
        const updateClock = () => {
            const el = document.getElementById('real-time-clock');
            if (el) {
                const now = new Date();
                const h = now.getHours().toString().padStart(2, '0');
                const m = now.getMinutes().toString().padStart(2, '0');
                const s = now.getSeconds().toString().padStart(2, '0');
                el.innerText = `${h}:${m}:${s}`;
            }
        };
        updateClock();
        this.clockInterval = setInterval(updateClock, 1000);
    }

    handleKeydown(e) {
        window.Audio.init();

        if (e.key.toLowerCase() === 'm') {
            window.Audio.toggleMute();
            return;
        }

        if (this.state === 'menu') {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                this.activeIndex = this.activeIndex < 5 ? this.activeIndex + 1 : 1;
                window.Audio.playKeystroke();
                this.updateMenuRender();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                this.activeIndex = this.activeIndex > 1 ? this.activeIndex - 1 : 5;
                window.Audio.playKeystroke();
                this.updateMenuRender();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                window.Audio.playEnter();
                setTimeout(() => {
                    this.menuItems[this.activeIndex - 1].handler();
                }, 120);
            } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
                e.preventDefault();
                this.activeIndex = parseInt(e.key);
                window.Audio.playKeystroke();
                this.updateMenuRender();
                setTimeout(() => {
                    window.Audio.playEnter();
                    setTimeout(() => {
                        this.menuItems[this.activeIndex - 1].handler();
                    }, 120);
                }, 80);
            }
        } else if (this.state === 'section') {
            if (e.key === 'Escape') {
                e.preventDefault();
                window.Audio.playKeystroke();
                this.showMenu();
            }
        } else if (this.state === 'subsection') {
            if (e.key === 'Escape') {
                e.preventDefault();
                window.Audio.playKeystroke();
            }
        }
    }

    attachClickListeners() {
        document.querySelectorAll('.menu-item').forEach(el => {
            el.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                this.activeIndex = id;
                window.Audio.playKeystroke();
                this.updateMenuRender();
                setTimeout(() => {
                    window.Audio.playEnter();
                    this.menuItems[this.activeIndex - 1].handler();
                }, 100);
            });
        });
    }
}

window.MenuManager = new MainMenuManager();
document.addEventListener('DOMContentLoaded', () => {
    window.MenuManager.init();
});
