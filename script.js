/* ==========================================================================
   PORTFOLIO WEBSITE - FAST & SMOOTH 60FPS SCROLL ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize High-Performance Lenis Smooth Scroll Engine
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothTouch: false,
      touchMultiplier: 1.2,
      wheelMultiplier: 1.0,
      lerp: 0.12,
    });
  }

  // 2. High-Performance Particle Atmosphere (No Canvas Shadow Filters)
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let width, height;
  let particles = [];

  if (canvas && ctx) {
    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = -Math.random() * 0.5 - 0.1;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.hue = Math.random() > 0.6 ? 345 : 355;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y < 0 || this.x < 0 || this.x > width) {
          this.reset();
          this.y = height + 10;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 85%, 65%, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 35; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // 3. Register Instant-Scrub GSAP & ScrollTrigger Plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    // --- STAGE 1 ANIMATION: 3D Tilt & Hero Fade ---
    const stage1Frame = document.querySelector('.stage1-frame');
    const stage1Img = document.querySelector('.stage1-img');
    const heroContent = document.querySelector('.hero-content');

    if (stage1Frame && stage1Img && heroContent) {
      gsap.timeline({
        scrollTrigger: {
          trigger: '.stage-1',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.1
        }
      })
      .to(stage1Frame, {
        rotateX: 20,
        rotateY: -6,
        scale: 0.88,
        borderRadius: '32px',
        ease: 'none'
      })
      .to(stage1Img, {
        scale: 1.1,
        ease: 'none'
      }, 0)
      .to(heroContent, {
        opacity: 0.2,
        y: -25,
        ease: 'none'
      }, 0);
    }

    // --- STAGE 2 ANIMATION: Kinetic Pan & About Text Reveal ---
    const stage2Img = document.querySelector('.stage2-img');
    const redFlare = document.querySelector('.red-rim-flare');
    const aboutCard = document.querySelector('.about-card');

    if (stage2Img && aboutCard) {
      gsap.timeline({
        scrollTrigger: {
          trigger: '.stage-2',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.1
        }
      })
      .fromTo(stage2Img, 
        { transform: 'translate(-15%, -15%) scale(1.3)' },
        { transform: 'translate(0%, 0%) scale(1)', ease: 'none' }
      )
      .fromTo(redFlare,
        { opacity: 0.2, scale: 0.8 },
        { opacity: 1, scale: 1.3, ease: 'none' }, 0
      )
      .fromTo(aboutCard,
        { y: 40, opacity: 0.4 },
        { y: 0, opacity: 1, ease: 'none' }, 0
      );
    }

    // --- STAGE 4 ANIMATION: 3D Holographic Orbit ---
    const orbitCard = document.querySelector('.orbit-card');
    const skillsOverlay = document.querySelector('.skills-overlay');

    if (orbitCard && skillsOverlay) {
      gsap.timeline({
        scrollTrigger: {
          trigger: '.stage-4',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.1
        }
      })
      .to(orbitCard, {
        rotateY: 360,
        rotateX: 15,
        scale: 1.05,
        ease: 'none'
      })
      .fromTo(skillsOverlay,
        { y: 35, opacity: 0.4 },
        { y: 0, opacity: 1, ease: 'none' }, 0
      );
    }

    // --- STAGE 5 ANIMATION: 3D Infinity Tunnel Stream ---
    const slices = document.querySelectorAll('.tunnel-slice');
    const timelineOverlay = document.querySelector('.timeline-overlay');

    if (slices.length > 0) {
      slices.forEach((slice, idx) => {
        const zOffset = (idx + 1) * -180;
        const zEnd = (idx + 1) * 300;

        gsap.fromTo(slice,
          { transform: `translateZ(${zOffset}px) translateY(${idx * 30}px)`, opacity: 0.3 },
          {
            transform: `translateZ(${zEnd}px) translateY(${idx * -20}px)`,
            opacity: idx === 0 ? 1 : 0.7 - idx * 0.1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.stage-5',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.1
            }
          }
        );
      });
    }

    if (timelineOverlay) {
      gsap.fromTo(timelineOverlay,
        { y: 35, opacity: 0.4 },
        {
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.stage-5',
            start: 'top center',
            end: 'bottom top',
            scrub: 0.1
          }
        }
      );
    }

    // --- STAGE 6 ANIMATION: Outro Reveal ---
    const outroFrame = document.querySelector('.outro-frame');
    const outroImg = document.querySelector('.stage6-img');
    const contactCard = document.querySelector('.contact-card');

    if (outroFrame && contactCard) {
      gsap.timeline({
        scrollTrigger: {
          trigger: '.stage-6',
          start: 'top bottom',
          end: 'center center',
          scrub: 0.1
        }
      })
      .fromTo(outroFrame,
        { scale: 0.7, rotateX: 20, opacity: 0.6 },
        { scale: 1, rotateX: 0, opacity: 1, ease: 'none' }
      )
      .fromTo(outroImg,
        { filter: 'blur(10px) brightness(1.3)' },
        { filter: 'blur(0px) brightness(1)', ease: 'none' }, 0
      )
      .fromTo(contactCard,
        { y: 40, opacity: 0.4 },
        { y: 0, opacity: 1, ease: 'none' }, 0
      );
    }
  } else if (lenis) {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // 4. Interactive Cursor 3D Parallax Tilt Effect
  document.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    const ambientGlow = document.querySelector('.ambient-glow');
    if (ambientGlow) {
      ambientGlow.style.transform = `translate(calc(-50% + ${mouseX * 20}px), calc(-50% + ${mouseY * 20}px))`;
    }

    const stage1Frame = document.querySelector('.stage1-frame');
    if (stage1Frame) {
      stage1Frame.style.transform = `rotateY(${mouseX * 8}deg) rotateX(${-mouseY * 8}deg)`;
    }
  });

  // 5. Scroll Progress Metric Update
  const progressFill = document.getElementById('progressFill');
  const scrollPercent = document.getElementById('scrollPercent');

  const updateScrollProgress = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const percent = totalHeight > 0 ? Math.min(100, Math.max(0, Math.round((currentScroll / totalHeight) * 100))) : 0;

    if (progressFill) {
      progressFill.style.height = `${percent}%`;
    }
    if (scrollPercent) {
      scrollPercent.textContent = percent.toString().padStart(3, '0');
    }
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  if (lenis) {
    lenis.on('scroll', updateScrollProgress);
  }
  updateScrollProgress();

  // 6. Instant Smooth Scroll Navigation for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -10, duration: 0.9 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});
