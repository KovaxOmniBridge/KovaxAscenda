// ============================================
// THEME APPLICATION
// ============================================

const themes = {
    blue: 'theme-blue',
    green: 'theme-green',
    purple: 'theme-purple',
    red: 'theme-red',
    orange: 'theme-orange',
    pink: 'theme-pink',
    teal: 'theme-teal',
    indigo: 'theme-indigo',
    yellow: 'theme-yellow',
    dark: 'theme-dark'
};

const heroGradients = [
    'hero-gradient-1',
    'hero-gradient-2',
    'hero-gradient-3',
    'hero-gradient-4',
    'hero-gradient-5',
    'hero-gradient-6',
    'hero-gradient-7',
    'hero-gradient-8'
];

const layouts = {
    modern: 'layout-modern',
    classic: 'layout-classic',
    minimal: 'layout-minimal'
};

const fonts = {
    modern: 'font-modern',
    classic: 'font-classic',
    playful: 'font-playful'
};

function applyTheme(settings) {
    const body = document.body;
    
    // Remove all existing theme classes
    Object.values(themes).forEach(theme => body.classList.remove(theme));
    Object.values(layouts).forEach(layout => body.classList.remove(layout));
    Object.values(fonts).forEach(font => body.classList.remove(font));
    heroGradients.forEach(gradient => {
        const hero = document.getElementById('siteHero');
        if (hero) hero.classList.remove(gradient);
    });

    // Apply selected theme
    if (settings.theme && themes[settings.theme]) {
        body.classList.add(themes[settings.theme]);
    }

    // Apply hero gradient
    if (settings.heroGradient) {
        const hero = document.getElementById('siteHero');
        if (hero) hero.classList.add(settings.heroGradient);
    }

    // Apply layout
    if (settings.layout && layouts[settings.layout]) {
        body.classList.add(layouts[settings.layout]);
    }

    // Apply font
    if (settings.font && fonts[settings.font]) {
        body.classList.add(fonts[settings.font]);
    }

    // Apply custom colors if provided
    if (settings.customColors) {
        applyCustomColors(settings.customColors);
    }
}

function applyCustomColors(colors) {
    const root = document.documentElement;
    
    if (colors.primary) {
        root.style.setProperty('--primary-color', colors.primary);
    }
    if (colors.secondary) {
        root.style.setProperty('--secondary-color', colors.secondary);
    }
    if (colors.accent) {
        root.style.setProperty('--accent-color', colors.accent);
    }
}

function getRandomTheme() {
    const themeKeys = Object.keys(themes);
    const randomIndex = Math.floor(Math.random() * themeKeys.length);
    return themeKeys[randomIndex];
}

function getRandomHeroGradient() {
    const randomIndex = Math.floor(Math.random() * heroGradients.length);
    return heroGradients[randomIndex];
}

// Export for use in main.js
window.themeManager = {
    applyTheme,
    applyCustomColors,
    getRandomTheme,
    getRandomHeroGradient,
    themes,
    heroGradients,
    layouts,
    fonts
};
