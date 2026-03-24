function googleTranslateElementInit() {
    const pageLanguage = (document.documentElement.lang || 'en').trim();
    new google.translate.TranslateElement({
        pageLanguage,
        includedLanguages: 'en,ja,ko,zh-CN,zh-TW,vi,th', 
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}

const SEOULMATE_LANG_KEY = 'seoulmate_preferred_lang';

function savePreferredLanguage(langCode) {
    try {
        localStorage.setItem(SEOULMATE_LANG_KEY, langCode);
    } catch (error) {
        console.warn('Unable to persist preferred language', error);
    }
}

function loadPreferredLanguage() {
    try {
        return localStorage.getItem(SEOULMATE_LANG_KEY) || 'en';
    } catch (error) {
        console.warn('Unable to read preferred language', error);
        return 'en';
    }
}

function normalizeLanguageCode(langCode) {
    if (!langCode) return 'en';

    const normalized = String(langCode).trim().toLowerCase();
    if (normalized === 'zh' || normalized === 'zh-tw') return 'zh-TW';
    if (normalized === 'zh-cn') return 'zh-CN';
    if (normalized === 'kr' || normalized === 'ko') return 'ko';
    if (normalized === 'jp' || normalized === 'ja') return 'ja';
    return normalized;
}

function getShortLanguageLabel(langCode) {
    const normalized = normalizeLanguageCode(langCode);
    if (normalized === 'zh-TW' || normalized === 'zh-CN') return 'ZH';
    if (normalized === 'ko') return 'KR';
    if (normalized === 'ja') return 'JP';
    return 'EN';
}

function applyGoogleTranslateLanguage(langCode) {
    const normalized = normalizeLanguageCode(langCode);
    const gtSelect = document.querySelector('.goog-te-combo');
    if (!gtSelect) return false;

    gtSelect.value = normalized;
    gtSelect.dispatchEvent(new Event('change'));
    return true;
}

function restorePreferredLanguage(currentLangText, options, languages) {
    const preferred = normalizeLanguageCode(loadPreferredLanguage());
    const pageLanguage = normalizeLanguageCode(document.documentElement.lang || 'en');
    const matchedLanguage = languages.find((lang) => lang.code === preferred);

    // UI 狀態先更新
    currentLangText.innerText = matchedLanguage ? matchedLanguage.name : 'English (US)';
    options.forEach((option) => {
        option.classList.toggle('selected', option.dataset.lang === preferred);
    });

    // 如果沒找到語言或已經是該語言就不用切換
    if (!matchedLanguage || preferred === pageLanguage) {
        return;
    }

    // 等待 Google 翻譯元件載入並重試切換語言
    let attempts = 0;
    const maxAttempts = 30;
    const trySwitch = () => {
        attempts += 1;
        if (applyGoogleTranslateLanguage(preferred)) {
            // 切換成功
            return;
        }
        if (attempts < maxAttempts) {
            setTimeout(trySwitch, 300);
        } else {
            console.warn('自動切換語言失敗，請手動選擇語言');
        }
    };
    setTimeout(trySwitch, 300);
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. 隱藏醜陋的 Google 原生元件，並加入頂級浮雕玻璃質感樣式
    const style = document.createElement('style');
    style.innerHTML = `
        #google_translate_element { display: none !important; opacity: 0; pointer-events: none; }
        .goog-te-banner-frame { display: none !important; }
        body { top: 0 !important; }
        .skiptranslate { display: none !important; }

        /* 高質感翻譯按鈕系統 */
        #luxe-lang-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 2000000000;
            font-family: 'DM Sans', 'SF Pro Display', sans-serif;
        }

        #luxe-lang-btn {
            background: #08080a;
            border: 1px solid rgba(255,255,255,0.1);
            color: #ffffff;
            padding: 10px 18px;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        #luxe-lang-btn:hover {
            transform: translateY(-3px);
            background: #121214;
            box-shadow: 0 12px 40px rgba(0,0,0,0.6);
            border-color: var(--c2);
        }

        #luxe-lang-btn .material-symbols-outlined {
            font-size: 20px;
            color: var(--accent, #e5e5ea);
        }

        #luxe-lang-menu {
            position: absolute;
            bottom: calc(100% + 14px);
            right: 0;
            background: #08080a;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 18px;
            padding: 8px;
            width: 200px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.6);
            opacity: 0;
            transform: translateY(15px);
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        #luxe-lang-menu.show {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }

        .luxe-lang-option {
            background: transparent;
            border: none;
            color: rgba(255,255,255,0.7);
            padding: 10px 14px;
            border-radius: 12px;
            text-align: left;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .luxe-lang-option:hover {
            background: rgba(255,255,255,0.05);
            color: #fff;
        }
        
        .luxe-lang-option.selected {
            color: var(--c2);
            font-weight: bold;
            background: rgba(0, 82, 255, 0.05);
        }

        /* 強制 Google 翻譯後的 字體 保持生效 */
        font, [class*="goog-te"], span, p, h1, h2, h3, h4, h5, h6, a, b, strong, em {
            font-family: inherit !important;
        }
        body {
            font-family: 'DM Sans', 'Noto Sans KR', sans-serif !important;
        }
        h1, h2, h3, h4, .nav-logo {
            font-family: 'Bebas Neue', 'Noto Sans KR', sans-serif !important;
        }
        em, .cat-name-zh {
            font-family: 'Cormorant Garamond', 'Playfair Display', serif !important;
        }
    `;
    document.head.appendChild(style);

    // 2. 建立隱藏的 Google 翻譯容器
    const gtContainer = document.createElement('div');
    gtContainer.id = 'google_translate_element';
    document.body.appendChild(gtContainer);

    // 3. 載入 Google 官方腳本
    const gtScript = document.createElement('script');
    gtScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(gtScript);

    // 4. 定義我們自訂的美觀 UI
    const languages = [
        { code: 'en', name: 'English (US)' },
        { code: 'ja', name: '日本語' },
        { code: 'ko', name: '한국어' },
        { code: 'zh-TW', name: '繁體中文' },
        { code: 'zh-CN', name: '简体中文' },
        { code: 'vi', name: 'Tiếng Việt' },
        { code: 'th', name: 'ภาษาไทย' }
    ];

    const uiContainer = document.createElement('div');
    uiContainer.id = 'luxe-lang-container';
    uiContainer.innerHTML = `
        <div id="luxe-lang-menu">
            ${languages.map(lang => `
                <button class="luxe-lang-option" data-lang="${lang.code}">
                    ${lang.name}
                </button>
            `).join('')}
        </div>
        <button id="luxe-lang-btn">
            <span class="material-symbols-outlined">translate</span>
            <span id="luxe-current-lang">語言 / Language</span>
        </button>
    `;
    document.body.appendChild(uiContainer);

    // 5. 互動邏輯：點擊選單、選擇語言後觸發底層隱藏的 Google 翻譯
    const btn = document.getElementById('luxe-lang-btn');
    const menu = document.getElementById('luxe-lang-menu');
    const currentLangText = document.getElementById('luxe-current-lang');
    const options = document.querySelectorAll('.luxe-lang-option');

    // 開關選單
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
    });

    // 點擊其他地方關閉選單
    document.addEventListener('click', () => {
        menu.classList.remove('show');
    });

    // 點擊某個語言
    options.forEach(opt => {
        opt.addEventListener('click', (e) => {
            const btnTarget = e.target.closest('.luxe-lang-option');
            const langCode = normalizeLanguageCode(btnTarget.dataset.lang);
            const langName = btnTarget.innerText;

            // UI 狀態更新
            currentLangText.innerText = langName;
            options.forEach(o => o.classList.remove('selected'));
            btnTarget.classList.add('selected');
            savePreferredLanguage(langCode);

            // 尋找隱藏的 Google 原生選單並驅動它
            if (applyGoogleTranslateLanguage(langCode)) {
            } else {
                console.warn("Google 翻譯引擎尚未載入完畢");
            }
        });
    });

    window.SeoulMateTranslator = {
        setLanguage(langCode) {
            const normalized = normalizeLanguageCode(langCode);
            savePreferredLanguage(normalized);
            return applyGoogleTranslateLanguage(normalized);
        },
        getLanguage() {
            return normalizeLanguageCode(loadPreferredLanguage());
        },
        getShortLabel(langCode) {
            return getShortLanguageLabel(langCode || loadPreferredLanguage());
        }
    };

    restorePreferredLanguage(currentLangText, options, languages);
});
