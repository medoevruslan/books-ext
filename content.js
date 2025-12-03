(async () => {

    const hostOptions = {
        'play.google.com': {
            about: 'content-gbooks-about.js',
            genres: 'content-gbooks-genres.js'
        },
        'draft2digital.com': 'content-d2d.js'
    };

    const currentHost = window.location.hostname;
    const currentUrl = window.location.href;

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
            }
        }
    }

    if (scriptToLoad) {
        console.log(`[Host Identifier] Loading script: ${scriptToLoad}`);
        try {
            const src = chrome.runtime.getURL(scriptToLoad);
            await import(src);
        } catch (err) {
            console.error(`[Host Identifier] Failed to load script: ${scriptToLoad}`, err);
        }
    } else {
        console.log('[Host Identifier] No matching script found for this page.');
    }
})();
