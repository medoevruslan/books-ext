(async () => {

    const routes = {
        'play.google.com': [
            { pattern: /about/, script: 'content-gbooks-about.js' },
            { pattern: /genres/, script: 'content-gbooks-genres.js' }
        ],
        'draft2digital.com': [
            { pattern: /\/book\/e\/\d+$/, script: 'content-d2d-description.js' },
            { pattern: /\/book\/m\/\d+\/ebook$/, script: 'content-d2d-main.js' }
        ],
        'www.wattpad.com': [
            { pattern: /.*/, script: 'content-wattpad.js' }
        ],
        'www.lulu.com': [
            { pattern: /start/, script: 'content-lulu-start.js' },
            { pattern: /copyright/, script: 'content-lulu-copyright.js' },
            { pattern: /details/, script: 'content-lulu-details.js' }
        ]
    };

    const currentHost = window.location.hostname;
    const currentUrl = window.location.href;
    const data = window.bookAutoFillData;

    let scriptToLoad = null;

    if (routes[currentHost]) {
        const hostRoutes = routes[currentHost];
        const match = hostRoutes.find(route => route.pattern.test(currentUrl));
        if (match) {
            scriptToLoad = match.script;
        }
    }

    if (scriptToLoad) {
        console.log(`[Host Identifier] Loading script: ${scriptToLoad}`);
        try {
            const src = chrome.runtime.getURL(scriptToLoad);
            const module = await import(src);
            if (module && typeof module.run === 'function') {
                console.log(`[Host Identifier] Running script logic for: ${scriptToLoad}`);
                await module.run(data);
            } else {
                console.warn(`[Host Identifier] Module ${scriptToLoad} does not export a run function.`);
            }
        } catch (err) {
            console.error(`[Host Identifier] Failed to load script: ${scriptToLoad}`, err);
        }
    } else {
        console.log('[Host Identifier] No matching script found for this page.');
    }
})();
