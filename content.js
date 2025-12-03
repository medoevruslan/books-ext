(async () => {

    const hostOptions = {
        'play.google.com': {
            about: 'content-gbooks-about.js',
            genres: 'content-gbooks-genres.js'
        },
        'draft2digital.com': 'content-d2d.js',
        'www.wattpad.com': 'content-wattpad.js',
        'www.lulu.com': {
            start: 'content-lulu-start.js',
            copyright: 'content-lulu-copyright.js',
            details: 'content-lulu-details.js'
        }
    };

    const currentHost = window.location.hostname;
    const currentUrl = window.location.href;
    const data = window.bookAutoFillData

    let scriptToLoad = null;

    if (hostOptions[currentHost]) {
        const options = hostOptions[currentHost];
        if (typeof options === 'string') {
            scriptToLoad = options;
        } else {
            // It's an object with path keys
            if (currentUrl.includes('about') && options.about) {
                scriptToLoad = options.about;
            } else if (currentUrl.includes('genres') && options.genres) {
                scriptToLoad = options.genres;
            } else if (currentUrl.includes('start') && options.start) {
                scriptToLoad = options.start
            } else if (currentUrl.includes('copyright') && options.copyright) {
                scriptToLoad = options.copyright
            } else if (currentUrl.includes('details') && options.details) {
                scriptToLoad = options.details
            }
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
