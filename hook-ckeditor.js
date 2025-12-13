// hook-ckeditor.js
(function () {
    if (window.__ckHookInstalled) return;
    window.__ckHookInstalled = true;

    const tryHook = () => {
        // CKEditor 5 Watchdog (used by React integrations)
        const watchdog =
            window.watchdog ||
            window.__ckeditorWatchdog ||
            window.CKEDITOR_WATCHDOG;

        if (watchdog?.editor) {
            window.__CKEDITOR_INSTANCE__ = watchdog.editor;
            return true;
        }

        return false;
    };

    // Try immediately
    if (tryHook()) return;

    // Retry for SPA navigation
    const interval = setInterval(() => {
        if (tryHook()) {
            clearInterval(interval);
        }
    }, 100);
})();