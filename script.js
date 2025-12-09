document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // --- Hero Animations ---
    const heroTimeline = gsap.timeline();

    // Reveal Hero Title with a clip-path effect if possible, or just smooth Y axis
    heroTimeline.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        skewY: 7
    })
        .from('.hero-subtitle', {
            y: 20,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.8')
        .from('.hero-actions, .hero-cta-wrapper', {
            y: 20,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.8')
        .from('.hero-visual, .hero-page-content .hero-label', {
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        }, '-=1');

    // --- Parallax Effects ---
    // Hero Image Parallax
    gsap.to('.hero-image-container', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 100,
        ease: 'none'
    });

    // Portfolio Image Parallax (inside their wrappers)
    gsap.utils.toArray('.portfolio-image-wrapper').forEach(wrapper => {
        const img = wrapper.querySelector('.portfolio-image');
        if (img) {
            gsap.to(img, {
                scrollTrigger: {
                    trigger: wrapper,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                },
                scale: 1.15, // Subtle zoom effect on scroll
                ease: 'none'
            });
        }
    });

    // --- Section Headers Reveal ---
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header.children, {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        });
    });

    // --- Card Stagger Animations ---
    const cards = gsap.utils.toArray('.service-card, .portfolio-item');
    ScrollTrigger.batch(cards, {
        onEnter: batch => gsap.to(batch, {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out',
            overwrite: true
        }),
        onLeave: batch => gsap.set(batch, { opacity: 0, y: -50, overwrite: true }), // Optional: fade out when leaving
        onEnterBack: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
        onLeaveBack: batch => gsap.set(batch, { opacity: 0, y: 50, overwrite: true }), // Optional
        // Simplified for better UX: just play once nicely
    });

    // Resetting batch to a simpler version for better UX (no disappearing on scroll up)
    ScrollTrigger.getAll().forEach(t => t.kill()); // Clear previous to avoid conflicts if re-running

    // Re-init ScrollTrigger for cards
    gsap.utils.toArray('.service-card, .portfolio-item').forEach((item, i) => {
        gsap.set(item, { opacity: 0, y: 50 }); // Initial state

        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // --- Magnetic/Hover Effects ---
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' });
        });
    });

    // Mobile menu toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-center');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            if (navList.style.display === 'block') {
                gsap.to(navList, { opacity: 0, y: -20, duration: 0.3, onComplete: () => navList.style.display = 'none' });
            } else {
                navList.style.display = 'block';
                navList.style.position = 'absolute';
                navList.style.top = '100%';
                navList.style.left = '0';
                navList.style.right = '0';
                navList.style.background = 'white';
                navList.style.padding = '1rem';
                navList.style.textAlign = 'center';
                navList.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                gsap.fromTo(navList, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.3 });
            }
        });
    }

    // Contact form handling
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.textContent = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                form.reset();
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }
});
