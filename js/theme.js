/**
 * Theme Manager — Dark theme only
 */
const ThemeManager = {
    init() {
        document.documentElement.setAttribute('data-theme', 'dark');
    },

    get() {
        return 'dark';
    }
};

ThemeManager.init();
