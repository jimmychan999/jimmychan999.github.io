let Stopwatch = function(elem, framePeriod) {
    let elapsed = 0;
    let lastFrameTime, interval;
    
    // initialize
    this.start = () => {
        if (interval) return;
        lastFrameTime = Date.now();
        interval = window.setInterval(update, framePeriod);
    }

    this.stop = () => {
        if (!interval) return;
        window.clearInterval(interval);
        interval = null;
    }
    
    this.reset = () => {
        elapsed = 0;
        render();
    }

    const delta = () => {
        // Get the time elapsed since last update call
        let now = Date.now();
        let change = now - lastFrameTime;
        lastFrameTime = now;
        return change;
    }
    
    const render = () => {
        elem.textContent = (elapsed / 1000).toFixed(2).toString();
    }

    const update = () => {
        elapsed += delta();
        render();
    }
};
