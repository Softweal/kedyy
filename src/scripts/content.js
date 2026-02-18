console.log('kedyy content script initialized.');

(function () {
    // Create the box element
    const box = document.createElement('div');
    box.id = 'kedyy-box';
    document.body.appendChild(box);

    // Lottie kütüphanesi hazırsa yükle
    let anim;

    function loadCat(catFile = 'kedy.json') {
        if (!window.lottie) {
            console.error('Lottie library not loaded in content script.');
            return;
        }

        if (anim) {
            anim.destroy();
        }

        box.innerHTML = '';
        box.appendChild(dialogue);

        const animationUrl = chrome.runtime.getURL(`src/assets/${catFile}`);
        anim = lottie.loadAnimation({
            container: box,
            renderer: 'svg',
            loop: true,
            autoplay: false,
            path: animationUrl
        });

        box.onmouseenter = () => anim.play();
        box.onmouseleave = () => anim.stop();
    }

    const dialogue = document.createElement('div');
    dialogue.id = 'kedyy-dialogue';
    dialogue.textContent = 'meow';
    box.appendChild(dialogue);

    let userName = '';

    chrome.storage.local.get(['userName', 'catHue', 'selectedCat'], (result) => {
        if (result.userName) {
            userName = result.userName;
        }
        if (result.catHue) {
            box.style.filter = `hue-rotate(${result.catHue}deg)`;
        }
        loadCat(result.selectedCat || 'kedy.json');
    });

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local') {
            if (changes.userName) {
                userName = changes.userName.newValue;
            }
            if (changes.catHue) {
                box.style.filter = `hue-rotate(${changes.catHue.newValue}deg)`;
            }
            if (changes.selectedCat) {
                loadCat(changes.selectedCat.newValue);
            }
        }
    });

    box.addEventListener('mouseenter', () => {
        const text = userName ? `meow, ${userName}!` : 'meow';
        dialogue.textContent = text;
        dialogue.classList.add('show');
    });

    box.addEventListener('mouseleave', () => {
        dialogue.classList.remove('show');
    });

    const GRAVITY = 0.8;
    const BOUNCE = 0.7;
    const FRICTION = 0.98;
    const THROW_FORCE = 0.5;
    const VISUAL_OFFSET_Y = 16;

    let state = {
        x: window.innerWidth - 140,
        y: window.innerHeight - 100 + VISUAL_OFFSET_Y,
        vx: 0,
        vy: 0,
        isDragging: false,
        lastMouseX: 0,
        lastMouseY: 0,
        dragStartX: 0,
        dragStartY: 0
    };

    function updatePosition() {
        box.style.transform = `translate(${state.x}px, ${state.y}px)`;
        box.style.left = '0px';
        box.style.top = '0px';
        box.style.bottom = 'auto';
        box.style.right = 'auto';
    }

    updatePosition();

    box.addEventListener('mousedown', startDrag);
    box.addEventListener('touchstart', (e) => startDrag(e.touches[0]), { passive: false });

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('touchmove', (e) => onDrag(e.touches[0]), { passive: false });

    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

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

        e.preventDefault && e.preventDefault();
    }

    function onDrag(e) {
        if (!state.isDragging) return;

        const currentX = e.clientX;
        state.vx = (currentX - state.lastMouseX) * THROW_FORCE;
        state.vy = 0;
        state.lastMouseX = currentX;
        state.x = currentX - state.dragStartX;
        updatePosition();

        if (e.preventDefault) e.preventDefault();
    }

    function endDrag() {
        if (!state.isDragging) return;
        state.isDragging = false;
    }

    function applyPhysics() {
        state.vy += GRAVITY;
        state.vx *= FRICTION;
        state.vy *= FRICTION;

        state.x += state.vx;
        state.y += state.vy;

        const floor = window.innerHeight - box.offsetHeight;
        if (state.y > floor) {
            state.y = floor;
            state.vy *= -BOUNCE;

            if (Math.abs(state.vy) < GRAVITY * 2) {
                state.vy = 0;
            }
            state.vx *= 0.8;
        }

        if (state.y < 0) {
            state.y = 0;
            state.vy *= -BOUNCE;
        }

        const rightWall = window.innerWidth - box.offsetWidth;
        if (state.x > rightWall) {
            state.x = rightWall;
            state.vx *= -BOUNCE;
        }

        if (state.x < 0) {
            state.x = 0;
            state.vx *= -BOUNCE;
        }
        updatePosition();
    }



    function px(val) {
        return val + 'px';
    }

    function px(val) {
        return val + 'px';
    }

})();
