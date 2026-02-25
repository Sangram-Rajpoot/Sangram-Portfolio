// Canvas-based scroll image sequence animation for Hero section
(function () {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const heroSection = document.querySelector('.hero');
    let width, height;

    // Image URLs for the sequence
    const imageUrls = [
        'https://mgx-backend-cdn.metadl.com/generate/images/986582/2026-02-25/3887a888-ccda-4ff3-8da3-8c1bf64c19ef.png',
        'https://mgx-backend-cdn.metadl.com/generate/images/986582/2026-02-25/c7a06b72-b3f9-4018-acd0-f6f514b13da3.png',
        'https://mgx-backend-cdn.metadl.com/generate/images/986582/2026-02-25/d8f292c8-6874-47e8-81fb-205d2904754c.png',
        'https://mgx-backend-cdn.metadl.com/generate/images/986582/2026-02-25/25542365-c355-406f-9422-4fb72f95c448.png'
    ];

    const images = [];
    let loadedCount = 0;
    let currentFrame = 0;
    let targetFrame = 0;
    const totalFrames = imageUrls.length;

    function resize() {
        width = canvas.width = heroSection.offsetWidth;
        height = canvas.height = heroSection.offsetHeight;
    }

    function preloadImages() {
        imageUrls.forEach((url, i) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalFrames) {
                    drawFrame(0);
                }
            };
            img.onerror = () => {
                loadedCount++;
            };
            img.src = url;
            images[i] = img;
        });
    }

    function drawFrame(index) {
        if (!images[index] || !images[index].complete) return;

        ctx.clearRect(0, 0, width, height);

        const img = images[index];
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;

        let drawWidth, drawHeight, drawX, drawY;

        if (canvasRatio > imgRatio) {
            drawWidth = width;
            drawHeight = width / imgRatio;
            drawX = 0;
            drawY = (height - drawHeight) / 2;
        } else {
            drawHeight = height;
            drawWidth = height * imgRatio;
            drawX = (width - drawWidth) / 2;
            drawY = 0;
        }

        ctx.globalAlpha = 0.6;
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        ctx.globalAlpha = 1;
    }

    function drawBlendedFrames(from, to, progress) {
        ctx.clearRect(0, 0, width, height);

        if (images[from] && images[from].complete) {
            ctx.globalAlpha = 0.6 * (1 - progress);
            drawSingleImage(images[from]);
        }

        if (images[to] && images[to].complete) {
            ctx.globalAlpha = 0.6 * progress;
            drawSingleImage(images[to]);
        }

        ctx.globalAlpha = 1;
    }

    function drawSingleImage(img) {
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;

        let drawWidth, drawHeight, drawX, drawY;

        if (canvasRatio > imgRatio) {
            drawWidth = width;
            drawHeight = width / imgRatio;
            drawX = 0;
            drawY = (height - drawHeight) / 2;
        } else {
            drawHeight = height;
            drawWidth = height * imgRatio;
            drawX = (width - drawWidth) / 2;
            drawY = 0;
        }

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    }

    let currentBlend = 0;
    let targetBlend = 0;

    function onScroll() {
        const scrollTop = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        const scrollFraction = Math.min(Math.max(scrollTop / heroHeight, 0), 1);

        targetBlend = scrollFraction * (totalFrames - 1);
    }

    function animateLoop() {
        currentBlend += (targetBlend - currentBlend) * 0.08;

        const fromIndex = Math.floor(currentBlend);
        const toIndex = Math.min(fromIndex + 1, totalFrames - 1);
        const progress = currentBlend - fromIndex;

        if (fromIndex === toIndex) {
            drawFrame(fromIndex);
        } else {
            drawBlendedFrames(fromIndex, toIndex, progress);
        }

        requestAnimationFrame(animateLoop);
    }

    resize();
    preloadImages();
    animateLoop();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);
})();