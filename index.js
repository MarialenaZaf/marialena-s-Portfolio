// ================================================================
// SPLASH SCREEN - Μηνύματα που εναλλάσσονται κατά τη φόρτωση
// ================================================================
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

// Αλλάζει μήνυμα κάθε 1.5 δευτερόλεπτα με fade effect
const messageInterval = setInterval(() => {
    msgIndex = (msgIndex + 1) % messages.length;
    msgEl.style.opacity = '0';
    setTimeout(() => {
        msgEl.textContent = messages[msgIndex];
        msgEl.style.opacity = '1';
    }, 300);
}, 1500);

// Κρύβει το splash screen μόλις φορτώσει όλη η σελίδα
window.addEventListener('load', () => {
    const isMobile = window.innerWidth <= 768;
    const delay = isMobile ? 2500 : 1500;

    setTimeout(() => {
        clearInterval(messageInterval);
        document.getElementById('splash-screen').classList.add('hidden');
    }, delay);
});


// ================================================================
// SCROLL PROGRESS BAR - Μπάρα προόδου scroll πάνω στη σελίδα
// ================================================================
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    document.getElementById('progress-bar').style.width = progress + '%';
});


// ================================================================
// FADE IN ON SCROLL - Sections εμφανίζονται καθώς scrollάρεις
// ================================================================
const fadeSections = document.querySelectorAll('.fade-section');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

fadeSections.forEach(section => observer.observe(section));


// ================================================================
// CUSTOM CURSOR - Προσαρμοσμένος κέρσορας
// ================================================================
const cursor = document.getElementById('custom-cursor');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Μεγαλώνει όταν περνάει πάνω από κουμπιά και links
document.querySelectorAll('a, button, .cover-btn, .page6-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});


// ================================================================
// PROJECT PANELS - Άνοιγμα/κλείσιμο panels από covers (page4)
// ================================================================
const coverBtns = document.querySelectorAll('.cover-btn');
const panels = document.querySelectorAll('.project-panel');

// Άνοιγμα panel όταν πατηθεί cover
coverBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.project;
        const targetPanel = document.getElementById(targetId);

        panels.forEach(p => p.classList.remove('active'));
        targetPanel.classList.add('active');
        targetPanel.scrollIntoView({ behavior: 'smooth' });
    });
});

// Κλείσιμο panel με το X
document.querySelectorAll('.close-panel').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.project-panel').classList.remove('active');
    });
});

// Άνοιγμα panel από buttons της page6
document.querySelectorAll('.page6-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.project;
        const targetPanel = document.getElementById(targetId);

        panels.forEach(p => p.classList.remove('active'));
        targetPanel.classList.add('active');
        targetPanel.scrollIntoView({ behavior: 'smooth' });
    });
});


// ================================================================
// ERROR HANDLER - Εμφανίζει μήνυμα αν αποτύχει η φόρτωση PDF
// ================================================================
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


// ================================================================
// PDF VIEWER - Κύριο PDF (page5)
// ================================================================
pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null;
let currentPage = 1;
let isAnimating = false;
const canvas = document.getElementById('bookCanvas');
const ctx = canvas.getContext('2d');
const loading = document.getElementById('bookLoading');

// Υπολογίζει το σωστό scale ανάλογα με το μέγεθος οθόνης
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

// Re-render όταν αλλάξει μέγεθος οθόνης
window.addEventListener('resize', () => {
    if (pdfDoc) {
        isAnimating = false;
        renderPage(currentPage, 'right');
    }
});

loadPDF();


// ================================================================
// BOHO PDF - PDF viewer για το project Boho Look
// ================================================================
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

// Φορτώνει το PDF μόνο όταν ανοίξει το panel (lazy loading)
document.querySelector('[data-project="project9"]').addEventListener('click', () => {
    if (!bohoDoc) loadBohoPDF();
});


// ================================================================
// MINIMAL PDF - PDF viewer για το project Minimal
// ================================================================
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


// ================================================================
// STREET PDF - PDF viewer για το project Street Fashion
// ================================================================
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


// ================================================================
// CIRCUS PDF - PDF viewer για το project Circus
// ================================================================
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


// ================================================================
// SWIPE SUPPORT - Αλλαγή σελίδας PDF με swipe σε κινητό
// ================================================================
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

        // Ελέγχει ότι το swipe είναι οριζόντιο και αρκετά μεγάλο
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) onLeft();
            else onRight();
        }
    }, { passive: true });
}

// Εφαρμογή swipe σε κάθε PDF canvas
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