/* ==========================================================================
   RAQEEM ADVERTISING SERVICES — MASTER JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ─── 1. PRELOADER ───
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800);
        });

        // Fallback dismiss after 3s
        setTimeout(() => {
            if (preloader && !preloader.classList.contains('hidden')) {
                preloader.classList.add('hidden');
                setTimeout(() => { preloader.style.display = 'none'; }, 800);
            }
        }, 3000);
    }

    // ─── 2. STICKY NAVBAR & SCROLL ───
    const navbar = document.getElementById('navbar');
    const floatTopBtn = document.getElementById('btnFloatTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 50);
        }
        if (floatTopBtn) {
            floatTopBtn.classList.toggle('visible', scrollY > 400);
        }
    });

    if (floatTopBtn) {
        floatTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ─── 3. MOBILE MENU TOGGLE ───
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', String(isExpanded));
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ─── 4. GOLD & RED HERO CANVAS PARTICLES ───
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = 0, height = 0;
        let particles = [];
        let mouse = { x: null, y: null, radius: 140 };
        let animationId = null;

        function setCanvasSize() {
            const parent = canvas.parentElement;
            width = canvas.width = parent ? parent.offsetWidth : window.innerWidth;
            height = canvas.height = parent ? parent.offsetHeight : window.innerHeight;
        }

        class Particle {
            constructor() {
                this.init();
            }

            init() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.radius = Math.random() * 2.2 + 0.8;
                this.baseX = this.x;
                this.baseY = this.y;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                // Alternate between Gold and Red particles
                this.isGold = Math.random() > 0.35;
                this.color = this.isGold ? '212, 175, 55' : '230, 57, 70';
                this.opacity = Math.random() * 0.6 + 0.2;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.isGold ? 'rgba(212, 175, 55, 0.8)' : 'rgba(230, 57, 70, 0.8)';
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Mouse interaction physics
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        const force = (1 - distance / mouse.radius) * 1.5;
                        this.x -= (dx / distance) * force * 3;
                        this.y -= (dy / distance) * force * 3;
                    }
                }

                // Bounce at edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
        }

        function createParticles() {
            particles = [];
            const count = Math.min(Math.floor((width * height) / 10000), 120);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            const maxDist = 110;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.18;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        // Gold or Red subtle lines
                        ctx.strokeStyle = particles[i].isGold 
                            ? `rgba(212, 175, 55, ${alpha})` 
                            : `rgba(230, 57, 70, ${alpha})`;
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connectParticles();
            animationId = requestAnimationFrame(animate);
        }

        setCanvasSize();
        createParticles();
        animate();

        window.addEventListener('resize', () => {
            setCanvasSize();
            createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
    }

    // ─── 5. INTERACTIVE ROI & BUDGET ESTIMATOR ───
    const budgetSlider = document.getElementById('budgetSlider');
    const budgetDisplay = document.getElementById('budgetDisplay');
    const goalPills = document.querySelectorAll('.goal-pill');
    const estReach = document.getElementById('estReach');
    const estLeads = document.getElementById('estLeads');
    const estRoas = document.getElementById('estRoas');
    const estTimeline = document.getElementById('estTimeline');

    let currentGoalMultiplier = 1.0;
    let currentGoalName = 'Rebranding';

    function updateEstimations() {
        if (!budgetSlider || !budgetDisplay) return;
        const budgetVal = parseInt(budgetSlider.value, 10);
        budgetDisplay.textContent = `$${budgetVal.toLocaleString()} USD`;

        // Calculate metrics based on budget & goal
        let reach = 0;
        let leads = 0;
        let roas = '4.2x';
        let timeline = '4-6 Weeks';

        switch (currentGoalName) {
            case 'Brand Launch':
                reach = Math.round(budgetVal * 120 * currentGoalMultiplier);
                leads = Math.round(budgetVal * 0.45);
                roas = '4.8x';
                timeline = '6-8 Weeks';
                break;
            case 'Scale Revenue':
                reach = Math.round(budgetVal * 95 * currentGoalMultiplier);
                leads = Math.round(budgetVal * 0.72);
                roas = '5.4x';
                timeline = '4-6 Weeks';
                break;
            case 'Lead Generation':
                reach = Math.round(budgetVal * 80 * currentGoalMultiplier);
                leads = Math.round(budgetVal * 0.95);
                roas = '3.9x';
                timeline = '2-4 Weeks';
                break;
            case '3D & CGI Campaign':
                reach = Math.round(budgetVal * 160 * currentGoalMultiplier);
                leads = Math.round(budgetVal * 0.35);
                roas = '6.2x';
                timeline = '8-10 Weeks';
                break;
            default:
                reach = Math.round(budgetVal * 110);
                leads = Math.round(budgetVal * 0.5);
                roas = '4.5x';
                timeline = '4-6 Weeks';
        }

        if (estReach) {
            estReach.textContent = reach >= 1000000 
                ? (reach / 1000000).toFixed(1) + 'M+' 
                : (reach / 1000).toFixed(0) + 'K+';
        }
        if (estLeads) estLeads.textContent = `+${leads.toLocaleString()}`;
        if (estRoas) estRoas.textContent = roas;
        if (estTimeline) estTimeline.textContent = timeline;
    }

    if (budgetSlider) {
        budgetSlider.addEventListener('input', updateEstimations);
    }

    if (goalPills.length > 0) {
        goalPills.forEach(pill => {
            pill.addEventListener('click', () => {
                goalPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentGoalMultiplier = parseFloat(pill.getAttribute('data-mult') || '1.0');
                currentGoalName = pill.getAttribute('data-goal') || 'Rebranding';
                updateEstimations();
            });
        });
    }

    // Initialize estimation on load
    updateEstimations();

    // ─── 6. PORTFOLIO CATEGORY FILTERING ───
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (filterBtns.length > 0 && portfolioCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterCategory = btn.getAttribute('data-filter');

                portfolioCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filterCategory === 'all' || cardCategory === filterCategory) {
                        card.style.display = 'flex';
                        card.style.animation = 'fadeInCard 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ─── 7. CASE STUDY MODAL ───
    const caseModal = document.getElementById('caseStudyModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalTitle = document.getElementById('modalTitle');
    const modalClient = document.getElementById('modalClient');
    const modalImpact = document.getElementById('modalImpact');
    const modalDesc = document.getElementById('modalDesc');
    const modalImage = document.getElementById('modalImage');

    const caseStudyData = {
        'summit-penthouse': {
            title: 'The Summit Penthouses: Ultra-Luxury Dubai Real Estate Launch',
            client: 'Emaar Signature / Dubai Marina',
            impact: '+340% HNW Lead Velocity | 100% Sold Out in 14 Days',
            desc: 'A masterclass in ultra-high-net-worth brand positioning. Raqeem engineered an exclusive private-membership aesthetic, 3D architectural digital tours, and targeted algorithmic ad placements across GCC, London, and Monaco.',
            img: 'images/portfolio-realestate.jpg'
        },
        'royal-eclat': {
            title: 'Maison Al-Ruh: Royal Éclat French-Arabian Fragrance Campaign',
            client: 'Maison Al-Ruh Parfums',
            impact: '18.4M Impressions | $2.6M Gross Sales in Month 1',
            desc: 'Luxury sensory storytelling blending French elegance with Arabian opulence. Cinematic 8K commercial production, influencer VIP unveiling boxes, and full omnichannel social domination.',
            img: 'images/portfolio-perfume.jpg'
        },
        'fintech-vault': {
            title: 'Crypto Wealth Hub: Neo-Banking App Brand & User Acquisition',
            client: 'Falcon Capital FinTech',
            impact: '+480% App Installs | 5.4x ROAS Across Meta & Google',
            desc: 'Transforming complex algorithmic wealth management into a sleek, gold-accented lifestyle interface. Multi-tier digital warfare marketing that captured tier-1 GCC investors.',
            img: 'images/portfolio-fintech.jpg'
        },
        'hypercar-run': {
            title: 'DXB Hypercar Night Run: Automotive Commercial & Social Blitz',
            client: 'Pagani & Supercar Arabia',
            impact: '42M+ Video Views | 650K+ Engagement Shares',
            desc: 'High-octane midnight cinematic video production in Downtown Dubai. Viral TikTok and Instagram Reels sound engineering that dominated automotive culture worldwide.',
            img: 'images/portfolio-automotive.jpg'
        },
        'dragon-billboard': {
            title: 'Golden Dragon Tourbillon: 3D Anamorphic Outdoor Spectacle',
            client: 'Geneve Horology & Meraas',
            impact: '#1 Trending in UAE | 98% Recall Rate',
            desc: 'A colossal 3D anamorphic corner LED billboard that broke social media with audiences capturing a golden dragon breaking through the skyscraper screen.',
            img: 'images/portfolio-billboard.jpg'
        },
        'growth-cockpit': {
            title: 'Omnichannel Brand Domination: Complete Creative Scale Engine',
            client: 'Gulf Luxe Retail Group',
            impact: '+320% Campaign Lift | 8.4M Verified Reach',
            desc: 'End-to-end full-funnel advertising architecture covering rebranding, high-conversion web development, and performance advertising.',
            img: 'images/hero-brand-visual.jpg'
        }
    };

    document.querySelectorAll('.view-case-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const caseId = link.getAttribute('data-case-id');
            const data = caseStudyData[caseId];
            if (data && caseModal) {
                if (modalTitle) modalTitle.textContent = data.title;
                if (modalClient) modalClient.textContent = data.client;
                if (modalImpact) modalImpact.textContent = data.impact;
                if (modalDesc) modalDesc.textContent = data.desc;
                if (modalImage) {
                    modalImage.src = data.img;
                    modalImage.onerror = () => { modalImage.style.display = 'none'; };
                }
                caseModal.classList.add('active');
            }
        });
    });

    if (modalCloseBtn && caseModal) {
        modalCloseBtn.addEventListener('click', () => {
            caseModal.classList.remove('active');
        });
    }

    if (caseModal) {
        caseModal.addEventListener('click', (e) => {
            if (e.target === caseModal) {
                caseModal.classList.remove('active');
            }
        });
    }

    // ─── 8. TESTIMONIAL SLIDER ───
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('testPrevBtn');
    const nextBtn = document.getElementById('testNextBtn');

    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval = null;

        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentSlide + 1);
                resetInterval();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentSlide - 1);
                resetInterval();
            });
        }

        function startInterval() {
            slideInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 6000);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        startInterval();
    }

    // ─── 9. CONSULTATION FORM CELEBRATION ───
    const consultForm = document.getElementById('consultationForm');
    const formFeedback = document.getElementById('formFeedback');

    if (consultForm) {
        consultForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = consultForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Securing Your Strategy Session...';
            }

            setTimeout(() => {
                consultForm.reset();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Proposal Requested!';
                }
                if (formFeedback) {
                    formFeedback.style.display = 'block';
                    formFeedback.innerHTML = `
                        <div style="background: rgba(212, 175, 55, 0.15); border: 1px solid #D4AF37; border-radius: 12px; padding: 20px; text-align: center; margin-top: 20px; color: #FFF;">
                            <h4 style="color: #F5D061; font-size: 1.2rem; margin-bottom: 6px;"><i class="fas fa-crown"></i> Strategy Brief Received</h4>
                            <p style="font-size: 0.95rem; color: #E2E8F0;">Thank you for contacting Raqeem. Our Lead Creative Strategist will review your requirements and provide a confidential preliminary blueprint within 24 hours.</p>
                        </div>
                    `;
                }
            }, 1200);
        });
    }

    // ─── 10. ANIMATE NUMBER COUNTERS ON SCROLL ───
    const counterElements = document.querySelectorAll('.count-up');
    if ('IntersectionObserver' in window && counterElements.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const endVal = parseFloat(target.getAttribute('data-target') || '0');
                    const prefix = target.getAttribute('data-prefix') || '';
                    const suffix = target.getAttribute('data-suffix') || '';
                    const isDecimal = endVal % 1 !== 0;

                    let current = 0;
                    const duration = 1800;
                    const stepTime = 20;
                    const steps = duration / stepTime;
                    const increment = endVal / steps;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= endVal) {
                            current = endVal;
                            clearInterval(timer);
                        }
                        target.textContent = `${prefix}${isDecimal ? current.toFixed(1) : Math.floor(current)}${suffix}`;
                    }, stepTime);

                    obs.unobserve(target);
                }
            });
        }, { threshold: 0.2 });

        counterElements.forEach(el => observer.observe(el));
    }
});
