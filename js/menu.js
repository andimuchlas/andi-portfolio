// js/menu.js

class MainMenuManager {
    constructor() {
        this.menuItems = [
            { id: 1, text: "PROFILE", route: "/profile" },
            { id: 2, text: "EXPERIENCE", route: "/experience" },
            { id: 3, text: "PROJECTS", route: "/projects" },
            { id: 4, text: "SKILLS", route: "/skills" },
            { id: 5, text: "CERTIFICATION", route: "/certification" },
            { id: 6, text: "MORE PORTFOLIO ↗", route: "https://landing-page-porfolio-one.vercel.app/" }
        ];

        const activeFromUrl = this.getActiveIdFromURL();
        this.activeIndex = activeFromUrl > 0 ? activeFromUrl : 1;
        this.state = activeFromUrl > 0 ? 'section' : 'menu';

        this.keyboardHandler = this.handleKeydown.bind(this);
        this.clockInterval = null;
    }

    getActiveIdFromURL() {
        const path = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
        if (path === '/profile') return 1;
        if (path === '/experience') return 2;
        if (path === '/projects') return 3;
        if (path === '/skills') return 4;
        if (path === '/certification') return 5;
        return 0;
    }

    init() {
        document.addEventListener('keydown', this.keyboardHandler);
        this.startClock();
        this.attachClickListeners();
        this.initMuteButton();

        if (window.innerWidth >= 768) {
            const kc = document.getElementById('keyboard-capture');
            if (kc) kc.focus();
        }
    }

    trackPageView(path) {
        if (window.va) {
            window.va('track', 'pageview', { url: path });
            console.log(`Analytics: Tracked pageview to ${path}`);
        }
    }

    generateNavbarHTML(activeId = null) {
        if (activeId === null) {
            activeId = this.getActiveIdFromURL();
        }

        let itemsHTML = '';
        this.menuItems.forEach((item, index) => {
            const isActive = activeId === item.id;
            const selector = isActive ? '▶' : '&nbsp;';
            const activeClass = isActive ? 'active menu-active-blink' : '';
            const targetAttr = item.id === 6 ? 'target="_blank" rel="noopener noreferrer"' : '';
            
            itemsHTML += `<a href="${item.route}" ${targetAttr} class="dos-nav-link ${activeClass}" data-id="${item.id}">` +
                         `<span class="selector">${selector}</span>${item.text}</a>`;
            
            if (index < this.menuItems.length - 1) {
                itemsHTML += `<span class="dos-nav-separator">|</span>`;
            }
        });

        return `
<nav class="dos-navbar-container phosphor-highlight-inverse">
    <div class="dos-navbar-items">
        ${itemsHTML}
    </div>
    <div class="dos-nav-clock" id="real-time-clock">--:--:--</div>
</nav>`;
    }

    async showMenu(playSound = true) {
        this.state = 'menu';
        this.trackPageView('/');
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
        const bioWidth = isMobile ? '90%' : '75%';
        const bioFontSize = isMobile ? '0.9em' : '1.05em';
        const bioGap = isMobile ? '2vmin' : '4vmin';
        const navBarHTML = this.generateNavbarHTML(this.state === 'menu' ? this.activeIndex : 0);

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
${navBarHTML}

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
Software engineer with a Computer Science background and 3+ years experience building backend services, AI/ML pipelines, and real-time interactive systems. I architect scalable services using <span class="phosphor-amber">Go, TypeScript, PostGIS, and OSRM</span>, orchestrate models with <span class="phosphor-amber">PyTorch & Transformers</span>, and develop real-time simulations in <span class="phosphor-amber">Unity (C#)</span>. Experienced with <span class="phosphor-amber">Kubernetes, gRPC, NATS, and Redis</span>, focusing on performance, efficiency, and first-principles design.
        </div>

        <div style="border-bottom: 1px solid #FFB000; opacity: 0.2; margin-top: ${bioGap}; width: ${bioWidth};"></div>
    </div>
</div>

<div class="retro-footer" style="margin-top: 2vmin; display: flex; justify-content: space-between; padding: 0 4vmin; font-size: 0.75em; opacity: 0.5;">
    <span>[1-6] Select   [M] Mute   [ESC] Home</span>
    <span><a href="https://landing-page-porfolio-one.vercel.app/" target="_blank" rel="noopener noreferrer" style="color: #FFB000; text-decoration: none; border-bottom: 1px dashed #FFB000;">[ VIEW MODERN UI ↗ ]</a></span>
    <span>Bandung, ID - 2026</span>
</div>`;
    }

    updateMenuRender() {
        this.menuItems.forEach(item => {
            const el = document.querySelector(`.dos-nav-link[data-id="${item.id}"]`);
            if (el) {
                const selectorEl = el.querySelector('.selector');
                if (this.activeIndex === item.id) {
                    el.classList.add('active', 'menu-active-blink');
                    if (selectorEl) selectorEl.innerText = '▶';
                } else {
                    el.classList.remove('active', 'menu-active-blink');
                    if (selectorEl) selectorEl.innerHTML = '&nbsp;';
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

    initMuteButton() {
        const btnMute = document.getElementById('btn-mute');
        if (!btnMute) return;
        const muteIndicator = btnMute.querySelector('div');
        
        const updateMuteUI = (isMuted) => {
            if (!muteIndicator) return;
            if (isMuted) {
                muteIndicator.style.background = '#ff0000';
                muteIndicator.style.boxShadow = '0 0 8px #ff0000';
            } else {
                muteIndicator.style.background = '#FFB000';
                muteIndicator.style.boxShadow = '0 0 8px #FFB000';
            }
        };

        if (window.Audio) {
            updateMuteUI(window.Audio.muted);
        }

        btnMute.addEventListener('click', () => {
            if (!window.Audio) return;
            const muted = window.Audio.toggleMute();
            updateMuteUI(muted);
            btnMute.style.transform = "scale(0.9)";
            setTimeout(() => btnMute.style.transform = "scale(1)", 100);
        });
    }

    navigateToSection(id) {
        const item = this.menuItems.find(m => m.id === id);
        if (item) {
            this.trackPageView(item.route);
            if (id === 6) {
                window.open(item.route, "_blank");
                return;
            }
            window.location.href = item.route;
        }
    }

    handleKeydown(e) {
        if (window.Audio && !window.Audio.initialized) {
            window.Audio.init();
        }

        // Mute shortcut
        if (e.key && e.key.toLowerCase() === 'm') {
            if (document.activeElement.tagName !== 'INPUT' || document.activeElement.id === 'keyboard-capture') {
                const btnMute = document.getElementById('btn-mute');
                if (btnMute) btnMute.click();
                return;
            }
        }

        // Subsection escape handling (e.g. project detail)
        if (this.state === 'subsection') {
            if (e.key === 'Escape') {
                e.preventDefault();
                if (window.Audio) window.Audio.playKeystroke();
                if (window.SectionProjects) {
                    window.SectionProjects.drawList(true);
                    this.state = 'section';
                }
                return;
            }
        }

        // Quick number selection 1-6
        if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
            if (document.activeElement.tagName === 'INPUT' && document.activeElement.id !== 'keyboard-capture') {
                return;
            }
            e.preventDefault();
            const id = parseInt(e.key);
            this.activeIndex = id;
            if (window.Audio) window.Audio.playKeystroke();
            this.updateMenuRender();
            setTimeout(() => {
                if (window.Audio) window.Audio.playEnter();
                this.navigateToSection(id);
            }, 80);
            return;
        }

        // ESC navigation back to Home
        if (e.key === 'Escape') {
            const path = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
            if (path !== '' && path !== '/') {
                e.preventDefault();
                if (window.Audio) window.Audio.playKeystroke();
                window.location.href = '/';
                return;
            }
        }

        // Arrow keys on main menu (/)
        if (this.state === 'menu') {
            const maxItems = this.menuItems.length;
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                this.activeIndex = this.activeIndex < maxItems ? this.activeIndex + 1 : 1;
                if (window.Audio) window.Audio.playKeystroke();
                this.updateMenuRender();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                this.activeIndex = this.activeIndex > 1 ? this.activeIndex - 1 : maxItems;
                if (window.Audio) window.Audio.playKeystroke();
                this.updateMenuRender();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (window.Audio) window.Audio.playEnter();
                setTimeout(() => {
                    this.navigateToSection(this.activeIndex);
                }, 80);
            }
        }
    }

    attachClickListeners() {
        document.querySelectorAll('.dos-nav-link').forEach(el => {
            el.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                const item = this.menuItems.find(m => m.id === id);
                if (item) {
                    if (item.id === 6) {
                        if (window.Audio) window.Audio.playKeystroke();
                        return; // Let native link open external URL in new tab
                    }
                    e.preventDefault();
                    this.activeIndex = id;
                    if (window.Audio) window.Audio.playKeystroke();
                    this.updateMenuRender();
                    setTimeout(() => {
                        if (window.Audio) window.Audio.playEnter();
                        window.location.href = item.route;
                    }, 80);
                }
            });
        });
    }
}

window.MenuManager = new MainMenuManager();
document.addEventListener('DOMContentLoaded', () => {
    window.MenuManager.init();
});
