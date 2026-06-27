// ----------------------------------------------------------------
// SPLASH SCREEN
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

document.querySelectorAll('.close-panel').forEach(btn => {
    btn.addEventListener('click', () => {
        const panel = btn.closest('.project-panel');
        panel.classList.remove('active');

        const panelId = panel.id;
        if (panelId === 'project4') { circusPage  = 1; circusDoc  = null; circusAnimating  = false; }
        if (panelId === 'project6') { vivaPage    = 1; vivaDoc    = null; vivaAnimating    = false; }
        if (panelId === 'project7') { minimalPage = 1; minimalDoc = null; minimalAnimating = false; }
        if (panelId === 'project8') { streetPage  = 1; streetDoc  = null; streetAnimating  = false; }
        if (panelId === 'project9') { bohoPage    = 1; bohoDoc    = null; bohoAnimating    = false; }
        if (panelId === 'project5') resetGreek();
    });
});


// ----------------------------------------------------------------
// PDF ERROR HANDLER
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
// ----------------------------------------------------------------
pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null;
let currentPage = 1;
let isAnimating = false;
const canvas = document.getElementById('bookCanvas');
const ctx = canvas.getContext('2d');
const loading = document.getElementById('bookLoading');

function getScale(page) {
    const baseViewport = page.getViewport({ scale: 1 });
    const isMobile = window.innerWidth <= 768;
    const maxWidth = isMobile ? window.innerWidth * 0.70 : window.innerWidth * 0.40;
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
    if (currentPage > 1 && !isAnimating) { currentPage--; renderPage(currentPage, 'left'); }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < pdfDoc.numPages && !isAnimating) { currentPage++; renderPage(currentPage, 'right'); }
});

window.addEventListener('resize', () => {
    if (pdfDoc) { isAnimating = false; renderPage(currentPage, 'right'); }
});

// Load page5 PDF lazily when the section becomes visible
const page5Observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !pdfDoc) {
            loadPDF();
            page5Observer.disconnect();
        }
    });
}, { threshold: 0.1 });
page5Observer.observe(document.querySelector('.page5'));


// ----------------------------------------------------------------
// GENERIC PDF VIEWER FACTORY
// Creates a reusable PDF viewer for any panel.
// ----------------------------------------------------------------
function createPDFViewer({ pdfPath, canvasId, loadingId, prevId, nextId, projectSelector }) {
    let doc = null;
    let page = 1;
    let animating = false;
    const cvs = document.getElementById(canvasId);
    const cvsCtx = cvs.getContext('2d');
    const ldr = document.getElementById(loadingId);


    async function load() {
        try {
            ldr.style.display = 'flex';
            cvs.style.display = 'none';
            doc = await pdfjsLib.getDocument(pdfPath).promise;
            render(page);
        } catch (err) {
            showPDFError(ldr, cvs);
        }
    }

    async function render(num, direction = 'right') {
        if (animating) return;
        animating = true;

        ldr.style.display = 'flex';
        cvs.style.display = 'none';

        try {
            const p = await doc.getPage(num);
            const viewport = p.getViewport({ scale: 1.5 });
            cvs.width = viewport.width;
            cvs.height = viewport.height;
            await p.render({ canvasContext: cvsCtx, viewport }).promise;

            const slideIn = direction === 'right' ? '100%' : '-100%';
            ldr.style.display = 'none';
            cvs.style.transition = 'none';
            cvs.style.transform = `translateX(${slideIn})`;
            cvs.style.opacity = '0';
            cvs.style.display = 'block';

            setTimeout(() => {
                cvs.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
                cvs.style.transform = 'translateX(0)';
                cvs.style.opacity = '1';
                animating = false;
            }, 20);

        } catch (err) {
            animating = false;
            showPDFError(ldr, cvs);
        }
    }

    document.getElementById(prevId).addEventListener('click', () => {
        if (page > 1 && !animating) { page--; render(page, 'left'); }
    });

    document.getElementById(nextId).addEventListener('click', () => {
        if (doc && page < doc.numPages && !animating) { page++; render(page, 'right'); }
    });

    document.querySelector(projectSelector).addEventListener('click', () => {
        page = 1; doc = null; animating = false; load();
    });

    // Returns reset function for close-panel handler
    return () => { page = 1; doc = null; animating = false; };
}

// Create all PDF viewers
const resetCircus  = createPDFViewer({ pdfPath: 'img/circus.pdf',  canvasId: 'circusCanvas',  loadingId: 'circusLoading',  prevId: 'circusPrev',  nextId: 'circusNext',  projectSelector: '[data-project="project4"]' });
const resetViva    = createPDFViewer({ pdfPath: 'img/viva.pdf',    canvasId: 'vivaCanvas',    loadingId: 'vivaLoading',    prevId: 'vivaPrev',    nextId: 'vivaNext',    projectSelector: '[data-project="project6"]' });
const resetMinimal = createPDFViewer({ pdfPath: 'img/minimal.pdf', canvasId: 'minimalCanvas', loadingId: 'minimalLoading', prevId: 'minimalPrev', nextId: 'minimalNext', projectSelector: '[data-project="project7"]' });
const resetStreet  = createPDFViewer({ pdfPath: 'img/street.pdf',  canvasId: 'streetCanvas',  loadingId: 'streetLoading',  prevId: 'streetPrev',  nextId: 'streetNext',  projectSelector: '[data-project="project8"]' });
const resetBoho    = createPDFViewer({ pdfPath: 'img/boho.pdf',    canvasId: 'bohoCanvas',    loadingId: 'bohoLoading',    prevId: 'bohoPrev',    nextId: 'bohoNext',    projectSelector: '[data-project="project9"]' });
const resetGreek = createPDFViewer({ pdfPath: 'img/greek.pdf', canvasId: 'greekCanvas', loadingId: 'greekLoading', prevId: 'greekPrev', nextId: 'greekNext', projectSelector: '[data-project="project5"]' });
const resetOnce = createPDFViewer({
    pdfPath: 'img/Once.pdf',
    canvasId: 'onceCanvas',
    loadingId: 'onceLoading',
    prevId: 'oncePrev',
    nextId: 'onceNext',
    projectSelector: '[data-project="project1"]'
});
// Update close-panel to use reset functions
document.querySelectorAll('.close-panel').forEach(btn => {
    btn.addEventListener('click', () => {
        const panel = btn.closest('.project-panel');
        panel.classList.remove('active');

        const panelId = panel.id;
        if (panelId === 'project4') resetCircus();
        if (panelId === 'project6') resetViva();
        if (panelId === 'project7') resetMinimal();
        if (panelId === 'project8') resetStreet();
        if (panelId === 'project9') resetBoho();
        if (panelId === 'project1') resetOnce();
    });
});


// ----------------------------------------------------------------
// SWIPE SUPPORT
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

// For panel PDFs, swipe is handled via the canvas elements directly
['circusCanvas','vivaCanvas','minimalCanvas','streetCanvas','bohoCanvas','greekCanvas','onceCanvas'].forEach(id => {
    const el = document.getElementById(id);
    const prevBtn = document.getElementById(id.replace('Canvas', 'Prev'));
    const nextBtn = document.getElementById(id.replace('Canvas', 'Next'));
    addSwipe(el,
        () => nextBtn.click(),
        () => prevBtn.click()
    );
});
// ----------------------------------------------------------------
// PAGE7 TABS
// Switches between the two extra projects.
// ----------------------------------------------------------------
document.querySelectorAll('.page7-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.page7-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.page7-panel').forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
});