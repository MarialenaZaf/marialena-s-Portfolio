// ----------------------------------------------------------------
// SPLASH SCREEN
// Displays rotating messages while the page loads.
// Messages fade in and out every 1.5 seconds.
// The splash screen hides after the page fully loads,
// with a longer delay on mobile to account for slower connections.
// ----------------------------------------------------------------
const messages = [
    "Preparing something beautiful for you...",
    "Loading the collection...",
    "Almost ready...",
    "Ironing out the last details...",
    "Your fashion journey is about to begin...",
    "Styling the pixels...",
    "Picking the perfect palette...",
    "Sewing it all together...",
    "The runway is almost ready...",
    "Fashion takes time, darling...",
    "Last stitch... almost there!",
    "Curating your experience..."
];

let msgIndex = 0;
const msgEl = document.getElementById('splashMessage');

const messageInterval = setInterval(() => {
    msgIndex = (msgIndex + 1) % messages.length;
    msgEl.style.opacity = '0';
    setTimeout(() => {
        msgEl.textContent = messages[msgIndex];
        msgEl.style.opacity = '1';
    }, 300);
}, 1500);

window.addEventListener('load', () => {
    const isMobile = window.innerWidth <= 768;
    const delay = isMobile ? 2500 : 1500;

    setTimeout(() => {
        clearInterval(messageInterval);
        document.getElementById('splash-screen').classList.add('hidden');
    }, delay);
});


// ----------------------------------------------------------------
// PROJECT PANELS
// Handles opening and closing of project detail panels.
// Triggered by clicking cover images on page4 or buttons on page6.
// Only one panel can be open at a time.
// When a panel is closed via the X button, its PDF resets to page 1
// so that the next time it opens, it starts from the beginning.
// ----------------------------------------------------------------
const coverBtns = document.querySelectorAll('.cover-btn');
const panels = document.querySelectorAll('.project-panel');

coverBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.project;
        const targetPanel = document.getElementById(targetId);

        panels.forEach(p => p.classList.remove('active'));
        targetPanel.classList.add('active');
        targetPanel.scrollIntoView({ behavior: 'smooth' });
    });
});

document.querySelectorAll('.page6-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.project;
        const targetPanel = document.getElementById(targetId);

        panels.forEach(p => p.classList.remove('active'));
        targetPanel.classList.add('active');
        targetPanel.scrollIntoView({ behavior: 'smooth' });
    });
});

// When the X button is clicked, close the panel and reset its PDF to page 1
document.querySelectorAll('.close-panel').forEach(btn => {
    btn.addEventListener('click', () => {
        const panel = btn.closest('.project-panel');
        panel.classList.remove('active');

        const panelId = panel.id;
        if (panelId === 'project4') { circusPage  = 1; circusDoc  = null; circusAnimating  = false; }
        if (panelId === 'project7') { minimalPage = 1; minimalDoc = null; minimalAnimating = false; }
        if (panelId === 'project8') { streetPage  = 1; streetDoc  = null; streetAnimating  = false; }
        if (panelId === 'project9') { bohoPage    = 1; bohoDoc    = null; bohoAnimating    = false; }
    });
});


// ----------------------------------------------------------------
// PDF ERROR HANDLER
// Displays a friendly error message inside the loading area
// if a PDF fails to load (e.g. file not found or network issue).
// ----------------------------------------------------------------
function showPDFError(loadingEl, canvasEl) {
    loadingEl.innerHTML = `
        <i class="fas fa-exclamation-circle" style="color:#c77d9c; font-size:2rem;"></i>
        <p style="color:#c77d9c; font-family:'Playfair Display',serif; text-align:center; margin-top:10px;">
            Oops! Could not load the PDF.<br>
            <a href="#" onclick="location.reload()" style="color:#8a4a68;">Try again</a>
        </p>
    `;
    loadingEl.style.display = 'flex';
    canvasEl.style.display = 'none';
}


// ----------------------------------------------------------------
// MAIN PDF VIEWER (page5)
// Displays the main fashion editorial PDF on page5.
// Scale is calculated dynamically based on screen width
// so it looks good on both desktop and mobile.
// ----------------------------------------------------------------
pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null;
let currentPage = 1;
let isAnimating = false;
const canvas = document.getElementById('bookCanvas');
const ctx = canvas.getContext('2d');
const loading = document.getElementById('bookLoading');

// Calculates the render scale based on available screen width
function getScale(page) {
    const baseViewport = page.getViewport({ scale: 1 });
    const isMobile = window.innerWidth <= 768;
    const maxWidth = isMobile
        ? window.innerWidth * 0.70
        : window.innerWidth * 0.40;
    return maxWidth / baseViewport.width;
}

async function loadPDF() {
    try {
        loading.style.display = 'flex';
        canvas.style.display = 'none';
        pdfDoc = await pdfjsLib.getDocument('img/page5_pdf.pdf').promise;
        renderPage(currentPage);
    } catch (err) {
        showPDFError(loading, canvas);
    }
}

// Renders a specific page with a slide-in animation from left or right
async function renderPage(num, direction = 'right') {
    if (isAnimating) return;
    isAnimating = true;

    loading.style.display = 'flex';
    canvas.style.display = 'none';

    try {
        const page = await pdfDoc.getPage(num);
        const scale = getScale(page);
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;

        const slideIn = direction === 'right' ? '100%' : '-100%';

        loading.style.display = 'none';
        canvas.style.transition = 'none';
        canvas.style.transform = `translateX(${slideIn})`;
        canvas.style.opacity = '0';
        canvas.style.display = 'block';

        setTimeout(() => {
            canvas.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
            canvas.style.transform = 'translateX(0)';
            canvas.style.opacity = '1';
            isAnimating = false;
        }, 20);

        document.getElementById('currentPage').textContent = num;

    } catch (err) {
        isAnimating = false;
        showPDFError(loading, canvas);
    }
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1 && !isAnimating) {
        currentPage--;
        renderPage(currentPage, 'left');
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < pdfDoc.numPages && !isAnimating) {
        currentPage++;
        renderPage(currentPage, 'right');
    }
});

// Re-renders the current page when the browser window is resized
window.addEventListener('resize', () => {
    if (pdfDoc) {
        isAnimating = false;
        renderPage(currentPage, 'right');
    }
});

loadPDF();


// ----------------------------------------------------------------
// CIRCUS PDF VIEWER (project4)
// Loads and renders the Circus project PDF.
// PDF is loaded lazily — only when the panel is first opened.
// Resets to page 1 every time the panel is reopened.
// ----------------------------------------------------------------
let circusDoc = null;
let circusPage = 1;
let circusAnimating = false;
const circusCanvas = document.getElementById('circusCanvas');
const circusCtx = circusCanvas.getContext('2d');
const circusLoading = document.getElementById('circusLoading');

async function loadCircusPDF() {
    try {
        circusLoading.style.display = 'flex';
        circusCanvas.style.display = 'none';
        circusDoc = await pdfjsLib.getDocument('img/circus.pdf').promise;
        renderCircusPage(circusPage);
    } catch (err) {
        showPDFError(circusLoading, circusCanvas);
    }
}

async function renderCircusPage(num, direction = 'right') {
    if (circusAnimating) return;
    circusAnimating = true;

    circusLoading.style.display = 'flex';
    circusCanvas.style.display = 'none';

    try {
        const page = await circusDoc.getPage(num);
        const viewport = page.getViewport({ scale: 1.5 });
        circusCanvas.width = viewport.width;
        circusCanvas.height = viewport.height;
        await page.render({ canvasContext: circusCtx, viewport }).promise;

        const slideIn = direction === 'right' ? '100%' : '-100%';
        circusLoading.style.display = 'none';
        circusCanvas.style.transition = 'none';
        circusCanvas.style.transform = `translateX(${slideIn})`;
        circusCanvas.style.opacity = '0';
        circusCanvas.style.display = 'block';

        setTimeout(() => {
            circusCanvas.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
            circusCanvas.style.transform = 'translateX(0)';
            circusCanvas.style.opacity = '1';
            circusAnimating = false;
        }, 20);

    } catch (err) {
        circusAnimating = false;
        showPDFError(circusLoading, circusCanvas);
    }
}

document.getElementById('circusPrev').addEventListener('click', () => {
    if (circusPage > 1 && !circusAnimating) {
        circusPage--;
        renderCircusPage(circusPage, 'left');
    }
});

document.getElementById('circusNext').addEventListener('click', () => {
    if (circusDoc && circusPage < circusDoc.numPages && !circusAnimating) {
        circusPage++;
        renderCircusPage(circusPage, 'right');
    }
});

document.querySelector('[data-project="project4"]').addEventListener('click', () => {
    circusPage = 1;
    circusDoc = null;
    circusAnimating = false;
    loadCircusPDF();
});


// ----------------------------------------------------------------
// BOHO PDF VIEWER (project9)
// Loads and renders the Boho Look project PDF.
// PDF is loaded lazily — only when the panel is first opened.
// Resets to page 1 every time the panel is reopened.
// ----------------------------------------------------------------
let bohoDoc = null;
let bohoPage = 1;
let bohoAnimating = false;
const bohoCanvas = document.getElementById('bohoCanvas');
const bohoCtx = bohoCanvas.getContext('2d');
const bohoLoading = document.getElementById('bohoLoading');

async function loadBohoPDF() {
    try {
        bohoLoading.style.display = 'flex';
        bohoCanvas.style.display = 'none';
        bohoDoc = await pdfjsLib.getDocument('img/boho.pdf').promise;
        renderBohoPage(bohoPage);
    } catch (err) {
        showPDFError(bohoLoading, bohoCanvas);
    }
}

async function renderBohoPage(num, direction = 'right') {
    if (bohoAnimating) return;
    bohoAnimating = true;

    bohoLoading.style.display = 'flex';
    bohoCanvas.style.display = 'none';

    try {
        const page = await bohoDoc.getPage(num);
        const viewport = page.getViewport({ scale: 1.5 });
        bohoCanvas.width = viewport.width;
        bohoCanvas.height = viewport.height;
        await page.render({ canvasContext: bohoCtx, viewport }).promise;

        const slideIn = direction === 'right' ? '100%' : '-100%';
        bohoLoading.style.display = 'none';
        bohoCanvas.style.transition = 'none';
        bohoCanvas.style.transform = `translateX(${slideIn})`;
        bohoCanvas.style.opacity = '0';
        bohoCanvas.style.display = 'block';

        setTimeout(() => {
            bohoCanvas.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
            bohoCanvas.style.transform = 'translateX(0)';
            bohoCanvas.style.opacity = '1';
            bohoAnimating = false;
        }, 20);

    } catch (err) {
        bohoAnimating = false;
        showPDFError(bohoLoading, bohoCanvas);
    }
}

document.getElementById('bohoPrev').addEventListener('click', () => {
    if (bohoPage > 1 && !bohoAnimating) {
        bohoPage--;
        renderBohoPage(bohoPage, 'left');
    }
});

document.getElementById('bohoNext').addEventListener('click', () => {
    if (bohoDoc && bohoPage < bohoDoc.numPages && !bohoAnimating) {
        bohoPage++;
        renderBohoPage(bohoPage, 'right');
    }
});

document.querySelector('[data-project="project9"]').addEventListener('click', () => {
    bohoPage = 1;
    bohoDoc = null;
    bohoAnimating = false;
    loadBohoPDF();
});


// ----------------------------------------------------------------
// MINIMAL PDF VIEWER (project7)
// Loads and renders the Minimal project PDF.
// PDF is loaded lazily — only when the panel is first opened.
// Resets to page 1 every time the panel is reopened.
// ----------------------------------------------------------------
let minimalDoc = null;
let minimalPage = 1;
let minimalAnimating = false;
const minimalCanvas = document.getElementById('minimalCanvas');
const minimalCtx = minimalCanvas.getContext('2d');
const minimalLoading = document.getElementById('minimalLoading');

async function loadMinimalPDF() {
    try {
        minimalLoading.style.display = 'flex';
        minimalCanvas.style.display = 'none';
        minimalDoc = await pdfjsLib.getDocument('img/minimal.pdf').promise;
        renderMinimalPage(minimalPage);
    } catch (err) {
        showPDFError(minimalLoading, minimalCanvas);
    }
}

async function renderMinimalPage(num, direction = 'right') {
    if (minimalAnimating) return;
    minimalAnimating = true;

    minimalLoading.style.display = 'flex';
    minimalCanvas.style.display = 'none';

    try {
        const page = await minimalDoc.getPage(num);
        const viewport = page.getViewport({ scale: 1.5 });
        minimalCanvas.width = viewport.width;
        minimalCanvas.height = viewport.height;
        await page.render({ canvasContext: minimalCtx, viewport }).promise;

        const slideIn = direction === 'right' ? '100%' : '-100%';
        minimalLoading.style.display = 'none';
        minimalCanvas.style.transition = 'none';
        minimalCanvas.style.transform = `translateX(${slideIn})`;
        minimalCanvas.style.opacity = '0';
        minimalCanvas.style.display = 'block';

        setTimeout(() => {
            minimalCanvas.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
            minimalCanvas.style.transform = 'translateX(0)';
            minimalCanvas.style.opacity = '1';
            minimalAnimating = false;
        }, 20);

    } catch (err) {
        minimalAnimating = false;
        showPDFError(minimalLoading, minimalCanvas);
    }
}

document.getElementById('minimalPrev').addEventListener('click', () => {
    if (minimalPage > 1 && !minimalAnimating) {
        minimalPage--;
        renderMinimalPage(minimalPage, 'left');
    }
});

document.getElementById('minimalNext').addEventListener('click', () => {
    if (minimalDoc && minimalPage < minimalDoc.numPages && !minimalAnimating) {
        minimalPage++;
        renderMinimalPage(minimalPage, 'right');
    }
});

document.querySelector('[data-project="project7"]').addEventListener('click', () => {
    minimalPage = 1;
    minimalDoc = null;
    minimalAnimating = false;
    loadMinimalPDF();
});


// ----------------------------------------------------------------
// STREET PDF VIEWER (project8)
// Loads and renders the Street Fashion project PDF.
// PDF is loaded lazily — only when the panel is first opened.
// Resets to page 1 every time the panel is reopened.
// ----------------------------------------------------------------
let streetDoc = null;
let streetPage = 1;
let streetAnimating = false;
const streetCanvas = document.getElementById('streetCanvas');
const streetCtx = streetCanvas.getContext('2d');
const streetLoading = document.getElementById('streetLoading');

async function loadStreetPDF() {
    try {
        streetLoading.style.display = 'flex';
        streetCanvas.style.display = 'none';
        streetDoc = await pdfjsLib.getDocument('img/street.pdf').promise;
        renderStreetPage(streetPage);
    } catch (err) {
        showPDFError(streetLoading, streetCanvas);
    }
}

async function renderStreetPage(num, direction = 'right') {
    if (streetAnimating) return;
    streetAnimating = true;

    streetLoading.style.display = 'flex';
    streetCanvas.style.display = 'none';

    try {
        const page = await streetDoc.getPage(num);
        const viewport = page.getViewport({ scale: 1.5 });
        streetCanvas.width = viewport.width;
        streetCanvas.height = viewport.height;
        await page.render({ canvasContext: streetCtx, viewport }).promise;

        const slideIn = direction === 'right' ? '100%' : '-100%';
        streetLoading.style.display = 'none';
        streetCanvas.style.transition = 'none';
        streetCanvas.style.transform = `translateX(${slideIn})`;
        streetCanvas.style.opacity = '0';
        streetCanvas.style.display = 'block';

        setTimeout(() => {
            streetCanvas.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
            streetCanvas.style.transform = 'translateX(0)';
            streetCanvas.style.opacity = '1';
            streetAnimating = false;
        }, 20);

    } catch (err) {
        streetAnimating = false;
        showPDFError(streetLoading, streetCanvas);
    }
}

document.getElementById('streetPrev').addEventListener('click', () => {
    if (streetPage > 1 && !streetAnimating) {
        streetPage--;
        renderStreetPage(streetPage, 'left');
    }
});

document.getElementById('streetNext').addEventListener('click', () => {
    if (streetDoc && streetPage < streetDoc.numPages && !streetAnimating) {
        streetPage++;
        renderStreetPage(streetPage, 'right');
    }
});

document.querySelector('[data-project="project8"]').addEventListener('click', () => {
    streetPage = 1;
    streetDoc = null;
    streetAnimating = false;
    loadStreetPDF();
});


// ----------------------------------------------------------------
// SWIPE SUPPORT
// Adds touch swipe detection to PDF canvases on mobile.
// Swiping left goes to the next page, swiping right goes back.
// Only triggers if the horizontal movement is greater than 50px
// and greater than the vertical movement (to avoid scroll conflicts).
// ----------------------------------------------------------------
function addSwipe(element, onLeft, onRight) {
    let startX = 0;
    let startY = 0;

    element.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    element.addEventListener('touchend', (e) => {
        const diffX = startX - e.changedTouches[0].clientX;
        const diffY = startY - e.changedTouches[0].clientY;

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) onLeft();
            else onRight();
        }
    }, { passive: true });
}

addSwipe(document.getElementById('bookCanvas'),
    () => { if (currentPage < pdfDoc?.numPages && !isAnimating) { currentPage++; renderPage(currentPage, 'right'); }},
    () => { if (currentPage > 1 && !isAnimating) { currentPage--; renderPage(currentPage, 'left'); }}
);

addSwipe(document.getElementById('minimalCanvas'),
    () => { if (minimalPage < minimalDoc?.numPages && !minimalAnimating) { minimalPage++; renderMinimalPage(minimalPage, 'right'); }},
    () => { if (minimalPage > 1 && !minimalAnimating) { minimalPage--; renderMinimalPage(minimalPage, 'left'); }}
);

addSwipe(document.getElementById('streetCanvas'),
    () => { if (streetPage < streetDoc?.numPages && !streetAnimating) { streetPage++; renderStreetPage(streetPage, 'right'); }},
    () => { if (streetPage > 1 && !streetAnimating) { streetPage--; renderStreetPage(streetPage, 'left'); }}
);

addSwipe(document.getElementById('bohoCanvas'),
    () => { if (bohoPage < bohoDoc?.numPages && !bohoAnimating) { bohoPage++; renderBohoPage(bohoPage, 'right'); }},
    () => { if (bohoPage > 1 && !bohoAnimating) { bohoPage--; renderBohoPage(bohoPage, 'left'); }}
);

addSwipe(document.getElementById('circusCanvas'),
    () => { if (circusPage < circusDoc?.numPages && !circusAnimating) { circusPage++; renderCircusPage(circusPage, 'right'); }},
    () => { if (circusPage > 1 && !circusAnimating) { circusPage--; renderCircusPage(circusPage, 'left'); }}
);