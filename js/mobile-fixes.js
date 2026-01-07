// Mobile viewport fix - Handle 100vh on mobile
function setAppHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--app-height', `${vh}px`);
}

// Initialize on load
setAppHeight();

// Update on resize (handles keyboard show/hide)
window.addEventListener('resize', setAppHeight);

// Also update on orientation change
window.addEventListener('orientationchange', () => {
    setTimeout(setAppHeight, 100);
});

//Export for use in other modules
export { setAppHeight };
