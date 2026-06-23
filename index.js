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