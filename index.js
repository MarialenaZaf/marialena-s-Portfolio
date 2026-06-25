const messages = [
    "Preparing something beautiful for you... ✨",
    "Loading the collection... 👗",
    "Almost ready... 🪡",
    "Ironing out the last details... 🧵",
    "Your fashion journey is about to begin... 💫"
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
// ========== PROJECT PANELS ==========
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

document.querySelectorAll('.close-panel').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.project-panel').classList.remove('active');
    });
});


// ========== PDF VIEWER ==========

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
    const maxWidth = isMobile
        ? window.innerWidth * 0.70
        : window.innerWidth * 0.40;
    return maxWidth / baseViewport.width;
}

async function loadPDF() {
    loading.style.display = 'flex';
    canvas.style.display = 'none';

    pdfDoc = await pdfjsLib.getDocument('img/page5_pdf.pdf').promise;

    renderPage(currentPage);
}

async function renderPage(num, direction = 'right') {
    if (isAnimating) return;
    isAnimating = true;

    loading.style.display = 'flex';
    canvas.style.display = 'none';

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

window.addEventListener('resize', () => {
    if (pdfDoc) {
        isAnimating = false;
        renderPage(currentPage, 'right');
    }
});

loadPDF();

document.querySelectorAll('.page6-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.project;
        const targetPanel = document.getElementById(targetId);

        panels.forEach(p => p.classList.remove('active'));
        targetPanel.classList.add('active');
        targetPanel.scrollIntoView({ behavior: 'smooth' });
    });
});

// ===== BOHO PDF =====
let bohoDoc = null;
let bohoPage = 1;
let bohoAnimating = false;
const bohoCanvas = document.getElementById('bohoCanvas');
const bohoCtx = bohoCanvas.getContext('2d');
const bohoLoading = document.getElementById('bohoLoading');

async function loadBohoPDF() {
    bohoLoading.style.display = 'flex';
    bohoCanvas.style.display = 'none';
    bohoDoc = await pdfjsLib.getDocument('img/boho.pdf').promise;
    renderBohoPage(bohoPage);
}

async function renderBohoPage(num, direction = 'right') {
    if (bohoAnimating) return;
    bohoAnimating = true;

    bohoLoading.style.display = 'flex';
    bohoCanvas.style.display = 'none';

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

// Φόρτωσε το PDF όταν ανοίξει το panel
document.querySelector('[data-project="project9"]').addEventListener('click', () => {
    if (!bohoDoc) loadBohoPDF();
});

// ===== MINIMAL PDF =====
let minimalDoc = null;
let minimalPage = 1;
let minimalAnimating = false;
const minimalCanvas = document.getElementById('minimalCanvas');
const minimalCtx = minimalCanvas.getContext('2d');
const minimalLoading = document.getElementById('minimalLoading');

async function loadMinimalPDF() {
    minimalLoading.style.display = 'flex';
    minimalCanvas.style.display = 'none';
    minimalDoc = await pdfjsLib.getDocument('img/minimal.pdf').promise;
    renderMinimalPage(minimalPage);
}

async function renderMinimalPage(num, direction = 'right') {
    if (minimalAnimating) return;
    minimalAnimating = true;

    minimalLoading.style.display = 'flex';
    minimalCanvas.style.display = 'none';

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
    if (!minimalDoc) loadMinimalPDF();
});

// ===== STREET PDF =====
let streetDoc = null;
let streetPage = 1;
let streetAnimating = false;
const streetCanvas = document.getElementById('streetCanvas');
const streetCtx = streetCanvas.getContext('2d');
const streetLoading = document.getElementById('streetLoading');

async function loadStreetPDF() {
    streetLoading.style.display = 'flex';
    streetCanvas.style.display = 'none';
    streetDoc = await pdfjsLib.getDocument('img/street.pdf').promise;
    renderStreetPage(streetPage);
}

async function renderStreetPage(num, direction = 'right') {
    if (streetAnimating) return;
    streetAnimating = true;

    streetLoading.style.display = 'flex';
    streetCanvas.style.display = 'none';

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
    if (!streetDoc) loadStreetPDF();
});

// ===== CIRCUS PDF =====
let circusDoc = null;
let circusPage = 1;
let circusAnimating = false;
const circusCanvas = document.getElementById('circusCanvas');
const circusCtx = circusCanvas.getContext('2d');
const circusLoading = document.getElementById('circusLoading');

async function loadCircusPDF() {
    circusLoading.style.display = 'flex';
    circusCanvas.style.display = 'none';
    circusDoc = await pdfjsLib.getDocument('img/circus.pdf').promise;
    renderCircusPage(circusPage);
}

async function renderCircusPage(num, direction = 'right') {
    if (circusAnimating) return;
    circusAnimating = true;

    circusLoading.style.display = 'flex';
    circusCanvas.style.display = 'none';

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
    if (!circusDoc) loadCircusPDF();
});