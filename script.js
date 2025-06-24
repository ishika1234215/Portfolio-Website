// Section reveal on scroll
function revealSections() {
    const sections = document.querySelectorAll('.section');
    const triggerBottom = window.innerHeight * 0.85;
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < triggerBottom) {
            section.classList.add('visible');
        }
    });
}
window.addEventListener('scroll', revealSections);
window.addEventListener('DOMContentLoaded', revealSections);

// Contact form validation and feedback
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();
        const message = contactForm.message.value.trim();
        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }
        // Simple email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        alert('Thank you for reaching out, ' + name + '!');
        contactForm.reset();
    });
}

// Neural network style background animation
(function() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let nodes = [];
    const NODE_COUNT = Math.floor((width * height) / 3500);
    const NODE_RADIUS = 4;
    const LINE_DIST = 140;
    const NODE_COLORS = ['#0ff', '#7c3aed', '#fff'];
    let mouse = { x: null, y: null };

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function randomVel() {
        return (Math.random() - 0.5) * 0.8;
    }

    function Node(i) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = randomVel();
        this.vy = randomVel();
        this.color = NODE_COLORS[i % NODE_COLORS.length];
    }
    Node.prototype.update = function() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        // Mouse interaction: nodes near mouse move away slightly
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 100) {
                this.vx -= dx / dist * 0.04;
                this.vy -= dy / dist * 0.04;
            }
        }
        this.vx = Math.max(Math.min(this.vx, 1), -1);
        this.vy = Math.max(Math.min(this.vy, 1), -1);
    };
    Node.prototype.draw = function(highlight) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, highlight ? NODE_RADIUS * 1.5 : NODE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = highlight ? '#fff' : this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = highlight ? 18 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;
    };

    function createNodes() {
        nodes = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push(new Node(i));
        }
    }
    createNodes();
    window.addEventListener('resize', createNodes);

    canvas.addEventListener('mousemove', function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    canvas.addEventListener('mouseleave', function() {
        mouse.x = null;
        mouse.y = null;
    });

    function drawLines() {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < LINE_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = 'rgba(124,58,237,0.13)';
                    ctx.lineWidth = 1.2 - dist / LINE_DIST;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        drawLines();
        for (let n of nodes) {
            const highlight = mouse.x !== null && mouse.y !== null && Math.abs(n.x - mouse.x) < 20 && Math.abs(n.y - mouse.y) < 20;
            n.update();
            n.draw(highlight);
        }
        requestAnimationFrame(animate);
    }
    animate();
})();

// Gallery modal (lightbox) functionality
const galleryPhotos = document.querySelectorAll('.gallery-photo');
const galleryModal = document.getElementById('gallery-modal');
const galleryModalImg = document.getElementById('gallery-modal-img');
const galleryModalClose = document.querySelector('.gallery-modal-close');

galleryPhotos.forEach(photo => {
    photo.addEventListener('click', function() {
        galleryModal.style.display = 'flex';
        galleryModalImg.src = this.src;
        galleryModalImg.alt = this.alt;
    });
});

galleryModalClose.addEventListener('click', function() {
    galleryModal.style.display = 'none';
    galleryModalImg.src = '';
});

galleryModal.addEventListener('click', function(e) {
    if (e.target === galleryModal) {
        galleryModal.style.display = 'none';
        galleryModalImg.src = '';
    }
});

// Feedback form functionality
const feedbackForm = document.getElementById('feedbackForm');
const feedbackList = document.getElementById('feedbackList');
const showFeedbackBtn = document.getElementById('showFeedbackBtn');
const feedbackListSection = document.getElementById('feedbackListSection');
const deletePassword = document.getElementById('deletePassword');
const ADMIN_PASSWORD = 'ishika1234@D'; // Change this to your desired password

function loadFeedbacks() {
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    feedbackList.innerHTML = '';
    feedbacks.forEach((fb, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="feedback-name">${fb.name}:</span> <span class="feedback-text">${fb.feedback}</span> <button class="delete-feedback" data-idx="${idx}">Delete</button>`;
        feedbackList.appendChild(li);
    });
}

feedbackForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = feedbackForm.name.value.trim();
    const feedback = feedbackForm.feedback.value.trim();
    if (!name || !feedback) return;
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    feedbacks.push({ name, feedback });
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    feedbackForm.reset();
    loadFeedbacks();
});

showFeedbackBtn.addEventListener('click', function() {
    feedbackListSection.style.display = 'block';
    loadFeedbacks();
});

feedbackList.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-feedback')) {
        const idx = e.target.getAttribute('data-idx');
        if (deletePassword.value !== ADMIN_PASSWORD) {
            alert('Incorrect admin password. Only the owner can delete feedback.');
            return;
        }
        let feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
        feedbacks.splice(idx, 1);
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        loadFeedbacks();
    }
});

window.addEventListener('DOMContentLoaded', loadFeedbacks); 