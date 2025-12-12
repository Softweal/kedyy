console.log('kedyy content script initialized.');

(function () {
    // Create the box element
    const box = document.createElement('div');
    box.id = 'kedyy-box';
    document.body.appendChild(box);

    // Initialize Lottie
    if (window.lottie) {
        const animationUrl = chrome.runtime.getURL('src/assets/kedy.json');
        const anim = lottie.loadAnimation({
            container: box,
            renderer: 'svg',
            loop: true,
            autoplay: false,
            path: animationUrl
        });

        box.addEventListener('mouseenter', () => anim.play());
        box.addEventListener('mouseleave', () => anim.stop());

    } else {
        console.error('Lottie library not loaded in content script.');
    }

    // Physics constants
    const GRAVITY = 0.8;
    const BOUNCE = 0.7;
    const FRICTION = 0.98;
    const THROW_FORCE = 0.5;

    // State
    // Initial Y should be bottom 0 relative to viewport? 
    // box height is 100px.
    let state = {
        x: window.innerWidth - 80,
        y: window.innerHeight - 100, // Start at absolute bottom
        vx: 0,
        vy: 0,
        isDragging: false,
        lastMouseX: 0,
        lastMouseY: 0,
        dragStartX: 0,
        dragStartY: 0
    };

    // ...

    function updatePosition() {
        // We use transform directly so it's performant and overrides any CSS positioning issues
        box.style.transform = `translate(${state.x}px, ${state.y}px)`;
        // Also ensure left/top are 0 so translate is absolute
        box.style.left = '0px';
        box.style.top = '0px';
        box.style.bottom = 'auto'; // override css
        box.style.right = 'auto'; // override css
    }

    // Initial position update
    updatePosition();

    // Mouse/Touch Events
    box.addEventListener('mousedown', startDrag);
    box.addEventListener('touchstart', (e) => startDrag(e.touches[0]), { passive: false });

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('touchmove', (e) => onDrag(e.touches[0]), { passive: false });

    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    // Animation Loop
    function loop() {
        if (!state.isDragging) {
            applyPhysics();
        }
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    function startDrag(e) {
        state.isDragging = true;
        state.dragStartX = e.clientX - state.x;
        state.dragStartY = e.clientY - state.y;
        state.lastMouseX = e.clientX;
        state.lastMouseY = e.clientY;
        state.vx = 0;
        state.vy = 0;

        // Prevent text selection while dragging
        e.preventDefault && e.preventDefault();
    }

    function onDrag(e) {
        if (!state.isDragging) return;

        const currentX = e.clientX;

        // Calculate throw velocity based on mouse movement
        state.vx = (currentX - state.lastMouseX) * THROW_FORCE;
        state.vy = 0;

        state.lastMouseX = currentX;

        state.x = currentX - state.dragStartX;
        // Vertically locked

        updatePosition();

        if (e.preventDefault) e.preventDefault(); // Prevent scrolling on touch
    }

    function endDrag() {
        if (!state.isDragging) return;
        state.isDragging = false;
    }

    function applyPhysics() {
        // Apply gravity
        state.vy += GRAVITY;

        // Apply air resistance
        state.vx *= FRICTION;
        state.vy *= FRICTION; // Optional: air resistance on Y too

        // Update position
        state.x += state.vx;
        state.y += state.vy;

        // Floor collision (Bottom of screen)
        const floor = window.innerHeight - box.offsetHeight;
        if (state.y > floor) {
            state.y = floor;
            state.vy *= -BOUNCE;

            // Stop completely if bouncing too low (prevent jitter)
            if (Math.abs(state.vy) < GRAVITY * 2) {
                state.vy = 0;
            }

            // Ground friction
            state.vx *= 0.8;
        }

        // Ceiling collision
        if (state.y < 0) {
            state.y = 0;
            state.vy *= -BOUNCE;
        }

        // Right wall collision
        const rightWall = window.innerWidth - box.offsetWidth;
        if (state.x > rightWall) {
            state.x = rightWall;
            state.vx *= -BOUNCE;
        }

        // Left wall collision
        if (state.x < 0) {
            state.x = 0;
            state.vx *= -BOUNCE;
        }

        updatePosition();
    }

    // Old updatePosition removed

    function px(val) {
        return val + 'px';
    }

    function px(val) {
        return val + 'px';
    }

})();
