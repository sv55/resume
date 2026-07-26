document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. Floating Particles Canvas =====
    const canvas = document.getElementById('heroCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
            // Pick from accent colors
            const colors = ['0, 153, 204', '106, 31, 224', '0, 168, 112', '224, 138, 0'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(80, Math.floor(window.innerWidth / 15));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 153, 204, ${0.1 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        animationId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // ===== 2. Mouse-Following Glow =====
    const heroGlow = document.getElementById('heroGlow');
    const heroSection = document.querySelector('.hero');

    document.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        if (e.clientY < rect.bottom) {
            heroGlow.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
            heroGlow.style.opacity = '1';
        } else {
            heroGlow.style.opacity = '0';
        }
    });

    // ===== 3. Typing Effect for Hero Title =====
    const heroTitleEl = document.getElementById('heroTitle');
    const titles = [
        'Principal Software Engineer',
        'Distributed Systems Architect',
        'AI & Agentic Systems Engineer',
        'Cloud Platform Optimizer',
        'Technical Leader & Mentor'
    ];
    let titleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function typeEffect() {
        const current = titles[titleIdx];

        if (isDeleting) {
            heroTitleEl.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            typeSpeed = 40;
        } else {
            heroTitleEl.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIdx === current.length) {
            isDeleting = true;
            typeSpeed = 2500; // pause at end
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            titleIdx = (titleIdx + 1) % titles.length;
            typeSpeed = 400;
        }

        setTimeout(typeEffect, typeSpeed);
    }
    setTimeout(typeEffect, 1800);

    // ===== 4. About Summary Typing Effect =====
    const aboutSummary = document.getElementById('aboutSummary');
    const summaryText = 'Principal Software Engineer with 12+ years of expertise in distributed systems, search grid architectures, and cloud platform optimization. A technical leader with a track record of driving large-scale system modernization, scaling low-latency services, and building high-performing engineering teams. Passionate about domain-driven system design, ML feature platforms, and operational excellence.';
    let summaryTyped = false;

    function typeSummary() {
        if (summaryTyped) return;
        summaryTyped = true;
        let i = 0;
        aboutSummary.innerHTML = '<span class="typing-cursor"></span>';

        function typeChar() {
            if (i < summaryText.length) {
                aboutSummary.innerHTML = summaryText.substring(0, i + 1) + '<span class="typing-cursor"></span>';
                i++;
                setTimeout(typeChar, 12);
            } else {
                // Remove cursor after done
                setTimeout(() => {
                    aboutSummary.innerHTML = summaryText;
                }, 2000);
            }
        }
        typeChar();
    }

    // ===== 5. Floating Navigation =====
    const nav = document.getElementById('nav');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 100) {
            nav.classList.add('visible', 'scrolled');
        } else {
            nav.classList.remove('visible', 'scrolled');
        }

        lastScrollY = scrollY;

        // Active link highlighting
        updateActiveLink();
    });

    function updateActiveLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        let current = '';

        sections.forEach(section => {
            const top = section.offsetTop - 200;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // ===== 6. Mobile Navigation Toggle =====
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        mobileToggle.classList.toggle('active');
    });

    // Close on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            mobileToggle.classList.remove('active');
        });
    });

    // ===== 7. Scroll-Triggered Reveal (Intersection Observer) =====
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Trigger stat counters when they appear
                if (entry.target.classList.contains('stat-card')) {
                    animateCounter(entry.target.querySelector('.stat-number'));
                }

                // Trigger about summary typing
                if (entry.target.closest('.about-text-card')) {
                    typeSummary();
                }

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // ===== 8. Counter Animation =====
    function animateCounter(el) {
        if (!el || el.dataset.animated) return;
        el.dataset.animated = 'true';

        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            el.textContent = current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString() + suffix;
            }
        }
        requestAnimationFrame(update);
    }

    // ===== 9. Timeline Card Expansion =====
    document.querySelectorAll('[data-expandable]').forEach(card => {
        card.addEventListener('click', () => {
            const wasExpanded = card.classList.contains('expanded');

            // Close all
            document.querySelectorAll('[data-expandable]').forEach(c => {
                c.classList.remove('expanded');
            });

            // Toggle clicked
            if (!wasExpanded) {
                card.classList.add('expanded');
            }
        });
    });

    // ===== 10. Smooth Scroll for Nav Links =====
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});
