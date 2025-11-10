/**
 * VELIN VINTAGE - Universal Theme System
 * 모든 페이지에서 공통으로 사용되는 테마 전환 스크립트
 * 
 * 사용법:
 * 1. 모든 HTML 파일의 </head> 바로 전에 이 스크립트를 포함시키세요
 * 2. nav-icons 섹션에 테마 토글 버튼을 추가하세요
 */

(function () {
    'use strict';

    // 테마 설정 상수
    const THEME_KEY = 'velinTheme';
    const THEMES = {
        DARK: 'dark',
        LIGHT: 'light'
    };

    // 라이트 테마 CSS 변수 정의
    const lightThemeStyles = {
        // Background colors
        '--bg-primary': '#ffffff',
        '--bg-secondary': '#f8f9fa',
        '--bg-tertiary': '#e9ecef',
        '--bg-card': '#ffffff',
        '--bg-hover': '#f1f3f5',

        // Text colors
        '--text-primary': '#0a0a0a',
        '--text-secondary': '#495057',
        '--text-tertiary': '#6c757d',
        '--text-muted': '#adb5bd',

        // Border colors
        '--border-primary': '#dee2e6',
        '--border-secondary': '#e9ecef',
        '--border-hover': '#adb5bd',

        // Accent colors (동일하게 유지)
        '--accent-primary': '#0a0a0a',
        '--accent-secondary': '#fff',
        '--accent-red': '#f87171',
        '--accent-green': '#4ade80',
        '--accent-yellow': '#fbbf24',

        // Shadow
        '--shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
        '--shadow-md': '0 4px 16px rgba(0, 0, 0, 0.12)',
        '--shadow-lg': '0 10px 30px rgba(0, 0, 0, 0.15)',

        // Special
        '--overlay-bg': 'rgba(0, 0, 0, 0.3)',
        '--glass-bg': 'rgba(255, 255, 255, 0.95)',
    };

    // 다크 테마 CSS 변수 정의
    const darkThemeStyles = {
        // Background colors
        '--bg-primary': '#0a0a0a',
        '--bg-secondary': '#111',
        '--bg-tertiary': '#1a1a1a',
        '--bg-card': '#111',
        '--bg-hover': '#151515',

        // Text colors
        '--text-primary': '#fff',
        '--text-secondary': '#888',
        '--text-tertiary': '#666',
        '--text-muted': '#555',

        // Border colors
        '--border-primary': '#222',
        '--border-secondary': '#1a1a1a',
        '--border-hover': '#333',

        // Accent colors
        '--accent-primary': '#fff',
        '--accent-secondary': '#000',
        '--accent-red': '#f87171',
        '--accent-green': '#4ade80',
        '--accent-yellow': '#fbbf24',

        // Shadow
        '--shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.3)',
        '--shadow-md': '0 5px 20px rgba(0, 0, 0, 0.5)',
        '--shadow-lg': '0 10px 30px rgba(0, 0, 0, 0.8)',

        // Special
        '--overlay-bg': 'rgba(0, 0, 0, 0.6)',
        '--glass-bg': 'rgba(10, 10, 10, 0.95)',
    };

    /**
     * CSS 변수를 DOM에 적용
     */
    function applyCSSVariables(theme) {
        const root = document.documentElement;
        const styles = theme === THEMES.LIGHT ? lightThemeStyles : darkThemeStyles;

        Object.entries(styles).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
    }

    /**
     * 테마 클래스를 body에 적용
     */
    function applyThemeClass(theme) {
        document.body.classList.remove('theme-dark', 'theme-light');
        document.body.classList.add(`theme-${theme}`);
        document.body.setAttribute('data-theme', theme);
    }

    /**
     * 저장된 테마 불러오기
     */
    function getSavedTheme() {
        return localStorage.getItem(THEME_KEY) || THEMES.DARK;
    }

    /**
     * 테마 저장하기
     */
    function saveTheme(theme) {
        localStorage.setItem(THEME_KEY, theme);
    }

    /**
     * 테마 전환 애니메이션
     */
    function animateThemeTransition() {
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    /**
     * 테마 전환 함수
     */
    function toggleTheme() {
        const currentTheme = getSavedTheme();
        const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;

        animateThemeTransition();
        applyCSSVariables(newTheme);
        applyThemeClass(newTheme);
        saveTheme(newTheme);
        updateThemeIcon(newTheme);

        // 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    }

    /**
     * 테마 아이콘 업데이트
     */
    function updateThemeIcon(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = theme === THEMES.LIGHT ? '🌙' : '☀️';
            themeToggle.setAttribute('aria-label',
                theme === THEMES.LIGHT ? 'Switch to dark mode' : 'Switch to light mode'
            );
        }
    }

    /**
     * 테마 토글 버튼 생성 및 삽입
     */
    function initializeThemeToggle() {
        const navIcons = document.querySelector('.nav-icons');
        if (!navIcons) return;

        // 이미 존재하는지 확인
        if (document.getElementById('themeToggle')) return;

        const currentTheme = getSavedTheme();

        // 테마 토글 버튼 생성
        const themeToggle = document.createElement('span');
        themeToggle.id = 'themeToggle';
        themeToggle.className = 'theme-toggle';
        themeToggle.textContent = currentTheme === THEMES.LIGHT ? '🌙' : '☀️';
        themeToggle.setAttribute('aria-label',
            currentTheme === THEMES.LIGHT ? 'Switch to dark mode' : 'Switch to light mode'
        );
        themeToggle.style.cursor = 'pointer';
        themeToggle.style.fontSize = '18px';
        themeToggle.style.transition = 'transform 0.3s ease';

        themeToggle.addEventListener('click', toggleTheme);
        themeToggle.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.2)';
        });
        themeToggle.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });

        // SEARCH 버튼 다음에 삽입
        const searchBtn = Array.from(navIcons.children).find(el =>
            el.textContent.includes('SEARCH')
        );

        if (searchBtn) {
            searchBtn.insertAdjacentElement('afterend', themeToggle);
        } else {
            navIcons.insertBefore(themeToggle, navIcons.firstChild);
        }
    }

    /**
     * 추가 스타일 주입 (CSS 변수를 사용하도록 변환하는 스타일)
     */
    function injectThemeStyles() {
        const styleId = 'velin-theme-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* 테마 전환을 위한 CSS 변수 기반 스타일 */
            body {
                background: var(--bg-primary) !important;
                color: var(--text-primary) !important;
            }

            /* Header */
            header {
                background: var(--glass-bg) !important;
                border-bottom-color: var(--border-primary) !important;
            }

            .top-banner {
                background: linear-gradient(90deg, var(--bg-tertiary), var(--bg-secondary)) !important;
                border-bottom-color: var(--border-secondary) !important;
            }

            .logo, .nav-links a {
                color: var(--text-primary) !important;
            }

            .nav-links a:hover {
                color: var(--text-secondary) !important;
            }

            .nav-links a::after {
                background: var(--text-primary) !important;
            }

            .nav-icons span {
                color: var(--text-primary) !important;
            }

            .nav-icons span:hover {
                color: var(--text-secondary) !important;
            }

            /* Cards & Containers */
            .product-card,
            .market-card,
            .brand-card,
            .cart-items,
            .cart-summary,
            .profile-header,
            .stat-card,
            .product-details,
            .chart-section,
            .value-index,
            .price-section {
                background: var(--bg-card) !important;
                border-color: var(--border-primary) !important;
            }

            .product-card:hover,
            .market-card:hover,
            .brand-card:hover {
                background: var(--bg-hover) !important;
                border-color: var(--border-hover) !important;
            }

            /* Text Colors */
            .product-brand,
            .item-brand,
            .stat-label,
            .summary-label,
            .trend-label,
            .detail-label,
            .breadcrumb,
            .form-label {
                color: var(--text-secondary) !important;
            }

            .item-details,
            .profile-joined,
            .empty-state-text {
                color: var(--text-tertiary) !important;
            }

            /* Borders */
            .cart-item,
            .summary-divider,
            .footer-bottom,
            .profile-tabs {
                border-color: var(--border-primary) !important;
            }

            /* Inputs */
            .form-input,
            .promo-input,
            .newsletter-input,
            .search-panel input[type="search"] {
                background: var(--bg-tertiary) !important;
                border-color: var(--border-secondary) !important;
                color: var(--text-primary) !important;
            }

            .form-input:focus,
            .promo-input:focus,
            .newsletter-input:focus {
                background: var(--bg-hover) !important;
                border-color: var(--text-primary) !important;
            }

            .form-input::placeholder,
            .promo-input::placeholder,
            .newsletter-input::placeholder,
            .search-panel input::placeholder {
                color: var(--text-muted) !important;
            }

            /* Buttons */
            .checkout-btn,
            .btn-primary,
            .btn-save,
            .btn-signup,
            .newsletter-submit {
                background: var(--accent-primary) !important;
                color: var(--accent-secondary) !important;
                border-color: var(--accent-primary) !important;
            }

            .checkout-btn:hover,
            .btn-primary:hover,
            .btn-save:hover,
            .btn-signup:hover,
            .newsletter-submit:hover {
                background: transparent !important;
                color: var(--accent-primary) !important;
            }

            .continue-shopping,
            .btn-secondary,
            .edit-profile-btn {
                background: transparent !important;
                color: var(--text-primary) !important;
                border-color: var(--text-primary) !important;
            }

            .continue-shopping:hover,
            .btn-secondary:hover,
            .edit-profile-btn:hover {
                background: var(--accent-primary) !important;
                color: var(--accent-secondary) !important;
            }

            .filter-btn,
            .chart-btn,
            .option-btn {
                background: transparent !important;
                color: var(--text-secondary) !important;
                border-color: var(--border-secondary) !important;
            }

            .filter-btn:hover,
            .filter-btn.active,
            .chart-btn:hover,
            .chart-btn.active,
            .option-btn:hover,
            .option-btn.selected {
                background: var(--accent-primary) !important;
                color: var(--accent-secondary) !important;
                border-color: var(--accent-primary) !important;
            }

            /* Search Panel */
            .search-overlay.active {
                background: var(--overlay-bg) !important;
            }

            .search-panel {
                background: var(--bg-primary) !important;
                border-left-color: var(--border-primary) !important;
            }

            .search-item {
                border-bottom-color: var(--border-secondary) !important;
            }

            .search-item:hover {
                background: var(--bg-hover) !important;
                color: var(--text-primary) !important;
            }

            .search-empty {
                color: var(--text-secondary) !important;
            }

            /* Modal */
            .modal {
                background: var(--overlay-bg) !important;
            }

            .modal-content,
            .signup-box,
            .login-box {
                background: var(--glass-bg) !important;
                border-color: var(--border-primary) !important;
            }

            /* Footer */
            footer {
                background: var(--bg-tertiary) !important;
                border-top-color: var(--border-primary) !important;
            }

            .footer-column ul li a {
                color: var(--text-tertiary) !important;
            }

            .footer-column ul li a:hover {
                color: var(--text-primary) !important;
            }

            .footer-bottom {
                color: var(--text-muted) !important;
            }

            /* Images & Media */
            .product-image,
            .main-image,
            .item-image,
            .similar-image,
            .thumbnail,
            .lookbook-image {
                background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%) !important;
            }

            /* Tabs */
            .tab,
            .tab-btn {
                color: var(--text-tertiary) !important;
            }

            .tab.active,
            .tab-btn.active {
                color: var(--text-primary) !important;
                border-bottom-color: var(--text-primary) !important;
            }

            /* Special Elements */
            .empty-state {
                background: var(--bg-card) !important;
                border-color: var(--border-primary) !important;
            }

            .announcement-item {
                background: var(--bg-card) !important;
                border-color: var(--border-primary) !important;
            }

            /* Chart */
            .chart-container {
                background: var(--bg-tertiary) !important;
                border-color: var(--border-secondary) !important;
                color: var(--text-tertiary) !important;
            }

            /* Light theme specific adjustments */
            .theme-light .hero {
                background: linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.6)),
                    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect fill="%23f8f9fa" width="1920" height="1080"/><text x="50%" y="50%" font-size="200" fill="%23e9ecef" text-anchor="middle" font-family="Arial Black">STREET</text></svg>') !important;
            }

            .theme-light .bg-animation::before {
                background: radial-gradient(circle, rgba(0, 0, 0, 0.03) 1px, transparent 1px) !important;
            }

            .theme-light .product-badge,
            .theme-light .product-badge-tag {
                background: var(--text-primary) !important;
                color: var(--bg-primary) !important;
            }

            .theme-light .cart-badge {
                background: var(--text-primary) !important;
                color: var(--bg-primary) !important;
            }

            /* Smooth transitions for theme changes */
            * {
                transition: background-color 0.3s ease, 
                           border-color 0.3s ease, 
                           color 0.3s ease !important;
            }

            /* Preserve existing color classes */
            .product-gain.up,
            .trend-value.up,
            .market-change.up,
            .price-trend.up,
            .strength-text.strong {
                color: var(--accent-green) !important;
            }

            .product-gain.down,
            .trend-value.down,
            .market-change.down,
            .price-trend.down,
            .remove-btn,
            .logout-btn,
            .strength-text.weak {
                color: var(--accent-red) !important;
            }

            .strength-text.medium {
                color: var(--accent-yellow) !important;
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * 초기화 함수
     */
    function initialize() {
        // 저장된 테마 불러오기
        const savedTheme = getSavedTheme();

        // CSS 변수 및 클래스 적용
        applyCSSVariables(savedTheme);
        applyThemeClass(savedTheme);

        // 추가 스타일 주입
        injectThemeStyles();

        // DOM이 로드되면 토글 버튼 생성
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeThemeToggle);
        } else {
            initializeThemeToggle();
        }
    }

    // 전역 함수로 노출
    window.VELIN_THEME = {
        toggle: toggleTheme,
        getCurrent: getSavedTheme,
        set: function (theme) {
            if (theme === THEMES.LIGHT || theme === THEMES.DARK) {
                applyCSSVariables(theme);
                applyThemeClass(theme);
                saveTheme(theme);
                updateThemeIcon(theme);
            }
        },
        THEMES: THEMES
    };

    // 초기화 실행
    initialize();

})();

/**
 * 사용 예시:
 * 
 * // 프로그래밍 방식으로 테마 전환
 * window.VELIN_THEME.toggle();
 * 
 * // 특정 테마 설정
 * window.VELIN_THEME.set('light');
 * window.VELIN_THEME.set('dark');
 * 
 * // 현재 테마 가져오기
 * const currentTheme = window.VELIN_THEME.getCurrent();
 * 
 * // 테마 변경 이벤트 리스닝
 * window.addEventListener('themeChanged', (e) => {
 *     console.log('Theme changed to:', e.detail.theme);
 * });
 */