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
    return 0.5;
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

loadPDF();